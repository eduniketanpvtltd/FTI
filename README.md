# FTI – Raw Materials Marketplace & Industrial Price Tracking Platform

[![ISO 9001:2015 Certified](https://img.shields.io/badge/Quality-ISO%209001%3A2015%20Certified-blue.svg)](file:///Users/souvik/Projects/FTI)
[![Next.js 16 (App Router)](https://img.shields.io/badge/Next.js-16.4-black.svg)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.3-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com)

A production-ready, mobile-first responsive B2B industrial raw materials and scrap trading platform for **FTI** (based at Kalamboli Iron & Steel Market, Navi Mumbai).

---

## 1. Key Business Features

### 🛡️ B2B Quotation-Based Purchasing Model
- **No Public Price Tags**: Raw materials fluctuate with mill spot benchmarks; public prices are hidden to preserve mill relationships and trading margins.
- **Multi-Combination Cart**: Buyers can configure and combine multiple specifications of the same material (e.g., Round Bar: 50mm EN8 3.5 MT + 75mm EN19 2.0 MT) into a single unified RFQ.
- **Official Quotation Issuance**: Admins assign mill-direct rates, set transportation/freight charges from Kalamboli yard, apply volume discounts, and set validity dates (e.g. 3 days).
- **One-Click Acceptance to Purchase Order**: Customers review itemized rates, accept the quotation, and the system instantly converts it into a confirmed Purchase Order and generates a compliant Indian GST Tax Invoice.

### 📈 Stock-Market-Style Price Intelligence Desk
- **Dual Ticker Desks**: Live benchmark pricing for **Raw Materials** (Billets, TMT Rebars, HR Plates, Copper Cathode, Aluminium Ingot, Zinc) and **Scrap Metals** (Heavy Melting Scrap HMS 80:20, Cast Iron, Shredded 211, Copper Candy, Aluminium Tense, Brass Honey).
- **Interactive Recharts Visualizer**: Area and Line charts with responsive tooltips and date-range filters (`1D`, `1W`, `1M`, `3M`, `6M`, `1Y`, `ALL`).
- **Key Market Metrics**: Previous Close, Period High, Period Low, Volatility Index, and downloadable CSV reports.
- **5-Minute Auto-Synchronization**: Live polling with manual refresh capability.

### 🏢 Full Admin Portal
- **Dashboard**: High-level KPIs (Total Quotations, Pending Review, Quotations Sent, Accepted POs, Realized Revenue).
- **Quotation Pricing Desk**: Full line-item pricing controls, freight calculations, and quotation snapshots.
- **Market Price Management**: Real-time spot price fixing, movement calculations, and audit history.
- **Order & Dispatch Fulfillment**: Multi-step order tracking (`Order Confirmed` → `Payment Received` → `Processing` → `Dispatched` → `Delivered`), LR/Docket numbers, and carrier details.
- **GST Invoices & Settings**: Downloadable GST invoices with PAN, GSTIN, HSN codes, and bank RTGS remittance details.

---

## 2. Technology Architecture

```
src/
├── app/
│   ├── page.tsx                     # Customer Homepage (Categories, Ticker, Why Choose FTI)
│   ├── raw-materials/
│   │   ├── page.tsx                 # 7 Raw Material Categories Catalog with Grade Filters
│   │   └── [slug]/page.tsx          # Dynamic Specification Selector & Multi-Combination Cart
│   ├── cart/page.tsx                # Quotation Cart (Address Selection & RFQ Submission)
│   ├── quotations/
│   │   ├── page.tsx                 # Customer Quotations List & Status Chips
│   │   └── [id]/page.tsx            # Quotation Details, Pricing Breakdown, PDF Download, Acceptance
│   ├── orders/
│   │   ├── page.tsx                 # Purchase Orders List
│   │   └── [id]/page.tsx            # Multi-Step Order Tracker, Freight Logistics, Tax Invoice
│   ├── market/page.tsx              # Live Raw Material & Scrap Metal Desk with Recharts Analytics
│   ├── profile/page.tsx             # Company Profile, Address Book, Invoices, Notifications
│   ├── admin/
│   │   ├── layout.tsx               # Admin Layout with Sidebar
│   │   ├── page.tsx                 # Trading Desk Operations Dashboard & Metrics
│   │   ├── quotations/page.tsx      # Quotation Requests Queue & Line-Item Price Assignment
│   │   ├── market/page.tsx          # Market Price Fixings & Audit Trail
│   │   ├── products/page.tsx        # Categories, Dynamic Specs & Grade Management
│   │   ├── orders/page.tsx          # Order Dispatch, Weighment Slips, and Tracking
│   │   ├── invoices/page.tsx        # GST Tax Invoice Repository & PDF Download
│   │   ├── customers/page.tsx       # Industrial Customer Accounts & Verification
│   │   └── settings/page.tsx        # Company Credentials, Bank RTGS Info, Audit Logs
│   ├── api/
│   │   ├── quotations/route.ts      # REST API for Quotations
│   │   ├── orders/route.ts          # REST API for Orders
│   │   └── market/route.ts          # REST API for Market Prices
│   ├── layout.tsx                   # Root Layout with StoreProvider
│   └── globals.css                  # Industrial Design Tokens & Custom Scrollbars
├── components/
│   ├── layout/
│   │   ├── Header.tsx               # Header with ISO 9001:2015 Badge & Quick Role Switcher
│   │   ├── BottomNav.tsx            # Mobile-First 4-Tab Bottom Navigation (Home, Market, Cart, Profile)
│   │   ├── Footer.tsx               # Company Legal Footer, GSTIN, Kalamboli Market Address
│   │   └── AdminSidebar.tsx         # Traditional Industrial Admin Portal Sidebar
│   └── ui/
│       └── ProductIcon.tsx          # Sharp Industrial Vector Illustrations for all 9 Categories
├── lib/
│   ├── store-context.tsx            # Reactive Application State, Quotation/Order/Market Workflows
│   ├── db-store.ts                  # Persistent State Repository & Local Storage Sync
│   ├── pdf-generator.ts             # Compliant Indian GST Tax Invoice & Quotation PDF Generator
│   ├── supabase.ts                  # Supabase Client Setup with Live / Mock Fallback
│   ├── firebase.ts                  # Firebase Authentication Helpers
│   └── utils.ts                     # Currency (INR), Indian Date Formatting, Number to Words
├── types/
│   └── index.ts                     # Complete TypeScript Domain Interfaces
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql   # Complete PostgreSQL Schema, Tables, Indexes, RLS Policies
```

---

## 3. Database Schema (Supabase PostgreSQL)

The schema is in [`supabase/migrations/001_initial_schema.sql`](file:///Users/souvik/Projects/FTI/supabase/migrations/001_initial_schema.sql):

- **Profiles & Roles**: `profiles` (with `user_role` enum: `super_admin`, `admin`, `sales_manager`, `market_manager`, `customer`).
- **Addresses**: `user_addresses` (multi-address support with default selection).
- **Catalog**: `product_categories` (7 active + 2 coming soon, JSONB specifications and grades).
- **Cart**: `cart_items` (user-scoped multi-combination line items).
- **Quotations**: `quotations`, `quotation_items`, `quotation_versions`, `quotation_status_history`.
- **Orders**: `orders`, `order_items`, `order_status_history`.
- **Invoices**: `invoices` (with HSN codes, CGST/SGST/IGST breakdown, amount in words, bank details).
- **Market**: `market_materials` and `market_price_history` (historical time-series data points).
- **System**: `notifications`, `app_settings`, `audit_logs`.
- **Security**: Full Row Level Security (RLS) enabled on all tables.

---

## 4. Environment Configuration

Copy [`.env.example`](file:///Users/souvik/Projects/FTI/.env.example) to `.env.local`:

```bash
cp .env.example .env.local
```

### Environment Variables:
```env
# Supabase PostgreSQL & Storage
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Firebase Authentication
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK (Server Verification)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

*Note: The platform features a built-in state repository layer. If external API keys are omitted during local development, the app runs locally with persistent storage.*

---

## 5. Getting Started Locally

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev -- -p 3005
```
Open **[http://localhost:3005](http://localhost:3005)** in your browser.

### Build for Production
```bash
npm run build
npm start -- -p 3005
```

---

## 6. End-to-End Workflow Testing Guide

1. **Explore Catalog & Build Combinations**:
   - Go to [http://localhost:3005/raw-materials/round-bar](http://localhost:3005/raw-materials/round-bar).
   - Select Grade `EN8 / C45`, Diameter `50 mm`, Quantity `3.5 MT`, and click **Add This Combination to Cart**.
   - Select Grade `EN19 / 4140`, Diameter `75 mm`, Quantity `2.0 MT`, and click **Add This Combination to Cart**.
   - Verify that **NO PRICES** are displayed.
2. **Submit Quotation Request**:
   - Open [http://localhost:3005/cart](http://localhost:3005/cart).
   - Select your delivery address (e.g., Turbhe MIDC Works Gate 2).
   - Click **Request a Quotation**.
   - System generates Quotation ID (e.g., `FTI-QT-2026-0002`) with status `Pending`.
3. **Admin Pricing**:
   - Click **Switch to Admin View** (or go to [http://localhost:3005/admin/quotations](http://localhost:3005/admin/quotations)).
   - Select the pending quotation.
   - Enter unit rates (e.g., ₹50,000/MT), freight (₹8,500), and 18% GST.
   - Click **Issue & Send Official Quotation to Customer**.
4. **Customer Acceptance & Order Generation**:
   - Switch back to Customer View and navigate to [http://localhost:3005/quotations](http://localhost:3005/quotations).
   - Open the quotation, review the line item pricing and freight.
   - Click **Accept Quotation & Buy**.
   - The quotation immediately converts into Purchase Order `FTI-ORD-2026-0002` and generates Tax Invoice `FTI-INV-2026-0002`.
   - Click **Download GST Tax Invoice** to download the professional PDF invoice.
5. **Market Tracking**:
   - Open [http://localhost:3005/market](http://localhost:3005/market).
   - Toggle between **Raw Material Prices** and **Scrap Material Prices**.
   - Click any row (e.g. Copper Cathode or Heavy Melting Scrap) to inspect the stock-market-style Recharts chart, switch time ranges (`1W`, `1M`, `1Y`), or export CSV reports.
