export type UserRole = 'super_admin' | 'admin' | 'sales_manager' | 'market_manager' | 'customer';

export type BusinessType = 'Manufacturer' | 'Wholesaler' | 'Fabricator' | 'Contractor' | 'Trader' | 'Other';

export interface UserProfile {
  id: string;
  firebaseUid?: string;
  fullName: string;
  email: string;
  mobile: string;
  companyName: string;
  gstin: string;
  businessType: BusinessType;
  designation?: string;
  primaryMaterials?: string[];
  monthlyVolume?: string;
  city?: string;
  state?: string;
  role: UserRole;
  isActive: boolean;
  isProfileComplete?: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface UserAddress {
  id: string;
  userId: string;
  addressType: 'billing' | 'shipping' | 'both';
  isDefault: boolean;
  recipientName: string;
  phone: string;
  companyName?: string;
  gstin?: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  isComingSoon?: boolean;
  displayOrder: number;
  availableGrades: string[];
  specificationFields: SpecificationField[];
}

export interface SpecificationField {
  key: string;
  label: string;
  type: 'select' | 'number' | 'text';
  options?: string[];
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  required: boolean;
  placeholder?: string;
}

export interface CartLineItem {
  id: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  specifications: Record<string, string | number>;
  grade: string;
  quantity: number;
  unit: string;
  specialInstructions?: string;
  addedAt: string;
}

export type QuotationStatus =
  | 'draft'
  | 'pending'
  | 'under_review'
  | 'quotation_prepared'
  | 'quotation_sent'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'converted_to_order';

export interface QuotationItem {
  id: string;
  categoryName: string;
  categorySlug: string;
  specifications: Record<string, string | number>;
  grade: string;
  quantity: number;
  unit: string;
  unitPrice?: number; // Added by admin
  lineTotal?: number; // Added by admin
  specialInstructions?: string;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. FTI-QT-2026-0001
  userId: string;
  customerSnapshot: {
    fullName: string;
    mobile: string;
    email: string;
    companyName: string;
    gstin?: string;
    deliveryAddress?: string;
    deliveryCity?: string;
    deliveryState?: string;
    deliveryPincode?: string;
  };
  items: QuotationItem[];
  status: QuotationStatus;
  version: number;
  validUntil?: string; // ISO date string
  subtotal?: number;
  taxRate?: number; // e.g. 18 for 18% GST
  taxAmount?: number;
  transportationCharges?: number;
  discountAmount?: number;
  grandTotal?: number;
  specialNotes?: string;
  adminNotes?: string;
  termsAndConditions?: string;
  statusHistory: {
    status: QuotationStatus;
    changedAt: string;
    changedBy: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'order_confirmed'
  | 'payment_pending'
  | 'payment_received'
  | 'processing'
  | 'dispatched'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';

export interface OrderItem {
  id: string;
  categoryName: string;
  categorySlug?: string;
  specifications: Record<string, string | number>;
  grade: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. FTI-ORD-2026-0001
  quotationId: string;
  quotationNumber: string;
  userId: string;
  customerSnapshot: Quotation['customerSnapshot'];
  billingAddress: UserAddress;
  shippingAddress: UserAddress;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  transportationCharges: number;
  discountAmount: number;
  grandTotal: number;
  trackingCarrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  dispatchDate?: string;
  cancellationReason?: string;
  statusHistory: {
    status: OrderStatus;
    changedAt: string;
    changedBy: string;
    note?: string;
  }[];
  invoiceId?: string;
  invoiceNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. FTI-INV-2026-0001
  orderId: string;
  orderNumber: string;
  quotationId: string;
  quotationNumber: string;
  userId: string;
  invoiceDate: string;
  dueDate: string;
  companyDetails: {
    name: string;
    tagline: string;
    address: string;
    gstin: string;
    pan: string;
    phone: string;
    email: string;
    website: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  customerDetails: {
    name: string;
    companyName: string;
    phone: string;
    email: string;
    gstin?: string;
  };
  billingAddress: string;
  shippingAddress: string;
  items: {
    id: string;
    description: string;
    hsnCode: string;
    specifications: string;
    grade: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    taxRate: number;
    lineTotal: number;
  }[];
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  transportationCharges: number;
  discountAmount: number;
  grandTotal: number;
  amountInWords: string;
  paymentTerms: string;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  createdAt: string;
}

export interface MarketPricePoint {
  date: string; // ISO date or formatted
  timestamp: number;
  price: number;
  previousPrice?: number;
  priceChange?: number;
  percentageChange?: number;
  movementDirection?: MovementDirection;
  notes?: string;
}

export type MovementDirection = 'up' | 'down' | 'neutral';
export type MarketMainCategory = 'raw_materials' | 'scrap_materials';

export interface MarketMaterial {
  id: string;
  mainCategory: MarketMainCategory; // Level 1: 'raw_materials' | 'scrap_materials'
  materialName: string; // Level 2: 'Ingot', 'Billet', 'TMT Rebar', 'Melting Scrap', 'Old Scrap', etc.
  mandiCity: string; // Level 3: 'Mandi Gobindgarh', 'Ludhiana', 'Raipur', 'Muzaffarnagar', etc.
  categorySlug: 'ingot' | 'scrap' | 'billet' | 'benchmark' | 'raw_materials' | 'scrap_materials' | string;
  categoryName: string;
  name: string;
  symbol: string;
  hubCity?: string;
  specification?: string;
  unit: string; // '₹ / Metric Ton'
  currentPrice: number;
  previousPrice: number;
  priceChange: number;
  percentageChange: number;
  movementDirection: MovementDirection;
  highPrice: number;
  lowPrice: number;
  averagePrice: number;
  volatility: number;
  lastUpdatedAt: string; // ISO string
  displayOrder: number;
  isActive: boolean;
  notes?: string;
  historicalPrices: MarketPricePoint[]; // Past 50 records
}

export interface MandiBulletinData {
  dateStr: string;
  timeStr: string;
  usdInrRate: number;
  overallTrend: 'up' | 'down' | 'neutral';
  trendText: string;
  rawMessageText: string;
  supportPhone: string;
  smsPhones: string[];
  whatsappPhones: string[];
  lastUpdatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string; // null for broadcast
  title: string;
  message: string;
  type: 'quotation' | 'order' | 'market' | 'system';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AppSettings {
  companyName: string;
  tagline: string;
  gstin: string;
  address: string;
  phone: string;
  email: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  defaultTaxRate: number;
  quotationValidityDays: number;
  supportPhone: string;
  supportEmail: string;
}
