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
} from 'lucide-react';

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#252A2E]">Loading order details...</div>}>
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
          <AlertCircle className="w-12 h-12 text-[#49352D] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#252A2E]">Order Not Found</h2>
          <p className="text-xs text-[#49352D] mt-1 mb-4 font-medium">
            The requested order ID does not exist or may have been archived.
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center space-x-1.5 bg-[#76513F] text-[#F1EAE1] text-xs font-bold px-4 py-2 rounded border border-[#B18A70]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Orders</span>
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  // Define 5-step fulfillment timeline
  const stages = [
    { key: 'order_confirmed', label: 'Order Confirmed', desc: 'Accepted quotation converted to PO' },
    { key: 'payment_received', label: 'Payment Verified', desc: 'Advance RTGS / NEFT confirmed' },
    { key: 'processing', label: 'Processing & Bundling', desc: 'Weighed & bundled at Kalamboli yard' },
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
      {/* Top Banner - Dark Chocolate Brown */}
      <div className="bg-[#49352D] text-[#F1EAE1] py-6 px-4 sm:px-6 border-b border-[#343A3F]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-[#A8ADB1] mb-2 font-medium">
            <Link href="/" className="hover:text-[#F1EAE1] transition">Home</Link>
            <span>/</span>
            <Link href="/orders" className="hover:text-[#F1EAE1] transition">Orders</Link>
            <span>/</span>
            <span className="text-[#B18A70] font-bold">{order.orderNumber}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg p-1 bg-[#343A3F] border border-[#737A7F] flex items-center justify-center shrink-0">
                  <img src="/fti-logo.png" alt="FTI Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F1EAE1]">
                  Purchase Order #{order.orderNumber}
                </h1>
                <span className="bg-[#10B981]/20 text-[#10B981] text-xs font-bold px-2.5 py-0.5 rounded border border-[#10B981]/40">
                  {order.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#A8ADB1] mt-1 font-medium">
                Converted from Quotation #{order.quotationNumber} on {formatIndianDateTime(order.createdAt)}
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              {invoice && (
                <button
                  onClick={() => generateInvoicePDF(invoice)}
                  className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold px-4 py-2 rounded border border-[#B18A70] flex items-center space-x-1.5 shadow transition cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Download GST Tax Invoice</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Just Accepted Celebration Banner */}
        {isJustAccepted && (
          <div className="mb-6 p-4 bg-[#BAC0C5] border-2 border-[#10B981] rounded-lg shadow-sm flex items-center space-x-3 text-[#252A2E]">
            <div className="p-2 bg-[#10B981] text-[#252A2E] rounded-md font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#252A2E]">
                Quotation Accepted & Order Confirmed Successfully!
              </h3>
              <p className="text-xs text-[#49352D] font-medium">
                Your official Tax Invoice #{order.invoiceNumber} has been generated. Material allocation is active at Kalamboli yard.
              </p>
            </div>
          </div>
        )}

        {/* 1. Fulfillment Multi-Step Timeline */}
        <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-6 mb-8 shadow-xs text-[#252A2E]">
          <div className="flex items-center justify-between border-b border-[#737A7F] pb-3 mb-6">
            <div>
              <h2 className="text-sm font-extrabold text-[#252A2E] uppercase tracking-wider">
                Order Fulfillment & Dispatch Progress
              </h2>
              <p className="text-xs text-[#49352D] font-medium">
                Real-time tracking of weighment, bundling, loading, and transit
              </p>
            </div>
            {order.dispatchDate && (
              <span className="text-xs bg-[#76513F] text-[#F1EAE1] font-bold px-2.5 py-1 rounded border border-[#B18A70]">
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
                  className={`p-3 rounded border text-xs relative transition ${
                    isCurrent
                      ? 'bg-[#A8ADB1] border-2 border-[#76513F] ring-1 ring-[#76513F] shadow-xs'
                      : isCompleted
                      ? 'bg-[#858C92] border-[#10B981]'
                      : 'bg-[#A8ADB1]/60 border-[#737A7F] opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-[#10B981] text-[#252A2E]'
                          : 'bg-[#737A7F] text-[#F1EAE1]'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </span>
                    <span className="font-extrabold text-[#252A2E] text-xs">
                      {stage.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#343A3F] leading-tight font-medium">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Dispatch Logistics Banner */}
          {order.trackingNumber && (
            <div className="mt-6 p-4 bg-[#49352D] text-[#F1EAE1] rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-[#343A3F]">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-[#76513F] text-[#F1EAE1] border border-[#B18A70] rounded-md">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#F1EAE1]">{order.trackingCarrier}</span>
                    <span className="text-[10px] bg-[#343A3F] text-[#10B981] font-mono px-2 py-0.5 rounded border border-[#737A7F]">
                      LIVE TRANSIT
                    </span>
                  </div>
                  <p className="text-xs text-[#A8ADB1] font-mono mt-0.5">
                    LR / Docket No: <span className="text-[#F1EAE1] font-bold">{order.trackingNumber}</span>
                  </p>
                </div>
              </div>

              {order.estimatedDelivery && (
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-[#A8ADB1] block uppercase font-bold">
                    Estimated Delivery
                  </span>
                  <span className="text-xs font-bold text-[#10B981]">
                    {formatIndianDate(order.estimatedDelivery)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Itemized Order List & Billing Breakdown (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg shadow-xs overflow-hidden text-[#252A2E]">
              <div className="p-5 border-b border-[#737A7F] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#252A2E]">
                    Order Items ({order.items.length})
                  </h3>
                  <p className="text-xs text-[#49352D] font-medium">
                    Agreed specifications locked from Quotation #{order.quotationNumber}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#252A2E] bg-[#858C92] px-2.5 py-1 rounded border border-[#737A7F]">
                  GST Rate: {order.taxRate}%
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#858C92] text-[#252A2E] font-extrabold border-b border-[#737A7F] uppercase text-[10px]">
                      <th className="py-2.5 px-4">#</th>
                      <th className="py-2.5 px-4">Material & Grade</th>
                      <th className="py-2.5 px-4">Specifications</th>
                      <th className="py-2.5 px-4">Quantity</th>
                      <th className="py-2.5 px-4 text-right">Unit Rate</th>
                      <th className="py-2.5 px-4 text-right">Line Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#737A7F]/30">
                    {order.items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#C7CBD0] transition">
                        <td className="py-3 px-4 font-mono font-bold text-[#49352D]">{index + 1}</td>
                        <td className="py-3 px-4">
                          <p className="font-extrabold text-[#252A2E]">{item.categoryName}</p>
                          <span className="font-mono text-[11px] font-bold text-[#F1EAE1] bg-[#76513F] px-1.5 py-0.2 rounded border border-[#B18A70]">
                            {item.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5 text-[11px] text-[#252A2E]">
                            {Object.entries(item.specifications).map(([k, v]) => (
                              <div key={k}>
                                <span className="text-[#49352D] font-medium capitalize">{k}:</span>{' '}
                                <span className="font-bold text-[#252A2E]">{v}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-[#252A2E]">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#252A2E]">
                          {formatINR(item.unitPrice)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-black text-[#252A2E]">
                          {formatINR(item.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Financial Breakdown */}
              <div className="bg-[#A8ADB1] p-5 border-t border-[#737A7F]">
                <div className="max-w-sm ml-auto space-y-2 text-xs">
                  <div className="flex justify-between text-[#252A2E] font-medium">
                    <span>Material Subtotal:</span>
                    <span className="font-mono font-bold text-[#252A2E]">
                      {formatINR(order.subtotal)}
                    </span>
                  </div>

                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-[#10B981] font-bold">
                      <span>Discount:</span>
                      <span className="font-mono font-bold">
                        - {formatINR(order.discountAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#252A2E] font-medium">
                    <span>GST @ {order.taxRate}% (CGST 9% + SGST 9%):</span>
                    <span className="font-mono font-bold text-[#252A2E]">
                      {formatINR(order.taxAmount)}
                    </span>
                  </div>

                  {order.transportationCharges > 0 && (
                    <div className="flex justify-between text-[#252A2E] font-medium">
                      <span>Transportation / Freight:</span>
                      <span className="font-mono font-bold text-[#252A2E]">
                        {formatINR(order.transportationCharges)}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#737A7F] flex justify-between text-sm font-black text-[#252A2E]">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base text-[#604333]">
                      {formatINR(order.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer Details for Settlement */}
            <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-5 shadow-xs text-[#252A2E]">
              <h3 className="text-xs font-extrabold text-[#252A2E] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4 text-[#76513F]" />
                <span>Bank Payment Details for RTGS / NEFT</span>
              </h3>
              <p className="text-xs text-[#49352D] mb-3 font-medium">
                Please remit payments referencing Purchase Order <span className="font-extrabold text-[#252A2E]">#{order.orderNumber}</span>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#A8ADB1] p-4 rounded border border-[#737A7F] text-xs font-mono">
                <div>
                  <span className="text-[#49352D] block text-[10px] uppercase font-bold">Beneficiary Name</span>
                  <span className="font-bold text-[#252A2E]">FIELDFAST TECH INTERNATIONAL (FTI)</span>
                </div>
                <div>
                  <span className="text-[#49352D] block text-[10px] uppercase font-bold">Bank & Branch</span>
                  <span className="font-bold text-[#252A2E]">State Bank of India, Kalamboli</span>
                </div>
                <div>
                  <span className="text-[#49352D] block text-[10px] uppercase font-bold">Current Account No.</span>
                  <span className="font-bold text-[#252A2E]">3892010049281</span>
                </div>
                <div>
                  <span className="text-[#49352D] block text-[10px] uppercase font-bold">IFSC Code</span>
                  <span className="font-bold text-[#604333]">SBIN0001824</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Info & Timeline (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customer Details Box */}
            <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-5 shadow-xs text-[#252A2E]">
              <h3 className="text-xs font-extrabold text-[#252A2E] uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-[#76513F]" />
                <span>Billing & Delivery Address</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#49352D] block text-[10px] uppercase font-bold">Company</span>
                  <span className="font-extrabold text-[#252A2E]">{order.customerSnapshot.companyName}</span>
                </div>

                <div>
                  <span className="text-[#49352D] block text-[10px] uppercase font-bold">Buyer Representative</span>
                  <span className="font-bold text-[#252A2E]">
                    {order.customerSnapshot.fullName} ({order.customerSnapshot.mobile})
                  </span>
                </div>

                <div className="pt-2 border-t border-[#737A7F]/40">
                  <span className="text-[#49352D] block text-[10px] uppercase font-bold">Shipping Address</span>
                  <span className="text-[#252A2E] leading-tight block mt-0.5 font-medium">
                    {order.shippingAddress.streetAddress}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </span>
                </div>
              </div>
            </div>

            {/* Status History Timeline */}
            <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-5 shadow-xs text-[#252A2E]">
              <h3 className="text-xs font-extrabold text-[#252A2E] uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-[#76513F]" />
                <span>Order Activity Log</span>
              </h3>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-[#737A7F]">
                {order.statusHistory.map((history, idx) => (
                  <div key={idx} className="relative flex items-start space-x-3 pl-4">
                    <div className="absolute left-0 w-4 h-4 rounded-full bg-[#76513F] border-2 border-[#BAC0C5] shadow-xs -translate-x-1 mt-0.5" />
                    <div>
                      <p className="text-xs font-extrabold text-[#252A2E] capitalize">
                        {history.status.replace(/_/g, ' ')}
                      </p>
                      <p className="text-[10px] text-[#49352D] font-medium">
                        {formatIndianDateTime(history.changedAt)} • {history.changedBy}
                      </p>
                      {history.note && (
                        <p className="text-[11px] text-[#343A3F] mt-0.5 italic">
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
