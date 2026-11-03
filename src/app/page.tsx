'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { ProductIcon } from '@/components/ui/ProductIcon';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Building2,
  Truck,
  CheckCircle2,
  Clock,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  PhoneCall,
  Search,
} from 'lucide-react';

import { ProductCategory } from '@/types';

export default function HomePage() {
  const { marketMaterials, categories, lastMarketSyncTime } = useStore();
  const [comingSoonModal, setComingSoonModal] = useState<string | null>(null);

  // Split categories: 3 primary cards on home
  const rawMaterialsCat = categories.filter((c: ProductCategory) => !c.isComingSoon);
  const fastenersCat = categories.find((c: ProductCategory) => c.slug === 'fasteners');
  const tractorPartsCat = categories.find((c: ProductCategory) => c.slug === 'tractor-parts');

  // Top market tickers
  const topGainers = [...marketMaterials].sort((a, b) => b.percentageChange - a.percentageChange).slice(0, 4);

  return (
    <CustomerLayout>
      {/* 1. Hero / Industrial Intro Banner */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white border-b border-slate-700/60 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1 rounded-full text-slate-200 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
                <img src="/fti-logo.png" alt="FTI Logo" className="w-4 h-4 object-contain" />
                <span className="text-red-400 font-bold">FieldFast Tech International</span>
                <span className="text-slate-500">•</span>
                <span>B2B Metal Trading Desk</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Direct Mill Sourced Raw Materials & Live Scrap Price Index
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                Source certified Round Bars, Bright Bars, Plates, Flats, and TMT rebars directly from prime producers.
                Submit custom dimension combinations for instant quotation preparation without public retail markups.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/raw-materials"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-md shadow flex items-center space-x-2 transition"
                >
                  <Layers className="w-4 h-4" />
                  <span>Explore Raw Materials</span>
                </Link>
                <Link
                  href="/market"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-sm font-semibold px-4 py-2.5 rounded-md flex items-center space-x-2 transition"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>View Live Metal Index</span>
                </Link>
              </div>
            </div>

            {/* Quick Live Market Snapshot Card */}
            <div className="w-full md:w-80 bg-slate-950/80 border border-slate-700/80 rounded-lg p-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Mandi & Spot Highlights
                  </span>
                </div>
                <Link href="/market" className="text-[11px] text-blue-400 hover:underline flex items-center">
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {topGainers.map((mat) => (
                  <div key={mat.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-900 last:border-none">
                    <div>
                      <p className="font-medium text-slate-200 truncate max-w-[150px]">{mat.name}</p>
                      <p className="text-[10px] text-slate-500">{mat.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-100">{formatINR(mat.currentPrice)}</p>
                      <p
                        className={`text-[10px] font-bold ${
                          mat.percentageChange > 0
                            ? 'text-emerald-400'
                            : mat.percentageChange < 0
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {mat.percentageChange > 0 ? '↑' : mat.percentageChange < 0 ? '↓' : '→'}{' '}
                        {Math.abs(mat.percentageChange)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Auto-sync active</span>
                </span>
                <span>{formatIndianDate(lastMarketSyncTime)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Three Primary Categories (Section 4.1 Requirement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="border-b border-slate-200 pb-3 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Product Categories</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select category to configure grades, sizes, and request official quotations.
            </p>
          </div>
          <span className="text-xs bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded">
            B2B Quotation Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Raw Materials (Active & Fully Functional) */}
          <Link
            href="/raw-materials"
            className="group relative bg-white border-2 border-blue-600/60 hover:border-blue-600 rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                  <Layers className="w-8 h-8" />
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded border border-emerald-200">
                  Active • 7 Subcategories
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                1. Raw Materials
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Round Bars, Bright Bars, Flat Sections, Steel Sheets, Square Bars, TMT construction rebars, and Bright Square bars.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-1.5 text-[11px] text-slate-500 font-medium">
                <span>• Round Bar</span>
                <span>• Bright Bar</span>
                <span>• Flat Bar</span>
                <span>• Steel Sheet</span>
                <span>• Square Bar</span>
                <span>• TMT Rebar</span>
              </div>
            </div>

            <div className="mt-6 flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition">
              <span>Browse 7 Material Categories</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </Link>

          {/* Card 2: Fasteners (Coming Soon) */}
          <div
            onClick={() => setComingSoonModal('Industrial Fasteners & Hardware')}
            className="cursor-pointer bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-6 shadow-sm transition flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
                  <ProductIcon slug="fasteners" className="w-8 h-8" />
                </div>
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded border border-amber-200">
                  Coming Soon
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                2. Fasteners
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                High-tensile Grade 8.8 / 10.9 hex bolts, nuts, socket head cap screws, stainless steel washers, and anchor studs for fabrication.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
                Catalog onboarding in progress with primary fastener manufacturers.
              </div>
            </div>

            <div className="mt-6 flex items-center text-xs font-semibold text-slate-400">
              <span>Catalog In Preparation</span>
            </div>
          </div>

          {/* Card 3: Tractor Parts (Coming Soon) */}
          <div
            onClick={() => setComingSoonModal('Agricultural Tractor Parts & Forgings')}
            className="cursor-pointer bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-6 shadow-sm transition flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
                  <ProductIcon slug="tractor-parts" className="w-8 h-8" />
                </div>
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded border border-amber-200">
                  Coming Soon
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                3. Tractor Parts
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Heavy forged three-point linkages, cultivator tines, rotavator blades, PTO shafts, and heavy agricultural machinery components.
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
                Supply chain integration in progress with certified forging units.
              </div>
            </div>

            <div className="mt-6 flex items-center text-xs font-semibold text-slate-400">
              <span>Catalog In Preparation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 7 Active Raw Material Categories Quick Grid */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Raw Material Categories (Ready for Quotation)
              </h3>
              <p className="text-xs text-slate-600">
                Select any material below to configure size, diameter, grade, and add multiple combinations to cart.
              </p>
            </div>
            <Link
              href="/raw-materials"
              className="mt-2 sm:mt-0 text-xs font-semibold text-blue-700 hover:underline flex items-center"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
            {rawMaterialsCat.map((cat: ProductCategory) => (
              <Link
                key={cat.id}
                href={`/raw-materials/${cat.slug}`}
                className="bg-white border border-slate-200 hover:border-blue-500 rounded-lg p-3 text-center flex flex-col items-center justify-between hover:shadow transition group"
              >
                <div className="my-2 p-1.5 rounded bg-slate-50 group-hover:scale-105 transition">
                  <ProductIcon slug={cat.slug} className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {cat.availableGrades.length} Grades
                  </p>
                </div>
                <span className="mt-2 text-[10px] text-blue-600 font-semibold flex items-center justify-center">
                  Configure <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose FieldFast Tech International (FTI) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center justify-center space-x-2 mb-2">
            <img src="/fti-logo.png" alt="FTI Logo" className="w-6 h-6 object-contain" />
            <span className="text-xs uppercase font-bold text-red-600 tracking-wider">FieldFast Advantage</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Why Industrial Buyers Rely on FTI (FieldFast Tech International)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Engineered specifically for engineering works, infrastructure EPC contractors, and steel traders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="w-10 h-10 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Certified Prime Quality</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Every shipment is backed by manufacturer Test Certificates (TC) with batch heat numbers and chemical analysis.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Multi-Combination Cart</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Add multiple diameters, lengths, and grades of the same product in a single RFQ without clutter.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="w-10 h-10 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Live Metal Index</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Track daily price movements of billets, rebars, copper, and scrap across key Indian manufacturing hubs.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="w-10 h-10 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Kalamboli Yard Logistics</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Dispatches with transit insurance, weighbridge verification slips, and direct truck tracking updates.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Contact & Support Section */}
      <section className="bg-slate-900 text-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">
              Need immediate mill allocation or scrap clearing?
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Speak directly with our Steel Trading Desk
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Kalamboli Iron Market, Navi Mumbai • Operational Monday to Saturday, 9:00 AM - 7:00 PM IST
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+912227428800"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded flex items-center space-x-2 transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>+91 22 2742 8800</span>
            </a>
            <Link
              href="/cart"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2.5 rounded flex items-center space-x-2 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-400" />
              <span>Request Custom Quotation</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon Explanatory Modal */}
      {comingSoonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border border-slate-300 shadow-2xl">
            <div className="flex items-center space-x-3 text-amber-600 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">{comingSoonModal}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This category is currently in active preparation with accredited domestic manufacturers and forging units.
              Purchasing operations will be enabled once technical specification catalogs and mill partnerships are finalised.
            </p>
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600">
              For urgent bulk requirements in this category, please contact our trading desk directly at{' '}
              <span className="font-semibold text-slate-800">sales@fti-materials.com</span>.
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setComingSoonModal(null)}
                className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded hover:bg-slate-800 transition"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
