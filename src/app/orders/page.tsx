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
  ChevronRight,
  Lock,
} from 'lucide-react';

export default function OrdersListPage() {
  const { orders: allOrders, invoices, isAuthenticated, currentUser } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders =
    currentUser.role !== 'customer'
      ? allOrders
      : allOrders.filter((o) => o.userId === currentUser.id);

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
        return (
          <span className="bg-[#251811] text-[#E8732A] text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-[#E06924]/40">
            Order Confirmed
          </span>
        );
      case 'payment_pending':
        return (
          <span className="bg-[#332114] text-[#E58A3C] text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-[#C86D28]/50">
            Payment Pending
          </span>
        );
      case 'payment_received':
        return (
          <span className="bg-[#122D21] text-[#4ADE80] text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-[#22C55E]/40">
            Payment Received
          </span>
        );
      case 'processing':
        return (
          <span className="bg-[#1C222C] text-[#CBD5E1] text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-[#2E3746]">
            Processing & Bundling
          </span>
        );
      case 'dispatched':
        return (
          <span className="bg-[#251811] text-[#E8732A] text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-[#E06924]/50 animate-pulse">
            Dispatched (En Route)
          </span>
        );
      case 'in_transit':
        return (
          <span className="bg-[#251811] text-[#E8732A] text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-[#E06924]/50">
            In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="bg-[#122D21] text-[#4ADE80] text-[11px] font-black px-2.5 py-0.5 rounded-lg border border-[#22C55E]/40">
            Delivered
          </span>
        );
      case 'completed':
        return (
          <span className="bg-[#1C222C] text-[#E2E8F0] text-[11px] font-bold px-2.5 py-0.5 rounded-lg">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-[#2F1619] text-[#F87171] text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-[#EF4444]/40">
            Cancelled
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

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="text-[#4ADE80] font-bold bg-[#122D21] px-2.5 py-0.5 rounded-lg border border-[#22C55E]/40">
            Paid in Full
          </span>
        );
      case 'partial':
        return (
          <span className="text-[#E58A3C] font-bold bg-[#332114] px-2.5 py-0.5 rounded-lg border border-[#C86D28]/50">
            Partially Paid
          </span>
        );
      case 'pending':
        return (
          <span className="text-[#E58A3C] font-bold bg-[#332114] px-2.5 py-0.5 rounded-lg border border-[#C86D28]/50">
            Payment Awaited
          </span>
        );
      case 'refunded':
        return (
          <span className="text-[#CBD5E1] font-semibold bg-[#1C222C] px-2.5 py-0.5 rounded-lg">
            Refunded
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
            <span className="text-[#E8732A] font-bold">My Orders</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Purchase Orders & <span className="text-[#E8732A]">Dispatch Tracking</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 leading-relaxed max-w-2xl">
                Monitor live fulfillment progress, truck logistics, weighbridge slips, and official GST invoices.
              </p>
            </div>

            <div className="bg-[#14181F] border border-[#2A323E] px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
              <span className="text-white font-bold">Ludhiana Transit Insured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-7">
        {/* Filters and Search */}
        <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-4 mb-6 shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Order ID (e.g. FTI-ORD-2026-0001) or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white placeholder-[#64748B] font-medium"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 md:pb-0 text-xs">
            <span className="text-white text-xs font-bold shrink-0">Filter:</span>
            {['all', 'order_confirmed', 'processing', 'dispatched', 'delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                  statusFilter === st
                    ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 shadow-[0_2px_10px_rgba(224,105,36,0.3)]'
                    : 'bg-[#191F28] text-[#CBD5E1] hover:bg-[#222936] border border-[#2A3342]'
                }`}
              >
                {st === 'all' ? 'All Orders' : st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {!isAuthenticated ? (
          <div className="text-center py-16 bg-[#14181F] border border-[#28303E] rounded-2xl p-8 max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#251811] border border-[#E06924]/40 text-[#E8732A] flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-white text-base">Sign In to Track Purchase Orders & Dispatches</h3>
            <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
              Sign in with Google to view your confirmed purchase orders, live dispatch logistics, weighbridge slips, and downloadable GST invoices.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login?redirect=/orders"
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
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-[#14181F] border border-[#28303E] rounded-2xl p-8">
            <PackageCheck className="w-12 h-12 text-[#E8732A] mx-auto mb-3" />
            <h3 className="font-extrabold text-white text-sm">No Orders Found</h3>
            <p className="text-xs text-[#94A3B8] mt-1 mb-4">
              Accepted quotations automatically convert into purchase orders here.
            </p>
            <Link
              href="/quotations"
              className="inline-flex items-center space-x-1.5 bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-5 py-2.5 rounded-xl border border-[#F59352]/50"
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
                  className="bg-[#14181F] border border-[#28303E] hover:border-[#E06924] rounded-2xl p-5 shadow-lg transition text-white"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#222934] pb-3.5 mb-3.5">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono font-extrabold text-base text-white">
                          {order.orderNumber}
                        </span>
                        {getOrderStatusBadge(order.status)}
                        <span className="text-[11px]">{getPaymentBadge(order.paymentStatus)}</span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        Placed on {formatIndianDateTime(order.createdAt)} • Ref: {order.quotationNumber}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-[#94A3B8] block uppercase font-bold">
                        Total Amount
                      </span>
                      <span className="text-lg font-black text-[#E8732A] font-mono">
                        {formatINR(order.grandTotal)}
                      </span>
                      <span className="text-[10px] text-[#64748B] block">
                        (Incl. GST & Transportation)
                      </span>
                    </div>
                  </div>

                  <div className="py-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                      {order.items.map((it, idx) => (
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
                            <span className="text-[11px] font-bold text-[#E8732A] font-mono">
                              {formatINR(it.lineTotal)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-3 p-3 bg-[#191F28] border border-[#2A3342] rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 text-white">
                        <Truck className="w-4 h-4 text-[#E8732A]" />
                        <span className="font-bold">{order.trackingCarrier}:</span>
                        <span className="font-mono font-bold text-[#E8732A]">{order.trackingNumber}</span>
                      </div>
                      {order.estimatedDelivery && (
                        <span className="text-[#94A3B8] text-[11px]">
                          Est. Delivery: {formatIndianDate(order.estimatedDelivery)}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-3.5 border-t border-[#222934] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                    <div className="text-[#94A3B8]">
                      <span>Destination: </span>
                      <span className="font-bold text-white">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      {invoice && (
                        <button
                          onClick={() => generateInvoicePDF(invoice)}
                          className="bg-[#191F28] hover:bg-[#222936] text-white font-bold px-3.5 py-2 rounded-xl border border-[#2E3746] flex items-center space-x-1.5 transition cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5 text-[#E8732A]" />
                          <span>PDF Invoice</span>
                        </button>
                      )}

                      <Link
                        href={`/orders/${order.id}`}
                        className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white font-bold px-4 py-2 rounded-xl border border-[#F59352]/50 flex items-center space-x-1.5 transition cursor-pointer shadow-md"
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
