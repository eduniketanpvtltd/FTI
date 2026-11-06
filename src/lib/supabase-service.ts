import { supabase, getSupabaseAdmin, isSupabaseConfigured } from './supabase';
import { INITIAL_MARKET_MATERIALS } from './db-store';
import {
  ProductCategory,
  MarketMaterial,
  Quotation,
  QuotationItem,
  QuotationStatus,
  Order,
  OrderStatus,
  PaymentStatus,
  Invoice,
  CartLineItem,
  UserProfile,
} from '@/types';

// Use admin client if available (bypasses RLS on server/admin actions), otherwise default client
const getClient = () => {
  return getSupabaseAdmin() || supabase;
};

// ==========================================
// 1. PRODUCT CATEGORIES & SPECIFICATIONS
// ==========================================

export async function fetchDbCategories(): Promise<ProductCategory[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const client = getClient();
    const { data, error } = await client
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase fetchDbCategories query warning:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    return data.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description || '',
      imageUrl: row.image_url,
      isActive: row.is_active,
      isComingSoon: row.is_coming_soon,
      displayOrder: row.display_order,
      availableGrades: Array.isArray(row.available_grades) ? row.available_grades : [],
      specificationFields: Array.isArray(row.specification_fields) ? row.specification_fields : [],
    }));
  } catch (err) {
    console.warn('Supabase categories error:', err);
    return null;
  }
}

// ==========================================
// 2. LIVE MARKET MATERIALS & SPOT RATES
// ==========================================

export async function fetchDbMarketMaterials(): Promise<MarketMaterial[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const client = getClient();
    const { data, error } = await client
      .from('market_materials')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.warn('Supabase fetchDbMarketMaterials error:', error.message);
      return null;
    }

    if (!data || data.length === 0) return null;

    const hasScrap20 = data.some((r: { symbol?: string }) => r.symbol === 'MANDI-SCR-20');
    const hasScrap21 = data.some((r: { symbol?: string }) => r.symbol === 'MANDI-SCR-21');

    const mappedMaterials: MarketMaterial[] = [];

    for (const row of data) {
      // Detect legacy benchmark rows (seeded as 'Mandi Benchmark')
      const isBenchmark =
        row.category_slug === 'benchmark' ||
        row.category_name === 'Mandi Benchmark' ||
        row.symbol?.startsWith('MANDI-BEN');

      const isScrap =
        !isBenchmark &&
        (row.main_category === 'scrap_materials' ||
          row.category_slug === 'scrap' ||
          row.category_slug === 'scrap_materials' ||
          (row.name && row.name.toLowerCase().includes('scrap')));

      let mainCategory: 'raw_materials' | 'scrap_materials' = isScrap ? 'scrap_materials' : 'raw_materials';
      let materialName = 'Ingot';
      let mandiCity = row.mandi_city || row.hub_city || 'Mandi Gobindgarh';
      let categorySlug = row.category_slug;
      let categoryName = row.category_name;
      let displayName = row.name;

      if (isBenchmark) {
        mandiCity = 'Mandi Gobindgarh';
        const rowName = (row.name || '').toLowerCase();
        const symbol = row.symbol || '';

        if (symbol === 'MANDI-BEN-01' || rowName.includes('billet')) {
          mainCategory = 'raw_materials';
          materialName = 'Billet';
          categorySlug = 'billet';
          categoryName = 'Billet';
          displayName = 'Billet - Mandi Gobindgarh';
        } else if (symbol === 'MANDI-BEN-02' || rowName.includes('ingot')) {
          mainCategory = 'raw_materials';
          materialName = 'Ingot';
          categorySlug = 'ingot';
          categoryName = 'Ingot';
          displayName = 'Ingot - Mandi Gobindgarh';
        } else if (symbol === 'MANDI-BEN-03' || rowName.includes('old')) {
          // If MANDI-SCR-20 already exists, skip duplicate
          if (hasScrap20) continue;
          mainCategory = 'scrap_materials';
          materialName = 'Old Scrap';
          categorySlug = 'scrap';
          categoryName = 'Old Scrap';
          displayName = 'Old Scrap - Mandi Gobindgarh';
        } else if (symbol === 'MANDI-BEN-04' || rowName.includes('melting')) {
          // If MANDI-SCR-21 already exists, skip duplicate
          if (hasScrap21) continue;
          mainCategory = 'scrap_materials';
          materialName = 'Melting Scrap';
          categorySlug = 'scrap';
          categoryName = 'Melting Scrap';
          displayName = 'Melting Scrap - Mandi Gobindgarh';
        } else {
          mainCategory = 'raw_materials';
          materialName = 'Ingot';
          categorySlug = 'ingot';
          categoryName = 'Ingot';
          displayName = `Ingot - ${mandiCity}`;
        }
      } else if (isScrap) {
        mainCategory = 'scrap_materials';
        const lowerName = (row.name || '').toLowerCase();
        const lowerNotes = (row.notes || '').toLowerCase();
        const lowerCity = mandiCity.toLowerCase();
        if (lowerName.includes('old') || lowerNotes.includes('old') || lowerCity.includes('old')) {
          materialName = 'Old Scrap';
        } else {
          materialName = 'Melting Scrap';
        }
        categoryName = materialName;
        displayName = row.name?.includes('-') ? row.name : `${materialName} - ${mandiCity}`;
      } else {
        materialName =
          row.material_name ||
          (row.name?.includes('-') ? row.name.split('-')[0].trim() : row.category_name || 'Ingot');
        categoryName = materialName;
        displayName = row.name?.includes('-') ? row.name : `${materialName} - ${mandiCity}`;
      }

      // Safety guard: Never allow "Mandi Benchmark" as a material or category name
      if (materialName === 'Mandi Benchmark' || categoryName === 'Mandi Benchmark') {
        materialName = displayName?.toLowerCase().includes('billet') ? 'Billet' : 'Ingot';
        categoryName = materialName;
      }

      // Normalize legacy unsuffixed IDs that have a specification (e.g. Ludhiana EN8D vs MS)
      let normalizedId = row.id;
      if (
        row.specification &&
        (row.id === 'mat-raw-materials-ingot-ludhiana' ||
          row.id === 'mat-scrap-materials-melting-scrap-ludhiana')
      ) {
        const specSlug = String(row.specification)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        normalizedId = `${row.id}-${specSlug}`;
      }

      // Skip if this exact ID was already mapped
      if (mappedMaterials.some((m) => m.id === normalizedId)) {
        continue;
      }

      mappedMaterials.push({
        id: normalizedId,
        mainCategory,
        materialName,
        mandiCity,
        categorySlug,
        categoryName,
        name: displayName,
        symbol: row.symbol,
        hubCity: mandiCity,
        specification: row.specification,
        unit: row.unit || '₹ / Metric Ton',
        currentPrice: Number(row.current_price),
        previousPrice: Number(row.previous_price),
        priceChange: Number(row.price_change),
        percentageChange:
          row.percentage_change !== undefined && row.percentage_change !== null
            ? Number(row.percentage_change)
            : row.percent_change !== undefined && row.percent_change !== null
            ? Number(row.percent_change)
            : Number(row.previous_price) > 0
            ? Number(((Number(row.price_change) / Number(row.previous_price)) * 100).toFixed(2))
            : 0,
        movementDirection: row.movement_direction,
        highPrice: Number(row.high_price),
        lowPrice: Number(row.low_price),
        averagePrice: Number(row.average_price),
        volatility: Number(row.volatility || 1.2),
        lastUpdatedAt: row.last_updated_at || new Date().toISOString(),
        displayOrder: row.display_order,
        isActive: row.is_active,
        notes: row.notes,
        historicalPrices: Array.isArray(row.historical_prices) && row.historical_prices.length > 0
          ? row.historical_prices.slice(-50)
          : [],
      });
    }

    // Merge supplementary materials (e.g. TMT Rebar, Wire Rod, HMS Scrap, Ludhiana EN8D/MS) if not present in DB
    const existingSymbols = new Set(mappedMaterials.map((m) => m.symbol));
    const existingIds = new Set(mappedMaterials.map((m) => m.id));
    for (const sup of INITIAL_MARKET_MATERIALS) {
      if (
        !existingSymbols.has(sup.symbol) &&
        !existingIds.has(sup.id) &&
        !mappedMaterials.some(
          (m) =>
            m.materialName === sup.materialName &&
            m.mandiCity === sup.mandiCity &&
            (m.specification || '') === (sup.specification || '')
        )
      ) {
        mappedMaterials.push(sup);
      }
    }

    return mappedMaterials;
  } catch (err) {
    console.warn('Supabase market materials error:', err);
    return null;
  }
}

export async function updateDbMarketPrice(
  materialId: string,
  newPrice: number,
  notes?: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const client = getClient();

    // 1. Fetch current price
    const { data: current, error: fetchErr } = await client
      .from('market_materials')
      .select('current_price, high_price, low_price')
      .eq('id', materialId)
      .single();

    if (fetchErr || !current) return false;

    const previousPrice = Number(current.current_price);
    const priceChange = newPrice - previousPrice;
    const percentageChange = previousPrice > 0 ? Number(((priceChange / previousPrice) * 100).toFixed(2)) : 0;
    const movementDirection = priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'neutral';
    const highPrice = Math.max(Number(current.high_price || newPrice), newPrice);
    const lowPrice = Math.min(Number(current.low_price || newPrice), newPrice);

    // 2. Update material row
    const { error: updateErr } = await client
      .from('market_materials')
      .update({
        current_price: newPrice,
        previous_price: previousPrice,
        price_change: priceChange,
        percentage_change: percentageChange,
        movement_direction: movementDirection,
        high_price: highPrice,
        low_price: lowPrice,
        notes: notes || undefined,
        last_updated_at: new Date().toISOString(),
      })
      .eq('id', materialId);

    if (updateErr) return false;

    // 3. Record historical price point
    await client.from('market_price_history').insert({
      material_id: materialId,
      price: newPrice,
      notes: notes || 'Updated via Trading Desk',
      recorded_at: new Date().toISOString(),
    });

    return true;
  } catch (err) {
    console.warn('Supabase update price error:', err);
    return false;
  }
}

// ==========================================
// 3. QUOTATIONS & MULTI-COMBINATIONS
// ==========================================

export async function createDbQuotation(quotation: Quotation): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const client = getClient();

    // 1. Insert parent quotation
    const { error: quoteErr } = await client.from('quotations').insert({
      id: quotation.id,
      quotation_number: quotation.quotationNumber,
      user_id: quotation.userId,
      customer_snapshot: quotation.customerSnapshot,
      status: quotation.status,
      version: quotation.version || 1,
      valid_until: quotation.validUntil,
      subtotal: quotation.subtotal,
      tax_rate: quotation.taxRate,
      tax_amount: quotation.taxAmount,
      transportation_charges: quotation.transportationCharges,
      discount_amount: quotation.discountAmount,
      grand_total: quotation.grandTotal,
      special_notes: quotation.specialNotes,
      admin_notes: quotation.adminNotes,
      terms_and_conditions: quotation.termsAndConditions,
      status_history: quotation.statusHistory,
      created_at: quotation.createdAt,
      updated_at: quotation.updatedAt,
    });

    if (quoteErr) {
      console.warn('Supabase quotation insert error:', quoteErr.message);
      return false;
    }

    // 2. Insert quotation line items
    if (quotation.items && quotation.items.length > 0) {
      const lineRows = quotation.items.map((item) => ({
        id: item.id,
        quotation_id: quotation.id,
        category_name: item.categoryName,
        category_slug: item.categorySlug,
        specifications: item.specifications,
        grade: item.grade,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unitPrice || 0,
        line_total: item.lineTotal || 0,
        special_instructions: item.specialInstructions,
      }));

      await client.from('quotation_items').insert(lineRows);
    }

    return true;
  } catch (err) {
    console.warn('createDbQuotation error:', err);
    return false;
  }
}

export async function fetchDbQuotations(userId?: string): Promise<Quotation[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const client = getClient();
    let query = client.from('quotations').select('*, items:quotation_items(*)').order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      quotationNumber: row.quotation_number,
      userId: row.user_id,
      customerSnapshot: row.customer_snapshot,
      items: (row.items || []).map((it: any) => ({
        id: it.id,
        categoryName: it.category_name,
        categorySlug: it.category_slug,
        specifications: it.specifications,
        grade: it.grade,
        quantity: Number(it.quantity),
        unit: it.unit,
        unitPrice: it.unit_price ? Number(it.unit_price) : undefined,
        lineTotal: it.line_total ? Number(it.line_total) : undefined,
        specialInstructions: it.special_instructions,
      })),
      status: row.status,
      version: row.version,
      validUntil: row.valid_until,
      subtotal: Number(row.subtotal),
      taxRate: Number(row.tax_rate),
      taxAmount: Number(row.tax_amount),
      transportationCharges: Number(row.transportation_charges),
      discountAmount: Number(row.discount_amount),
      grandTotal: Number(row.grand_total),
      specialNotes: row.special_notes,
      adminNotes: row.admin_notes,
      termsAndConditions: row.terms_and_conditions,
      statusHistory: row.status_history || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.warn('fetchDbQuotations error:', err);
    return null;
  }
}

// ==========================================
// 4. ORDERS & INVOICES
// ==========================================

export async function createDbOrder(order: Order): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const client = getClient();
    const { error: orderErr } = await client.from('orders').insert({
      id: order.id,
      order_number: order.orderNumber,
      quotation_id: order.quotationId,
      quotation_number: order.quotationNumber,
      user_id: order.userId,
      customer_snapshot: order.customerSnapshot,
      status: order.status,
      payment_status: order.paymentStatus,
      subtotal: order.subtotal,
      tax_rate: order.taxRate,
      tax_amount: order.taxAmount,
      transportation_charges: order.transportationCharges,
      discount_amount: order.discountAmount,
      grand_total: order.grandTotal,
      tracking_carrier: order.trackingCarrier,
      tracking_number: order.trackingNumber,
      estimated_delivery: order.estimatedDelivery,
      dispatch_date: order.dispatchDate,
      status_history: order.statusHistory,
      invoice_id: order.invoiceId,
      invoice_number: order.invoiceNumber,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    });

    if (orderErr) {
      console.warn('createDbOrder error:', orderErr.message);
      return false;
    }

    if (order.items && order.items.length > 0) {
      const orderItems = order.items.map((item) => ({
        id: item.id,
        order_id: order.id,
        category_name: item.categoryName,
        category_slug: item.categorySlug,
        specifications: item.specifications,
        grade: item.grade,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unitPrice,
        line_total: item.lineTotal,
      }));
      await client.from('order_items').insert(orderItems);
    }

    return true;
  } catch (err) {
    console.warn('createDbOrder error:', err);
    return false;
  }
}

export async function fetchDbOrders(userId?: string): Promise<Order[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const client = getClient();
    let query = client.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      orderNumber: row.order_number,
      quotationId: row.quotation_id,
      quotationNumber: row.quotation_number,
      userId: row.user_id,
      customerSnapshot: row.customer_snapshot,
      billingAddress: row.billing_address || {
        id: `addr-${row.id}-bill`,
        userId: row.user_id,
        addressType: 'billing',
        isDefault: true,
        recipientName: row.customer_snapshot?.fullName || 'Customer',
        phone: row.customer_snapshot?.mobile || '',
        companyName: row.customer_snapshot?.companyName,
        gstin: row.customer_snapshot?.gstin,
        streetAddress: row.customer_snapshot?.deliveryAddress || 'Plot MIDC Area',
        city: row.customer_snapshot?.deliveryCity || 'Mumbai',
        district: row.customer_snapshot?.deliveryCity || 'Mumbai',
        state: row.customer_snapshot?.deliveryState || 'Maharashtra',
        pincode: row.customer_snapshot?.deliveryPincode || '400705',
        country: 'India',
      },
      shippingAddress: row.shipping_address || {
        id: `addr-${row.id}-ship`,
        userId: row.user_id,
        addressType: 'shipping',
        isDefault: false,
        recipientName: row.customer_snapshot?.fullName || 'Customer',
        phone: row.customer_snapshot?.mobile || '',
        companyName: row.customer_snapshot?.companyName,
        gstin: row.customer_snapshot?.gstin,
        streetAddress: row.customer_snapshot?.deliveryAddress || 'Plot MIDC Area',
        city: row.customer_snapshot?.deliveryCity || 'Mumbai',
        district: row.customer_snapshot?.deliveryCity || 'Mumbai',
        state: row.customer_snapshot?.deliveryState || 'Maharashtra',
        pincode: row.customer_snapshot?.deliveryPincode || '400705',
        country: 'India',
      },
      items: (row.items || []).map((it: any) => ({
        id: it.id,
        categoryName: it.category_name,
        categorySlug: it.category_slug,
        specifications: it.specifications,
        grade: it.grade,
        quantity: Number(it.quantity),
        unit: it.unit,
        unitPrice: Number(it.unit_price),
        lineTotal: Number(it.line_total),
      })),
      status: row.status,
      paymentStatus: row.payment_status,
      subtotal: Number(row.subtotal),
      taxRate: Number(row.tax_rate),
      taxAmount: Number(row.tax_amount),
      transportationCharges: Number(row.transportation_charges),
      discountAmount: Number(row.discount_amount),
      grandTotal: Number(row.grand_total),
      trackingCarrier: row.tracking_carrier,
      trackingNumber: row.tracking_number,
      estimatedDelivery: row.estimated_delivery,
      dispatchDate: row.dispatch_date,
      statusHistory: row.status_history || [],
      invoiceId: row.invoice_id,
      invoiceNumber: row.invoice_number,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.warn('fetchDbOrders error:', err);
    return null;
  }
}

export async function updateDbQuotationPricing(
  quotationId: string,
  pricingData: {
    items: QuotationItem[];
    taxRate: number;
    transportationCharges: number;
    discountAmount: number;
    validUntil: string;
    termsAndConditions?: string;
    adminNotes?: string;
    status: QuotationStatus;
  }
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const client = getClient();
    const subtotal = pricingData.items.reduce((acc, it) => acc + (it.lineTotal || 0), 0);
    const taxAmount = (subtotal * (pricingData.taxRate || 18)) / 100;
    const grandTotal = Math.max(
      0,
      subtotal + taxAmount + (pricingData.transportationCharges || 0) - (pricingData.discountAmount || 0)
    );

    const { error: quoteErr } = await client
      .from('quotations')
      .update({
        subtotal,
        tax_rate: pricingData.taxRate,
        tax_amount: taxAmount,
        transportation_charges: pricingData.transportationCharges,
        discount_amount: pricingData.discountAmount,
        grand_total: grandTotal,
        valid_until: pricingData.validUntil,
        terms_and_conditions: pricingData.termsAndConditions,
        admin_notes: pricingData.adminNotes,
        status: pricingData.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', quotationId);

    if (quoteErr) {
      console.warn('updateDbQuotationPricing error:', quoteErr.message);
      return false;
    }

    // Update item unit prices
    for (const item of pricingData.items) {
      await client
        .from('quotation_items')
        .update({
          unit_price: item.unitPrice || 0,
          line_total: item.lineTotal || 0,
        })
        .eq('id', item.id);
    }

    return true;
  } catch (err) {
    console.warn('updateDbQuotationPricing error:', err);
    return false;
  }
}

export async function updateDbOrderStatus(
  orderId: string,
  status: OrderStatus,
  options?: {
    trackingCarrier?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    notes?: string;
  }
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const client = getClient();
    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (options?.trackingCarrier) updates.tracking_carrier = options.trackingCarrier;
    if (options?.trackingNumber) updates.tracking_number = options.trackingNumber;
    if (options?.estimatedDelivery) updates.estimated_delivery = options.estimatedDelivery;

    const { error } = await client.from('orders').update(updates).eq('id', orderId);
    if (error) {
      console.warn('updateDbOrderStatus error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('updateDbOrderStatus error:', err);
    return false;
  }
}

export async function updateDbPaymentStatus(
  orderId: string,
  status: PaymentStatus
): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const client = getClient();
    const { error } = await client
      .from('orders')
      .update({
        payment_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    return !error;
  } catch (err) {
    console.warn('updateDbPaymentStatus error:', err);
    return false;
  }
}

export async function createDbInvoice(invoice: Invoice): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const client = getClient();
    const { error } = await client.from('invoices').insert({
      id: invoice.id,
      invoice_number: invoice.invoiceNumber,
      order_id: invoice.orderId,
      order_number: invoice.orderNumber,
      quotation_id: invoice.quotationId,
      quotation_number: invoice.quotationNumber,
      user_id: invoice.userId,
      invoice_date: invoice.invoiceDate,
      due_date: invoice.dueDate,
      company_details: invoice.companyDetails,
      customer_details: invoice.customerDetails,
      billing_address: invoice.billingAddress,
      shipping_address: invoice.shippingAddress,
      subtotal: invoice.subtotal,
      cgst_amount: invoice.cgstAmount,
      sgst_amount: invoice.sgstAmount,
      igst_amount: invoice.igstAmount,
      transportation_charges: invoice.transportationCharges,
      discount_amount: invoice.discountAmount,
      grand_total: invoice.grandTotal,
      amount_in_words: invoice.amountInWords,
      payment_terms: invoice.paymentTerms,
      status: invoice.status,
      created_at: invoice.createdAt,
    });

    return !error;
  } catch (err) {
    console.warn('createDbInvoice error:', err);
    return false;
  }
}

