'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  AppState,
  getInitialState,
  saveState,
  INITIAL_USERS,
  STORAGE_KEY,
} from './db-store';
import {
  UserProfile,
  UserAddress,
  CartLineItem,
  Quotation,
  QuotationItem,
  Order,
  Invoice,
  MarketMaterial,
  MandiBulletinData,
  NotificationItem,
  AppSettings,
  ProductCategory,
  QuotationStatus,
  OrderStatus,
  PaymentStatus,
  MovementDirection,
  MarketPricePoint,
} from '@/types';
import { generateRefId, numberToIndianWords } from './utils';
import {
  fetchDbCategories,
  fetchDbMarketMaterials,
  fetchDbQuotations,
  fetchDbOrders,
  createDbQuotation,
  createDbOrder,
  updateDbMarketPrice as syncDbMarketPrice,
  updateDbQuotationPricing,
  updateDbOrderStatus,
  updateDbPaymentStatus,
  createDbInvoice,
} from './supabase-service';

interface StoreContextType {
  state: AppState;
  categories: ProductCategory[];
  currentUser: UserProfile;
  switchUserRole: (role: 'customer' | 'admin') => void;
  // Cart
  cart: CartLineItem[];
  addToCart: (item: Omit<CartLineItem, 'id' | 'addedAt'>) => void;
  updateCartItem: (id: string, updates: Partial<CartLineItem>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  // Quotations
  quotations: Quotation[];
  submitQuotationRequest: (deliveryAddress: UserAddress, specialNotes?: string) => string;
  updateQuotationPricing: (
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
  ) => void;
  acceptQuotation: (quotationId: string) => string; // returns orderId
  rejectQuotation: (quotationId: string, reason?: string) => void;
  // Orders
  orders: Order[];
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    options?: {
      trackingCarrier?: string;
      trackingNumber?: string;
      estimatedDelivery?: string;
      notes?: string;
    }
  ) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  // Invoices
  invoices: Invoice[];
  getInvoiceByOrder: (orderId: string) => Invoice | undefined;
  // Market
  marketMaterials: MarketMaterial[];
  mandiBulletin: MandiBulletinData;
  updateMarketPrice: (materialId: string, newPrice: number, notes?: string) => void;
  updateMandiBulletin: (rawBulletinText: string) => void;
  addMarketMaterial: (material: Omit<MarketMaterial, 'id' | 'lastUpdatedAt' | 'historicalPrices'>) => void;
  lastMarketSyncTime: Date;
  refreshMarketPrices: () => void;
  // Addresses
  addresses: UserAddress[];
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  updateAddress: (id: string, address: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  // Profile
  updateProfile: (profile: Partial<UserProfile>) => void;
  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(getInitialState);
  const [lastMarketSyncTime, setLastMarketSyncTime] = useState<Date>(
    () => new Date('2026-11-03T11:30:00.000Z')
  );

  // Set to client time upon mount
  useEffect(() => {
    setLastMarketSyncTime(new Date());
  }, []);

  // Persist state to localStorage on modification
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Listen to cross-tab storage changes (native storage event only fires across OTHER tabs)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setState(parsed);
        } catch (err) {
          console.error('Error syncing cross-tab state:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Pure state updater without side-effects inside reducer
  const mutate = useCallback((updater: (prev: AppState) => AppState) => {
    setState((prev) => updater(prev));
  }, []);

  // 5-minute automated customer market price polling synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      setLastMarketSyncTime(new Date());
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Background sync from Supabase when database tables exist
  useEffect(() => {
    async function syncFromSupabase() {
      try {
        const [dbCats, dbMat, dbQuotes, dbOrders] = await Promise.all([
          fetchDbCategories(),
          fetchDbMarketMaterials(),
          fetchDbQuotations(),
          fetchDbOrders(),
        ]);

        if (dbCats || dbMat || dbQuotes || dbOrders) {
          mutate((prev) => ({
            ...prev,
            categories: dbCats && dbCats.length > 0 ? dbCats : prev.categories,
            marketMaterials: dbMat && dbMat.length > 0 ? dbMat : prev.marketMaterials,
            quotations: dbQuotes && dbQuotes.length > 0 ? dbQuotes : prev.quotations,
            orders: dbOrders && dbOrders.length > 0 ? dbOrders : prev.orders,
          }));
        }
      } catch (err) {
        // Fallback safely to current state
      }
    }
    syncFromSupabase();
  }, [mutate]);

  const refreshMarketPrices = useCallback(() => {
    setLastMarketSyncTime(new Date());
  }, []);

  // Switch between Demo Customer and Super Admin
  const switchUserRole = useCallback((role: 'customer' | 'admin') => {
    mutate((prev) => ({
      ...prev,
      currentUser: role === 'admin' ? INITIAL_USERS[1] : INITIAL_USERS[0],
    }));
  }, [mutate]);

  // Cart operations
  const addToCart = useCallback((item: Omit<CartLineItem, 'id' | 'addedAt'>) => {
    const now = Date.now();
    const newItemId = `cart-${now}-${Math.random().toString(36).substring(2, 6)}`;
    const addedAt = new Date().toISOString();

    mutate((prev) => {
      // Guard against rapid duplicate submission (< 1000ms) of the identical combination
      const isDuplicateRecent = prev.cart.some((c) => {
        const timeDiff = Math.abs(now - new Date(c.addedAt).getTime());
        const isSameCategory = c.categorySlug === item.categorySlug;
        const isSameGrade = c.grade === item.grade;
        const isSameQty = Number(c.quantity) === Number(item.quantity) && c.unit === item.unit;
        const isSameSpecs = JSON.stringify(c.specifications) === JSON.stringify(item.specifications);
        return isSameCategory && isSameGrade && isSameQty && isSameSpecs && timeDiff < 1000;
      });

      if (isDuplicateRecent) {
        return prev;
      }

      const newItem: CartLineItem = {
        ...item,
        id: newItemId,
        addedAt,
      };

      return {
        ...prev,
        cart: [...prev.cart, newItem],
      };
    });
  }, [mutate]);

  const updateCartItem = useCallback((id: string, updates: Partial<CartLineItem>) => {
    mutate((prev) => ({
      ...prev,
      cart: prev.cart.map((it) => (it.id === id ? { ...it, ...updates } : it)),
    }));
  }, [mutate]);

  const removeFromCart = useCallback((id: string) => {
    mutate((prev) => ({
      ...prev,
      cart: prev.cart.filter((it) => it.id !== id),
    }));
  }, [mutate]);

  const clearCart = useCallback(() => {
    mutate((prev) => ({
      ...prev,
      cart: [],
    }));
  }, [mutate]);

  // Quotation Submission (Customer)
  const submitQuotationRequest = useCallback(
    (deliveryAddress: UserAddress, specialNotes?: string): string => {
      let createdQuotationId = '';
      let pendingQuote: Quotation | null = null;

      mutate((prev) => {
        if (prev.cart.length === 0) return prev;

        const newSeq = prev.quotations.length + 1;
        const quotationNumber = generateRefId('FTI-QT', newSeq);
        const quotationId = `qt-${Date.now()}`;
        createdQuotationId = quotationId;

        const quotationItems: QuotationItem[] = prev.cart.map((cartItem, idx) => ({
          id: `qti-${Date.now()}-${idx}`,
          categoryName: cartItem.categoryName,
          categorySlug: cartItem.categorySlug,
          specifications: cartItem.specifications,
          grade: cartItem.grade,
          quantity: cartItem.quantity,
          unit: cartItem.unit,
          specialInstructions: cartItem.specialInstructions,
        }));

        const newQuotation: Quotation = {
          id: quotationId,
          quotationNumber,
          userId: prev.currentUser.id,
          customerSnapshot: {
            fullName: prev.currentUser.fullName,
            mobile: prev.currentUser.mobile,
            email: prev.currentUser.email,
            companyName: prev.currentUser.companyName,
            gstin: prev.currentUser.gstin,
            deliveryAddress: `${deliveryAddress.streetAddress}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}`,
            deliveryCity: deliveryAddress.city,
            deliveryState: deliveryAddress.state,
            deliveryPincode: deliveryAddress.pincode,
          },
          items: quotationItems,
          status: 'pending',
          version: 1,
          specialNotes: specialNotes || '',
          statusHistory: [
            {
              status: 'pending',
              changedAt: new Date().toISOString(),
              changedBy: `${prev.currentUser.fullName} (Customer)`,
              note: 'Quotation request submitted from cart',
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        pendingQuote = newQuotation;

        const newNotification: NotificationItem = {
          id: `notif-${Date.now()}`,
          userId: prev.currentUser.id,
          title: `Quotation Request ${quotationNumber} Submitted`,
          message: `Your request with ${quotationItems.length} specification combination(s) is under administrative review.`,
          type: 'quotation',
          link: `/quotations/${quotationId}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        return {
          ...prev,
          quotations: [newQuotation, ...prev.quotations],
          cart: [],
          notifications: [newNotification, ...prev.notifications],
        };
      });

      // Background asynchronous sync to Supabase database
      if (pendingQuote) {
        createDbQuotation(pendingQuote).catch((err) =>
          console.warn('Supabase quotation sync notice:', err)
        );
      }

      return createdQuotationId;
    },
    [mutate]
  );

  // Admin quotation pricing & sending
  const updateQuotationPricing = useCallback(
    (
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
    ) => {
      mutate((prev) => {
        const quotation = prev.quotations.find((q) => q.id === quotationId);
        if (!quotation) return prev;

        const subtotal = pricingData.items.reduce((sum, it) => sum + (it.lineTotal || 0), 0);
        const taxableAmount = Math.max(0, subtotal - pricingData.discountAmount);
        const taxAmount = (taxableAmount * pricingData.taxRate) / 100;
        const grandTotal = taxableAmount + taxAmount + pricingData.transportationCharges;

        const statusNote =
          pricingData.status === 'quotation_sent'
            ? 'Official quotation issued and sent to customer'
            : 'Quotation pricing saved as draft';

        const updatedQuotation: Quotation = {
          ...quotation,
          items: pricingData.items,
          subtotal,
          taxRate: pricingData.taxRate,
          taxAmount,
          transportationCharges: pricingData.transportationCharges,
          discountAmount: pricingData.discountAmount,
          grandTotal,
          validUntil: pricingData.validUntil,
          termsAndConditions: pricingData.termsAndConditions,
          adminNotes: pricingData.adminNotes,
          status: pricingData.status,
          version: quotation.version + 1,
          updatedAt: new Date().toISOString(),
          statusHistory: [
            ...quotation.statusHistory,
            {
              status: pricingData.status,
              changedAt: new Date().toISOString(),
              changedBy: `${prev.currentUser.fullName} (Admin)`,
              note: statusNote,
            },
          ],
        };

        const notification: NotificationItem = {
          id: `notif-${Date.now()}`,
          userId: quotation.userId,
          title: `Quotation ${quotation.quotationNumber} Pricing Issued`,
          message: `Official quotation value: ₹${grandTotal.toLocaleString('en-IN')}. Please review and accept before validity expires.`,
          type: 'quotation',
          link: `/quotations/${quotation.id}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        return {
          ...prev,
          quotations: prev.quotations.map((q) => (q.id === quotationId ? updatedQuotation : q)),
          notifications: [notification, ...prev.notifications],
        };
      });

      // Background asynchronous sync to Supabase database
      updateDbQuotationPricing(quotationId, pricingData).catch((err) =>
        console.warn('Supabase quotation pricing sync error:', err)
      );
    },
    [mutate]
  );

  // Customer Quotation Acceptance -> Converted to Purchase Order + Invoice
  const acceptQuotation = useCallback(
    (quotationId: string): string => {
      let createdOrderId = '';
      let pendingOrder: Order | null = null;
      let pendingInvoice: Invoice | null = null;

      mutate((prev) => {
        const quotation = prev.quotations.find((q) => q.id === quotationId);
        if (!quotation || quotation.status !== 'quotation_sent') return prev;

        const orderSeq = prev.orders.length + 1;
        const orderNumber = generateRefId('FTI-ORD', orderSeq);
        const orderId = `ord-${Date.now()}`;
        createdOrderId = orderId;

        const invoiceSeq = prev.invoices.length + 1;
        const invoiceNumber = generateRefId('FTI-INV', invoiceSeq);
        const invoiceId = `inv-${Date.now()}`;

        const defaultAddr = prev.addresses.find((a) => a.isDefault) || prev.addresses[0];

        const updatedQuotation: Quotation = {
          ...quotation,
          status: 'converted_to_order',
          updatedAt: new Date().toISOString(),
          statusHistory: [
            ...quotation.statusHistory,
            {
              status: 'accepted',
              changedAt: new Date().toISOString(),
              changedBy: `${prev.currentUser.fullName} (Customer)`,
              note: 'Quotation accepted by customer',
            },
            {
              status: 'converted_to_order',
              changedAt: new Date().toISOString(),
              changedBy: 'System',
              note: `Converted into Purchase Order #${orderNumber}`,
            },
          ],
        };

        const orderItems = quotation.items.map((it, idx) => ({
          id: `ord-it-${Date.now()}-${idx}`,
          categoryName: it.categoryName,
          specifications: it.specifications,
          grade: it.grade,
          quantity: it.quantity,
          unit: it.unit,
          unitPrice: it.unitPrice || 0,
          lineTotal: it.lineTotal || 0,
        }));

        const newOrder: Order = {
          id: orderId,
          orderNumber,
          quotationId: quotation.id,
          quotationNumber: quotation.quotationNumber,
          userId: quotation.userId,
          customerSnapshot: quotation.customerSnapshot,
          billingAddress: defaultAddr,
          shippingAddress: defaultAddr,
          items: orderItems,
          status: 'order_confirmed',
          paymentStatus: 'pending',
          subtotal: quotation.subtotal || 0,
          taxRate: quotation.taxRate || 18,
          taxAmount: quotation.taxAmount || 0,
          transportationCharges: quotation.transportationCharges || 0,
          discountAmount: quotation.discountAmount || 0,
          grandTotal: quotation.grandTotal || 0,
          invoiceId,
          invoiceNumber,
          statusHistory: [
            {
              status: 'order_confirmed',
              changedAt: new Date().toISOString(),
              changedBy: `${prev.currentUser.fullName} (Customer)`,
              note: `Order placed from accepted Quotation #${quotation.quotationNumber}`,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        pendingOrder = newOrder;

        // Half CGST & Half SGST for intra-state Maharashtra, or full IGST
        const halfTax = (quotation.taxAmount || 0) / 2;

        const newInvoice: Invoice = {
          id: invoiceId,
          invoiceNumber,
          orderId,
          orderNumber,
          quotationId: quotation.id,
          quotationNumber: quotation.quotationNumber,
          userId: quotation.userId,
          invoiceDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          companyDetails: {
            name: prev.settings.companyName,
            tagline: prev.settings.tagline,
            address: prev.settings.address,
            gstin: prev.settings.gstin,
            pan: 'AAACF0123M',
            phone: prev.settings.phone,
            email: prev.settings.email,
            website: 'www.fti-materials.com',
            bankName: prev.settings.bankName,
            accountNumber: prev.settings.accountNumber,
            ifscCode: prev.settings.ifscCode,
            branch: prev.settings.branch,
          },
          customerDetails: {
            name: quotation.customerSnapshot.fullName,
            companyName: quotation.customerSnapshot.companyName,
            phone: quotation.customerSnapshot.mobile,
            email: quotation.customerSnapshot.email,
            gstin: quotation.customerSnapshot.gstin,
          },
          billingAddress: `${defaultAddr.streetAddress}, ${defaultAddr.city}, ${defaultAddr.state} ${defaultAddr.pincode}`,
          shippingAddress: `${defaultAddr.streetAddress}, ${defaultAddr.city}, ${defaultAddr.state} ${defaultAddr.pincode}`,
          items: quotation.items.map((it, idx) => ({
            id: `inv-it-${Date.now()}-${idx}`,
            description: `${it.categoryName} - Grade ${it.grade}`,
            hsnCode: '72142090',
            specifications: Object.entries(it.specifications)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', '),
            grade: it.grade,
            quantity: it.quantity,
            unit: it.unit,
            unitPrice: it.unitPrice || 0,
            taxRate: quotation.taxRate || 18,
            lineTotal: it.lineTotal || 0,
          })),
          subtotal: quotation.subtotal || 0,
          cgstAmount: halfTax,
          sgstAmount: halfTax,
          igstAmount: 0,
          transportationCharges: quotation.transportationCharges || 0,
          discountAmount: quotation.discountAmount || 0,
          grandTotal: quotation.grandTotal || 0,
          amountInWords: numberToIndianWords(quotation.grandTotal || 0),
          paymentTerms: 'Payment due against proforma invoice before dispatch. RTGS/NEFT to SBI account.',
          status: 'issued',
          createdAt: new Date().toISOString(),
        };

        pendingInvoice = newInvoice;

        const notification: NotificationItem = {
          id: `notif-${Date.now()}`,
          userId: quotation.userId,
          title: `Purchase Order ${orderNumber} Confirmed!`,
          message: `Official Invoice ${invoiceNumber} generated. Proceed with payment to initiate dispatch processing.`,
          type: 'order',
          link: `/orders/${orderId}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        return {
          ...prev,
          quotations: prev.quotations.map((q) => (q.id === quotationId ? updatedQuotation : q)),
          orders: [newOrder, ...prev.orders],
          invoices: [newInvoice, ...prev.invoices],
          notifications: [notification, ...prev.notifications],
        };
      });

      // Background asynchronous sync to Supabase database
      if (pendingOrder) {
        createDbOrder(pendingOrder).catch((err) =>
          console.warn('Supabase order sync notice:', err)
        );
      }
      if (pendingInvoice) {
        createDbInvoice(pendingInvoice).catch((err) =>
          console.warn('Supabase invoice sync notice:', err)
        );
      }

      return createdOrderId;
    },
    [mutate]
  );

  // Reject quotation
  const rejectQuotation = useCallback(
    (quotationId: string, reason?: string) => {
      mutate((prev) => {
        const quotation = prev.quotations.find((q) => q.id === quotationId);
        if (!quotation) return prev;

        const updated: Quotation = {
          ...quotation,
          status: 'rejected',
          updatedAt: new Date().toISOString(),
          statusHistory: [
            ...quotation.statusHistory,
            {
              status: 'rejected',
              changedAt: new Date().toISOString(),
              changedBy: `${prev.currentUser.fullName} (Customer)`,
              note: reason || 'Quotation declined by customer',
            },
          ],
        };

        return {
          ...prev,
          quotations: prev.quotations.map((q) => (q.id === quotationId ? updated : q)),
        };
      });
    },
    [mutate]
  );

  // Order status update (Admin)
  const updateOrderStatus = useCallback(
    (
      orderId: string,
      status: OrderStatus,
      options?: {
        trackingCarrier?: string;
        trackingNumber?: string;
        estimatedDelivery?: string;
        notes?: string;
      }
    ) => {
      mutate((prev) => {
        const order = prev.orders.find((o) => o.id === orderId);
        if (!order) return prev;

        const updatedOrder: Order = {
          ...order,
          status,
          trackingCarrier: options?.trackingCarrier || order.trackingCarrier,
          trackingNumber: options?.trackingNumber || order.trackingNumber,
          estimatedDelivery: options?.estimatedDelivery || order.estimatedDelivery,
          dispatchDate: status === 'dispatched' ? new Date().toISOString().split('T')[0] : order.dispatchDate,
          updatedAt: new Date().toISOString(),
          statusHistory: [
            ...order.statusHistory,
            {
              status,
              changedAt: new Date().toISOString(),
              changedBy: `${prev.currentUser.fullName} (Admin)`,
              note: options?.notes || `Order status updated to ${status}`,
            },
          ],
        };

        const notification: NotificationItem = {
          id: `notif-${Date.now()}`,
          userId: order.userId,
          title: `Order #${order.orderNumber} Status: ${status.replace('_', ' ').toUpperCase()}`,
          message: options?.notes || `Your order status has been updated.`,
          type: 'order',
          link: `/orders/${order.id}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        return {
          ...prev,
          orders: prev.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
          notifications: [notification, ...prev.notifications],
        };
      });

      // Background asynchronous sync to Supabase database
      updateDbOrderStatus(orderId, status, options).catch((err) =>
        console.warn('Supabase order status sync notice:', err)
      );
    },
    [mutate]
  );

  // Payment status update (Admin)
  const updatePaymentStatus = useCallback(
    (orderId: string, status: PaymentStatus) => {
      mutate((prev) => {
        const order = prev.orders.find((o) => o.id === orderId);
        if (!order) return prev;

        const updatedOrder: Order = {
          ...order,
          paymentStatus: status,
          updatedAt: new Date().toISOString(),
        };

        const updatedInvoices = prev.invoices.map((inv) =>
          inv.orderId === orderId ? { ...inv, status: status === 'paid' ? ('paid' as const) : inv.status } : inv
        );

        return {
          ...prev,
          orders: prev.orders.map((o) => (o.id === orderId ? updatedOrder : o)),
          invoices: updatedInvoices,
        };
      });

      // Background asynchronous sync to Supabase database
      updateDbPaymentStatus(orderId, status).catch((err) =>
        console.warn('Supabase payment status sync notice:', err)
      );
    },
    [mutate]
  );

  const getInvoiceByOrder = useCallback(
    (orderId: string) => {
      return state.invoices.find((inv) => inv.orderId === orderId);
    },
    [state.invoices]
  );

  // Admin updates market material price with audit trail and historical chart update
  const updateMarketPrice = useCallback(
    (materialId: string, newPrice: number, notes?: string) => {
      mutate((prev) => {
        const material = prev.marketMaterials.find((m) => m.id === materialId);
        if (!material) return prev;

        const prevPrice = material.currentPrice;
        const priceChange = newPrice - prevPrice;
        const percentageChange = Number(((priceChange / prevPrice) * 100).toFixed(2));
        const movementDirection: MovementDirection =
          priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'neutral';

        const now = new Date();
        const newPoint: MarketPricePoint = {
          date: now.toISOString().split('T')[0],
          timestamp: now.getTime(),
          price: newPrice,
          previousPrice: prevPrice,
          priceChange,
          percentageChange,
          movementDirection,
          notes: notes || `Trading Update: ${movementDirection.toUpperCase()} ${priceChange >= 0 ? '+' : ''}₹${priceChange}`,
        };

        const updatedHistory = [...(material.historicalPrices || []), newPoint].slice(-50);

        const updatedMaterial: MarketMaterial = {
          ...material,
          currentPrice: newPrice,
          previousPrice: prevPrice,
          priceChange,
          percentageChange,
          movementDirection,
          highPrice: Math.max(material.highPrice, newPrice),
          lowPrice: Math.min(material.lowPrice, newPrice),
          lastUpdatedAt: now.toISOString(),
          notes: notes || material.notes,
          historicalPrices: updatedHistory,
        };

        return {
          ...prev,
          marketMaterials: prev.marketMaterials.map((m) => (m.id === materialId ? updatedMaterial : m)),
        };
      });

      // Background asynchronous sync to Supabase database
      syncDbMarketPrice(materialId, newPrice, notes).catch((err) =>
        console.warn('Supabase market price sync notice:', err)
      );
    },
    [mutate]
  );


  const addMarketMaterial = useCallback(
    (materialData: Omit<MarketMaterial, 'id' | 'lastUpdatedAt' | 'historicalPrices'>) => {
      mutate((prev) => {
        const id = `mat-${Date.now()}`;
        const now = new Date();
        const newMat: MarketMaterial = {
          ...materialData,
          id,
          lastUpdatedAt: now.toISOString(),
          historicalPrices: [
            {
              date: now.toISOString().split('T')[0],
              timestamp: now.getTime(),
              price: materialData.currentPrice,
            },
          ],
        };
        return {
          ...prev,
          marketMaterials: [...prev.marketMaterials, newMat],
        };
      });
    },
    [mutate]
  );

  const updateMandiBulletin = useCallback(
    (rawBulletinText: string) => {
      // Import parser dynamically or use helper
      const { parseMandiBroadcast } = require('./mandi-parser');
      const { bulletin, materials } = parseMandiBroadcast(rawBulletinText);
      mutate((prev: AppState) => {
        const notif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: 'Live Mandi Benchmark Updated',
          message: `Mandi Gobindgarh live bulletin updated for ${bulletin.dateStr} (${bulletin.timeStr}) with ${materials.length} hub rates.`,
          type: 'market',
          link: '/market',
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        return {
          ...prev,
          mandiBulletin: bulletin,
          marketMaterials: materials,
          notifications: [notif, ...prev.notifications],
        };
      });
      setLastMarketSyncTime(new Date());
    },
    [mutate]
  );

  // Addresses
  const addAddress = useCallback(
    (address: Omit<UserAddress, 'id'>) => {
      mutate((prev) => {
        const newAddr: UserAddress = {
          ...address,
          id: `addr-${Date.now()}`,
        };
        const updatedList = address.isDefault
          ? prev.addresses.map((a) => ({ ...a, isDefault: false }))
          : prev.addresses;
        return {
          ...prev,
          addresses: [...updatedList, newAddr],
        };
      });
    },
    [mutate]
  );

  const updateAddress = useCallback(
    (id: string, updates: Partial<UserAddress>) => {
      mutate((prev) => ({
        ...prev,
        addresses: prev.addresses.map((a) => (a.id === id ? { ...a, ...updates } : a)),
      }));
    },
    [mutate]
  );

  const deleteAddress = useCallback(
    (id: string) => {
      mutate((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((a) => a.id !== id),
      }));
    },
    [mutate]
  );

  // Profile
  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      mutate((prev) => ({
        ...prev,
        currentUser: { ...prev.currentUser, ...updates },
      }));
    },
    [mutate]
  );

  // Notifications
  const markNotificationRead = useCallback(
    (id: string) => {
      mutate((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      }));
    },
    [mutate]
  );

  // Settings
  const updateSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      mutate((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...updates },
      }));
    },
    [mutate]
  );

  const value = useMemo(
    () => ({
      state,
      categories: state.categories,
      currentUser: state.currentUser,
      switchUserRole,
      cart: state.cart,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      quotations: state.quotations,
      submitQuotationRequest,
      updateQuotationPricing,
      acceptQuotation,
      rejectQuotation,
      orders: state.orders,
      updateOrderStatus,
      updatePaymentStatus,
      invoices: state.invoices,
      getInvoiceByOrder,
      marketMaterials: state.marketMaterials,
      mandiBulletin: state.mandiBulletin,
      updateMarketPrice,
      updateMandiBulletin,
      addMarketMaterial,
      lastMarketSyncTime,
      refreshMarketPrices,
      addresses: state.addresses,
      addAddress,
      updateAddress,
      deleteAddress,
      updateProfile,
      notifications: state.notifications,
      markNotificationRead,
      settings: state.settings,
      updateSettings,
    }),
    [
      state,
      switchUserRole,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      submitQuotationRequest,
      updateQuotationPricing,
      acceptQuotation,
      rejectQuotation,
      updateOrderStatus,
      updatePaymentStatus,
      getInvoiceByOrder,
      updateMarketPrice,
      updateMandiBulletin,
      addMarketMaterial,
      lastMarketSyncTime,
      refreshMarketPrices,
      addAddress,
      updateAddress,
      deleteAddress,
      updateProfile,
      markNotificationRead,
      updateSettings,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
