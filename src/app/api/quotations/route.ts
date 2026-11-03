import { NextResponse } from 'next/server';
import { INITIAL_QUOTATIONS } from '@/lib/db-store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let results = INITIAL_QUOTATIONS;
    if (status) {
      results = results.filter((q) => q.status === status);
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Quotation request must contain at least one line item.' },
        { status: 400 }
      );
    }

    const quotationId = `qt-${Date.now()}`;
    const quotationNumber = `FTI-QT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newQuotation = {
      id: quotationId,
      quotationNumber,
      userId: body.userId || 'usr-customer-01',
      customerSnapshot: body.customerSnapshot || {},
      items: body.items,
      status: 'pending',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Quotation request submitted successfully',
      data: newQuotation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create quotation request' },
      { status: 500 }
    );
  }
}
