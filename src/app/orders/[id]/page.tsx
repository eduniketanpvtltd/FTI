'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import { generateInvoicePDF } from '@/lib/pdf-generator';
import {
  CheckCircle2,
  Clock,
  Truck,
  Receipt,
  ArrowLeft,
  Building2,
  AlertCircle,
  CreditCard,
  ChevronRight,
} from 'lucide-react';

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#94A3B8]">
          Loading order details...
        </div>
      }
    >
      <OrderDetailContent />
    </Suspense>
  );
}

function OrderDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const isJustAccepted = searchParams?.get('accepted') === 'true';

  const { orders, invoices } = useStore();
  const order = orders.find((o) => o.id === id);
  const invoice = invoices.find((inv) => inv.orderId === id);

  if (!order) {
    return (
      <CustomerLayout>
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <AlertCircle className="w-12 h-12 text-[#E8732A] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Order Not Found</h2>
          <p className="text-xs text-[#94A3B8] mt-1 mb-4">
            The requested order ID does not exist or may have been archived.
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center space-x-1.5 bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-[#F59352]/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Orders</span>
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  const stages = [
    { key: 'order_confirmed', label: 'Order Confirmed', desc: 'Accepted quotation converted to PO' },
    { key: 'payment_received', label: 'Payment Verified', desc: 'Advance RTGS / NEFT confirmed' },
    { key: 'processing', label: 'Processing & Bundling', desc: 'Weighed & bundled at Ludhiana Works' },
    { key: 'dispatched', label: 'Dispatched (In Transit)', desc: 'Loaded on truck with transit insurance' },
    { key: 'delivered', label: 'Delivered', desc: 'Received at customer site' },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'order_confirmed':
      case 'payment_pending':
        return 0;
      case 'payment_received':
        return 1;
      case 'processing':
        return 2;
      case 'dispatched':
      case 'in_transit':
        return 3;
      case 'delivered':
      case 'completed':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIndex = getStageIndex(order.status);

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
            <Link href="/orders" className="hover:text-white transition">
              Orders
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-[#E8732A] font-bold">{order.orderNumber}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-10 h-10 rounded-xl p-1 bg-[#14181F] border border-[#E06924]/50 flex items-center justify-center shrink-0">
                  <img src="/fti-logo.png" alt="FTI Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Purchase Order <span className="text-[#E8732A]">#{order.orderNumber}</span>
                </h1>
                <span className="bg-[#122D21] text-[#4ADE80] text-xs font-bold px-2.5 py-0.5 rounded-lg border border-[#22C55E]/40">
                  {order.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1.5">
                Converted from Quotation #{order.quotationNumber} on {formatIndianDateTime(order.createdAt)}
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              {invoice && (
                <button
                  onClick={() => generateInvoicePDF(invoice)}
                  className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-[#F59352]/50 flex items-center space-x-1.5 shadow-md transition cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Download GST Tax Invoice</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-7">
        {isJustAccepted && (
          <div className="mb-6 p-4 bg-[#14181F] border-2 border-[#22C55E]/60 rounded-2xl shadow-lg flex items-center space-x-3 text-white">
            <div className="p-2.5 bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                Quotation Accepted & Order Confirmed Successfully!
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Your official Tax Invoice #{order.invoiceNumber} has been generated. Material allocation is active at Ludhiana Dispatch Hub.
              </p>
            </div>
          </div>
        )}

        {/* 1. Fulfillment Multi-Step Timeline */}
        <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-6 mb-7 shadow-lg text-white">
          <div className="flex items-center justify-between border-b border-[#222934] pb-3.5 mb-5">
            <div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Order Fulfillment & Dispatch Progress
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Real-time tracking of weighment, bundling, loading, and transit
              </p>
            </div>
            {order.dispatchDate && (
              <span className="text-xs bg-[#251811] text-[#E8732A] font-bold px-3 py-1 rounded-lg border border-[#E06924]/40">
                Dispatched on {formatIndianDate(order.dispatchDate)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {stages.map((stage, idx) => {
              const isCompleted = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <div
                  key={stage.key}
                  className={`p-3.5 rounded-xl border text-xs relative transition ${
                    isCurrent
                      ? 'bg-[#251811] border-2 border-[#E8732A] shadow-md'
                      : isCompleted
                      ? 'bg-[#122D21]/60 border-[#22C55E]/50'
                      : 'bg-[#191F28] border-[#2A3342] opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-[#22C55E] text-[#0B0E11]'
                          : 'bg-[#2A3342] text-[#94A3B8]'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </span>
                    <span className="font-extrabold text-white text-xs">{stage.label}</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-tight">{stage.desc}</p>
                </div>
              );
            })}
          </div>

          {order.trackingNumber && (
            <div className="mt-6 p-4 bg-[#191F28] text-white rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-[#2A3342]">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#251811] text-[#E8732A] border border-[#E06924]/40 rounded-xl">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{order.trackingCarrier}</span>
                    <span className="text-[10px] bg-[#122D21] text-[#4ADE80] font-mono px-2 py-0.5 rounded-md border border-[#22C55E]/40">
                      LIVE TRANSIT
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] font-mono mt-0.5">
                    LR / Docket No: <span className="text-[#E8732A] font-bold">{order.trackingNumber}</span>
                  </p>
                </div>
              </div>

              {order.estimatedDelivery && (
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-[#94A3B8] block uppercase font-bold">
                    Estimated Delivery
                  </span>
                  <span className="text-xs font-bold text-[#4ADE80]">
                    {formatIndianDate(order.estimatedDelivery)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl shadow-lg overflow-hidden text-white">
              <div className="p-5 border-b border-[#222934] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    Order Items ({order.items.length})
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    Agreed specifications locked from Quotation #{order.quotationNumber}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#E8732A] bg-[#251811] px-2.5 py-1 rounded-lg border border-[#E06924]/40">
                  GST Rate: {order.taxRate}%
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0F1319] text-[#94A3B8] font-extrabold border-b border-[#222934] uppercase text-[10px]">
                      <th className="py-2.5 px-4">#</th>
                      <th className="py-2.5 px-4">Material & Grade</th>
                      <th className="py-2.5 px-4">Specifications</th>
                      <th className="py-2.5 px-4">Quantity</th>
                      <th className="py-2.5 px-4 text-right">Unit Rate</th>
                      <th className="py-2.5 px-4 text-right">Line Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2530]">
                    {order.items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#191F28] transition">
                        <td className="py-3 px-4 font-mono font-bold text-[#94A3B8]">{index + 1}</td>
                        <td className="py-3 px-4">
                          <p className="font-extrabold text-white">{item.categoryName}</p>
                          <span className="inline-block mt-0.5 font-mono text-[10px] font-bold text-[#E8732A] bg-[#251811] px-2 py-0.5 rounded-md border border-[#E06924]/40">
                            {item.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5 text-[11px] text-[#CBD5E1]">
                            {Object.entries(item.specifications).map(([k, v]) => (
                              <div key={k}>
                                <span className="text-[#94A3B8] font-medium capitalize">{k}:</span>{' '}
                                <span className="font-bold text-white">{v}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-white">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-white">
                          {formatINR(item.unitPrice)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-black text-[#E8732A]">
                          {formatINR(item.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-[#10141A] p-5 border-t border-[#222934]">
                <div className="max-w-sm ml-auto space-y-2 text-xs">
                  <div className="flex justify-between text-[#CBD5E1] font-medium">
                    <span>Material Subtotal:</span>
                    <span className="font-mono font-bold text-white">
                      {formatINR(order.subtotal)}
                    </span>
                  </div>

                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-[#4ADE80] font-bold">
                      <span>Discount:</span>
                      <span className="font-mono font-bold">
                        - {formatINR(order.discountAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#CBD5E1] font-medium">
                    <span>GST @ {order.taxRate}% (CGST 9% + SGST 9%):</span>
                    <span className="font-mono font-bold text-white">
                      {formatINR(order.taxAmount)}
                    </span>
                  </div>

                  {order.transportationCharges > 0 && (
                    <div className="flex justify-between text-[#CBD5E1] font-medium">
                      <span>Transportation / Freight:</span>
                      <span className="font-mono font-bold text-white">
                        {formatINR(order.transportationCharges)}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#242C38] flex justify-between text-sm font-black text-white">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base text-[#E8732A]">
                      {formatINR(order.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 shadow-lg text-white">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4 text-[#E8732A]" />
                <span>Bank Payment Details for RTGS / NEFT</span>
              </h3>
              <p className="text-xs text-[#94A3B8] mb-3">
                Please remit payments referencing Purchase Order <span className="font-extrabold text-white">#{order.orderNumber}</span>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#10141A] p-4 rounded-xl border border-[#222934] text-xs font-mono">
                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Beneficiary Name</span>
                  <span className="font-bold text-white">FIELDFAST TECH INTERNATIONAL (FTI)</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Bank & Branch</span>
                  <span className="font-bold text-white">State Bank of India, Industrial Area-C, Ludhiana</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Current Account No.</span>
                  <span className="font-bold text-white">3892010049281</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">IFSC Code</span>
                  <span className="font-bold text-[#E8732A]">SBIN0001824</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 shadow-lg text-white">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-[#E8732A]" />
                <span>Billing & Delivery Address</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Company</span>
                  <span className="font-extrabold text-white">{order.customerSnapshot.companyName}</span>
                </div>

                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Buyer Representative</span>
                  <span className="font-bold text-[#CBD5E1]">
                    {order.customerSnapshot.fullName} ({order.customerSnapshot.mobile})
                  </span>
                </div>

                <div className="pt-2.5 border-t border-[#222934]">
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Shipping Address</span>
                  <span className="text-white leading-tight block mt-0.5">
                    {order.shippingAddress.streetAddress}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 shadow-lg text-white">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-[#E8732A]" />
                <span>Order Activity Log</span>
              </h3>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-[#28303E]">
                {order.statusHistory.map((history, idx) => (
                  <div key={idx} className="relative flex items-start space-x-3 pl-4">
                    <div className="absolute left-0 w-4 h-4 rounded-full bg-[#E8732A] border-2 border-[#14181F] -translate-x-1 mt-0.5" />
                    <div>
                      <p className="text-xs font-extrabold text-white capitalize">
                        {history.status.replace(/_/g, ' ')}
                      </p>
                      <p className="text-[10px] text-[#94A3B8]">
                        {formatIndianDateTime(history.changedAt)} • {history.changedBy}
                      </p>
                      {history.note && (
                        <p className="text-[11px] text-[#CBD5E1] mt-0.5 italic">
                          "{history.note}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
