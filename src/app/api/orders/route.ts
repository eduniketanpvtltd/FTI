import { NextResponse } from 'next/server';
import { INITIAL_ORDERS } from '@/lib/db-store';

export async function GET(request: Request) {
  try {
    return NextResponse.json({
      success: true,
      count: INITIAL_ORDERS.length,
      data: INITIAL_ORDERS,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
