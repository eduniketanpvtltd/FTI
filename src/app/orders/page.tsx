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
  ArrowRight,
  Search,
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
        return <span className="bg-[#76513F] text-[#F1EAE1] text-[11px] font-bold px-2 py-0.5 rounded border border-[#B18A70]">Order Confirmed</span>;
      case 'payment_pending':
        return <span className="bg-[#E5A34B]/20 text-[#49352D] text-[11px] font-bold px-2 py-0.5 rounded border border-[#E5A34B]">Payment Pending</span>;
      case 'payment_received':
        return <span className="bg-[#10B981]/20 text-[#10B981] text-[11px] font-bold px-2 py-0.5 rounded border border-[#10B981]">Payment Received</span>;
      case 'processing':
        return <span className="bg-[#343A3F] text-[#F1EAE1] text-[11px] font-bold px-2 py-0.5 rounded border border-[#737A7F]">Processing & Bundling</span>;
      case 'dispatched':
        return <span className="bg-[#604333] text-[#F1EAE1] text-[11px] font-bold px-2 py-0.5 rounded border border-[#B18A70] animate-pulse">Dispatched (En Route)</span>;
      case 'in_transit':
        return <span className="bg-[#604333] text-[#F1EAE1] text-[11px] font-bold px-2 py-0.5 rounded border border-[#B18A70]">In Transit</span>;
      case 'delivered':
        return <span className="bg-[#10B981] text-[#252A2E] text-[11px] font-black px-2 py-0.5 rounded">Delivered</span>;
      case 'completed':
        return <span className="bg-[#343A3F] text-[#F1EAE1] text-[11px] font-bold px-2 py-0.5 rounded">Completed</span>;
      case 'cancelled':
        return <span className="bg-[#DC6262]/20 text-[#DC6262] text-[11px] font-bold px-2 py-0.5 rounded border border-[#DC6262]">Cancelled</span>;
      default:
        return <span className="bg-[#858C92] text-[#252A2E] text-[11px] font-bold px-2 py-0.5 rounded">{status}</span>;
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return <span className="text-[#10B981] font-bold bg-[#10B981]/20 px-2 py-0.5 rounded border border-[#10B981]/40">Paid in Full</span>;
      case 'partial':
        return <span className="text-[#49352D] font-bold bg-[#E5A34B]/30 px-2 py-0.5 rounded border border-[#E5A34B]">Partially Paid</span>;
      case 'pending':
        return <span className="text-[#49352D] font-bold bg-[#E5A34B]/20 px-2 py-0.5 rounded border border-[#E5A34B]">Payment Awaited</span>;
      case 'refunded':
        return <span className="text-[#252A2E] font-semibold bg-[#858C92] px-2 py-0.5 rounded">Refunded</span>;
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
            <span className="text-[#B18A70] font-bold">My Orders</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F1EAE1]">
                Purchase Orders & Dispatch Tracking
              </h1>
              <p className="text-xs sm:text-sm text-[#A8ADB1] mt-1 leading-relaxed">
                Monitor live fulfillment progress, truck logistics, weighbridge slips, and official GST invoices.
              </p>
            </div>

            <div className="bg-[#343A3F] border border-[#737A7F] px-3 py-1.5 rounded text-xs flex items-center space-x-2 shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span className="text-[#F1EAE1] font-semibold">Kalamboli Transit Insured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters and Search */}
        <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-4 mb-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[#252A2E]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#49352D] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Order ID (e.g. FTI-ORD-2026-0001) or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#A8ADB1] border border-[#737A7F] rounded text-[#252A2E] placeholder-[#49352D] font-medium"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <span className="text-[#252A2E] text-[11px] font-bold shrink-0">Filter:</span>
            {['all', 'order_confirmed', 'processing', 'dispatched', 'delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70] shadow-xs'
                    : 'bg-[#A8ADB1] text-[#252A2E] hover:bg-[#858C92] border border-[#737A7F]'
                }`}
              >
                {st === 'all' ? 'All Orders' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-8">
            <PackageCheck className="w-12 h-12 text-[#49352D] mx-auto mb-3" />
            <h3 className="font-extrabold text-[#252A2E] text-sm">No Orders Found</h3>
            <p className="text-xs text-[#49352D] mt-1 mb-4 font-medium">
              Accepted quotations automatically convert into purchase orders here.
            </p>
            <Link
              href="/quotations"
              className="inline-flex items-center space-x-1.5 bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold px-4 py-2 rounded border border-[#B18A70]"
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
                  className="bg-[#BAC0C5] border border-[#737A7F] hover:border-[#76513F] rounded-lg p-5 shadow-xs transition text-[#252A2E]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#737A7F]/40 pb-3 mb-3">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-bold text-base text-[#252A2E]">
                          {order.orderNumber}
                        </span>
                        {getOrderStatusBadge(order.status)}
                        <span className="text-[11px]">{getPaymentBadge(order.paymentStatus)}</span>
                      </div>
                      <p className="text-xs text-[#49352D] mt-1 font-medium">
                        Placed on {formatIndianDateTime(order.createdAt)} • Ref: {order.quotationNumber}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-[#49352D] block uppercase font-bold">
                        Total Amount
                      </span>
                      <span className="text-base font-black text-[#604333]">
                        {formatINR(order.grandTotal)}
                      </span>
                      <span className="text-[10px] text-[#49352D] block font-medium">
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
                            <span className="text-[11px] font-bold text-[#604333]">
                              {formatINR(it.lineTotal)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dispatch / Tracking Info Pill if Available */}
                  {order.trackingNumber && (
                    <div className="mt-3 p-2.5 bg-[#858C92] border border-[#737A7F] rounded flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-[#252A2E]">
                        <Truck className="w-4 h-4 text-[#76513F]" />
                        <span className="font-bold">{order.trackingCarrier}:</span>
                        <span className="font-mono font-bold">{order.trackingNumber}</span>
                      </div>
                      {order.estimatedDelivery && (
                        <span className="text-[#343A3F] text-[11px] font-medium">
                          Est. Delivery: {formatIndianDate(order.estimatedDelivery)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div className="mt-4 pt-3 border-t border-[#737A7F]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                    <div className="text-[#49352D] font-medium">
                      <span>Destination: </span>
                      <span className="font-bold text-[#252A2E]">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {invoice && (
                        <button
                          onClick={() => generateInvoicePDF(invoice)}
                          className="bg-[#858C92] hover:bg-[#76513F] text-[#252A2E] hover:text-[#F1EAE1] font-bold px-3 py-1.5 rounded border border-[#737A7F] flex items-center space-x-1 transition cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>PDF Invoice</span>
                        </button>
                      )}

                      <Link
                        href={`/orders/${order.id}`}
                        className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] font-bold px-4 py-2 rounded border border-[#B18A70] flex items-center space-x-1.5 transition cursor-pointer"
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
