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
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
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
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold px-2 py-0.5 rounded">Pending Admin Review</span>;
      case 'under_review':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[11px] font-bold px-2 py-0.5 rounded">Under Stock Review</span>;
      case 'quotation_prepared':
        return <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 text-[11px] font-bold px-2 py-0.5 rounded">Pricing Prepared</span>;
      case 'quotation_sent':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2 py-0.5 rounded animate-pulse">Official Quotation Sent • Action Required</span>;
      case 'accepted':
        return <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">Quotation Accepted</span>;
      case 'converted_to_order':
        return <span className="bg-purple-100 text-purple-900 border border-purple-300 text-[11px] font-bold px-2 py-0.5 rounded">Converted to Purchase Order</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 text-[11px] font-bold px-2 py-0.5 rounded">Declined</span>;
      case 'expired':
        return <span className="bg-slate-200 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded">Validity Expired</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <CustomerLayout>
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-6 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-200">Home</Link>
            <span>/</span>
            <span className="text-blue-400 font-semibold">My Quotations</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                My Quotation Requests & Official Pricing
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Track status history, review assigned mill prices, and accept quotations to confirm purchase orders.
              </p>
            </div>

            <Link
              href="/raw-materials"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded flex items-center space-x-1.5 shadow shrink-0 transition"
            >
              <span>+ New Quotation Request</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search & Status Filters */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Quotation ID (e.g. FTI-QT-2026-0001) or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <span className="text-slate-500 text-[11px] font-semibold shrink-0">Status:</span>
            {['all', 'pending', 'quotation_sent', 'accepted', 'converted_to_order'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition shrink-0 ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
          <div className="text-center py-16 bg-white border border-slate-200 rounded-lg p-8">
            <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">No Quotations Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'No quotations matched your current filters.'
                : 'You have not submitted any quotation requests yet.'}
            </p>
            <Link
              href="/raw-materials"
              className="inline-flex items-center space-x-1.5 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded"
            >
              <span>Explore Materials & Request RFQ</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuotations.map((quotation) => (
              <div
                key={quotation.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-5 shadow-xs hover:shadow transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-base text-slate-900">
                        {quotation.quotationNumber}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        v{quotation.version}
                      </span>
                      {getStatusBadge(quotation.status)}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Submitted on {formatIndianDateTime(quotation.createdAt)}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    {quotation.grandTotal ? (
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">
                          Total Quotation Value
                        </span>
                        <span className="text-base font-extrabold text-blue-700">
                          {formatINR(quotation.grandTotal)}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          (Incl. {quotation.taxRate}% GST & Freight)
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">
                          Pricing Status
                        </span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Awaiting Desk Quotation
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Summary in Quotation */}
                <div className="py-2">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Line Items ({quotation.items.length} Combination{quotation.items.length > 1 ? 's' : ''})
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {quotation.items.map((it, idx) => (
                      <div
                        key={it.id || idx}
                        className="bg-slate-50 border border-slate-200/80 rounded p-2.5 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-slate-800">
                            {it.categoryName} ({it.grade})
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {Object.entries(it.specifications)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' • ')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block font-mono">
                            {it.quantity} {it.unit}
                          </span>
                          {it.lineTotal && (
                            <span className="text-[11px] font-semibold text-blue-700">
                              {formatINR(it.lineTotal)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>
                      {quotation.validUntil
                        ? `Valid until: ${formatIndianDate(quotation.validUntil)}`
                        : 'Quotation valid for 3 working days once issued'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Link
                      href={`/quotations/${quotation.id}`}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded flex items-center space-x-1.5 transition"
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
