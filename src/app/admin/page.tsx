'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDateTime } from '@/lib/utils';
import {
  FileSpreadsheet,
  TrendingUp,
  ArrowRight,
  PackageCheck,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { quotations, orders, marketMaterials } = useStore();

  const totalQuotations = quotations.length;
  const pendingQuotations = quotations.filter((q) => q.status === 'pending');
  const sentQuotations = quotations.filter((q) => q.status === 'quotation_sent');

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (o) => o.status === 'order_confirmed' || o.paymentStatus === 'pending'
  );

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Trading Operations <span className="text-[#E8732A]">Dashboard</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Monitor real-time customer RFQ submissions, assign pricing, and track Ludhiana Dispatch Hub shipments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <Link
            href="/admin/quotations"
            className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl border border-[#F59352]/50 shadow-[0_4px_15px_rgba(224,105,36,0.3)] transition flex items-center justify-center space-x-1.5 touch-manipulation"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Process Pending RFQs ({pendingQuotations.length})</span>
          </Link>
          <Link
            href="/admin/market"
            className="bg-[#191F28] hover:bg-[#222936] text-[#CBD5E1] hover:text-white border border-[#2A3342] text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 touch-manipulation"
          >
            <TrendingUp className="w-4 h-4 text-[#4ADE80]" />
            <span>Update Spot Rates</span>
          </Link>
        </div>
      </div>

      {/* 1. Key Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-3.5 sm:p-4 shadow-md">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Total Quotations</span>
          <p className="text-lg sm:text-xl font-black text-white font-mono mt-0.5">
            {totalQuotations}
          </p>
          <span className="text-[10px] text-[#64748B] mt-0.5 block truncate">Lifetime Requests</span>
        </div>

        <div className="bg-[#251811] border border-[#E06924]/50 rounded-2xl p-3.5 sm:p-4 shadow-md">
          <span className="text-[10px] font-bold text-[#E8732A] uppercase">Pending Review</span>
          <p className="text-lg sm:text-xl font-black text-[#E8732A] font-mono mt-0.5">
            {pendingQuotations.length}
          </p>
          <span className="text-[10px] text-[#F59352] mt-0.5 block truncate">Pricing Desk</span>
        </div>

        <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-3.5 sm:p-4 shadow-md">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Quotations Sent</span>
          <p className="text-lg sm:text-xl font-black text-[#38BDF8] font-mono mt-0.5">
            {sentQuotations.length}
          </p>
          <span className="text-[10px] text-[#64748B] mt-0.5 block truncate">Awaiting Client</span>
        </div>

        <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-3.5 sm:p-4 shadow-md">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Accepted & Orders</span>
          <p className="text-lg sm:text-xl font-black text-white font-mono mt-0.5">
            {totalOrders}
          </p>
          <span className="text-[10px] text-[#64748B] mt-0.5 block truncate">Active POs</span>
        </div>

        <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-3.5 sm:p-4 shadow-md">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Pending Dispatch</span>
          <p className="text-lg sm:text-xl font-black text-[#E58A3C] font-mono mt-0.5">
            {pendingOrders.length}
          </p>
          <span className="text-[10px] text-[#64748B] mt-0.5 block truncate">Processing Yard</span>
        </div>

        <div className="bg-[#122D21] border border-[#22C55E]/40 rounded-2xl p-3.5 sm:p-4 shadow-md col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-[#4ADE80] uppercase">Realized Revenue</span>
          <p className="text-base sm:text-lg font-black text-[#4ADE80] font-mono mt-0.5 truncate">
            {formatINR(totalRevenue)}
          </p>
          <span className="text-[10px] text-[#86EFAC] mt-0.5 block">Paid in Full</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quotation Requests Action Queue (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#14181F] border border-[#28303E] rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#222934] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-white">
                  Recent Quotation Requests
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Submissions requiring line item price assignment
                </p>
              </div>

              <Link
                href="/admin/quotations"
                className="text-xs text-[#E8732A] font-bold hover:text-[#F59352] flex items-center"
              >
                <span>Manage All</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="divide-y divide-[#222934]">
              {quotations.slice(0, 5).map((q) => (
                <div
                  key={q.id}
                  className="p-4 hover:bg-[#191F28]/60 transition text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-extrabold text-white">
                        {q.quotationNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          q.status === 'pending'
                            ? 'bg-[#332114] text-[#E58A3C] border border-[#C86D28]/50'
                            : q.status === 'quotation_sent'
                            ? 'bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40'
                            : 'bg-[#191F28] text-[#CBD5E1] border border-[#2A3342]'
                        }`}
                      >
                        {q.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[#E2E8F0] mt-1 font-bold truncate">
                      {q.customerSnapshot.companyName}
                    </p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      {q.customerSnapshot.fullName} • {q.items.length} Combination(s) •{' '}
                      {formatIndianDateTime(q.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#222934] shrink-0">
                    {q.grandTotal ? (
                      <span className="font-mono font-extrabold text-[#E8732A] text-sm">
                        {formatINR(q.grandTotal)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#E58A3C] font-bold bg-[#332114] px-2.5 py-0.5 rounded-lg border border-[#C86D28]/50">
                        Needs Pricing
                      </span>
                    )}

                    <Link
                      href={`/admin/quotations?selected=${q.id}`}
                      className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white font-bold px-3.5 py-1.5 rounded-xl border border-[#F59352]/40 transition touch-manipulation shadow-sm"
                    >
                      {q.status === 'pending' ? 'Assign Prices' : 'View / Edit'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-[#14181F] border border-[#28303E] rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#222934] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-white">Active Purchase Orders</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Confirmed orders requiring dispatch & tracking
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="text-xs text-[#E8732A] font-bold hover:text-[#F59352] flex items-center"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="divide-y divide-[#222934]">
              {orders.slice(0, 4).map((o) => (
                <div
                  key={o.id}
                  className="p-4 hover:bg-[#191F28]/60 transition text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-extrabold text-white">{o.orderNumber}</span>
                      <span className="bg-[#251811] text-[#E8732A] border border-[#E06924]/40 text-[10px] font-bold px-2 py-0.5 rounded-md capitalize">
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-[#E2E8F0] mt-1 font-bold truncate">
                      {o.customerSnapshot.companyName}
                    </p>
                    {o.trackingNumber ? (
                      <p className="text-[11px] text-[#E8732A] font-mono mt-0.5">
                        LR: {o.trackingNumber} ({o.trackingCarrier})
                      </p>
                    ) : (
                      <p className="text-[11px] text-[#94A3B8] mt-0.5">Ref: {o.quotationNumber}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#222934] shrink-0">
                    <span className="font-mono font-extrabold text-white text-sm">
                      {formatINR(o.grandTotal)}
                    </span>
                    <Link
                      href="/admin/orders"
                      className="bg-[#191F28] hover:bg-[#222936] text-white border border-[#2A3342] hover:border-[#E06924]/50 font-bold px-3.5 py-1.5 rounded-xl transition touch-manipulation"
                    >
                      Update
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Market Rate Controls Snapshot (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#222934] pb-3.5 mb-3.5">
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  Live Metal Price Controls
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Trading desk benchmarks updated directly in real-time
                </p>
              </div>

              <Link
                href="/admin/market"
                className="text-xs font-bold text-[#E8732A] hover:text-[#F59352]"
              >
                Full Controls
              </Link>
            </div>

            <div className="space-y-2.5">
              {marketMaterials.slice(0, 6).map((mat) => (
                <div
                  key={mat.id}
                  className="p-3 rounded-xl bg-[#191F28] border border-[#2A3342] flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{mat.name}</p>
                    <span className="text-[10px] text-[#94A3B8] font-mono">{mat.symbol}</span>
                  </div>

                  <div className="text-right">
                    <p className="font-mono font-extrabold text-white">
                      {formatINR(mat.currentPrice)}
                    </p>
                    <span
                      className={`text-[10px] font-bold font-mono ${
                        mat.percentageChange > 0
                          ? 'text-[#4ADE80]'
                          : mat.percentageChange < 0
                          ? 'text-[#F87171]'
                          : 'text-[#94A3B8]'
                      }`}
                    >
                      {mat.percentageChange > 0 ? '▲' : mat.percentageChange < 0 ? '▼' : '▬'}{' '}
                      {Math.abs(mat.percentageChange)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#222934]">
              <Link
                href="/admin/market"
                className="w-full bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-extrabold py-2.5 rounded-xl border border-[#F59352]/50 flex items-center justify-center space-x-1.5 transition shadow-md"
              >
                <span>Open Price Fixing Management</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
