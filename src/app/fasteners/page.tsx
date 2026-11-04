'use client';

import React from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { ProductIcon } from '@/components/ui/ProductIcon';
import {
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  PhoneCall,
  Mail,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from 'lucide-react';

export default function FastenersPage() {
  return (
    <CustomerLayout>
      {/* Top Breadcrumb & Title - Dark Chocolate Brown */}
      <div className="bg-[#49352D] text-[#F1EAE1] py-6 px-4 sm:px-6 border-b border-[#343A3F]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-[#A8ADB1] mb-2 font-medium">
            <Link href="/" className="hover:text-[#F1EAE1] transition">Home</Link>
            <span>/</span>
            <span className="text-[#B18A70] font-bold">Fasteners</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#343A3F] border border-[#737A7F] px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#E5A34B] mb-2">
                <Clock className="w-3.5 h-3.5 text-[#E5A34B]" />
                <span>Catalog Onboarding in Progress</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F1EAE1]">
                Industrial Fasteners & Hardware
              </h1>
              <p className="text-xs sm:text-sm text-[#A8ADB1] mt-1 leading-relaxed max-w-2xl">
                High-tensile Grade 8.8 / 10.9 hex bolts, nuts, socket head cap screws, stainless steel washers, and anchor studs for fabrication and structural engineering.
              </p>
            </div>

            <div className="bg-[#343A3F] border border-[#737A7F] px-3.5 py-2 rounded text-xs flex items-center space-x-2 shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span className="text-[#F1EAE1] font-semibold">Tier-1 Mill Quality Fasteners</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Status Alert Banner */}
        <div className="bg-[#BAC0C5] border-2 border-[#737A7F] rounded-xl p-5 sm:p-6 mb-8 shadow-xs">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 bg-[#858C92] text-[#252A2E] rounded-lg shrink-0">
              <ProductIcon slug="fasteners" className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-[#E5A34B]" />
                <h3 className="text-base font-extrabold text-[#252A2E]">
                  Technical Catalog In Active Preparation
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#343A3F] font-medium mt-1.5 leading-relaxed">
                We are actively integrating inventory and dimension standards from accredited fastener forging and machining units.
                Online self-checkout for fasteners will be live shortly once standard size matrices and bulk pack weights are finalized.
              </p>
              <div className="mt-4 pt-3 border-t border-[#737A7F]/40 flex flex-wrap gap-2 text-xs font-semibold text-[#49352D]">
                <span className="bg-[#A8ADB1] px-2.5 py-1 rounded border border-[#737A7F]">• Grade 8.8 & 10.9 High Tensile</span>
                <span className="bg-[#A8ADB1] px-2.5 py-1 rounded border border-[#737A7F]">• Stainless 304 / 316 Fasteners</span>
                <span className="bg-[#A8ADB1] px-2.5 py-1 rounded border border-[#737A7F]">• Heavy Hex & Structural Washers</span>
                <span className="bg-[#A8ADB1] px-2.5 py-1 rounded border border-[#737A7F]">• Anchor Studs & Threaded Bars</span>
              </div>
            </div>
          </div>
        </div>

        {/* Immediate RFQ / Contact Card */}
        <div className="bg-[#49352D] text-[#F1EAE1] rounded-xl p-6 sm:p-8 border border-[#343A3F] shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-bold text-[#B18A70] uppercase tracking-wider">
                Urgent Bulk Requirements
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#F1EAE1] mt-1">
                Submit an Offline Fasteners RFQ Today
              </h2>
              <p className="text-xs sm:text-sm text-[#A8ADB1] mt-2 leading-relaxed">
                Have an urgent bill of materials (BOM) or tender requirement? Our trading desk directly sources from manufacturing plants with batch test certificates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="tel:+912227428800"
                className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold px-4 py-2.5 rounded border border-[#B18A70] flex items-center justify-center space-x-2 transition shadow-xs"
              >
                <PhoneCall className="w-4 h-4 text-[#F1EAE1]" />
                <span>+91 22 2742 8800</span>
              </a>
              <a
                href="mailto:sales@fti-materials.com?subject=Fasteners%20Bulk%20Inquiry"
                className="bg-[#343A3F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-semibold px-4 py-2.5 rounded border border-[#737A7F] flex items-center justify-center space-x-2 transition shadow-xs"
              >
                <Mail className="w-4 h-4 text-[#B18A70]" />
                <span>sales@fti-materials.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Return to Available Raw Materials */}
        <div className="flex items-center justify-between pt-4 border-t border-[#737A7F]">
          <Link
            href="/"
            className="text-xs font-bold text-[#49352D] hover:text-[#252A2E] flex items-center space-x-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/raw-materials"
            className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold px-4 py-2 rounded border border-[#B18A70] flex items-center space-x-2 transition shadow-xs"
          >
            <Layers className="w-4 h-4 text-[#F1EAE1]" />
            <span>Explore Raw Materials Catalog</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </CustomerLayout>
  );
}

