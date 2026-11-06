import { NextResponse } from 'next/server';
import { INITIAL_MARKET_MATERIALS } from '@/lib/db-store';
import {
  INITIAL_MANDI_BULLETIN,
  formatIstBulletinDateTime,
  syncBulletinWithLatestTime,
} from '@/lib/mandi-parser';
import { fetchDbMarketMaterials, updateDbMarketPrice } from '@/lib/supabase-service';


export async function GET(request: Request) {
  try {
    const now = new Date();
    const { sessionDate, isoStr } = formatIstBulletinDateTime(now);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const mainCategory = searchParams.get('mainCategory');
    const materialName = searchParams.get('materialName');

    const dbMaterials = await fetchDbMarketMaterials();
    let materials = (dbMaterials || INITIAL_MARKET_MATERIALS).map((m) => {
      const history = Array.isArray(m.historicalPrices) ? [...m.historicalPrices] : [];
      if (history.length > 0) {
        const lastIdx = history.length - 1;
        history[lastIdx] = {
          ...history[lastIdx],
          date: sessionDate,
          timestamp: now.getTime(),
          price: m.currentPrice,
        };
      }
      return {
        ...m,
        lastUpdatedAt: isoStr,
        historicalPrices: history,
      };
    });

    if (mainCategory) {
      materials = materials.filter((m) => m.mainCategory === mainCategory);
    }
    if (materialName) {
      materials = materials.filter(
        (m) =>
          m.materialName?.toLowerCase() === materialName.toLowerCase() ||
          m.categoryName?.toLowerCase() === materialName.toLowerCase()
      );
    }
    if (category) {
      materials = materials.filter((m) => m.categorySlug === category);
    }

    const bulletin = syncBulletinWithLatestTime(INITIAL_MANDI_BULLETIN, materials, now);

    return NextResponse.json(
      {
        success: true,
        source: dbMaterials ? 'supabase' : 'local_store',
        lastUpdated: isoStr,
        dateStr: bulletin.dateStr,
        timeStr: bulletin.timeStr,
        bulletin,
        count: materials.length,
        data: materials,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { materialId, price, notes } = body;

    if (!materialId || !price) {
      return NextResponse.json(
        { success: false, error: 'materialId and price are required' },
        { status: 400 }
      );
    }

    const updated = await updateDbMarketPrice(materialId, Number(price), notes);

    return NextResponse.json({
      success: true,
      persistedToDb: updated,
      message: `Price updated for material ${materialId}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update price' },
      { status: 500 }
    );
  }
}

