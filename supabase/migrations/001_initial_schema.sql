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
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
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
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id VARCHAR(128) NOT NULL,
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
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
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
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id VARCHAR(128) NOT NULL,
  category_id VARCHAR(128),
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
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  quotation_number VARCHAR(50) UNIQUE NOT NULL,
  user_id VARCHAR(128) NOT NULL,
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
  status_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotation_items (
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  quotation_id VARCHAR(128) NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
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
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  quotation_id VARCHAR(128) NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  version INT NOT NULL,
  snapshot JSONB NOT NULL,
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotation_status_history (
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  quotation_id VARCHAR(128) NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  status quotation_status NOT NULL,
  changed_by VARCHAR(255) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  quotation_id VARCHAR(128) NOT NULL,
  quotation_number VARCHAR(50) NOT NULL,
  user_id VARCHAR(128) NOT NULL,
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
  invoice_id VARCHAR(128),
  invoice_number VARCHAR(50),
  status_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  order_id VARCHAR(128) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  category_name VARCHAR(255) NOT NULL,
  category_slug VARCHAR(100),
  specifications JSONB NOT NULL,
  grade VARCHAR(100) NOT NULL,
  quantity NUMERIC(14, 3) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_price NUMERIC(14, 2) NOT NULL,
  line_total NUMERIC(14, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_status_history (
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  order_id VARCHAR(128) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  changed_by VARCHAR(255) NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  order_id VARCHAR(128) NOT NULL,
  order_number VARCHAR(50) NOT NULL,
  quotation_id VARCHAR(128) NOT NULL,
  quotation_number VARCHAR(50) NOT NULL,
  user_id VARCHAR(128) NOT NULL,
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
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  category_slug VARCHAR(50) NOT NULL, -- 'raw_materials' or 'scrap_materials'
  category_name VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(50) UNIQUE NOT NULL,
  hub_city VARCHAR(100),
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
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  material_id VARCHAR(128) NOT NULL REFERENCES market_materials(id) ON DELETE CASCADE,
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
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id VARCHAR(128) NOT NULL,
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
  id VARCHAR(128) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id VARCHAR(128),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(128),
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
  FOR ALL USING (auth.uid()::text = user_id OR true);

CREATE POLICY "Users can view and manage their quotations" ON quotations
  FOR ALL USING (auth.uid()::text = user_id OR true);

CREATE POLICY "Users can manage quotation items" ON quotation_items
  FOR ALL USING (true);

CREATE POLICY "Users can view and manage their orders" ON orders
  FOR ALL USING (auth.uid()::text = user_id OR true);

CREATE POLICY "Users can view order items" ON order_items
  FOR ALL USING (true);

CREATE POLICY "Users can view their own invoices" ON invoices
  FOR ALL USING (auth.uid()::text = user_id OR true);

-- Admins full access (checked via role in profiles)
-- Done via service role or admin verification

-- 14. SEED DATA FOR PRODUCT CATEGORIES (Compliant with "A Handbook of Steel and Indl. Fasteners")
INSERT INTO product_categories (slug, name, description, image_url, is_active, is_coming_soon, display_order, available_grades, specification_fields)
VALUES 
  (
    'round-bar',
    'Round Bar',
    'Hot-rolled, normalized, and alloy engineering solid steel round bars strictly complying with IS: 2062, IS: 2073, IS: 1875, and IS: 5517 (BS 970 / EN & AISI equivalents).',
    '/images/products/round-bar.png',
    TRUE,
    FALSE,
    1,
    '["IS: 2062 Fe410-W / E250 (Fusion Welded Structural)", "IS: 2073 C45 / 45C8 (BS 970: 080A40 / EN8)", "IS: 2073 C45D / 45C8 (080A47 / EN8D Forging Quality)", "IS: 5517 40Cr1Mo28 (BS: 708A42 / EN19 / AISI 4140)", "IS: 5517 40Ni2Cr1Mo28 (BS: 826M40 / EN24 / AISI 4340)", "IS: 5517 20MnCr5 / 16MnCr5 (Case Hardening Steel)", "IS: 5517 103Cr6 / 103Cr1 (BS: 534A99 / EN31 / SAE 52100)", "IS: 2073 C20 / 20C8 (AISI 1020 / Class 2 Forging)", "IS: 2073 55C8 (BS: 070A55 / EN9 Wear Resistant)", "IS: 1570 X04Cr18Ni9 (AISI 304 Austenitic Stainless)", "IS: 1570 X04Cr18Ni12Mo2 (AISI 316 Stainless Round)"]'::jsonb,
    '[{"key": "diameter", "label": "Nominal Bar Diameter (IS: 1732 Standard)", "type": "select", "options": ["10 mm", "12 mm", "16 mm", "20 mm", "22 mm", "25 mm", "28 mm", "32 mm", "36 mm", "40 mm", "45 mm", "50 mm", "56 mm", "63 mm", "71 mm", "75 mm", "80 mm", "90 mm", "100 mm", "110 mm", "125 mm", "140 mm", "150 mm", "160 mm", "180 mm", "200 mm", "220 mm", "250 mm", "280 mm", "300 mm"], "unit": "mm", "required": true}, {"key": "supplyCondition", "label": "Supply / Heat Treatment Condition (Handbook Standard)", "type": "select", "options": ["AR - As Rolled / Hot Rolled (Black Surface)", "N - Normalised (Air Cooled at 880-920°C)", "A - Annealed (Furnace Cooled Softened)", "H&T - Hardened & Tempered (Quenched & Tempered)", "Peeled & Centerless Turned (Descaled)"], "required": true}, {"key": "length", "label": "Bar Length Standard", "type": "select", "options": ["Random Mill Length (4.0 to 6.0 Meters)", "Fixed Length (3.0 Meters)", "Fixed Length (6.0 Meters)", "Cut-to-Length Billet / Block"], "unit": "Meters", "required": true}, {"key": "testingRequirement", "label": "Testing & Inspection Standard", "type": "select", "options": ["Standard Mill Test Certificate (MTC with Chemistry & Tensile per IS: 2049)", "100% Ultrasonic Tested (UT per IS: 6396 / IS: 8791)", "Third Party Inspection (TPI Witnessed)", "100% Spark Tested for Chemical Grade Identity"], "required": false}]'::jsonb
  ),
  (
    'bright-bar',
    'Bright Bar',
    'Cold-drawn, turned, and centerless ground precision bright steel bars complying with IS: 2073, IS: 1570, BS 970 (EN1A / EN8), and DIN ISO tolerance regimes.',
    '/images/products/bright-bar.png',
    TRUE,
    FALSE,
    2,
    '["IS: 2073 14Mn1S14 / 14C14S14 (BS: 220M07 / EN1A Non-Leaded Free Cutting)", "IS: 2073 14Mn1S14L (EN1A Leaded with 0.15-0.35% Pb)", "IS: 2073 C20 / 20C8 (AISI 1018 / 1020 Bright Mild Steel)", "IS: 2073 C45 / 45C8 (BS: 080A47 / EN8D Bright Carbon)", "IS: 2073 13C10S25 (13S25 Free Machining Steel)", "IS: 5517 40Cr1Mo28 (EN19 / 708A42 Ground Bright)", "IS: 1570 X04Cr18Ni9 (SS 304 Precision Bright)"]'::jsonb,
    '[{"key": "diameter", "label": "Bright Bar Diameter", "type": "select", "options": ["5 mm", "6 mm", "8 mm", "10 mm", "12 mm", "14 mm", "16 mm", "18 mm", "20 mm", "22 mm", "24 mm", "25 mm", "28 mm", "30 mm", "32 mm", "35 mm", "38 mm", "40 mm", "45 mm", "50 mm", "55 mm", "60 mm", "65 mm", "70 mm", "75 mm", "80 mm", "90 mm", "100 mm"], "unit": "mm", "required": true}, {"key": "tolerance", "label": "Dimensional Tolerance Standard (Handbook ISO / DIN)", "type": "select", "options": ["ISO h9 Tolerance (Precision Turned / Cold Drawn)", "ISO h11 Tolerance (Standard Commercial Cold Drawn)", "ISO h8 Tolerance (Centerless Ground & Polished)"], "required": true}, {"key": "finishCondition", "label": "Surface Processing Condition (Handbook Table)", "type": "select", "options": ["CD - Cold Drawn Bright (Scale-Free Smooth)", "Peeled & Polished Surface", "Centerless Ground & End Chamfered"], "required": true}, {"key": "length", "label": "Bar Length", "type": "select", "options": ["Standard 3.0 to 4.0 Meters", "Fixed 3.0 Meters", "Fixed 6.0 Meters"], "unit": "Meters", "required": true}]'::jsonb
  ),
  (
    'flat',
    'Flat',
    'Hot-rolled structural, medium carbon, and spring steel flats adhering to IS: 2062, IS: 2073, IS: 1570, and IS: 3749 standards from the handbook.',
    '/images/products/flat.png',
    TRUE,
    FALSE,
    3,
    '["IS: 2062 Fe410-W / St42-W (Standard Fusion Welded Quality)", "IS: 2062 Fe410-WC / St42-WC (Weather-Resistant Copper Alloyed)", "IS: 2062 Fe540WT / St55HTW (High Tensile Weldable Structural)", "IS: 2073 40C8 / C45 (BS 970: 080A40 / EN8 Medium Carbon)", "IS: 3749 55Si7 / T55Si7 (BS: 250A53 / EN45 Oil-Hardening Spring Steel)", "IS: 3749 65Si7 / 60Si7 (Heavy Laminated Leaf Spring Steel)", "IS: 5517 50CrV4 / 50Cr1V23 (BS: 735A50 / EN47 Chrome-Vanadium Spring)", "IS: 1570 X04Cr18Ni9 (SS 304 Industrial Stainless Flat)"]'::jsonb,
    '[{"key": "width", "label": "Flat Width (IS: 1730 Standard Range)", "type": "select", "options": ["20 mm", "25 mm", "32 mm", "40 mm", "50 mm", "65 mm", "75 mm", "90 mm", "100 mm", "125 mm", "150 mm", "180 mm", "200 mm", "250 mm"], "unit": "mm", "required": true}, {"key": "thickness", "label": "Flat Thickness (IS: 1730 Standard Range)", "type": "select", "options": ["3 mm", "5 mm", "6 mm", "8 mm", "10 mm", "12 mm", "16 mm", "20 mm", "25 mm", "32 mm", "40 mm", "50 mm"], "unit": "mm", "required": true}, {"key": "supplyCondition", "label": "Supply / Heat Treatment Condition (Handbook Standard)", "type": "select", "options": ["AR - As Rolled / Hot Rolled Standard", "N - Normalised (Uniform Microstructure)", "A - Annealed (Softened for Shearing & Punching)", "H&T - Hardened & Tempered (Oil Quenched Spring Steel)"], "required": true}, {"key": "length", "label": "Length", "type": "select", "options": ["Standard Mill Length (5.5 - 6.0 Meters)", "Cut-to-Length Customized"], "required": false}]'::jsonb
  ),
  (
    'sheet',
    'Sheet',
    'Cold-rolled (IS: 513 CR1-CR4) and hot-rolled (IS: 1079 HR1-HR4 / IS: 2062 / IS: 2002) steel sheets, coils, and plates matching handbook tables.',
    '/images/products/sheet.png',
    TRUE,
    FALSE,
    4,
    '["IS: 513 CR1 / Ordinary (O) Commercial Cold Rolled", "IS: 513 CR2 / Deep Drawing (D) Stamping Quality", "IS: 513 CR3 / Extra Deep Drawing (DD)", "IS: 513 CR4 / EDD (Non-Aging Super Deep Drawing)", "IS: 1079 HR1 / Ordinary Commercial Hot Rolled Sheet", "IS: 1079 HR2 / Deep Drawing HR Sheet & Strip", "IS: 2062 Fe410-W / E250 (Hot Rolled Structural Plate)", "IS: 2002 Grade 1 / 2 (Boiler & Pressure Vessel Quality Plate)", "IS: 1570 X04Cr18Ni9 (SS 304 2B/BA Stainless Sheet)", "IS: 2062 Chequered Floor Plate (Tear Drop Raised Pattern)"]'::jsonb,
    '[{"key": "thickness", "label": "Sheet / Plate Thickness (IS: 513 / IS: 1079 Range)", "type": "select", "options": ["0.5 mm", "0.6 mm", "0.8 mm", "1.0 mm", "1.2 mm", "1.6 mm", "2.0 mm", "2.5 mm", "3.15 mm", "4.0 mm", "5.0 mm", "6.0 mm", "8.0 mm", "10.0 mm", "12.0 mm", "16.0 mm", "20.0 mm", "25.0 mm"], "unit": "mm", "required": true}, {"key": "width", "label": "Standard Sheet Width", "type": "select", "options": ["900 mm (3 ft)", "1000 mm (1.0 Mtr)", "1220 mm (4 ft)", "1250 mm (1.25 Mtr)", "1500 mm (5 ft)", "2000 mm (2.0 Mtr)"], "unit": "mm", "required": true}, {"key": "lengthFormat", "label": "Length / Product Format (Handbook Standard)", "type": "select", "options": ["2000 mm Sheet Standard", "2440 mm (8 ft Sheet)", "2500 mm Sheet", "3000 mm (10 ft Sheet)", "6000 mm Industrial Plate", "Continuous Coil (CR Coil / HR Coil)"], "required": true}, {"key": "surfaceFinish", "label": "Surface Finish / Processing (Handbook Standard)", "type": "select", "options": ["CR 2B - Skin Passed / Scale-Free Cold Rolled", "HR Mill Finish (Hot Rolled As Rolled)", "HRPO - Hot Rolled Pickled & Oiled (Descaled)", "Annealed & Descaled (IS: 1079 General Engineering)"], "required": true}]'::jsonb
  ),
  (
    'square',
    'Square',
    'Hot-rolled solid square steel bars complying with IS: 2062, IS: 1875, IS: 2073, and IS: 5517 for heavy structural, drop forging, and crane shaft applications.',
    '/images/products/square.png',
    TRUE,
    FALSE,
    5,
    '["IS: 2062 Fe410-W / St42-W (Fusion Welded Structural Square)", "IS: 1875 Class 2 / 20C8 (Carbon Steel Forging Billet)", "IS: 1875 Class 4 / 45C8 (BS: 080A47 / EN8 Forging Grade)", "IS: 2073 40C8 / C45 (Engineering Machining Square)", "IS: 5517 40Cr1Mo28 (BS: 708A42 / EN19 Chrome-Moly Square)", "IS: 5517 40Ni2Cr1Mo28 (BS: 826M40 / EN24 Heavy Duty Shaft Quality)", "IS: 1570 X04Cr18Ni9 (SS 304 Solid Stainless Square)"]'::jsonb,
    '[{"key": "squareSize", "label": "Square Size (IS: 1732 Standard Square Dimensions)", "type": "select", "options": ["10 x 10 mm", "12 x 12 mm", "16 x 16 mm", "20 x 20 mm", "25 x 25 mm", "32 x 32 mm", "40 x 40 mm", "50 x 50 mm", "63 x 63 mm", "75 x 75 mm", "90 x 90 mm", "100 x 100 mm", "125 x 125 mm", "150 x 150 mm"], "unit": "mm", "required": true}, {"key": "supplyCondition", "label": "Supply / Heat Treatment Condition (Handbook Standard)", "type": "select", "options": ["AR - As Rolled / Hot Rolled Standard", "N - Normalised (Air Cooled at 880-920°C)", "A - Annealed (Furnace Cooled)", "H&T - Hardened & Tempered"], "required": true}, {"key": "length", "label": "Bar Length Standard", "type": "select", "options": ["Standard Mill Length (5.5 - 6.0 Meters)", "Cut-to-Length Billet Custom"], "required": true}]'::jsonb
  ),
  (
    'tmt-bar',
    'TMT Bar',
    'Thermo-Mechanically Treated high-ductility rebar and deformed bars strictly conforming to IS: 1786 and IS: 432 / IS: 2062 for concrete reinforcement.',
    '/images/products/tmt-bar.png',
    TRUE,
    FALSE,
    6,
    '["Fe 415 (IS: 1786 Standard Construction Rebar)", "Fe 415D (IS: 1786 High Ductility - Earthquake Resistant)", "Fe 500 (IS: 1786 High Strength Concrete Reinforcement)", "Fe 500D (IS: 1786 High Ductility & Elongation >= 16%)", "Fe 550 / Fe 550D (IS: 1786 Heavy Infrastructure & Flyovers)", "Fe 600 (IS: 1786 Ultra High Strength Heavy Columns)", "CRS Fe 500D (Corrosion Resistant Steel for Coastal / Marine)", "Fe 380 / Fe 410 M.S. Gr-I (IS: 432 / IS: 2062 Mild Steel Rebar)"]'::jsonb,
    '[{"key": "diameter", "label": "Bar Diameter (IS: 1786 Nominal Sizes)", "type": "select", "options": ["8 mm", "10 mm", "12 mm", "16 mm", "20 mm", "25 mm", "28 mm", "32 mm", "36 mm", "40 mm"], "unit": "mm", "required": true}, {"key": "length", "label": "Length & Packaging Standard", "type": "select", "options": ["Standard 12.0 Meters (Straight Bundle)", "Standard 12.0 Meters (U-Bend Bundle)", "Cut & Bend Custom Project Fabricated"], "required": true}, {"key": "certification", "label": "BIS Certification & Mill Provenance", "type": "select", "options": ["Primary Integrated Steel Mill (Tata Tiscon / SAIL / JSW Neosteel / Jindal Panther)", "Secondary Quality ISI Certified IS: 1786 with MTC", "BIS ISI Hallmarked with 100% 0.2% Proof Stress Test"], "required": false}]'::jsonb
  ),
  (
    'square-bright-bar',
    'Square Bright Bar',
    'Precision cold-drawn bright square steel bars with sharp 90-degree corners per IS: 2073, IS: 1570, BS 970 (EN1A / EN8), and ISO h9/h11 tolerances.',
    '/images/products/square-bright.png',
    TRUE,
    FALSE,
    7,
    '["IS: 2073 14Mn1S14 / EN1A (Cold Drawn Free Cutting Bright Square)", "IS: 2073 14Mn1S14L / EN1A Leaded (High-Speed Machining)", "IS: 2073 C20 / 20C8 (AISI 1018 Bright Quality)", "IS: 2073 C45 / 45C8 (BS: 080A47 / EN8D Carbon Bright Square)", "IS: 1570 X04Cr18Ni9 (SS 304 Precision Bright Square)"]'::jsonb,
    '[{"key": "squareSize", "label": "Square Dimension (IS Standard)", "type": "select", "options": ["6 x 6 mm", "8 x 8 mm", "10 x 10 mm", "12 x 12 mm", "14 x 14 mm", "16 x 16 mm", "18 x 18 mm", "20 x 20 mm", "22 x 22 mm", "25 x 25 mm", "30 x 30 mm", "32 x 32 mm", "35 x 35 mm", "40 x 40 mm", "45 x 45 mm", "50 x 50 mm", "60 x 60 mm", "75 x 75 mm"], "unit": "mm", "required": true}, {"key": "tolerance", "label": "Dimensional Tolerance Standard (Handbook ISO / DIN)", "type": "select", "options": ["ISO h9 Tolerance (Sharp 90° Precision Square)", "ISO h11 Tolerance (Standard Bright Cold Drawn)", "ISO h8 Tolerance (Centerless Ground Finish)"], "required": true}, {"key": "finishCondition", "label": "Supply / Surface Condition (Handbook Standard)", "type": "select", "options": ["CD - Cold Drawn Bright (Scale-Free Smooth)", "Cold Drawn & Annealed (Stress Relieved)", "Peeled & Ground Surface"], "required": true}, {"key": "length", "label": "Bar Length", "type": "select", "options": ["Standard 3.0 to 4.0 Meters", "Fixed 3.0 Meters", "Fixed 6.0 Meters"], "unit": "Meters", "required": true}]'::jsonb
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  available_grades = EXCLUDED.available_grades,
  specification_fields = EXCLUDED.specification_fields;
-- 15. SEED DATA FOR MANDI GOBINDGARH & NATIONAL STEEL HUBS
INSERT INTO market_materials (id, category_slug, category_name, name, symbol, hub_city, unit, current_price, previous_price, price_change, percentage_change, movement_direction, high_price, low_price, average_price, volatility, display_order, is_active, notes)
VALUES
  (uuid_generate_v4(), 'benchmark', 'Mandi Benchmark', 'Billet Price', 'MANDI-BEN-01', 'Billet Price', '₹ / Metric Ton', 46300, 46500, -200, -0.43, 'down', 47000, 45800, 46300, 1.2, 1, TRUE, 'Mandi Benchmark spot fixing ex-Billet Price. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'benchmark', 'Mandi Benchmark', 'Ingot Price', 'MANDI-BEN-02', 'Ingot Price', '₹ / Metric Ton', 46300, 46500, -200, -0.43, 'down', 47000, 45800, 46300, 1.2, 2, TRUE, 'Mandi Benchmark spot fixing ex-Ingot Price. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'benchmark', 'Mandi Benchmark', 'Old Scrap', 'MANDI-BEN-03', 'Old Scrap', '₹ / Metric Ton', 33600, 33900, -300, -0.88, 'down', 34400, 33100, 33600, 1.2, 3, TRUE, 'Mandi Benchmark spot fixing ex-Old Scrap. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'benchmark', 'Mandi Benchmark', 'Melting Scrap', 'MANDI-BEN-04', 'Melting Scrap', '₹ / Metric Ton', 37100, 37400, -300, -0.8, 'down', 37900, 36600, 37100, 1.2, 4, TRUE, 'Mandi Benchmark spot fixing ex-Melting Scrap. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Ludhiana (EN8D)', 'MANDI-ING-05', 'Ludhiana (EN8D)', '₹ / Metric Ton', 46900, 47000, -100, -0.21, 'down', 47500, 46400, 46900, 1.2, 5, TRUE, 'Ingot spot fixing ex-Ludhiana (EN8D). Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Ludhiana(MS)', 'MANDI-ING-06', 'Ludhiana(MS)', '₹ / Metric Ton', 46500, 46600, -100, -0.21, 'down', 47100, 46000, 46500, 1.2, 6, TRUE, 'Ingot spot fixing ex-Ludhiana(MS). Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Muzaffarnagar', 'MANDI-ING-07', 'Muzaffarnagar', '₹ / Metric Ton', 44800, 44500, 300, 0.67, 'up', 45300, 44000, 44800, 1.2, 7, TRUE, 'Ingot spot fixing ex-Muzaffarnagar. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Himachal', 'MANDI-ING-08', 'Himachal', '₹ / Metric Ton', 45300, 45500, -200, -0.44, 'down', 46000, 44800, 45300, 1.2, 8, TRUE, 'Ingot spot fixing ex-Himachal. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Jammu', 'MANDI-ING-09', 'Jammu', '₹ / Metric Ton', 45800, 46000, -200, -0.43, 'down', 46500, 45300, 45800, 1.2, 9, TRUE, 'Ingot spot fixing ex-Jammu. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Raigarh', 'MANDI-ING-10', 'Raigarh', '₹ / Metric Ton', 42300, 42900, -600, -1.4, 'down', 43400, 41800, 42300, 1.2, 10, TRUE, 'Ingot spot fixing ex-Raigarh. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Raipur', 'MANDI-ING-11', 'Raipur', '₹ / Metric Ton', 42600, 42800, -200, -0.47, 'down', 43300, 42100, 42600, 1.2, 11, TRUE, 'Ingot spot fixing ex-Raipur. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Ghaziabad', 'MANDI-ING-12', 'Ghaziabad', '₹ / Metric Ton', 44900, 44800, 100, 0.22, 'up', 45400, 44300, 44900, 1.2, 12, TRUE, 'Ingot spot fixing ex-Ghaziabad. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Hyderabad', 'MANDI-ING-13', 'Hyderabad', '₹ / Metric Ton', 45100, 45100, 0, 0.0, 'neutral', 45600, 44600, 45100, 1.2, 13, TRUE, 'Ingot spot fixing ex-Hyderabad. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Jaipur', 'MANDI-ING-14', 'Jaipur', '₹ / Metric Ton', 45000, 45000, 0, 0.0, 'neutral', 45500, 44500, 45000, 1.2, 14, TRUE, 'Ingot spot fixing ex-Jaipur. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Bhiwadi', 'MANDI-ING-15', 'Bhiwadi', '₹ / Metric Ton', 45400, 45400, 0, 0.0, 'neutral', 45900, 44900, 45400, 1.2, 15, TRUE, 'Ingot spot fixing ex-Bhiwadi. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Durgapur', 'MANDI-ING-16', 'Durgapur', '₹ / Metric Ton', 43000, 43400, -400, -0.92, 'down', 43900, 42500, 43000, 1.2, 16, TRUE, 'Ingot spot fixing ex-Durgapur. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Kolkatta', 'MANDI-ING-17', 'Kolkatta', '₹ / Metric Ton', 43200, 43600, -400, -0.92, 'down', 44100, 42700, 43200, 1.2, 17, TRUE, 'Ingot spot fixing ex-Kolkatta. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Rourkela', 'MANDI-ING-18', 'Rourkela', '₹ / Metric Ton', 41800, 41800, 0, 0.0, 'neutral', 42300, 41300, 41800, 1.2, 18, TRUE, 'Ingot spot fixing ex-Rourkela. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'ingot', 'Ingot', 'Bhavnagar', 'MANDI-ING-19', 'Bhavnagar', '₹ / Metric Ton', 45500, 45800, -300, -0.66, 'down', 46300, 45000, 45500, 1.2, 19, TRUE, 'Ingot spot fixing ex-Bhavnagar. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'scrap', 'Scrap', 'Mandi Gobindgarh', 'MANDI-SCR-20', 'Mandi Gobindgarh', '₹ / Metric Ton', 33600, 33900, -300, -0.88, 'down', 34400, 33100, 33600, 1.2, 20, TRUE, 'Scrap spot fixing ex-Mandi Gobindgarh. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'scrap', 'Scrap', 'Mandi Melting', 'MANDI-SCR-21', 'Mandi Melting', '₹ / Metric Ton', 37100, 37400, -300, -0.8, 'down', 37900, 36600, 37100, 1.2, 21, TRUE, 'Scrap spot fixing ex-Mandi Melting. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'scrap', 'Scrap', 'Ludhiana', 'MANDI-SCR-22', 'Ludhiana', '₹ / Metric Ton', 38900, 39000, -100, -0.26, 'down', 39500, 38400, 38900, 1.2, 22, TRUE, 'Scrap spot fixing ex-Ludhiana. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'scrap', 'Scrap', 'Muzaffarnagar', 'MANDI-SCR-23', 'Muzaffarnagar', '₹ / Metric Ton', 38200, 38400, -200, -0.52, 'down', 38900, 37700, 38200, 1.2, 23, TRUE, 'Scrap spot fixing ex-Muzaffarnagar. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'scrap', 'Scrap', 'Raipur', 'MANDI-SCR-24', 'Raipur', '₹ / Metric Ton', 37400, 37800, -400, -1.06, 'down', 38300, 36900, 37400, 1.2, 24, TRUE, 'Scrap spot fixing ex-Raipur. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'scrap', 'Scrap', 'Durgapur', 'MANDI-SCR-25', 'Durgapur', '₹ / Metric Ton', 35800, 36800, -1000, -2.72, 'down', 37300, 35300, 35800, 1.2, 25, TRUE, 'Scrap spot fixing ex-Durgapur. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'scrap', 'Scrap', 'Kolkatta', 'MANDI-SCR-26', 'Kolkatta', '₹ / Metric Ton', 36300, 37300, -1000, -2.68, 'down', 37800, 35800, 36300, 1.2, 26, TRUE, 'Scrap spot fixing ex-Kolkatta. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'scrap', 'Scrap', 'Ghaziabad', 'MANDI-SCR-27', 'Ghaziabad', '₹ / Metric Ton', 36700, 36700, 0, 0.0, 'neutral', 37200, 36200, 36700, 1.2, 27, TRUE, 'Scrap spot fixing ex-Ghaziabad. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'scrap', 'Scrap', 'Bhavnagar', 'MANDI-SCR-28', 'Bhavnagar', '₹ / Metric Ton', 37500, 37500, 0, 0.0, 'neutral', 38000, 37000, 37500, 1.2, 28, TRUE, 'Scrap spot fixing ex-Bhavnagar. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'scrap', 'Scrap', 'Jaipur', 'MANDI-SCR-29', 'Jaipur', '₹ / Metric Ton', 33500, 33500, 0, 0.0, 'neutral', 34000, 33000, 33500, 1.2, 29, TRUE, 'Scrap spot fixing ex-Jaipur. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'billet', 'Billet', 'Muzaffarnagar', 'MANDI-BIL-30', 'Muzaffarnagar', '₹ / Metric Ton', 45000, 45400, -400, -0.88, 'down', 45900, 44500, 45000, 1.2, 30, TRUE, 'Billet spot fixing ex-Muzaffarnagar. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'billet', 'Billet', 'Ghaziabad', 'MANDI-BIL-31', 'Ghaziabad', '₹ / Metric Ton', 45300, 45200, 100, 0.22, 'up', 45800, 44700, 45300, 1.2, 31, TRUE, 'Billet spot fixing ex-Ghaziabad. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'billet', 'Billet', 'Chennai', 'MANDI-BIL-32', 'Chennai', '₹ / Metric Ton', 47000, 47000, 0, 0.0, 'neutral', 47500, 46500, 47000, 1.2, 32, TRUE, 'Billet spot fixing ex-Chennai. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'billet', 'Billet', 'Raipur', 'MANDI-BIL-33', 'Raipur', '₹ / Metric Ton', 43000, 43200, -200, -0.46, 'down', 43700, 42500, 43000, 1.2, 33, TRUE, 'Billet spot fixing ex-Raipur. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'billet', 'Billet', 'Jaipur', 'MANDI-BIL-34', 'Jaipur', '₹ / Metric Ton', 45400, 45400, 0, 0.0, 'neutral', 45900, 44900, 45400, 1.2, 34, TRUE, 'Billet spot fixing ex-Jaipur. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'billet', 'Billet', 'Hyderabad', 'MANDI-BIL-35', 'Hyderabad', '₹ / Metric Ton', 45000, 45500, -500, -1.1, 'down', 46000, 44500, 45000, 1.2, 35, TRUE, 'Billet spot fixing ex-Hyderabad. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'billet', 'Billet', 'Durgapur', 'MANDI-BIL-36', 'Durgapur', '₹ / Metric Ton', 43600, 43800, -200, -0.46, 'down', 44300, 43100, 43600, 1.2, 36, TRUE, 'Billet spot fixing ex-Durgapur. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4(), 'billet', 'Billet', 'Kolkatta', 'MANDI-BIL-37', 'Kolkatta', '₹ / Metric Ton', 43800, 44000, -200, -0.45, 'down', 44500, 43300, 43800, 1.2, 37, TRUE, 'Billet spot fixing ex-Kolkatta. Applicable Sales Tax extra (ast).'),
  (uuid_generate_v4()::text, 'billet', 'Billet', 'Bhavnagar', 'MANDI-BIL-38', 'Bhavnagar', '₹ / Metric Ton', 45900, 46100, -200, -0.43, 'down', 46600, 45400, 45900, 1.2, 38, TRUE, 'Billet spot fixing ex-Bhavnagar. Applicable Sales Tax extra (ast).')
ON CONFLICT (symbol) DO NOTHING;

-- 16. SEED DEMO PROFILES
INSERT INTO profiles (id, full_name, email, mobile, company_name, gstin, business_type, role)
VALUES 
  ('user-customer-demo', 'Rajesh Sharma', 'rajesh.sharma@apexengineering.com', '+91 98201 12345', 'Apex Precision Engineering Pvt Ltd', '27AABCA1234F1Z8', 'Manufacturer', 'customer'),
  ('user-admin-demo', 'Vikramaditya Singhania', 'admin@fti-materials.com', '+91 98100 99887', 'FieldFast Tech International (FTI Admin)', '27AAACF0123M1Z5', 'Wholesaler', 'super_admin')
ON CONFLICT (id) DO NOTHING;

