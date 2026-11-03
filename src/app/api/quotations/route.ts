import { NextResponse } from 'next/server';
import { INITIAL_QUOTATIONS } from '@/lib/db-store';
import { fetchDbQuotations, createDbQuotation } from '@/lib/supabase-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId') || undefined;

    const dbQuotations = await fetchDbQuotations(userId);
    let results = dbQuotations || INITIAL_QUOTATIONS;

    if (status) {
      results = results.filter((q) => q.status === status);
    }

    return NextResponse.json({
      success: true,
      source: dbQuotations ? 'supabase' : 'local_store',
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

    const newQuotation: any = {
      id: quotationId,
      quotationNumber,
      userId: body.userId || 'usr-customer-01',
      customerSnapshot: body.customerSnapshot || {},
      items: body.items,
      status: 'pending',
      version: 1,
      validUntil: body.validUntil || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      subtotal: body.subtotal || 0,
      taxRate: body.taxRate || 18.0,
      taxAmount: body.taxAmount || 0,
      transportationCharges: body.transportationCharges || 0,
      discountAmount: body.discountAmount || 0,
      grandTotal: body.grandTotal || 0,
      specialNotes: body.specialNotes || '',
      adminNotes: '',
      termsAndConditions: '',
      statusHistory: [
        {
          status: 'pending',
          changedAt: new Date().toISOString(),
          changedBy: 'Customer',
          note: 'Quotation request submitted',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Attempt to persist to Supabase
    await createDbQuotation(newQuotation);

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
