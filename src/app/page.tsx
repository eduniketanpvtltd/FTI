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
  Truck,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  PhoneCall,
  Settings,
  Wrench,
} from 'lucide-react';

import { ProductCategory } from '@/types';
import { FTI_ISO_CERTIFICATE, FTI_COMPANY_INFO } from '@/lib/fti-catalog-data';

export default function HomePage() {
  const { categories } = useStore();
  const [comingSoonModal, setComingSoonModal] = useState<string | null>(null);

  const rawMaterialsCat = categories.filter(
    (c: ProductCategory) =>
      !c.isComingSoon && c.slug !== 'fasteners' && c.slug !== 'tractor-parts'
  );

  return (
    <CustomerLayout>
      {/* 1. Hero Section with AI Foundry Background Image & Exact Mockup Layout */}
      <section className="relative overflow-hidden border-b border-[#1E242D]">
        {/* AI-Generated Molten Steel Foundry Hero Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/foundry-hero-bg.jpg"
            alt="Industrial Steel Foundry"
            className="w-full h-72 sm:h-96 object-cover object-center opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/40 via-[#0B0E11]/85 to-[#0B0E11]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E11]/90 via-[#0B0E11]/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto pt-24 sm:pt-28 pb-8 sm:pb-12 px-3.5 sm:px-6">
          {/* // PRIMARY PRODUCT CATEGORIES */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 px-0.5">
              <div className="flex items-center space-x-2">
                <span className="text-[#E8732A] font-black text-sm tracking-tighter">//</span>
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
                  PRIMARY PRODUCT CATEGORIES
                </span>
              </div>
              <span className="text-[11px] text-[#94A3B8] font-medium hidden sm:inline">
                Instant access to mill-certified catalogs & quotations
              </span>
            </div>

            {/* 3 Primary Category Cards - Exact Mockup Shape & Styling */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              {/* Card 1: Raw Materials (Active Orange Glow) */}
              <Link
                href="/raw-materials"
                className="group relative bg-gradient-to-b from-[#2A1B12]/95 to-[#15181F]/95 border-2 border-[#E06924] hover:border-[#F28B49] rounded-2xl p-3 sm:p-5 shadow-[0_0_25px_rgba(224,105,36,0.2)] transition flex flex-col items-center justify-between text-center cursor-pointer"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#251811] border border-[#E06924]/40 flex items-center justify-center text-[#E8732A] mb-2 group-hover:scale-105 transition">
                  <Layers className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-xs sm:text-base font-extrabold text-white leading-tight">
                  Raw
                  <br className="sm:hidden" /> Materials
                </h3>
                <div className="mt-2.5">
                  <span className="inline-block bg-[#123123] text-[#4ADE80] text-[9px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#22C55E]/50 whitespace-nowrap">
                    Active - 7 Types
                  </span>
                </div>
              </Link>

              {/* Card 2: Fasteners */}
              <Link
                href="/fasteners"
                className="group relative bg-[#151921]/95 hover:bg-[#1A202A] border border-[#2A323E] hover:border-[#E06924] rounded-2xl p-3 sm:p-5 transition flex flex-col items-center justify-between text-center cursor-pointer"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#251811] border border-[#E06924]/40 flex items-center justify-center text-[#E8732A] mb-2 group-hover:scale-105 transition">
                  <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xs sm:text-base font-extrabold text-white leading-tight">
                  Fasteners
                </h3>
                <div className="mt-2.5">
                  <span className="inline-block bg-[#123123] text-[#4ADE80] text-[9px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#22C55E]/50 whitespace-nowrap">
                    Active - 17 Types
                  </span>
                </div>
              </Link>

              {/* Card 3: Tractor Parts */}
              <Link
                href="/tractor-parts"
                className="group relative bg-[#151921]/95 hover:bg-[#1A202A] border border-[#2A323E] hover:border-[#E06924] rounded-2xl p-3 sm:p-5 transition flex flex-col items-center justify-between text-center cursor-pointer"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#251811] border border-[#E06924]/40 flex items-center justify-center text-[#E8732A] mb-2 group-hover:scale-105 transition">
                  <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-xs sm:text-base font-extrabold text-white leading-tight">
                  Tractor Parts
                </h3>
                <div className="mt-2.5">
                  <span className="inline-block bg-[#123123] text-[#4ADE80] text-[9px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#22C55E]/50 whitespace-nowrap">
                    Active - 50 Parts
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Brand Pill Banner - Exact Match to Mockup */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center justify-between sm:justify-start gap-3 bg-[#14181F] border border-[#2A323E] px-4 py-2.5 rounded-full mb-5 w-full sm:w-auto shadow-inner">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#1F1713] border border-[#E06924]/60 p-0.5 flex items-center justify-center shrink-0">
                  <img src="/fti-logo-dark.png" alt="FTI Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-[#E8732A] font-extrabold text-[11px] sm:text-xs uppercase tracking-wider leading-tight">
                  FIELDFAST TECH
                  <br className="sm:hidden" /> INTERNATIONAL
                </span>
              </div>
              <div className="h-6 w-px bg-[#2C3543] shrink-0" />
              <span className="text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-wider leading-tight text-right sm:text-left">
                B2B METAL
                <br className="sm:hidden" /> TRADING DESK
              </span>
            </div>

            {/* Hero Title with White + Molten Orange Accent */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Direct Mill Sourced Raw Materials &{' '}
              <span className="text-[#E8732A]">Live Scrap Price Index</span>
            </h1>

            <p className="mt-3.5 text-xs sm:text-base text-[#94A3B8] leading-relaxed max-w-2xl">
              Source certified Round Bars, Bright Bars, Plates, Flats, and TMT rebars directly from prime producers.
              Submit custom dimension combinations for instant quotation preparation without public retail markups.
            </p>

            {/* Stacked on Mobile, Side-by-Side on Desktop CTA Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md sm:max-w-none">
              <Link
                href="/raw-materials"
                className="bg-gradient-to-b from-[#E8732A] to-[#C45316] hover:from-[#F2823B] hover:to-[#D45E1C] text-white text-sm font-bold px-6 py-3 rounded-xl shadow-[0_4px_20px_rgba(224,105,36,0.35)] flex items-center justify-center space-x-2.5 border border-[#F59352]/50 transition"
              >
                <Layers className="w-4 h-4 text-white" />
                <span>Explore Raw Materials</span>
              </Link>
              <Link
                href="/market"
                className="bg-[#151A22] hover:bg-[#1D2430] text-white border border-[#2E3746] text-sm font-bold px-6 py-3 rounded-xl flex items-center justify-center space-x-2.5 transition shadow-sm"
              >
                <TrendingUp className="w-4 h-4 text-[#22C55E]" />
                <span>View Live Metal Index</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Product Categories Overview */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 py-8">
        <div className="flex items-center justify-between gap-4 pb-5 mb-6 border-b border-[#1E242D]">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Product Categories</h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              Select category to configure grades, sizes, and request official quotations.
            </p>
          </div>
          <div className="bg-[#14181F] text-[#E2E8F0] text-[11px] sm:text-xs font-bold px-3.5 py-2 rounded-xl border border-[#2A323E] text-center shrink-0 leading-tight">
            B2B
            <br className="sm:hidden" /> Quotation
            <br className="sm:hidden" /> Model
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Raw Materials */}
          <Link
            href="/raw-materials"
            className="group relative bg-[#14181F] border-2 border-[#E06924]/70 hover:border-[#F28B49] rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src="/images/round-bar-fg.jpg"
                    alt="Raw Materials"
                    className="w-12 h-12 rounded-xl object-cover border border-[#E06924]/50"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8732A] block">
                      PRIMARY DIVISION
                    </span>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-[#E8732A] transition">
                      1. Raw Materials
                    </h3>
                  </div>
                </div>
                <span className="bg-[#123123] text-[#4ADE80] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#22C55E]/40">
                  Active • 7 Types
                </span>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Round Bars, Bright Bars, Flat Sections, Steel Sheets, Square Bars, TMT construction rebars, and Bright Square bars.
              </p>

              <div className="mt-4 pt-3 border-t border-[#222934] grid grid-cols-2 gap-1.5 text-xs text-[#CBD5E1] font-semibold">
                <span>• Round Bar</span>
                <span>• Bright Bar</span>
                <span>• Flat Bar</span>
                <span>• Steel Sheet</span>
                <span>• Square Bar</span>
                <span>• TMT Rebar</span>
              </div>
            </div>

            <div className="mt-6 flex items-center text-xs font-bold text-[#E8732A] group-hover:translate-x-1 transition">
              <span>Browse 7 Material Categories</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </Link>

          {/* Card 2: Fasteners */}
          <Link
            href="/fasteners"
            className="group relative bg-[#14181F] border border-[#262E3B] hover:border-[#E06924] rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <ProductIcon slug="fasteners" className="w-12 h-12" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8732A] block">
                      INDUSTRIAL HARDWARE
                    </span>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-[#E8732A] transition">
                      2. Fasteners
                    </h3>
                  </div>
                </div>
                <span className="bg-[#123123] text-[#4ADE80] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#22C55E]/40">
                  Active • 17 Types
                </span>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Cold & hot forged high-tensile fasteners across 17 subcategories and 543 IS engineering drawings (IS 1363, IS 1364, IS 730, IS 1120).
              </p>

              <div className="mt-4 pt-3 border-t border-[#222934] grid grid-cols-2 gap-1.5 text-xs text-[#CBD5E1] font-semibold">
                <span>• Hex Bolt & Nut</span>
                <span>• U-Bolt & J-Bolt</span>
                <span>• L-Bolt & J-Hook</span>
                <span>• Coach Screw</span>
                <span>• Heavy Hex Series</span>
                <span>• DTI & Spring Washers</span>
              </div>
            </div>

            <div className="mt-6 flex items-center text-xs font-bold text-[#E8732A] group-hover:translate-x-1 transition">
              <span>Explore 17 Fastener Subcategories</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </Link>

          {/* Card 3: Tractor Parts */}
          <Link
            href="/tractor-parts"
            className="group relative bg-[#14181F] border border-[#262E3B] hover:border-[#E06924] rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <ProductIcon slug="tractor-parts" className="w-12 h-12" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8732A] block">
                      AGRICULTURAL FORGINGS
                    </span>
                    <h3 className="text-lg font-extrabold text-white group-hover:text-[#E8732A] transition">
                      3. Tractor Parts
                    </h3>
                  </div>
                </div>
                <span className="bg-[#123123] text-[#4ADE80] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#22C55E]/40">
                  Active • 50 SKUs
                </span>
              </div>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                50 OEM-grade agricultural tractor spare parts across 19 assembly systems — Engine, Clutch, Transmission, PTO, Differential, Hydraulics & Linkage.
              </p>

              <div className="mt-4 pt-3 border-t border-[#222934] grid grid-cols-2 gap-1.5 text-xs text-[#CBD5E1] font-semibold">
                <span>• Engine & Crankshaft</span>
                <span>• Clutch & Gear Set</span>
                <span>• PTO Shaft & Diff</span>
                <span>• Hydraulic Lift & Pump</span>
                <span>• Top & Lower Linkages</span>
                <span>• Axles, Hubs & Brakes</span>
              </div>
            </div>

            <div className="mt-6 flex items-center text-xs font-bold text-[#E8732A] group-hover:translate-x-1 transition">
              <span>Browse 50 Tractor Spare Parts</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. The 7 Active Raw Material Categories Quick Grid */}
      <section className="bg-[#0E1217] border-y border-[#1E242D] py-8 px-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-white">
                Raw Material Categories <span className="text-[#E8732A]">(Ready for Quotation)</span>
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Select any material below to configure size, diameter, grade, and add multiple combinations to cart.
              </p>
            </div>
            <Link
              href="/raw-materials"
              className="mt-2 sm:mt-0 text-xs font-bold text-[#E8732A] hover:text-[#F28B49] flex items-center transition"
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
                className="bg-[#14181F] border border-[#262E3B] hover:border-[#E06924] rounded-2xl p-3.5 text-center flex flex-col items-center justify-between hover:shadow-[0_0_20px_rgba(224,105,36,0.15)] transition group"
              >
                <div className="my-1.5 group-hover:scale-105 transition">
                  <ProductIcon slug={cat.slug} className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white group-hover:text-[#E8732A] transition">
                    {cat.name}
                  </h4>
                  <p className="text-[10px] text-[#94A3B8] font-medium mt-0.5">
                    {cat.availableGrades.length} Grades
                  </p>
                </div>
                <span className="mt-2 text-[10px] text-[#E8732A] font-bold flex items-center justify-center">
                  Configure <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose FieldFast Tech International */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 py-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center justify-center space-x-2 mb-2 bg-[#14181F] px-3.5 py-1 rounded-full border border-[#262E3B]">
            <img src="/fti-logo.png" alt="FTI Logo" className="w-4 h-4 object-contain" />
            <span className="text-[11px] uppercase font-extrabold text-[#E8732A] tracking-wider">
              FieldFast Advantage
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Why Industrial Buyers Rely on <span className="text-[#E8732A]">FTI</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Engineered specifically for engineering works, infrastructure EPC contractors, and steel traders.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#14181F] border border-[#262E3B] rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-[#251811] border border-[#E06924]/40 text-[#E8732A] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Certified Prime Quality</h4>
            <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
              Every shipment is backed by manufacturer Test Certificates (TC) with batch heat numbers and chemical analysis.
            </p>
          </div>

          <div className="bg-[#14181F] border border-[#262E3B] rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-[#251811] border border-[#E06924]/40 text-[#E8732A] flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Multi-Combination Cart</h4>
            <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
              Add multiple diameters, lengths, and grades of the same product in a single RFQ without clutter.
            </p>
          </div>

          <div className="bg-[#14181F] border border-[#262E3B] rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-[#123123] border border-[#22C55E]/40 text-[#4ADE80] flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Live Metal Index</h4>
            <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
              Track daily price movements of billets, ingots, wire rods, and scrap across key Indian manufacturing hubs.
            </p>
          </div>

          <div className="bg-[#14181F] border border-[#262E3B] rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-[#1C222C] border border-[#2E3746] text-[#CBD5E1] flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Ludhiana Dispatch Hub</h4>
            <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
              Direct dispatches from St.No.1, Industrial Area-C, Ludhiana with weighbridge verification slips and live truck tracking.
            </p>
          </div>
        </div>

        {/* ISO 9001:2015 Official Certification Banner */}
        <div className="mt-6 bg-gradient-to-r from-[#171C24] via-[#14181F] to-[#1E1712] border border-[#2A3342] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <img
              src={FTI_ISO_CERTIFICATE.cdnUrl}
              alt="ISO 9001:2015 Certificate QACS/IND/250321"
              className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg object-cover border border-[#E8732A]/50 shrink-0 bg-white p-0.5"
            />
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#112A1F] border border-[#22C55E]/40 text-[#34D399] text-[10px] font-bold mb-1.5">
                <span>{FTI_ISO_CERTIFICATE.standard} CERTIFIED • {FTI_ISO_CERTIFICATE.certificateNumber}</span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                {FTI_ISO_CERTIFICATE.qmsLabel} ({FTI_ISO_CERTIFICATE.accreditation})
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed max-w-2xl">
                {FTI_ISO_CERTIFICATE.scope}. Valid through <strong className="text-white">{FTI_ISO_CERTIFICATE.validUntil}</strong> • Registered Works: <strong className="text-white">{FTI_COMPANY_INFO.fullAddress}</strong>.
              </p>
            </div>
          </div>
          <a
            href={FTI_ISO_CERTIFICATE.cdnUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-[#1B222D] hover:bg-[#252E3D] text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-[#2E3848] transition"
          >
            View Official Certificate
          </a>
        </div>
      </section>

      {/* 5. Contact & Support Section */}
      <section className="bg-[#11151C] text-white py-8 px-3.5 sm:px-6 border-t border-[#1E242D]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-bold text-[#E8732A] tracking-wider">
              {FTI_COMPANY_INFO.tagline} — {FTI_COMPANY_INFO.footerTagline}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Speak directly with our Ludhiana Trading & Engineering Desk
            </h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              {FTI_COMPANY_INFO.fullAddress} • 24×7 Support & WhatsApp Desk
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${FTI_COMPANY_INFO.supportPhone}`}
              className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-5 py-2.5 rounded-xl border border-[#F59352]/50 flex items-center space-x-2 transition shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>{FTI_COMPANY_INFO.supportPhone}</span>
            </a>
            <Link
              href="/cart"
              className="bg-[#161B22] hover:bg-[#1E2530] text-white border border-[#2C3545] text-xs font-bold px-5 py-2.5 rounded-xl flex items-center space-x-2 transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#E8732A]" />
              <span>Request Custom Quotation</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon Explanatory Modal */}
      {comingSoonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14181F] rounded-2xl max-w-md w-full p-6 border border-[#2C3545] shadow-2xl">
            <div className="flex items-center space-x-3 mb-3">
              <AlertCircle className="w-6 h-6 text-[#E8732A]" />
              <h3 className="font-extrabold text-base text-white">{comingSoonModal}</h3>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              This category is currently in active preparation with accredited domestic manufacturers and forging units.
              Purchasing operations will be enabled once technical specification catalogs and mill partnerships are finalised.
            </p>
            <div className="mt-4 p-3 bg-[#1A2029] border border-[#2A323E] rounded-xl text-[11px] text-[#CBD5E1]">
              For urgent bulk requirements in this category, please contact our trading desk directly at{' '}
              <span className="font-bold text-[#E8732A]">sales@fieldfasttech.com</span>.
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setComingSoonModal(null)}
                className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-5 py-2 rounded-xl border border-[#F59352]/50 transition cursor-pointer"
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
