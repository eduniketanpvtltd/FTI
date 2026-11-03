'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import { generateInvoicePDF } from '@/lib/pdf-generator';
import { OrderStatus, PaymentStatus } from '@/types';
import {
  PackageCheck,
  Truck,
  Receipt,
  Download,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export default function OrdersListPage() {
  const { orders, invoices } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.some((i) => i.categoryName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'order_confirmed':
        return <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded border border-blue-200">Order Confirmed</span>;
      case 'payment_pending':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded border border-amber-200">Payment Pending</span>;
      case 'payment_received':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200">Payment Received</span>;
      case 'processing':
        return <span className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2 py-0.5 rounded border border-indigo-200">Processing & Bundling</span>;
      case 'dispatched':
        return <span className="bg-purple-100 text-purple-900 text-[11px] font-bold px-2 py-0.5 rounded border border-purple-300 animate-pulse">Dispatched (En Route)</span>;
      case 'in_transit':
        return <span className="bg-purple-100 text-purple-900 text-[11px] font-bold px-2 py-0.5 rounded border border-purple-300">In Transit</span>;
      case 'delivered':
        return <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">Delivered</span>;
      case 'completed':
        return <span className="bg-slate-800 text-white text-[11px] font-bold px-2 py-0.5 rounded">Completed</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded">Cancelled</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded">{status}</span>;
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Paid in Full</span>;
      case 'partial':
        return <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Partially Paid</span>;
      case 'pending':
        return <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Payment Awaited</span>;
      case 'refunded':
        return <span className="text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded">Refunded</span>;
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
            <span className="text-blue-400 font-semibold">My Orders</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Purchase Orders & Dispatch Tracking
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Monitor live fulfillment progress, truck logistics, weighbridge slips, and official GST invoices.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded text-xs flex items-center space-x-2 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">Kalamboli Transit Insured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters and Search */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Order ID (e.g. FTI-ORD-2026-0001) or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <span className="text-slate-500 text-[11px] font-semibold shrink-0">Filter:</span>
            {['all', 'order_confirmed', 'processing', 'dispatched', 'delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition shrink-0 ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'All Orders' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-lg p-8">
            <PackageCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-sm">No Orders Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Accepted quotations automatically convert into purchase orders here.
            </p>
            <Link
              href="/quotations"
              className="inline-flex items-center space-x-1.5 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded"
            >
              <span>View Quotations</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const invoice = invoices.find((inv) => inv.orderId === order.id);
              return (
                <div
                  key={order.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-5 shadow-xs hover:shadow transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-base text-slate-900">
                          {order.orderNumber}
                        </span>
                        {getOrderStatusBadge(order.status)}
                        <span className="text-[11px]">{getPaymentBadge(order.paymentStatus)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Placed on {formatIndianDateTime(order.createdAt)} • Ref: {order.quotationNumber}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">
                        Total Amount
                      </span>
                      <span className="text-base font-extrabold text-blue-700">
                        {formatINR(order.grandTotal)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        (Incl. GST & Transportation)
                      </span>
                    </div>
                  </div>

                  {/* Items Summary in Order */}
                  <div className="py-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {order.items.map((it, idx) => (
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
                            <span className="text-[11px] font-semibold text-blue-700">
                              {formatINR(it.lineTotal)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dispatch / Tracking Info Pill if Available */}
                  {order.trackingNumber && (
                    <div className="mt-3 p-2.5 bg-blue-50/70 border border-blue-200 rounded flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-blue-900">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold">{order.trackingCarrier}:</span>
                        <span className="font-mono">{order.trackingNumber}</span>
                      </div>
                      {order.estimatedDelivery && (
                        <span className="text-slate-600 text-[11px]">
                          Est. Delivery: {formatIndianDate(order.estimatedDelivery)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                    <div className="text-slate-500">
                      <span>Destination: </span>
                      <span className="font-medium text-slate-700">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {invoice && (
                        <button
                          onClick={() => generateInvoicePDF(invoice)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded border border-slate-300 flex items-center space-x-1 transition"
                        >
                          <Receipt className="w-3.5 h-3.5 text-blue-600" />
                          <span>PDF Invoice</span>
                        </button>
                      )}

                      <Link
                        href={`/orders/${order.id}`}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded flex items-center space-x-1.5 transition"
                      >
                        <span>Track Order Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
