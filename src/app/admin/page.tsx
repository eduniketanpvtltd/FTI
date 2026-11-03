'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import {
  Users,
  FileSpreadsheet,
  PackageCheck,
  Receipt,
  TrendingUp,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Truck,
  Plus,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { quotations, orders, invoices, marketMaterials, addresses } = useStore();

  const totalQuotations = quotations.length;
  const pendingQuotations = quotations.filter((q) => q.status === 'pending');
  const sentQuotations = quotations.filter((q) => q.status === 'quotation_sent');
  const acceptedQuotations = quotations.filter((q) => q.status === 'accepted' || q.status === 'converted_to_order');

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'order_confirmed' || o.paymentStatus === 'pending');
  const completedOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'completed');

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Trading Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time customer RFQ submissions, assign pricing, and track Kalamboli yard dispatches.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/quotations"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded shadow transition flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Process Pending RFQs ({pendingQuotations.length})</span>
          </Link>
          <Link
            href="/admin/market"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded transition flex items-center space-x-1.5"
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Update Spot Rates</span>
          </Link>
        </div>
      </div>

      {/* 1. Key Metrics Cards (Section 11.1) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Quotations</span>
          <p className="text-xl font-extrabold text-slate-900 font-mono mt-1">{totalQuotations}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Lifetime Requests</span>
        </div>

        <div className="bg-white border border-amber-300 bg-amber-50/20 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-amber-800 uppercase">Pending Review</span>
          <p className="text-xl font-extrabold text-amber-700 font-mono mt-1">{pendingQuotations.length}</p>
          <span className="text-[10px] text-amber-600 mt-1 block">Requires Pricing Desk</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Quotations Sent</span>
          <p className="text-xl font-extrabold text-blue-700 font-mono mt-1">{sentQuotations.length}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Awaiting Client PO</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Accepted & Orders</span>
          <p className="text-xl font-extrabold text-purple-700 font-mono mt-1">{totalOrders}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">Active POs</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Pending Dispatch</span>
          <p className="text-xl font-extrabold text-slate-800 font-mono mt-1">{pendingOrders.length}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">In Processing / Packing</span>
        </div>

        <div className="bg-white border border-emerald-300 bg-emerald-50/20 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-800 uppercase">Realized Revenue</span>
          <p className="text-lg font-extrabold text-emerald-700 font-mono mt-1">{formatINR(totalRevenue)}</p>
          <span className="text-[10px] text-emerald-600 mt-1 block">Paid in Full</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quotation Requests Action Queue (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Recent Quotation Requests
                </h2>
                <p className="text-xs text-slate-500">
                  Submissions requiring line item price assignment
                </p>
              </div>

              <Link
                href="/admin/quotations"
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center"
              >
                <span>Manage All</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {quotations.slice(0, 5).map((q) => (
                <div key={q.id} className="p-4 hover:bg-slate-50 transition text-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900">{q.quotationNumber}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          q.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : q.status === 'quotation_sent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {q.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5 font-medium">
                      {q.customerSnapshot.companyName} ({q.customerSnapshot.fullName})
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {q.items.length} Combination(s) • {formatIndianDateTime(q.createdAt)}
                    </p>
                  </div>

                  <div className="text-right flex items-center space-x-3">
                    {q.grandTotal ? (
                      <span className="font-mono font-bold text-slate-900">
                        {formatINR(q.grandTotal)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Needs Pricing
                      </span>
                    )}

                    <Link
                      href={`/admin/quotations?selected=${q.id}`}
                      className="bg-slate-900 text-white font-semibold px-3 py-1.5 rounded hover:bg-slate-800 transition"
                    >
                      {q.status === 'pending' ? 'Assign Prices' : 'View / Edit'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Active Purchase Orders</h2>
                <p className="text-xs text-slate-500">Confirmed orders requiring dispatch & tracking</p>
              </div>

              <Link
                href="/admin/orders"
                className="text-xs text-blue-600 font-semibold hover:underline flex items-center"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.slice(0, 4).map((o) => (
                <div key={o.id} className="p-4 hover:bg-slate-50 transition text-xs flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                      <span className="bg-purple-100 text-purple-900 text-[10px] font-bold px-1.5 py-0.2 rounded capitalize">
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{o.customerSnapshot.companyName}</p>
                    {o.trackingNumber && (
                      <p className="text-[11px] text-blue-700 font-mono">
                        LR: {o.trackingNumber} ({o.trackingCarrier})
                      </p>
                    )}
                  </div>

                  <div className="text-right flex items-center space-x-3">
                    <span className="font-mono font-bold text-slate-900">{formatINR(o.grandTotal)}</span>
                    <Link
                      href="/admin/orders"
                      className="bg-slate-900 text-white font-semibold px-3 py-1.5 rounded hover:bg-slate-800 transition"
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
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Live Metal Price Controls
                </h3>
                <p className="text-xs text-slate-500">
                  Trading desk benchmarks updated directly in real-time
                </p>
              </div>

              <Link
                href="/admin/market"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Full Controls
              </Link>
            </div>

            <div className="space-y-2">
              {marketMaterials.slice(0, 6).map((mat) => (
                <div
                  key={mat.id}
                  className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{mat.name}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{mat.symbol}</span>
                  </div>

                  <div className="text-right">
                    <p className="font-mono font-bold text-slate-900">{formatINR(mat.currentPrice)}</p>
                    <span
                      className={`text-[10px] font-bold ${
                        mat.percentageChange > 0
                          ? 'text-emerald-700'
                          : mat.percentageChange < 0
                          ? 'text-rose-700'
                          : 'text-slate-500'
                      }`}
                    >
                      {mat.percentageChange > 0 ? '↑' : mat.percentageChange < 0 ? '↓' : '→'}{' '}
                      {Math.abs(mat.percentageChange)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200">
              <Link
                href="/admin/market"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded flex items-center justify-center space-x-1.5 transition"
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
