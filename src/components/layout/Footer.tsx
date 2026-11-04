import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#49352D] text-[#A8ADB1] text-sm border-t border-[#343A3F] pb-20 md:pb-8">
      {/* Upper Footer: Value Props */}
      <div className="border-b border-[#343A3F] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded bg-[#343A3F] border border-[#737A7F] text-[#B18A70] mt-0.5 shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#F1EAE1] text-base">Direct Mill Certification</h4>
              <p className="text-xs text-[#A8ADB1] mt-1 leading-relaxed">
                All raw materials are accompanied by manufacturer test certificates (MTC) with full chemical and mechanical trace reports.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded bg-[#343A3F] border border-[#737A7F] text-[#10B981] mt-0.5 shrink-0 shadow-xs">
              <span className="font-bold text-lg leading-none">₹</span>
            </div>
            <div>
              <h4 className="font-bold text-[#F1EAE1] text-base">Live Industrial Price Index</h4>
              <p className="text-xs text-[#A8ADB1] mt-1 leading-relaxed">
                Direct benchmark tracking of Mandi Gobindgarh, Raipur, and Alang secondary & primary metal pricing updated by trading desk.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded bg-[#343A3F] border border-[#737A7F] text-[#E5A34B] mt-0.5 shrink-0 shadow-xs">
              <span className="font-bold text-sm leading-none">B2B</span>
            </div>
            <div>
              <h4 className="font-bold text-[#F1EAE1] text-base">Tailored B2B Quotations</h4>
              <p className="text-xs text-[#A8ADB1] mt-1 leading-relaxed">
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
            <div className="w-10 h-10 rounded-lg p-1 bg-[#343A3F] border border-[#737A7F] flex items-center justify-center shrink-0">
              <img
                src="/fti-logo.png"
                alt="FTI - FieldFast Tech International"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-[#F1EAE1] text-sm tracking-wide block">
                FieldFast Tech International
              </span>
              <span className="text-[10px] text-[#B18A70] font-semibold uppercase tracking-wider block">
                FTI Industrial Trading
              </span>
            </div>
          </div>
          <p className="text-xs text-[#A8ADB1] mt-3 leading-relaxed">
            Leading industrial raw materials sourcing and certified scrap liquidation desk catering to heavy engineering, infrastructure, and component manufacturers across India.
          </p>
          <div className="mt-4 flex items-center space-x-2 text-xs text-[#F1EAE1]">
            <span className="inline-block px-2.5 py-1 rounded bg-[#343A3F] border border-[#737A7F] font-mono font-semibold">
              GSTIN: 27AAACF0123M1Z5
            </span>
          </div>
        </div>

        <div>
          <h5 className="font-bold text-[#F1EAE1] text-xs uppercase tracking-wider mb-3">
            Raw Materials Catalog
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/raw-materials/round-bar" className="text-[#A8ADB1] hover:text-[#F1EAE1] transition">
                Round Bar (EN8, EN19, EN24, MS)
              </Link>
            </li>
            <li>
              <Link href="/raw-materials/bright-bar" className="text-[#A8ADB1] hover:text-[#F1EAE1] transition">
                Bright Bar (EN1A, EN8D, 1018)
              </Link>
            </li>
            <li>
              <Link href="/raw-materials/flat" className="text-[#A8ADB1] hover:text-[#F1EAE1] transition">
                Flat Bar (IS 2062, EN8)
              </Link>
            </li>
            <li>
              <Link href="/raw-materials/sheet" className="text-[#A8ADB1] hover:text-[#F1EAE1] transition">
                Sheet & Plate (HR, CR, Chequered)
              </Link>
            </li>
            <li>
              <Link href="/raw-materials/square" className="text-[#A8ADB1] hover:text-[#F1EAE1] transition">
                Square Bar & Square Bright
              </Link>
            </li>
            <li>
              <Link href="/raw-materials/tmt-bar" className="text-[#A8ADB1] hover:text-[#F1EAE1] transition">
                TMT Bar (Fe 500D, 550D)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-[#F1EAE1] text-xs uppercase tracking-wider mb-3">
            Market & Operations
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/market" className="text-[#A8ADB1] hover:text-[#F1EAE1] transition">
                Raw Material Prices (Live)
              </Link>
            </li>
            <li>
              <Link href="/market" className="text-[#A8ADB1] hover:text-[#F1EAE1] transition">
                Scrap Material Prices (HMS, Non-Ferrous)
              </Link>
            </li>
            <li>
              <Link href="/cart" className="text-[#A8ADB1] hover:text-[#F1EAE1] transition">
                Quotation Cart
              </Link>
            </li>
            <li>
              <Link href="/quotations" className="text-[#A8ADB1] hover:text-[#F1EAE1] transition">
                Quotation Request Status
              </Link>
            </li>
            <li>
              <Link href="/orders" className="text-[#A8ADB1] hover:text-[#F1EAE1] transition">
                Order Tracking & PDF Invoices
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-[#F1EAE1] text-xs uppercase tracking-wider mb-3">
            Kalamboli Metal Exchange
          </h5>
          <div className="space-y-2.5 text-xs text-[#A8ADB1]">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-[#B18A70] shrink-0 mt-0.5" />
              <span>FTI House, Iron & Steel Market, Kalamboli, Navi Mumbai, MH 410218</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-[#B18A70] shrink-0" />
              <span>+91 22 2742 8800 / +91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#B18A70] shrink-0" />
              <span>sales@fti-materials.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-[#343A3F] flex flex-col sm:flex-row items-center justify-between text-xs text-[#858C92]">
        <p>© 2026 FieldFast Tech International (FTI). All rights reserved.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <span>ISO 9001:2015 Quality Management</span>
          <span>•</span>
          <span>B2B Quotation Terms</span>
          <span>•</span>
          <span>Jurisdiction: Navi Mumbai</span>
        </div>
      </div>
    </footer>
  );
}
