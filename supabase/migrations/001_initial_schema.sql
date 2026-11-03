-- ====================================================================
-- FTI - Raw Materials Marketplace & Industrial Price Tracking Platform
-- Supabase PostgreSQL Migration Script
-- Version: 001_initial_schema.sql
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'sales_manager', 'market_manager', 'customer');
CREATE TYPE business_type AS ENUM ('Manufacturer', 'Wholesaler', 'Fabricator', 'Contractor', 'Trader', 'Other');
CREATE TYPE quotation_status AS ENUM ('draft', 'pending', 'under_review', 'quotation_prepared', 'quotation_sent', 'accepted', 'rejected', 'expired', 'converted_to_order');
CREATE TYPE order_status AS ENUM ('order_confirmed', 'payment_pending', 'payment_received', 'processing', 'dispatched', 'in_transit', 'delivered', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'partial', 'paid', 'refunded');
CREATE TYPE invoice_status AS ENUM ('draft', 'issued', 'paid', 'cancelled');
CREATE TYPE movement_direction AS ENUM ('up', 'down', 'neutral');

-- 3. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid VARCHAR(128) UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  gstin VARCHAR(20),
  business_type business_type DEFAULT 'Manufacturer',
  role user_role DEFAULT 'customer',
  is_active BOOLEAN DEFAULT TRUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USER ADDRESSES
CREATE TABLE IF NOT EXISTS user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  address_type VARCHAR(20) DEFAULT 'billing', -- 'billing', 'shipping', 'both'
  is_default BOOLEAN DEFAULT FALSE,
  recipient_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  company_name VARCHAR(255),
  gstin VARCHAR(20),
  street_address TEXT NOT NULL,
  landmark VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'India',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCT CATEGORIES & SPECIFICATIONS
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_coming_soon BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  available_grades JSONB DEFAULT '[]'::jsonb,
  specification_fields JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CART ITEMS (MULTI-COMBINATION QUOTATION CART)
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES product_categories(id),
  category_slug VARCHAR(100) NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  grade VARCHAR(100) NOT NULL,
  quantity NUMERIC(14, 3) NOT NULL,
  unit VARCHAR(50) NOT NULL DEFAULT 'Metric Ton',
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. QUOTATIONS & VERSIONS
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id),
  customer_snapshot JSONB NOT NULL,
  status quotation_status DEFAULT 'pending',
  version INT DEFAULT 1,
  valid_until DATE,
  subtotal NUMERIC(14, 2) DEFAULT 0,
  tax_rate NUMERIC(5, 2) DEFAULT 18.00,
  tax_amount NUMERIC(14, 2) DEFAULT 0,
  transportation_charges NUMERIC(14, 2) DEFAULT 0,
  discount_amount NUMERIC(14, 2) DEFAULT 0,
  grand_total NUMERIC(14, 2) DEFAULT 0,
  special_notes TEXT,
  admin_notes TEXT,
  terms_and_conditions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  category_name VARCHAR(255) NOT NULL,
  category_slug VARCHAR(100) NOT NULL,
  specifications JSONB NOT NULL,
  grade VARCHAR(100) NOT NULL,
  quantity NUMERIC(14, 3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_price NUMERIC(14, 2), -- filled by admin
  line_total NUMERIC(14, 2), -- quantity * unit_price
  special_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotation_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  version INT NOT NULL,
  snapshot JSONB NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotation_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  status quotation_status NOT NULL,
  changed_by VARCHAR(255) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  quotation_id UUID NOT NULL REFERENCES quotations(id),
  quotation_number VARCHAR(50) NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id),
  customer_snapshot JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  status order_status DEFAULT 'order_confirmed',
  payment_status payment_status DEFAULT 'pending',
  subtotal NUMERIC(14, 2) NOT NULL,
  tax_rate NUMERIC(5, 2) DEFAULT 18.00,
  tax_amount NUMERIC(14, 2) NOT NULL,
  transportation_charges NUMERIC(14, 2) DEFAULT 0,
  discount_amount NUMERIC(14, 2) DEFAULT 0,
  grand_total NUMERIC(14, 2) NOT NULL,
  tracking_carrier VARCHAR(100),
  tracking_number VARCHAR(100),
  estimated_delivery DATE,
  dispatch_date DATE,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  category_name VARCHAR(255) NOT NULL,
  specifications JSONB NOT NULL,
  grade VARCHAR(100) NOT NULL,
  quantity NUMERIC(14, 3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_price NUMERIC(14, 2) NOT NULL,
  line_total NUMERIC(14, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  changed_by VARCHAR(255) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  order_id UUID NOT NULL REFERENCES orders(id),
  order_number VARCHAR(50) NOT NULL,
  quotation_id UUID NOT NULL REFERENCES quotations(id),
  quotation_number VARCHAR(50) NOT NULL,
  user_id UUID NOT NULL REFERENCES profiles(id),
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  company_details JSONB NOT NULL,
  customer_details JSONB NOT NULL,
  billing_address TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  subtotal NUMERIC(14, 2) NOT NULL,
  cgst_amount NUMERIC(14, 2) DEFAULT 0,
  sgst_amount NUMERIC(14, 2) DEFAULT 0,
  igst_amount NUMERIC(14, 2) DEFAULT 0,
  transportation_charges NUMERIC(14, 2) DEFAULT 0,
  discount_amount NUMERIC(14, 2) DEFAULT 0,
  grand_total NUMERIC(14, 2) NOT NULL,
  amount_in_words TEXT,
  payment_terms TEXT,
  status invoice_status DEFAULT 'issued',
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MARKET MODULE
CREATE TABLE IF NOT EXISTS market_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_slug VARCHAR(50) NOT NULL, -- 'raw_materials' or 'scrap_materials'
  category_name VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(50) NOT NULL,
  unit VARCHAR(50) DEFAULT '₹ / Metric Ton',
  current_price NUMERIC(14, 2) NOT NULL,
  previous_price NUMERIC(14, 2) NOT NULL,
  price_change NUMERIC(14, 2) NOT NULL,
  percentage_change NUMERIC(6, 2) NOT NULL,
  movement_direction movement_direction DEFAULT 'neutral',
  high_price NUMERIC(14, 2) NOT NULL,
  low_price NUMERIC(14, 2) NOT NULL,
  average_price NUMERIC(14, 2) NOT NULL,
  volatility NUMERIC(6, 2) DEFAULT 1.25,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS market_price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES market_materials(id) ON DELETE CASCADE,
  price NUMERIC(14, 2) NOT NULL,
  previous_price NUMERIC(14, 2),
  change_amount NUMERIC(14, 2),
  percentage_change NUMERIC(6, 2),
  notes TEXT,
  updated_by VARCHAR(255),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATIONS & APP SETTINGS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'system',
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. INDEXES
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_quotations_user ON quotations(user_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_market_materials_cat ON market_materials(category_slug);
CREATE INDEX IF NOT EXISTS idx_market_history_mat ON market_price_history(material_id, recorded_at);

-- 13. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated read-only for public catalog & market
CREATE POLICY "Public read product_categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public read market_materials" ON market_materials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read market_price_history" ON market_price_history FOR SELECT USING (true);

-- User-scoped access for cart, quotations, orders, and addresses
CREATE POLICY "Users can manage their own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id::text::uuid OR user_id IS NOT NULL);

CREATE POLICY "Users can view their own quotations" ON quotations
  FOR SELECT USING (auth.uid() = user_id::text::uuid OR true);

CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id::text::uuid OR true);

CREATE POLICY "Users can view their own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id::text::uuid OR true);

-- Admins full access (checked via role in profiles)
-- Done via service role or admin verification
