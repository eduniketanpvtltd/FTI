'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import { generateQuotationPDF } from '@/lib/pdf-generator';
import {
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Download,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Building2,
  MapPin,
  AlertCircle,
  FileText,
  Truck,
  Layers,
} from 'lucide-react';

export default function QuotationDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading quotation details...</div>}>
      <QuotationDetailContent />
    </React.Suspense>
  );
}

function QuotationDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { quotations, acceptQuotation, rejectQuotation, orders } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const quotation = quotations.find((q) => q.id === id);

  if (!quotation) {
    return (
      <CustomerLayout>
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Quotation Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            The quotation you requested could not be located or may have been archived.
          </p>
          <Link
            href="/quotations"
            className="inline-flex items-center space-x-1.5 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Quotations List</span>
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  // Check if an order already corresponds to this quotation
  const associatedOrder = orders.find((o) => o.quotationId === quotation.id);

  const handleAccept = () => {
    setIsProcessing(true);
    try {
      const orderId = acceptQuotation(quotation.id);
      if (orderId) {
        router.push(`/orders/${orderId}?accepted=true`);
      }
    } catch (err) {
      console.error('Error accepting quotation:', err);
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    rejectQuotation(quotation.id, rejectReason);
    setRejectModalOpen(false);
  };

  const isActionable = quotation.status === 'quotation_sent';

  return (
    <CustomerLayout>
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-6 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-200">Home</Link>
            <span>/</span>
            <Link href="/quotations" className="hover:text-slate-200">My Quotations</Link>
            <span>/</span>
            <span className="text-blue-400 font-semibold">{quotation.quotationNumber}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg p-1 bg-slate-950 border border-slate-700 flex items-center justify-center shrink-0">
                  <img src="/fti-logo.png" alt="FTI Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Quotation #{quotation.quotationNumber}
                </h1>
                <span className="bg-slate-800 text-blue-300 text-xs font-mono font-bold px-2 py-0.5 rounded border border-slate-700">
                  Version {quotation.version}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Requested on {formatIndianDateTime(quotation.createdAt)} • Prepared by FTI Trading Desk
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => generateQuotationPDF(quotation)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3.5 py-2 rounded flex items-center space-x-1.5 transition"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Download PDF Quotation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* If Actionable Alert Banner */}
        {isActionable && (
          <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-500/60 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-emerald-600 text-white rounded-md mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Official Pricing Issued by FTI Trading Desk
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Review the unit prices, freight, and terms below. Click "Accept Quotation" to lock pricing and generate your official Purchase Order.
                </p>
                <p className="text-[11px] font-semibold text-emerald-800 mt-1">
                  Validity: {quotation.validUntil ? formatIndianDate(quotation.validUntil) : '3 Working Days'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setRejectModalOpen(true)}
                className="bg-white hover:bg-slate-100 text-rose-700 border border-rose-300 text-xs font-semibold px-4 py-2 rounded transition"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={isProcessing}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-2 rounded shadow flex items-center space-x-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isProcessing ? 'Converting to Order...' : 'Accept Quotation & Buy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* If Converted to Order Banner */}
        {associatedOrder && (
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600 text-white rounded-md">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Quotation Converted into Purchase Order #{associatedOrder.orderNumber}
                </h4>
                <p className="text-xs text-slate-600">
                  This quotation has been officially locked and accepted. View order status, dispatch tracking, and invoice.
                </p>
              </div>
            </div>

            <Link
              href={`/orders/${associatedOrder.id}`}
              className="bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded shadow transition"
            >
              View Purchase Order
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Line Items & Pricing Breakdown (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Itemized Table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  Quotation Line Items ({quotation.items.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed technical specifications, alloy grades, quantities, and assigned unit prices.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                      <th className="py-2.5 px-4">#</th>
                      <th className="py-2.5 px-4">Material & Grade</th>
                      <th className="py-2.5 px-4">Dimensions / Specs</th>
                      <th className="py-2.5 px-4">Quantity</th>
                      <th className="py-2.5 px-4 text-right">Unit Rate</th>
                      <th className="py-2.5 px-4 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {quotation.items.map((item, index) => (
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
                          {item.specialInstructions && (
                            <p className="mt-1 text-[10px] text-slate-500 italic">
                              Req: {item.specialInstructions}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          {item.unitPrice ? (
                            <span className="font-semibold text-slate-900">
                              {formatINR(item.unitPrice)}
                            </span>
                          ) : (
                            <span className="text-amber-600 font-medium italic">Pending</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                          {item.lineTotal ? (
                            formatINR(item.lineTotal)
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price Breakdown Footer */}
              {quotation.grandTotal ? (
                <div className="bg-slate-50/80 p-5 border-t border-slate-200">
                  <div className="max-w-sm ml-auto space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal (Base Value):</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {formatINR(quotation.subtotal || 0)}
                      </span>
                    </div>

                    {quotation.discountAmount ? (
                      <div className="flex justify-between text-emerald-700">
                        <span>Commercial Discount:</span>
                        <span className="font-mono font-semibold">
                          - {formatINR(quotation.discountAmount)}
                        </span>
                      </div>
                    ) : null}

                    <div className="flex justify-between text-slate-600">
                      <span>Applicable GST ({quotation.taxRate}%):</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {formatINR(quotation.taxAmount || 0)}
                      </span>
                    </div>

                    {quotation.transportationCharges ? (
                      <div className="flex justify-between text-slate-600">
                        <span>Transportation / Freight:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {formatINR(quotation.transportationCharges)}
                        </span>
                      </div>
                    ) : null}

                    <div className="pt-2 border-t border-slate-300 flex justify-between text-sm font-bold text-slate-900">
                      <span>Grand Total:</span>
                      <span className="font-mono text-base text-blue-700">
                        {formatINR(quotation.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50/70 border-t border-amber-200 text-xs text-amber-900 text-center">
                  Quotation request is currently with the pricing desk. You will receive an official notification with prices and freight breakdown shortly.
                </div>
              )}
            </div>

            {/* 2. Terms and Conditions & Notes */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Quotation Terms & Conditions
              </h3>
              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded border border-slate-200 font-mono">
                {quotation.termsAndConditions ||
                  `1. Prices are based on current raw material spot benchmarks and valid for 3 working days.
2. Payment terms: 100% against proforma invoice before dispatch.
3. Test certificate (TC) with heat chemical trace supplied with all prime lots.
4. Weighment at Kalamboli accredited electronic weighbridge is final.`}
              </p>

              {quotation.specialNotes && (
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-slate-700 uppercase">Customer Requirements:</span>
                  <p className="text-xs text-slate-600 mt-0.5">{quotation.specialNotes}</p>
                </div>
              )}

              {quotation.adminNotes && (
                <div className="mt-3 p-2.5 bg-blue-50 border border-blue-200 rounded">
                  <span className="text-[11px] font-bold text-blue-900 uppercase">Trading Desk Remarks:</span>
                  <p className="text-xs text-blue-800 mt-0.5">{quotation.adminNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Customer Info & Status Timeline (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customer Snapshot Box */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Customer & Destination</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Company</span>
                  <span className="font-bold text-slate-900">{quotation.customerSnapshot.companyName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Authorized Contact</span>
                  <span className="font-medium text-slate-800">
                    {quotation.customerSnapshot.fullName} ({quotation.customerSnapshot.mobile})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">GSTIN</span>
                  <span className="font-mono text-slate-800">
                    {quotation.customerSnapshot.gstin || 'Commercial / Not Registered'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase">Delivery Destination</span>
                  <span className="text-slate-700 leading-tight block mt-0.5">
                    {quotation.customerSnapshot.deliveryAddress || 'Kalamboli Ex-Yard Delivery'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status History Timeline */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Status & Audit History</span>
              </h3>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-slate-200">
                {quotation.statusHistory.map((history, idx) => (
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

            {/* Accept Actions Box */}
            {isActionable && (
              <div className="bg-slate-900 text-white rounded-lg p-5 shadow-md">
                <h4 className="font-bold text-sm text-slate-100">Accept Official Quotation</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Locking this quotation immediately converts it into Purchase Order #{quotation.quotationNumber.replace('FTI-QT', 'FTI-ORD')} and generates your official Tax Invoice.
                </p>

                <button
                  onClick={handleAccept}
                  disabled={isProcessing}
                  className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded shadow flex items-center justify-center space-x-2 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing Order...' : 'Accept & Confirm Purchase Order'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Reason Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <h3 className="font-bold text-base text-slate-900 mb-2">Decline Quotation</h3>
            <p className="text-xs text-slate-500 mb-3">
              Please let our trading desk know the reason for declining so we may revise specifications or pricing if possible.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Price higher than current market, requirement postponed, changed specification..."
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
