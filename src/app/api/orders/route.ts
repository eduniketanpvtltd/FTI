import { NextResponse } from 'next/server';
import { INITIAL_ORDERS } from '@/lib/db-store';
import { fetchDbOrders } from '@/lib/supabase-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || undefined;

    const dbOrders = await fetchDbOrders(userId);
    const results = dbOrders || INITIAL_ORDERS;

    return NextResponse.json({
      success: true,
      source: dbOrders ? 'supabase' : 'local_store',
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

