import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#080A0D] text-[#94A3B8] text-sm border-t border-[#1C222B] pb-24 md:pb-8">
      {/* Upper Footer: Value Props */}
      <div className="border-b border-[#1C222B] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3.5 bg-[#12161C] p-4 rounded-2xl border border-[#222934]">
            <div className="p-2.5 rounded-xl bg-[#241811] border border-[#E06924]/40 text-[#E8732A] mt-0.5 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Direct Mill Certification</h4>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                All raw materials are accompanied by manufacturer test certificates (MTC) with full chemical and mechanical trace reports.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 bg-[#12161C] p-4 rounded-2xl border border-[#222934]">
            <div className="p-2.5 rounded-xl bg-[#11281E] border border-[#22C55E]/40 text-[#34D399] mt-0.5 shrink-0">
              <span className="font-bold text-base leading-none">₹</span>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Live Industrial Price Index</h4>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                Direct benchmark tracking of Mandi Gobindgarh, Ludhiana, Raipur, and regional metal pricing updated by trading desk.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5 bg-[#12161C] p-4 rounded-2xl border border-[#222934]">
            <div className="p-2.5 rounded-xl bg-[#241811] border border-[#E06924]/40 text-[#E8732A] mt-0.5 shrink-0">
              <span className="font-bold text-xs leading-none">B2B</span>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Tailored B2B Quotations</h4>
              <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                Configure precise custom diameters, tolerances, cut lengths, and quantities without retail markups.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl p-1 bg-[#14181F] border border-[#E06924]/50 flex items-center justify-center shrink-0">
              <img
                src="/fti-logo-dark.png"
                alt="FTI - FieldFast Tech International"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-wide block">
                FieldFast Tech International
              </span>
              <span className="text-[10px] text-[#E8732A] font-bold uppercase tracking-wider block">
                Smart Sourcing. Stronger Business.
              </span>
            </div>
          </div>
          <p className="text-xs text-[#94A3B8] mt-3 leading-relaxed">
            Built for the businesses that build India. ISO 9001:2015 certified sourcing & manufacturing desk for Alloy & Carbon Steel Bars, Cold/Hot Forged Industrial Fasteners, and Precision Tractor Spare Parts.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#E2E8F0]">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-[#14181F] border border-[#262E3B] font-mono font-semibold text-[#E8732A]">
              ISO 9001:2015 • QACS/IND/250321
            </span>
            <span className="inline-block px-2.5 py-1 rounded-lg bg-[#14181F] border border-[#262E3B] font-mono text-[11px] text-[#CBD5E1]">
              IAS MSCB-196 • IAF MLA
            </span>
          </div>
        </div>

        <div>
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
            Product Catalogs
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/raw-materials/round-bar" className="text-[#94A3B8] hover:text-[#E8732A] transition">
                Round Bar (34 Alloy & Carbon Grades)
              </Link>
            </li>
            <li>
              <Link href="/raw-materials/bright-bar" className="text-[#94A3B8] hover:text-[#E8732A] transition">
                Bright Bar (34 Precision Grades)
              </Link>
            </li>
            <li>
              <Link href="/raw-materials/tmt-bar" className="text-[#94A3B8] hover:text-[#E8732A] transition">
                TMT Bar (10 Approved Brands • Fe 500D/550D)
              </Link>
            </li>
            <li>
              <Link href="/raw-materials/flat" className="text-[#94A3B8] hover:text-[#E8732A] transition">
                Flat, Sheet & Square Steel Bars
              </Link>
            </li>
            <li>
              <Link href="/fasteners" className="text-[#94A3B8] hover:text-[#E8732A] transition font-semibold text-[#E2E8F0]">
                Industrial Fasteners (17 Subcategories • IS Standards)
              </Link>
            </li>
            <li>
              <Link href="/tractor-parts" className="text-[#94A3B8] hover:text-[#E8732A] transition font-semibold text-[#E2E8F0]">
                Tractor Spare Parts (50 OEM-Grade SKUs)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
            Market & Operations
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/market" className="text-[#94A3B8] hover:text-[#E8732A] transition">
                Raw Material Prices (Live)
              </Link>
            </li>
            <li>
              <Link href="/market" className="text-[#94A3B8] hover:text-[#E8732A] transition">
                Scrap Material Prices (HMS, Melting)
              </Link>
            </li>
            <li>
              <Link href="/cart" className="text-[#94A3B8] hover:text-[#E8732A] transition">
                Quotation Cart
              </Link>
            </li>
            <li>
              <Link href="/quotations" className="text-[#94A3B8] hover:text-[#E8732A] transition">
                Quotation Request Status
              </Link>
            </li>
            <li>
              <Link href="/orders" className="text-[#94A3B8] hover:text-[#E8732A] transition">
                Order Tracking & PDF Invoices
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
            Registered Works & Dispatch Hub
          </h5>
          <div className="space-y-2.5 text-xs text-[#94A3B8]">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-[#E8732A] shrink-0 mt-0.5" />
              <span>St.No.1, New Ram Nagar, Industrial Area-C, Sua Road, Ludhiana 141014, Punjab, India</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-[#E8732A] shrink-0" />
              <span>+91-9780830333 / +91-9589971567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#E8732A] shrink-0" />
              <span>sales@fieldfasttech.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#1C222B] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B]">
        <p>© 2026 FieldFast Tech International (FTI). All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 sm:mt-0">
          <span>ISO 9001:2015 Certified (Cert No: QACS/IND/250321)</span>
          <span>•</span>
          <span>24×7 Support: +91-9780830333</span>
          <span>•</span>
          <span>Jurisdiction: Ludhiana, Punjab</span>
        </div>
      </div>
    </footer>
  );
}
