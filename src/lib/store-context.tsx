'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  AppState,
  getInitialState,
  saveState,
  INITIAL_USERS,
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
  NotificationItem,
  AppSettings,
  ProductCategory,
  QuotationStatus,
  OrderStatus,
  PaymentStatus,
} from '@/types';
import { generateRefId, numberToIndianWords } from './utils';

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
  updateMarketPrice: (materialId: string, newPrice: number, notes?: string) => void;
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

  // Listen to cross-tab / window state changes
  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<AppState>;
      if (custom.detail) {
        setState(custom.detail);
      }
    };
    window.addEventListener('fti_state_updated', handleUpdate);
    return () => window.removeEventListener('fti_state_updated', handleUpdate);
  }, []);

  // Save changes whenever state modifies
  const mutate = useCallback((updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  // 5-minute automated customer market price polling synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      setLastMarketSyncTime(new Date());
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

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
    mutate((prev) => {
      const newItem: CartLineItem = {
        ...item,
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        addedAt: new Date().toISOString(),
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
    },
    [mutate]
  );

  // Customer Quotation Acceptance -> Converted to Purchase Order + Invoice
  const acceptQuotation = useCallback(
    (quotationId: string): string => {
      let createdOrderId = '';
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
        const movementDirection = priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'neutral';

        const now = new Date();
        const newPoint = {
          date: now.toISOString().split('T')[0],
          timestamp: now.getTime(),
          price: newPrice,
        };

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
          historicalPrices: [...material.historicalPrices, newPoint],
        };

        return {
          ...prev,
          marketMaterials: prev.marketMaterials.map((m) => (m.id === materialId ? updatedMaterial : m)),
        };
      });
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
      updateMarketPrice,
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
