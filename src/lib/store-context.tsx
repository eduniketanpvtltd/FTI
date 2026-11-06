'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  AppState,
  getInitialState,
  saveState,
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  GUEST_USER,
  STORAGE_KEY,
} from './db-store';
import {
  formatIstBulletinDateTime,
  syncBulletinWithLatestTime,
  parseMandiBroadcast,
} from './mandi-parser';
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
  BusinessType,
} from '@/types';
import { generateRefId, numberToIndianWords } from './utils';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from './firebase';
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

export interface OnboardingProfileInput {
  fullName: string;
  email: string;
  mobile: string;
  designation: string;
  companyName: string;
  businessType: BusinessType;
  gstin: string;
  primaryMaterials?: string[];
  monthlyVolume?: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  addressType?: 'billing' | 'shipping' | 'both';
}

export interface GoogleAccountPayload {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
}

interface StoreContextType {
  state: AppState;
  categories: ProductCategory[];
  // Auth & User
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  authLoading: boolean;
  currentUser: UserProfile;
  users: UserProfile[];
  loginWithGoogle: (
    fallbackAccount?: GoogleAccountPayload
  ) => Promise<{
    status: 'logged_in' | 'needs_onboarding' | 'error';
    user?: UserProfile;
    error?: string;
    errorCode?: string;
  }>;
  completeSignupProfile: (input: OnboardingProfileInput) => Promise<UserProfile>;
  logout: () => Promise<void>;
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
  refreshMarketPrices: () => Promise<void>;
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
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [lastMarketSyncTime, setLastMarketSyncTime] = useState<Date>(() => new Date('2026-01-01T00:00:00.000Z'));

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

  // Helper to resolve or create a UserProfile from a Google account payload
  const resolveGoogleAccount = useCallback(
    async (
      account: GoogleAccountPayload
    ): Promise<{ status: 'logged_in' | 'needs_onboarding'; user: UserProfile }> => {
      let dbProfile: UserProfile | null = null;
      let dbAddresses: UserAddress[] = [];

      try {
        const res = await fetch(
          `/api/auth/profile?uid=${encodeURIComponent(account.uid)}&email=${encodeURIComponent(
            account.email || ''
          )}`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.found && json.profile) {
            dbProfile = json.profile;
            dbAddresses = Array.isArray(json.addresses) ? json.addresses : [];
          }
        }
      } catch (err) {
        // Fallback to local state users
      }

      let resolvedUser: UserProfile | null = null;
      let needsOnboarding = true;

      mutate((prev) => {
        const localExisting = prev.users.find(
          (u) =>
            (account.uid && u.firebaseUid === account.uid) ||
            (account.email && u.email.toLowerCase() === account.email.toLowerCase())
        );

        const existing = localExisting || dbProfile;
        const hasCompanyAndMobile = Boolean(
          existing &&
            existing.companyName &&
            existing.companyName !== 'Guest Visitor' &&
            existing.companyName !== 'Pending Setup' &&
            existing.mobile &&
            existing.mobile.trim().length >= 10 &&
            existing.isProfileComplete !== false
        );

        if (existing && hasCompanyAndMobile) {
          needsOnboarding = false;
          const mergedProfile: UserProfile = {
            ...existing,
            firebaseUid: account.uid || existing.firebaseUid,
            fullName: existing.fullName || account.displayName || 'Authorized Buyer',
            email: account.email || existing.email,
            avatarUrl: account.photoURL || existing.avatarUrl,
            isProfileComplete: true,
          };
          resolvedUser = mergedProfile;

          const existingAddrIds = new Set(prev.addresses.map((a) => a.id));
          const mergedAddresses = [
            ...prev.addresses,
            ...dbAddresses.filter((a) => !existingAddrIds.has(a.id)),
          ];

          const updatedUsers = prev.users.some((u) => u.id === mergedProfile.id)
            ? prev.users.map((u) => (u.id === mergedProfile.id ? mergedProfile : u))
            : [mergedProfile, ...prev.users];

          return {
            ...prev,
            isAuthenticated: true,
            currentUser: mergedProfile,
            users: updatedUsers,
            addresses: mergedAddresses,
          };
        } else {
          needsOnboarding = true;
          const partialUser: UserProfile = {
            id: existing?.id || `usr-${account.uid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}`,
            firebaseUid: account.uid,
            fullName:
              existing?.fullName && existing.fullName !== 'Guest Visitor'
                ? existing.fullName
                : account.displayName || (account.email ? account.email.split('@')[0] : ''),
            email: account.email || existing?.email || '',
            mobile: existing?.mobile || account.phoneNumber || '',
            companyName:
              existing?.companyName && existing.companyName !== 'Guest Visitor'
                ? existing.companyName
                : '',
            gstin: existing?.gstin || '',
            businessType: existing?.businessType || 'Manufacturer',
            designation: existing?.designation || 'Purchase / Procurement Head',
            role: existing?.role || 'customer',
            isActive: true,
            isProfileComplete: false,
            avatarUrl: account.photoURL || existing?.avatarUrl,
            createdAt: existing?.createdAt || new Date().toISOString(),
          };
          resolvedUser = partialUser;

          return {
            ...prev,
            isAuthenticated: true,
            currentUser: partialUser,
          };
        }
      });

      return {
        status: needsOnboarding ? 'needs_onboarding' : 'logged_in',
        user: resolvedUser!,
      };
    },
    [mutate]
  );

  // Sync Firebase Auth session if user previously authenticated via Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && fbUser.email) {
        // Only auto-sync if not already authenticated as the same user
        setState((prev) => {
          if (prev.isAuthenticated && prev.currentUser.email.toLowerCase() === fbUser.email?.toLowerCase()) {
            return prev;
          }
          return prev;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch latest market prices & bulletin and sync all timestamps to latest current time
  const refreshMarketPrices = useCallback(async () => {
    const now = new Date();
    const { sessionDate, isoStr } = formatIstBulletinDateTime(now);

    try {
      const res = await fetch(`/api/market?t=${now.getTime()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          mutate((prev) => {
            const baseMaterials: MarketMaterial[] =
              json.source === 'supabase'
                ? json.data
                : prev.marketMaterials && prev.marketMaterials.length > 0
                ? prev.marketMaterials
                : json.data;

            const syncedMaterials = baseMaterials.map((m) => {
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

            const updatedBulletin = syncBulletinWithLatestTime(
              prev.mandiBulletin || json.bulletin,
              syncedMaterials,
              now
            );

            return {
              ...prev,
              marketMaterials: syncedMaterials,
              mandiBulletin: updatedBulletin,
            };
          });
          setLastMarketSyncTime(now);
          return;
        }
      }
    } catch (err) {
      console.warn('Market refresh fetch fallback:', err);
    }

    // Fallback: sync all timestamps and bulletin date/time to latest time
    mutate((prev) => {
      const syncedMaterials = prev.marketMaterials.map((m) => {
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
      const updatedBulletin = syncBulletinWithLatestTime(
        prev.mandiBulletin,
        syncedMaterials,
        now
      );
      return {
        ...prev,
        marketMaterials: syncedMaterials,
        mandiBulletin: updatedBulletin,
      };
    });
    setLastMarketSyncTime(now);
  }, [mutate]);

  // Initial sync on mount + 3-minute automated market price polling & time synchronization
  useEffect(() => {
    refreshMarketPrices();
    const interval = setInterval(() => {
      refreshMarketPrices();
    }, 3 * 60 * 1000); // Auto sync every 3 minutes

    return () => clearInterval(interval);
  }, [refreshMarketPrices]);

  // Background sync from Supabase when database tables exist
  useEffect(() => {
    async function syncFromSupabase() {
      try {
        const [dbCats, dbMat, dbQuotes, dbOrders, profilesRes] = await Promise.all([
          fetchDbCategories(),
          fetchDbMarketMaterials(),
          fetchDbQuotations(),
          fetchDbOrders(),
          fetch('/api/auth/profile?all=true').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        ]);

        const dbProfiles: UserProfile[] = profilesRes?.profiles || [];

        if (dbCats || dbMat || dbQuotes || dbOrders || dbProfiles.length > 0) {
          const now = new Date();
          mutate((prev) => {
            const existingEmails = new Set(prev.users.map((u) => u.email.toLowerCase()));
            const mergedUsers = [...prev.users];
            for (const p of dbProfiles) {
              if (p.email && !existingEmails.has(p.email.toLowerCase())) {
                existingEmails.add(p.email.toLowerCase());
                mergedUsers.push(p);
              }
            }

            const resolvedMat = dbMat && dbMat.length > 0 ? dbMat : prev.marketMaterials;
            return {
              ...prev,
              users: mergedUsers,
              categories: INITIAL_CATEGORIES,
              marketMaterials: resolvedMat,
              mandiBulletin: syncBulletinWithLatestTime(prev.mandiBulletin, resolvedMat, now),
              quotations: dbQuotes && dbQuotes.length > 0 ? dbQuotes : prev.quotations,
              orders: dbOrders && dbOrders.length > 0 ? dbOrders : prev.orders,
            };
          });
          setLastMarketSyncTime(now);
        }
      } catch (err) {
        // Fallback safely to current state
      }
    }
    syncFromSupabase();
  }, [mutate]);

  // Google Sign-In / Sign-Up Flow
  const loginWithGoogle = useCallback(
    async (
      fallbackAccount?: GoogleAccountPayload
    ): Promise<{
      status: 'logged_in' | 'needs_onboarding' | 'error';
      user?: UserProfile;
      error?: string;
      errorCode?: string;
    }> => {
      setAuthLoading(true);
      try {
        if (fallbackAccount) {
          const result = await resolveGoogleAccount(fallbackAccount);
          return result;
        }

        const credential = await signInWithPopup(auth, googleProvider);
        const fbUser = credential.user;

        const result = await resolveGoogleAccount({
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || '',
          photoURL: fbUser.photoURL || undefined,
          phoneNumber: fbUser.phoneNumber || undefined,
        });

        return result;
      } catch (err: any) {
        const code = err?.code || '';
        if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
          return {
            status: 'error',
            errorCode: code,
            error: 'Google Sign-In popup was closed before completing. Please try again.',
          };
        }
        return {
          status: 'error',
          errorCode: code || 'auth/unknown',
          error:
            err?.message ||
            'Unable to complete Google Sign-In popup. Please try again or continue with your Google email below.',
        };
      } finally {
        setAuthLoading(false);
      }
    },
    [resolveGoogleAccount]
  );

  // Complete B2B Buyer Profile during Signup
  const completeSignupProfile = useCallback(
    async (input: OnboardingProfileInput): Promise<UserProfile> => {
      let createdProfile: UserProfile | null = null;
      let createdAddress: UserAddress | null = null;

      mutate((prev) => {
        const userId =
          prev.currentUser.id && prev.currentUser.id !== 'guest'
            ? prev.currentUser.id
            : `usr-${Date.now()}`;

        const completedUser: UserProfile = {
          id: userId,
          firebaseUid: prev.currentUser.firebaseUid || `g-${Date.now()}`,
          fullName: input.fullName.trim(),
          email: input.email.trim().toLowerCase(),
          mobile: input.mobile.trim(),
          designation: input.designation || 'Purchase / Procurement Head',
          companyName: input.companyName.trim(),
          gstin: input.gstin.trim().toUpperCase(),
          businessType: input.businessType,
          primaryMaterials: input.primaryMaterials || [],
          monthlyVolume: input.monthlyVolume || '',
          city: input.city.trim(),
          state: input.state.trim(),
          role: prev.currentUser.role || 'customer',
          isActive: true,
          isProfileComplete: true,
          avatarUrl: prev.currentUser.avatarUrl,
          createdAt: prev.currentUser.createdAt || new Date().toISOString(),
        };

        const newAddress: UserAddress = {
          id: `addr-${Date.now()}`,
          userId,
          addressType: input.addressType || 'both',
          isDefault: true,
          recipientName: `${input.companyName.trim()} (${input.fullName.trim()})`,
          phone: input.mobile.trim(),
          companyName: input.companyName.trim(),
          gstin: input.gstin.trim().toUpperCase() || undefined,
          streetAddress: input.streetAddress.trim(),
          landmark: input.landmark?.trim() || undefined,
          city: input.city.trim(),
          district: input.district.trim() || input.city.trim(),
          state: input.state.trim(),
          pincode: input.pincode.trim(),
          country: 'India',
        };

        const welcomeNotif: NotificationItem = {
          id: `notif-welcome-${Date.now()}`,
          userId,
          title: `B2B Buyer Account Verified: ${input.companyName.trim()}`,
          message: `Welcome ${input.fullName.trim()}! Your company profile and delivery location (${input.city.trim()}, ${input.state.trim()}) are now active for official RFQ quotations.`,
          type: 'system',
          link: '/raw-materials',
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        createdProfile = completedUser;
        createdAddress = newAddress;

        const updatedUsers = prev.users.some(
          (u) => u.id === completedUser.id || u.email.toLowerCase() === completedUser.email.toLowerCase()
        )
          ? prev.users.map((u) =>
              u.id === completedUser.id || u.email.toLowerCase() === completedUser.email.toLowerCase()
                ? completedUser
                : u
            )
          : [completedUser, ...prev.users];

        // Clear default flag only for this user's existing addresses
        const updatedAddresses = [
          ...prev.addresses.map((a) => (a.userId === userId ? { ...a, isDefault: false } : a)),
          newAddress,
        ];

        return {
          ...prev,
          isAuthenticated: true,
          currentUser: completedUser,
          users: updatedUsers,
          addresses: updatedAddresses,
          notifications: [welcomeNotif, ...prev.notifications],
        };
      });

      if (createdProfile) {
        fetch('/api/auth/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile: createdProfile,
            address: createdAddress,
          }),
        }).catch((err) => console.warn('Profile sync notice:', err));
      }

      return createdProfile!;
    },
    [mutate]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      // Ignore firebase signout warning if not signed into firebase
    }
    mutate((prev) => ({
      ...prev,
      isAuthenticated: false,
      currentUser: GUEST_USER,
    }));
  }, [mutate]);

  // Switch between Demo Customer and Super Admin
  const switchUserRole = useCallback(
    (role: 'customer' | 'admin') => {
      mutate((prev) => ({
        ...prev,
        isAuthenticated: true,
        currentUser: role === 'admin' ? INITIAL_USERS[1] : INITIAL_USERS[0],
      }));
    },
    [mutate]
  );

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

  // Quotation Submission (Customer) - Requires Authentication & Completed Profile
  const submitQuotationRequest = useCallback(
    (deliveryAddress: UserAddress, specialNotes?: string): string => {
      if (
        !state.isAuthenticated ||
        state.currentUser.id === 'guest' ||
        state.currentUser.isProfileComplete === false
      ) {
        throw new Error('Authentication and completed B2B buyer profile are required to request a quotation.');
      }

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
            website: 'https://fti-app-sooty.vercel.app',
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
      const now = new Date();
      const { sessionDate, isoStr } = formatIstBulletinDateTime(now);

      mutate((prev) => {
        const material = prev.marketMaterials.find((m) => m.id === materialId);
        if (!material) return prev;

        const prevPrice = material.currentPrice;
        const priceChange = newPrice - prevPrice;
        const percentageChange = Number(((priceChange / prevPrice) * 100).toFixed(2));
        const movementDirection: MovementDirection =
          priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'neutral';

        const newPoint: MarketPricePoint = {
          date: sessionDate,
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
          lastUpdatedAt: isoStr,
          notes: notes || material.notes,
          historicalPrices: updatedHistory,
        };

        const updatedMaterials = prev.marketMaterials.map((m) =>
          m.id === materialId ? updatedMaterial : m
        );

        return {
          ...prev,
          marketMaterials: updatedMaterials,
          mandiBulletin: syncBulletinWithLatestTime(prev.mandiBulletin, updatedMaterials, now),
        };
      });

      setLastMarketSyncTime(now);

      // Background asynchronous sync to Supabase database
      syncDbMarketPrice(materialId, newPrice, notes).catch((err) =>
        console.warn('Supabase market price sync notice:', err)
      );
    },
    [mutate]
  );


  const addMarketMaterial = useCallback(
    (materialData: Omit<MarketMaterial, 'id' | 'lastUpdatedAt' | 'historicalPrices'>) => {
      const now = new Date();
      const { sessionDate, isoStr } = formatIstBulletinDateTime(now);

      mutate((prev) => {
        const id = `mat-${Date.now()}`;
        const newMat: MarketMaterial = {
          ...materialData,
          id,
          lastUpdatedAt: isoStr,
          historicalPrices: [
            {
              date: sessionDate,
              timestamp: now.getTime(),
              price: materialData.currentPrice,
            },
          ],
        };
        const updatedMaterials = [...prev.marketMaterials, newMat];
        return {
          ...prev,
          marketMaterials: updatedMaterials,
          mandiBulletin: syncBulletinWithLatestTime(prev.mandiBulletin, updatedMaterials, now),
        };
      });
      setLastMarketSyncTime(now);
    },
    [mutate]
  );

  const updateMandiBulletin = useCallback(
    (rawBulletinText: string) => {
      const now = new Date();
      const { bulletin, materials } = parseMandiBroadcast(rawBulletinText, true);
      const syncedBulletin = syncBulletinWithLatestTime(bulletin, materials, now);
      mutate((prev: AppState) => {
        const notif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: 'Live Mandi Benchmark Updated',
          message: `Mandi Gobindgarh live bulletin updated for ${syncedBulletin.dateStr} (${syncedBulletin.timeStr}) with ${materials.length} hub rates.`,
          type: 'market',
          link: '/market',
          isRead: false,
          createdAt: now.toISOString(),
        };

        return {
          ...prev,
          mandiBulletin: syncedBulletin,
          marketMaterials: materials,
          notifications: [notif, ...prev.notifications],
        };
      });
      setLastMarketSyncTime(now);
    },
    [mutate]
  );

  // Addresses
  const addAddress = useCallback(
    (address: Omit<UserAddress, 'id'>) => {
      let createdAddr: UserAddress | null = null;
      let ownerProfile: UserProfile | null = null;

      mutate((prev) => {
        const newAddr: UserAddress = {
          ...address,
          id: `addr-${Date.now()}`,
        };
        createdAddr = newAddr;
        ownerProfile = prev.currentUser;

        const updatedList = address.isDefault
          ? prev.addresses.map((a) =>
              a.userId === address.userId ? { ...a, isDefault: false } : a
            )
          : prev.addresses;
        return {
          ...prev,
          addresses: [...updatedList, newAddr],
        };
      });

      if (createdAddr && ownerProfile && (ownerProfile as UserProfile).id !== 'guest') {
        fetch('/api/auth/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile: ownerProfile,
            address: createdAddr,
          }),
        }).catch(() => {});
      }
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
      let updatedProfile: UserProfile | null = null;
      mutate((prev) => {
        const merged: UserProfile = {
          ...prev.currentUser,
          ...updates,
          isProfileComplete: true,
        };
        updatedProfile = merged;
        const updatedUsers = prev.users.some((u) => u.id === merged.id)
          ? prev.users.map((u) => (u.id === merged.id ? merged : u))
          : [merged, ...prev.users];

        return {
          ...prev,
          currentUser: merged,
          users: updatedUsers,
        };
      });

      if (updatedProfile && (updatedProfile as UserProfile).id !== 'guest') {
        fetch('/api/auth/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: updatedProfile }),
        }).catch(() => {});
      }
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

  const isProfileComplete = useMemo(() => {
    if (!state.isAuthenticated || state.currentUser.id === 'guest') return false;
    if (state.currentUser.isProfileComplete === false) return false;
    return Boolean(
      state.currentUser.companyName &&
        state.currentUser.companyName !== 'Guest Visitor' &&
        state.currentUser.mobile &&
        state.currentUser.mobile.trim().length >= 10
    );
  }, [state.isAuthenticated, state.currentUser]);

  const userAddresses = useMemo(() => {
    if (!state.isAuthenticated || state.currentUser.id === 'guest') {
      return [];
    }
    if (state.currentUser.role !== 'customer') {
      return state.addresses;
    }
    return state.addresses.filter((a) => a.userId === state.currentUser.id);
  }, [state.isAuthenticated, state.currentUser, state.addresses]);

  const value = useMemo(
    () => ({
      state,
      categories: state.categories,
      isAuthenticated: state.isAuthenticated,
      isProfileComplete,
      authLoading,
      currentUser: state.currentUser,
      users: state.users,
      loginWithGoogle,
      completeSignupProfile,
      logout,
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
      addresses: userAddresses,
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
      isProfileComplete,
      authLoading,
      userAddresses,
      loginWithGoogle,
      completeSignupProfile,
      logout,
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
