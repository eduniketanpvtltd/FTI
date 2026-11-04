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
} from 'lucide-react';

export default function QuotationsListPage() {
  const { quotations } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

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
        return <span className="bg-[#E5A34B]/20 text-[#49352D] border border-[#E5A34B] text-[11px] font-bold px-2 py-0.5 rounded">Pending Admin Review</span>;
      case 'under_review':
        return <span className="bg-[#343A3F] text-[#F1EAE1] border border-[#737A7F] text-[11px] font-bold px-2 py-0.5 rounded">Under Stock Review</span>;
      case 'quotation_prepared':
        return <span className="bg-[#858C92] text-[#252A2E] border border-[#737A7F] text-[11px] font-bold px-2 py-0.5 rounded">Pricing Prepared</span>;
      case 'quotation_sent':
        return <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981] text-[11px] font-bold px-2 py-0.5 rounded animate-pulse">Official Quotation Sent • Action Required</span>;
      case 'accepted':
        return <span className="bg-[#76513F] text-[#F1EAE1] border border-[#B18A70] text-[11px] font-bold px-2 py-0.5 rounded">Quotation Accepted</span>;
      case 'converted_to_order':
        return <span className="bg-[#604333] text-[#F1EAE1] border border-[#737A7F] text-[11px] font-bold px-2 py-0.5 rounded">Converted to Purchase Order</span>;
      case 'rejected':
        return <span className="bg-[#DC6262]/20 text-[#DC6262] border border-[#DC6262] text-[11px] font-bold px-2 py-0.5 rounded">Declined</span>;
      case 'expired':
        return <span className="bg-[#858C92] text-[#252A2E] text-[11px] font-bold px-2 py-0.5 rounded">Validity Expired</span>;
      default:
        return <span className="bg-[#858C92] text-[#252A2E] text-[11px] font-bold px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <CustomerLayout>
      {/* Top Banner - Dark Chocolate Brown */}
      <div className="bg-[#49352D] text-[#F1EAE1] py-6 px-4 sm:px-6 border-b border-[#343A3F]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-[#A8ADB1] mb-2 font-medium">
            <Link href="/" className="hover:text-[#F1EAE1] transition">Home</Link>
            <span>/</span>
            <span className="text-[#B18A70] font-bold">My Quotations</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F1EAE1]">
                My Quotation Requests & Official Pricing
              </h1>
              <p className="text-xs sm:text-sm text-[#A8ADB1] mt-1 leading-relaxed">
                Track status history, review assigned mill prices, and accept quotations to confirm purchase orders.
              </p>
            </div>

            <Link
              href="/raw-materials"
              className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold px-4 py-2 rounded border border-[#B18A70] flex items-center space-x-1.5 shadow shrink-0 transition"
            >
              <span>+ New Quotation Request</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search & Status Filters */}
        <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-4 mb-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[#252A2E]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#49352D] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Quotation ID (e.g. FTI-QT-2026-0001) or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#A8ADB1] border border-[#737A7F] rounded text-[#252A2E] placeholder-[#49352D] font-medium"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <span className="text-[#252A2E] text-[11px] font-bold shrink-0">Status:</span>
            {['all', 'pending', 'quotation_sent', 'accepted', 'converted_to_order'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70] shadow-xs'
                    : 'bg-[#A8ADB1] text-[#252A2E] hover:bg-[#858C92] border border-[#737A7F]'
                }`}
              >
                {st === 'all'
                  ? 'All'
                  : st === 'quotation_sent'
                  ? 'Pricing Issued'
                  : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Quotations List Table / Cards */}
        {filteredQuotations.length === 0 ? (
          <div className="text-center py-16 bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-8">
            <FileSpreadsheet className="w-12 h-12 text-[#49352D] mx-auto mb-3" />
            <h3 className="font-extrabold text-[#252A2E] text-sm">No Quotations Found</h3>
            <p className="text-xs text-[#49352D] mt-1 mb-4 font-medium">
              {searchTerm || statusFilter !== 'all'
                ? 'No quotations matched your current filters.'
                : 'You have not submitted any quotation requests yet.'}
            </p>
            <Link
              href="/raw-materials"
              className="inline-flex items-center space-x-1.5 bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold px-4 py-2 rounded border border-[#B18A70]"
            >
              <span>Explore Materials & Request RFQ</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuotations.map((quotation) => (
              <div
                key={quotation.id}
                className="bg-[#BAC0C5] border border-[#737A7F] hover:border-[#76513F] rounded-lg p-5 shadow-xs transition text-[#252A2E]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#737A7F]/40 pb-3 mb-3">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-base text-[#252A2E]">
                        {quotation.quotationNumber}
                      </span>
                      <span className="text-[10px] text-[#252A2E] bg-[#858C92] px-1.5 py-0.5 rounded font-mono font-bold">
                        v{quotation.version}
                      </span>
                      {getStatusBadge(quotation.status)}
                    </div>
                    <p className="text-xs text-[#49352D] mt-1 font-medium">
                      Submitted on {formatIndianDateTime(quotation.createdAt)}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    {quotation.grandTotal ? (
                      <div>
                        <span className="text-[10px] text-[#49352D] block uppercase font-bold">
                          Total Quotation Value
                        </span>
                        <span className="text-base font-black text-[#604333]">
                          {formatINR(quotation.grandTotal)}
                        </span>
                        <span className="text-[10px] text-[#49352D] block font-medium">
                          (Incl. {quotation.taxRate}% GST & Freight)
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[10px] text-[#49352D] block uppercase font-bold">
                          Pricing Status
                        </span>
                        <span className="text-xs font-bold text-[#49352D] bg-[#E5A34B]/30 px-2 py-0.5 rounded border border-[#E5A34B]">
                          Awaiting Desk Quotation
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Summary in Quotation */}
                <div className="py-2">
                  <h4 className="text-[11px] font-bold text-[#49352D] uppercase tracking-wider mb-2">
                    Line Items ({quotation.items.length} Combination{quotation.items.length > 1 ? 's' : ''})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {quotation.items.map((it, idx) => (
                      <div
                        key={it.id || idx}
                        className="bg-[#A8ADB1] border border-[#737A7F] rounded p-2.5 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-[#252A2E]">
                            {it.categoryName} ({it.grade})
                          </p>
                          <p className="text-[11px] text-[#49352D] font-medium">
                            {Object.entries(it.specifications)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' • ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#252A2E] block font-mono">
                            {it.quantity} {it.unit}
                          </span>
                          {it.lineTotal && (
                            <span className="text-[11px] font-bold text-[#604333]">
                              {formatINR(it.lineTotal)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-[#737A7F]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-[#49352D] font-medium">
                    <Clock className="w-4 h-4 text-[#76513F]" />
                    <span>
                      {quotation.validUntil
                        ? `Valid until: ${formatIndianDate(quotation.validUntil)}`
                        : 'Quotation valid for 3 working days once issued'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/quotations/${quotation.id}`}
                      className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] font-bold px-4 py-2 rounded border border-[#B18A70] flex items-center space-x-1.5 transition cursor-pointer"
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
