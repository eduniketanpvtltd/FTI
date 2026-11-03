import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800 pb-20 md:pb-8">
      {/* Upper Footer: Value Props */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-blue-400 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-base">Direct Mill Certification</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                All raw materials are accompanied by manufacturer test certificates (MTC) with full chemical and mechanical trace reports.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-emerald-400 mt-0.5">
              <span className="font-bold text-lg leading-none">₹</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-base">Live Industrial Price Index</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Direct benchmark tracking of Mandi Gobindgarh, Raipur, and Alang secondary & primary metal pricing updated by trading desk.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-amber-400 mt-0.5">
              <span className="font-bold text-sm leading-none">B2B</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-base">Tailored B2B Quotations</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
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
            <div className="w-10 h-10 rounded-lg p-1 bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
              <img
                src="/fti-logo.png"
                alt="FTI - FieldFast Tech International"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-slate-100 text-sm tracking-wide block">
                FieldFast Tech International
              </span>
              <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider block">
                FTI Industrial Trading
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Leading industrial raw materials sourcing and certified scrap liquidation desk catering to heavy engineering, infrastructure, and component manufacturers across India.
          </p>
          <div className="mt-4 flex items-center space-x-2 text-xs text-slate-300">
            <span className="inline-block px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono">
              GSTIN: 27AAACF0123M1Z5
            </span>
          </div>
        </div>

        <div>
          <h5 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
            Raw Materials Catalog
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/raw-materials/round-bar" className="hover:text-white transition">
                Round Bar (EN8, EN19, EN24, MS)
              </Link>
            </li>
            <li>
              <Link href="/raw-materials/bright-bar" className="hover:text-white transition">
                Bright Bar (EN1A, EN8D, 1018)
              </Link>
            </li>
            <li>
              <Link href="/raw-materials/flat" className="hover:text-white transition">
                Flat Bar (IS 2062, EN8)
              </Link>
            </li>
            <li>
              <Link href="/raw-materials/sheet" className="hover:text-white transition">
                Sheet & Plate (HR, CR, Chequered)
              </Link>
            </li>
            <li>
              <Link href="/raw-materials/square" className="hover:text-white transition">
                Square Bar & Square Bright
              </Link>
            </li>
            <li>
              <Link href="/raw-materials/tmt-bar" className="hover:text-white transition">
                TMT Bar (Fe 500D, 550D)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
            Market & Operations
          </h5>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/market" className="hover:text-white transition">
                Raw Material Prices (Live)
              </Link>
            </li>
            <li>
              <Link href="/market?tab=scrap" className="hover:text-white transition">
                Scrap Material Prices (HMS, Non-Ferrous)
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white transition">
                Quotation Cart
              </Link>
            </li>
            <li>
              <Link href="/quotations" className="hover:text-white transition">
                Quotation Request Status
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-white transition">
                Order Tracking & PDF Invoices
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
            Kalamboli Metal Exchange
          </h5>
          <div className="space-y-2.5 text-xs text-slate-400">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>FTI House, Iron & Steel Market, Kalamboli, Navi Mumbai, MH 410218</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-slate-500 shrink-0" />
              <span>+91 22 2742 8800 / +91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <span>sales@fti-materials.com</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
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
