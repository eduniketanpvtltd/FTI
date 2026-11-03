'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import { generateInvoicePDF } from '@/lib/pdf-generator';
import {
  PackageCheck,
  CheckCircle2,
  Clock,
  Truck,
  Receipt,
  Download,
  ArrowLeft,
  Building2,
  ShieldCheck,
  MapPin,
  AlertCircle,
  CreditCard,
} from 'lucide-react';

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading order details...</div>}>
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
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            The requested order ID does not exist or may have been archived.
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center space-x-1.5 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded"
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
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-6 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-200">Home</Link>
            <span>/</span>
            <Link href="/orders" className="hover:text-slate-200">Orders</Link>
            <span>/</span>
            <span className="text-blue-400 font-semibold">{order.orderNumber}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Purchase Order #{order.orderNumber}
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-emerald-500/30">
                  {order.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Converted from Quotation #{order.quotationNumber} on {formatIndianDateTime(order.createdAt)}
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              {invoice && (
                <button
                  onClick={() => generateInvoicePDF(invoice)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded flex items-center space-x-1.5 shadow transition"
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
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-lg shadow-sm flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 text-white rounded-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-emerald-950">
                Quotation Accepted & Order Confirmed Successfully!
              </h3>
              <p className="text-xs text-emerald-800">
                Your official Tax Invoice #{order.invoiceNumber} has been generated. Material allocation is active at Kalamboli yard.
              </p>
            </div>
          </div>
        )}

        {/* 1. Fulfillment Multi-Step Timeline */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Order Fulfillment & Dispatch Progress
              </h2>
              <p className="text-xs text-slate-500">
                Real-time tracking of weighment, bundling, loading, and transit
              </p>
            </div>
            {order.dispatchDate && (
              <span className="text-xs bg-purple-50 text-purple-800 font-semibold px-2.5 py-1 rounded border border-purple-200">
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
                      ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600'
                      : isCompleted
                      ? 'bg-slate-50 border-emerald-400'
                      : 'bg-slate-50/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">
                      {stage.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    {stage.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Dispatch Logistics Banner */}
          {order.trackingNumber && (
            <div className="mt-6 p-4 bg-slate-900 text-white rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-blue-600 text-white rounded-md">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{order.trackingCarrier}</span>
                    <span className="text-[10px] bg-slate-800 text-blue-400 font-mono px-2 py-0.5 rounded border border-slate-700">
                      LIVE TRANSIT
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    LR / Docket No: <span className="text-white font-bold">{order.trackingNumber}</span>
                  </p>
                </div>
              </div>

              {order.estimatedDelivery && (
                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">
                    Estimated Delivery
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
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
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Order Items ({order.items.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Agreed specifications locked from Quotation #{order.quotationNumber}
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                  GST Rate: {order.taxRate}%
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                      <th className="py-2.5 px-4">#</th>
                      <th className="py-2.5 px-4">Material & Grade</th>
                      <th className="py-2.5 px-4">Specifications</th>
                      <th className="py-2.5 px-4">Quantity</th>
                      <th className="py-2.5 px-4 text-right">Unit Rate</th>
                      <th className="py-2.5 px-4 text-right">Line Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {order.items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono text-slate-400">{index + 1}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{item.categoryName}</p>
                          <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            {item.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5 text-[11px] text-slate-600">
                            {Object.entries(item.specifications).map(([k, v]) => (
                              <div key={k}>
                                <span className="text-slate-400 capitalize">{k}:</span>{' '}
                                <span className="font-medium text-slate-800">{v}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                          {formatINR(item.unitPrice)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {formatINR(item.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Financial Breakdown */}
              <div className="bg-slate-50/80 p-5 border-t border-slate-200">
                <div className="max-w-sm ml-auto space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Material Subtotal:</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {formatINR(order.subtotal)}
                    </span>
                  </div>

                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span className="font-mono font-semibold">
                        - {formatINR(order.discountAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>GST @ {order.taxRate}% (CGST 9% + SGST 9%):</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {formatINR(order.taxAmount)}
                    </span>
                  </div>

                  {order.transportationCharges > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Transportation / Freight:</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {formatINR(order.transportationCharges)}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-300 flex justify-between text-sm font-bold text-slate-900">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base text-blue-700">
                      {formatINR(order.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer Details for Settlement */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Bank Payment Details for RTGS / NEFT</span>
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Please remit payments referencing Purchase Order <span className="font-bold text-slate-900">#{order.orderNumber}</span>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded border border-slate-200 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Beneficiary Name</span>
                  <span className="font-bold text-slate-900">FTI INDUSTRIAL TRADING CORP</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Bank & Branch</span>
                  <span className="font-bold text-slate-900">State Bank of India, Kalamboli</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Current Account No.</span>
                  <span className="font-bold text-slate-900">3892010049281</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">IFSC Code</span>
                  <span className="font-bold text-blue-700">SBIN0001824</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Info & Timeline (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customer Details Box */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Billing & Delivery Address</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Company</span>
                  <span className="font-bold text-slate-900">{order.customerSnapshot.companyName}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Buyer Representative</span>
                  <span className="font-medium text-slate-800">
                    {order.customerSnapshot.fullName} ({order.customerSnapshot.mobile})
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase">Shipping Address</span>
                  <span className="text-slate-700 leading-tight block mt-0.5">
                    {order.shippingAddress.streetAddress}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </span>
                </div>
              </div>
            </div>

            {/* Status History Timeline */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Order Activity Log</span>
              </h3>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-slate-200">
                {order.statusHistory.map((history, idx) => (
                  <div key={idx} className="relative flex items-start space-x-3 pl-4">
                    <div className="absolute left-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xs -translate-x-1 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 capitalize">
                        {history.status.replace(/_/g, ' ')}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatIndianDateTime(history.changedAt)} • {history.changedBy}
                      </p>
                      {history.note && (
                        <p className="text-[11px] text-slate-600 mt-0.5 italic">
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
