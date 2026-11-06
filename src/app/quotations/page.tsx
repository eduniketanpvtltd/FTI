'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import { QuotationStatus } from '@/types';
import {
  FileSpreadsheet,
  Clock,
  ArrowRight,
  Search,
  ChevronRight,
  Lock,
} from 'lucide-react';

export default function QuotationsListPage() {
  const { quotations: allQuotations, isAuthenticated, currentUser } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const quotations =
    currentUser.role !== 'customer'
      ? allQuotations
      : allQuotations.filter((q) => q.userId === currentUser.id);

  const filteredQuotations = quotations.filter((q) => {
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesSearch =
      q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.items.some((item) =>
        item.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.grade.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-[#332114] text-[#E58A3C] border border-[#C86D28]/50 text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
            Pending Admin Review
          </span>
        );
      case 'under_review':
        return (
          <span className="bg-[#1C222C] text-[#CBD5E1] border border-[#2E3746] text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
            Under Stock Review
          </span>
        );
      case 'quotation_prepared':
        return (
          <span className="bg-[#1C222C] text-[#E2E8F0] border border-[#2E3746] text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
            Pricing Prepared
          </span>
        );
      case 'quotation_sent':
        return (
          <span className="bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40 text-[11px] font-bold px-2.5 py-0.5 rounded-lg animate-pulse">
            Official Quotation Sent • Action Required
          </span>
        );
      case 'accepted':
        return (
          <span className="bg-[#251811] text-[#E8732A] border border-[#E06924]/50 text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
            Quotation Accepted
          </span>
        );
      case 'converted_to_order':
        return (
          <span className="bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40 text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
            Converted to Purchase Order
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-[#2F1619] text-[#F87171] border border-[#EF4444]/40 text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
            Declined
          </span>
        );
      case 'expired':
        return (
          <span className="bg-[#1C222C] text-[#94A3B8] text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
            Validity Expired
          </span>
        );
      default:
        return (
          <span className="bg-[#1C222C] text-[#CBD5E1] text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
            {status}
          </span>
        );
    }
  };

  return (
    <CustomerLayout>
      {/* Top Hero Banner with AI Foundry Background */}
      <div className="relative overflow-hidden border-b border-[#1E242D]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/foundry-hero-bg.jpg"
            alt="Industrial Steel Foundry"
            className="w-full h-52 sm:h-60 object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/35 via-[#0B0E11]/85 to-[#0B0E11]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E11]/90 via-[#0B0E11]/45 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto pt-16 sm:pt-20 pb-5 px-3.5 sm:px-6">
          <div className="flex items-center space-x-1.5 text-xs text-[#CBD5E1] mb-2 font-medium">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-[#E8732A] font-bold">My Quotations</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                My Quotation Requests & <span className="text-[#E8732A]">Official Pricing</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 leading-relaxed max-w-2xl">
                Track status history, review assigned mill prices, and accept quotations to confirm purchase orders.
              </p>
            </div>

            <Link
              href="/raw-materials"
              className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-[#F59352]/50 flex items-center space-x-1.5 shadow-[0_4px_15px_rgba(224,105,36,0.3)] shrink-0 transition self-start sm:self-auto"
            >
              <span>+ New Quotation Request</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-7">
        {/* Search & Status Filters */}
        <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-4 mb-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Quotation ID (e.g. FTI-QT-2026-0001) or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white placeholder-[#64748B] font-medium"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 md:pb-0 text-xs">
            <span className="text-white text-xs font-bold shrink-0">Status:</span>
            {['all', 'pending', 'quotation_sent', 'accepted', 'converted_to_order'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 shadow-[0_2px_10px_rgba(224,105,36,0.3)]'
                    : 'bg-[#191F28] text-[#CBD5E1] hover:bg-[#222936] border border-[#2A3342]'
                }`}
              >
                {st === 'all'
                  ? 'All'
                  : st === 'quotation_sent'
                  ? 'Pricing Issued'
                  : st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Quotations List */}
        {!isAuthenticated ? (
          <div className="text-center py-16 bg-[#14181F] border border-[#28303E] rounded-2xl p-8 max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#251811] border border-[#E06924]/40 text-[#E8732A] flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-white text-base">Sign In to Request & Track Quotations</h3>
            <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
              You can freely explore our raw materials catalog and add specifications to your quotation cart. To submit official RFQ requests and view assigned mill pricing, please sign in with Google.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login?redirect=/quotations"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-extrabold px-6 py-3 rounded-xl border border-[#F59352]/50 shadow-lg"
              >
                <span>Sign In / Sign Up with Google</span>
              </Link>
              <Link
                href="/raw-materials"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 bg-[#191F28] text-[#CBD5E1] hover:text-white text-xs font-bold px-5 py-3 rounded-xl border border-[#2A3342]"
              >
                <span>Explore Raw Materials</span>
              </Link>
            </div>
          </div>
        ) : filteredQuotations.length === 0 ? (
          <div className="text-center py-16 bg-[#14181F] border border-[#28303E] rounded-2xl p-8">
            <FileSpreadsheet className="w-12 h-12 text-[#E8732A] mx-auto mb-3" />
            <h3 className="font-extrabold text-white text-sm">No Quotations Found</h3>
            <p className="text-xs text-[#94A3B8] mt-1 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'No quotations matched your current filters.'
                : 'You have not submitted any quotation requests yet.'}
            </p>
            <Link
              href="/raw-materials"
              className="inline-flex items-center space-x-1.5 bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-5 py-2.5 rounded-xl border border-[#F59352]/50"
            >
              <span>Explore Materials & Request RFQ</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuotations.map((quotation) => (
              <div
                key={quotation.id}
                className="bg-[#14181F] border border-[#28303E] hover:border-[#E06924] rounded-2xl p-5 shadow-lg transition text-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#222934] pb-3.5 mb-3.5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-extrabold text-base text-white">
                        {quotation.quotationNumber}
                      </span>
                      <span className="text-[10px] text-[#E8732A] bg-[#251811] px-2 py-0.5 rounded-md border border-[#E06924]/40 font-mono font-bold">
                        v{quotation.version}
                      </span>
                      {getStatusBadge(quotation.status)}
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      Submitted on {formatIndianDateTime(quotation.createdAt)}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    {quotation.grandTotal ? (
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block uppercase font-bold">
                          Total Quotation Value
                        </span>
                        <span className="text-lg font-black text-[#E8732A] font-mono">
                          {formatINR(quotation.grandTotal)}
                        </span>
                        <span className="text-[10px] text-[#64748B] block">
                          (Incl. {quotation.taxRate}% GST & Freight)
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[10px] text-[#94A3B8] block uppercase font-bold">
                          Pricing Status
                        </span>
                        <span className="text-xs font-bold text-[#E58A3C] bg-[#332114] px-2.5 py-0.5 rounded-lg border border-[#C86D28]/50">
                          Awaiting Desk Quotation
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="py-2">
                  <h4 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                    Line Items ({quotation.items.length} Combination{quotation.items.length > 1 ? 's' : ''})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                    {quotation.items.map((it, idx) => (
                      <div
                        key={it.id || idx}
                        className="bg-[#191F28] border border-[#2A3342] rounded-xl p-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-white">
                            {it.categoryName} ({it.grade})
                          </p>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">
                            {Object.entries(it.specifications)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' • ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-white block font-mono">
                            {it.quantity} {it.unit}
                          </span>
                          {it.lineTotal && (
                            <span className="text-[11px] font-bold text-[#E8732A] font-mono">
                              {formatINR(it.lineTotal)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#222934] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-[#94A3B8]">
                    <Clock className="w-4 h-4 text-[#E8732A]" />
                    <span>
                      {quotation.validUntil
                        ? `Valid until: ${formatIndianDate(quotation.validUntil)}`
                        : 'Quotation valid for 3 working days once issued'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/quotations/${quotation.id}`}
                      className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white font-bold px-4 py-2.5 rounded-xl border border-[#F59352]/50 flex items-center space-x-1.5 transition cursor-pointer shadow-md"
                    >
                      <span>
                        {quotation.status === 'quotation_sent'
                          ? 'Review & Accept Quotation'
                          : 'View Full Details'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
