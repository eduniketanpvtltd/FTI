'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { ProductIcon } from '@/components/ui/ProductIcon';
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Building2,
  Truck,
  CheckCircle2,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  PhoneCall,
  Search,
} from 'lucide-react';

import { ProductCategory } from '@/types';

export default function HomePage() {
  const { categories } = useStore();
  const [comingSoonModal, setComingSoonModal] = useState<string | null>(null);

  // Split categories: 3 primary cards on home
  const rawMaterialsCat = categories.filter((c: ProductCategory) => !c.isComingSoon);
  const fastenersCat = categories.find((c: ProductCategory) => c.slug === 'fasteners');
  const tractorPartsCat = categories.find((c: ProductCategory) => c.slug === 'tractor-parts');

  return (
    <CustomerLayout>
      {/* 1. Hero / Industrial Intro Banner - Dark Chocolate Brown */}
      <section className="bg-[#49352D] text-[#F1EAE1] border-b border-[#343A3F] pt-4 pb-8 sm:pt-6 sm:pb-10 px-3 sm:px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          {/* Top 3 Category Mini-Boxes at Starting - Visible without scrolling down */}
          <div className="mb-5 sm:mb-7">
            <div className="flex items-center justify-between mb-2 sm:mb-2.5 px-0.5">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#F1EAE1]">
                  Primary Product Categories
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#A8ADB1] font-medium hidden sm:inline">
                Instant access to mill-certified catalogs & quotations
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {/* Mini Box 1: Raw Materials */}
              <Link
                href="/raw-materials"
                className="group bg-[#BAC0C5] hover:bg-[#D6DADC] border-2 border-[#76513F] hover:border-[#604333] rounded-lg p-2 sm:p-3.5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-3 cursor-pointer"
              >
                <div className="p-1.5 sm:p-2 bg-[#76513F] text-[#F1EAE1] rounded-md group-hover:bg-[#604333] transition shrink-0 shadow-xs">
                  <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-center sm:justify-between gap-1">
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#252A2E] group-hover:text-[#604333] transition truncate leading-tight">
                      Raw Materials
                    </h3>
                    <ArrowRight className="w-3.5 h-3.5 text-[#76513F] hidden lg:block shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="mt-1 flex items-center justify-center sm:justify-start">
                    <span className="bg-[#10B981]/20 text-[#065F46] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded border border-[#10B981]/50 leading-tight whitespace-nowrap">
                      Active • 7 Types
                    </span>
                  </div>
                </div>
              </Link>

              {/* Mini Box 2: Fasteners */}
              <Link
                href="/fasteners"
                className="group bg-[#BAC0C5] hover:bg-[#D6DADC] border border-[#737A7F] hover:border-[#604333] rounded-lg p-2 sm:p-3.5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-3 cursor-pointer"
              >
                <div className="p-1.5 sm:p-2 bg-[#858C92] text-[#252A2E] rounded-md shrink-0 shadow-xs group-hover:bg-[#76513F] group-hover:text-[#F1EAE1] transition">
                  <ProductIcon slug="fasteners" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-center sm:justify-between gap-1">
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#252A2E] group-hover:text-[#604333] transition truncate leading-tight">
                      Fasteners
                    </h3>
                    <ArrowRight className="w-3.5 h-3.5 text-[#737A7F] hidden lg:block shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="mt-1 flex items-center justify-center sm:justify-start">
                    <span className="bg-[#E5A34B]/25 text-[#92400E] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded border border-[#E5A34B]/60 leading-tight whitespace-nowrap">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </Link>

              {/* Mini Box 3: Tractor Parts */}
              <Link
                href="/tractor-parts"
                className="group bg-[#BAC0C5] hover:bg-[#D6DADC] border border-[#737A7F] hover:border-[#604333] rounded-lg p-2 sm:p-3.5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-3 cursor-pointer"
              >
                <div className="p-1.5 sm:p-2 bg-[#858C92] text-[#252A2E] rounded-md shrink-0 shadow-xs group-hover:bg-[#76513F] group-hover:text-[#F1EAE1] transition">
                  <ProductIcon slug="tractor-parts" className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-center sm:justify-between gap-1">
                    <h3 className="text-xs sm:text-sm font-extrabold text-[#252A2E] group-hover:text-[#604333] transition truncate leading-tight">
                      Tractor Parts
                    </h3>
                    <ArrowRight className="w-3.5 h-3.5 text-[#737A7F] hidden lg:block shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="mt-1 flex items-center justify-center sm:justify-start">
                    <span className="bg-[#E5A34B]/25 text-[#92400E] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded border border-[#E5A34B]/60 leading-tight whitespace-nowrap">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-[#343A3F] border border-[#737A7F] px-3 py-1 rounded-full text-[#F1EAE1] text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
              <img src="/fti-logo.png" alt="FTI Logo" className="w-4 h-4 object-contain" />
              <span className="text-[#B18A70] font-bold">FieldFast Tech International</span>
              <span className="text-[#737A7F]">•</span>
              <span className="text-[#F1EAE1]">B2B Metal Trading Desk</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#F1EAE1] leading-tight">
              Direct Mill Sourced Raw Materials & Live Scrap Price Index
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#A8ADB1] leading-relaxed">
              Source certified Round Bars, Bright Bars, Plates, Flats, and TMT rebars directly from prime producers.
              Submit custom dimension combinations for instant quotation preparation without public retail markups.
            </p>

            <div className="mt-5 sm:mt-6 flex flex-wrap gap-2.5 sm:gap-3">
              <Link
                href="/raw-materials"
                className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-md shadow flex items-center space-x-2 border border-[#B18A70] transition"
              >
                <Layers className="w-4 h-4 text-[#F1EAE1]" />
                <span>Explore Raw Materials</span>
              </Link>
              <Link
                href="/market"
                className="bg-[#343A3F] hover:bg-[#604333] text-[#F1EAE1] border border-[#737A7F] text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md flex items-center space-x-2 transition shadow-xs"
              >
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                <span>View Live Metal Index</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Three Primary Categories - Industrial Steel Grey Surface */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="border-b border-[#737A7F] pb-3 mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#252A2E]">Product Categories</h2>
            <p className="text-xs sm:text-sm text-[#49352D] font-medium mt-0.5">
              Select category to configure grades, sizes, and request official quotations.
            </p>
          </div>
          <span className="text-xs bg-[#858C92] text-[#252A2E] font-bold px-2.5 py-1 rounded border border-[#737A7F]">
            B2B Quotation Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Raw Materials (Active & Fully Functional) */}
          <Link
            href="/raw-materials"
            className="group relative bg-[#BAC0C5] border-2 border-[#76513F] hover:border-[#604333] rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#76513F] text-[#F1EAE1] rounded-lg group-hover:bg-[#604333] transition shadow-xs">
                  <Layers className="w-8 h-8" />
                </div>
                <span className="bg-[#10B981]/20 text-[#10B981] text-xs font-bold px-2.5 py-0.5 rounded border border-[#10B981]/40">
                  Active • 7 Subcategories
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#252A2E] group-hover:text-[#604333] transition">
                1. Raw Materials
              </h3>
              <p className="text-xs text-[#343A3F] mt-2 leading-relaxed font-medium">
                Round Bars, Bright Bars, Flat Sections, Steel Sheets, Square Bars, TMT construction rebars, and Bright Square bars.
              </p>

              <div className="mt-4 pt-3 border-t border-[#737A7F]/40 grid grid-cols-2 gap-1.5 text-[11px] text-[#343A3F] font-semibold">
                <span>• Round Bar</span>
                <span>• Bright Bar</span>
                <span>• Flat Bar</span>
                <span>• Steel Sheet</span>
                <span>• Square Bar</span>
                <span>• TMT Rebar</span>
              </div>
            </div>

            <div className="mt-6 flex items-center text-sm font-bold text-[#76513F] group-hover:text-[#604333] group-hover:translate-x-1 transition">
              <span>Browse 7 Material Categories</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </Link>

          {/* Card 2: Fasteners (Coming Soon) */}
          <Link
            href="/fasteners"
            className="group relative bg-[#BAC0C5] border border-[#737A7F] hover:border-[#604333] rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#858C92] text-[#252A2E] rounded-lg shadow-xs group-hover:bg-[#76513F] group-hover:text-[#F1EAE1] transition">
                  <ProductIcon slug="fasteners" className="w-8 h-8" />
                </div>
                <span className="bg-[#E5A34B]/20 text-[#49352D] text-xs font-bold px-2.5 py-0.5 rounded border border-[#E5A34B]/50">
                  Coming Soon
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#252A2E] group-hover:text-[#604333] transition">
                2. Fasteners
              </h3>
              <p className="text-xs text-[#343A3F] mt-2 leading-relaxed font-medium">
                High-tensile Grade 8.8 / 10.9 hex bolts, nuts, socket head cap screws, stainless steel washers, and anchor studs for fabrication.
              </p>

              <div className="mt-4 pt-3 border-t border-[#737A7F]/40 text-xs text-[#343A3F] font-medium">
                Catalog onboarding in progress with primary fastener manufacturers.
              </div>
            </div>

            <div className="mt-6 flex items-center text-xs font-bold text-[#76513F] group-hover:text-[#604333] group-hover:translate-x-1 transition">
              <span>View Fasteners Overview</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </Link>

          {/* Card 3: Tractor Parts (Coming Soon) */}
          <Link
            href="/tractor-parts"
            className="group relative bg-[#BAC0C5] border border-[#737A7F] hover:border-[#604333] rounded-lg p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#858C92] text-[#252A2E] rounded-lg shadow-xs group-hover:bg-[#76513F] group-hover:text-[#F1EAE1] transition">
                  <ProductIcon slug="tractor-parts" className="w-8 h-8" />
                </div>
                <span className="bg-[#E5A34B]/20 text-[#49352D] text-xs font-bold px-2.5 py-0.5 rounded border border-[#E5A34B]/50">
                  Coming Soon
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#252A2E] group-hover:text-[#604333] transition">
                3. Tractor Parts
              </h3>
              <p className="text-xs text-[#343A3F] mt-2 leading-relaxed font-medium">
                Heavy forged three-point linkages, cultivator tines, rotavator blades, PTO shafts, and heavy agricultural machinery components.
              </p>

              <div className="mt-4 pt-3 border-t border-[#737A7F]/40 text-xs text-[#343A3F] font-medium">
                Supply chain integration in progress with certified forging units.
              </div>
            </div>

            <div className="mt-6 flex items-center text-xs font-bold text-[#76513F] group-hover:text-[#604333] group-hover:translate-x-1 transition">
              <span>View Tractor Parts Overview</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. The 7 Active Raw Material Categories Quick Grid - Medium Steel Grey Section */}
      <section className="bg-[#858C92] border-y border-[#737A7F] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-[#252A2E]">
                Raw Material Categories (Ready for Quotation)
              </h3>
              <p className="text-xs text-[#343A3F] font-medium">
                Select any material below to configure size, diameter, grade, and add multiple combinations to cart.
              </p>
            </div>
            <Link
              href="/raw-materials"
              className="mt-2 sm:mt-0 text-xs font-bold text-[#49352D] hover:text-[#252A2E] flex items-center transition"
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
                className="bg-[#BAC0C5] border border-[#737A7F] hover:border-[#76513F] hover:bg-[#C7CBD0] rounded-lg p-3 text-center flex flex-col items-center justify-between hover:shadow-md transition group shadow-xs"
              >
                <div className="my-2 p-1.5 rounded bg-[#A8ADB1] group-hover:scale-105 transition">
                  <ProductIcon slug={cat.slug} className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#252A2E] group-hover:text-[#76513F] transition">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] text-[#49352D] font-medium mt-0.5">
                    {cat.availableGrades.length} Grades
                  </p>
                </div>
                <span className="mt-2 text-[10px] text-[#76513F] font-bold flex items-center justify-center">
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
          <div className="inline-flex items-center justify-center space-x-2 mb-2 bg-[#858C92] px-3 py-1 rounded-full border border-[#737A7F]">
            <img src="/fti-logo.png" alt="FTI Logo" className="w-5 h-5 object-contain" />
            <span className="text-xs uppercase font-extrabold text-[#49352D] tracking-wider">FieldFast Advantage</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#252A2E]">
            Why Industrial Buyers Rely on FTI (FieldFast Tech International)
          </h2>
          <p className="text-xs sm:text-sm text-[#343A3F] font-medium mt-1">
            Engineered specifically for engineering works, infrastructure EPC contractors, and steel traders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-5 shadow-xs">
            <div className="w-10 h-10 rounded-md bg-[#76513F] text-[#F1EAE1] flex items-center justify-center mb-3 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#252A2E] text-sm">Certified Prime Quality</h4>
            <p className="text-xs text-[#343A3F] mt-1.5 leading-relaxed font-medium">
              Every shipment is backed by manufacturer Test Certificates (TC) with batch heat numbers and chemical analysis.
            </p>
          </div>

          <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-5 shadow-xs">
            <div className="w-10 h-10 rounded-md bg-[#604333] text-[#F1EAE1] flex items-center justify-center mb-3 shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#252A2E] text-sm">Multi-Combination Cart</h4>
            <p className="text-xs text-[#343A3F] mt-1.5 leading-relaxed font-medium">
              Add multiple diameters, lengths, and grades of the same product in a single RFQ without clutter.
            </p>
          </div>

          <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-5 shadow-xs">
            <div className="w-10 h-10 rounded-md bg-[#10B981] text-[#F1EAE1] flex items-center justify-center mb-3 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#252A2E] text-sm">Live Metal Index</h4>
            <p className="text-xs text-[#343A3F] mt-1.5 leading-relaxed font-medium">
              Track daily price movements of billets, rebars, copper, and scrap across key Indian manufacturing hubs.
            </p>
          </div>

          <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-5 shadow-xs">
            <div className="w-10 h-10 rounded-md bg-[#343A3F] text-[#F1EAE1] flex items-center justify-center mb-3 shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-[#252A2E] text-sm">Kalamboli Yard Logistics</h4>
            <p className="text-xs text-[#343A3F] mt-1.5 leading-relaxed font-medium">
              Dispatches with transit insurance, weighbridge verification slips, and direct truck tracking updates.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Contact & Support Section - Dark Chocolate Brown */}
      <section className="bg-[#49352D] text-[#F1EAE1] py-8 px-4 sm:px-6 border-t border-[#343A3F]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-bold text-[#B18A70] tracking-wider">
              Need immediate mill allocation or scrap clearing?
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#F1EAE1] mt-1">
              Speak directly with our Steel Trading Desk
            </h3>
            <p className="text-xs text-[#A8ADB1] mt-1">
              Kalamboli Iron Market, Navi Mumbai • Operational Monday to Saturday, 9:00 AM - 7:00 PM IST
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+912227428800"
              className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold px-4 py-2.5 rounded border border-[#B18A70] flex items-center space-x-2 transition shadow-xs"
            >
              <PhoneCall className="w-4 h-4 text-[#F1EAE1]" />
              <span>+91 22 2742 8800</span>
            </a>
            <Link
              href="/cart"
              className="bg-[#343A3F] hover:bg-[#604333] text-[#F1EAE1] border border-[#737A7F] text-xs font-semibold px-4 py-2.5 rounded flex items-center space-x-2 transition shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#B18A70]" />
              <span>Request Custom Quotation</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon Explanatory Modal */}
      {comingSoonModal && (
        <div className="fixed inset-0 z-50 bg-[#252A2E]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#BAC0C5] rounded-lg max-w-md w-full p-6 border-2 border-[#737A7F] shadow-2xl">
            <div className="flex items-center space-x-3 text-[#49352D] mb-3">
              <AlertCircle className="w-6 h-6 text-[#E5A34B]" />
              <h3 className="font-extrabold text-base text-[#252A2E]">{comingSoonModal}</h3>
            </div>
            <p className="text-xs text-[#252A2E] leading-relaxed font-medium">
              This category is currently in active preparation with accredited domestic manufacturers and forging units.
              Purchasing operations will be enabled once technical specification catalogs and mill partnerships are finalised.
            </p>
            <div className="mt-4 p-3 bg-[#858C92] border border-[#737A7F] rounded text-[11px] text-[#252A2E] font-medium">
              For urgent bulk requirements in this category, please contact our trading desk directly at{' '}
              <span className="font-bold text-[#49352D]">sales@fti-materials.com</span>.
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setComingSoonModal(null)}
                className="bg-[#76513F] text-[#F1EAE1] text-xs font-bold px-4 py-2 rounded hover:bg-[#604333] border border-[#B18A70] transition shadow-xs cursor-pointer"
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
