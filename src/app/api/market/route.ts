import { NextResponse } from 'next/server';
import { INITIAL_MARKET_MATERIALS } from '@/lib/db-store';
import { fetchDbMarketMaterials, updateDbMarketPrice } from '@/lib/supabase-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const dbMaterials = await fetchDbMarketMaterials();
    let materials = dbMaterials || INITIAL_MARKET_MATERIALS;

    if (category) {
      materials = materials.filter((m) => m.categorySlug === category);
    }

    return NextResponse.json({
      success: true,
      source: dbMaterials ? 'supabase' : 'local_store',
      lastUpdated: new Date().toISOString(),
      count: materials.length,
      data: materials,
    });
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

