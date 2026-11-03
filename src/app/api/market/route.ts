import { NextResponse } from 'next/server';
import { INITIAL_MARKET_MATERIALS } from '@/lib/db-store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let materials = INITIAL_MARKET_MATERIALS;
    if (category) {
      materials = materials.filter((m) => m.categorySlug === category);
    }

    return NextResponse.json({
      success: true,
      lastUpdated: '2026-11-03T11:30:00.000Z',
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
