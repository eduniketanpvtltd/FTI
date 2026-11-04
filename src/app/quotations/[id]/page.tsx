'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import { generateQuotationPDF } from '@/lib/pdf-generator';
import {
  CheckCircle2,
  Download,
  ArrowLeft,
  Clock,
  Building2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export default function QuotationDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-[#252A2E]">Loading quotation details...</div>}>
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
          <AlertCircle className="w-12 h-12 text-[#49352D] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#252A2E]">Quotation Not Found</h2>
          <p className="text-xs text-[#49352D] mt-1 mb-4 font-medium">
            The quotation you requested could not be located or may have been archived.
          </p>
          <Link
            href="/quotations"
            className="inline-flex items-center space-x-1.5 bg-[#76513F] text-[#F1EAE1] text-xs font-bold px-4 py-2 rounded border border-[#B18A70]"
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
      {/* Top Banner - Dark Chocolate Brown */}
      <div className="bg-[#49352D] text-[#F1EAE1] py-6 px-4 sm:px-6 border-b border-[#343A3F]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-[#A8ADB1] mb-2 font-medium">
            <Link href="/" className="hover:text-[#F1EAE1] transition">Home</Link>
            <span>/</span>
            <Link href="/quotations" className="hover:text-[#F1EAE1] transition">My Quotations</Link>
            <span>/</span>
            <span className="text-[#B18A70] font-bold">{quotation.quotationNumber}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg p-1 bg-[#343A3F] border border-[#737A7F] flex items-center justify-center shrink-0">
                  <img src="/fti-logo.png" alt="FTI Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F1EAE1]">
                  Quotation #{quotation.quotationNumber}
                </h1>
                <span className="bg-[#343A3F] text-[#F1EAE1] text-xs font-mono font-bold px-2 py-0.5 rounded border border-[#737A7F]">
                  Version {quotation.version}
                </span>
              </div>
              <p className="text-xs text-[#A8ADB1] mt-1">
                Requested on {formatIndianDateTime(quotation.createdAt)} • Prepared by FTI Trading Desk
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => generateQuotationPDF(quotation)}
                className="bg-[#343A3F] hover:bg-[#604333] text-[#F1EAE1] border border-[#737A7F] text-xs font-bold px-3.5 py-2 rounded flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#B18A70]" />
                <span>Download PDF Quotation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* If Actionable Alert Banner */}
        {isActionable && (
          <div className="mb-6 p-4 bg-[#BAC0C5] border-2 border-[#10B981] rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[#252A2E]">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-[#10B981] text-[#252A2E] rounded-md mt-0.5">
                <CheckCircle2 className="w-5 h-5 font-bold" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#252A2E] text-sm">
                  Official Pricing Issued by FTI Trading Desk
                </h3>
                <p className="text-xs text-[#49352D] mt-0.5 font-medium">
                  Review the unit prices, freight, and terms below. Click "Accept Quotation" to lock pricing and generate your official Purchase Order.
                </p>
                <p className="text-[11px] font-bold text-[#10B981] mt-1">
                  Validity: {quotation.validUntil ? formatIndianDate(quotation.validUntil) : '3 Working Days'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setRejectModalOpen(true)}
                className="bg-[#858C92] hover:bg-[#DC6262] text-[#252A2E] hover:text-[#F1EAE1] border border-[#737A7F] text-xs font-bold px-4 py-2 rounded transition cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={isProcessing}
                className="bg-[#10B981] hover:bg-[#059669] text-[#252A2E] text-xs font-black px-5 py-2 rounded shadow flex items-center space-x-1.5 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isProcessing ? 'Converting to Order...' : 'Accept Quotation & Buy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* If Converted to Order Banner */}
        {associatedOrder && (
          <div className="mb-6 p-4 bg-[#604333] border border-[#76513F] rounded-lg flex items-center justify-between text-[#F1EAE1]">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#76513F] text-[#F1EAE1] border border-[#B18A70] rounded-md">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-[#F1EAE1] text-sm">
                  Quotation Converted into Purchase Order #{associatedOrder.orderNumber}
                </h4>
                <p className="text-xs text-[#A8ADB1]">
                  This quotation has been officially locked and accepted. View order status, dispatch tracking, and invoice.
                </p>
              </div>
            </div>

            <Link
              href={`/orders/${associatedOrder.id}`}
              className="bg-[#76513F] hover:bg-[#B18A70] text-[#F1EAE1] text-xs font-bold px-4 py-2 rounded border border-[#B18A70] shadow transition"
            >
              View Purchase Order
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Line Items & Pricing Breakdown (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Itemized Table */}
            <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg shadow-xs overflow-hidden text-[#252A2E]">
              <div className="p-5 border-b border-[#737A7F]">
                <h3 className="text-sm font-extrabold text-[#252A2E]">
                  Quotation Line Items ({quotation.items.length})
                </h3>
                <p className="text-xs text-[#49352D] font-medium">
                  Detailed technical specifications, alloy grades, quantities, and assigned unit prices.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#858C92] text-[#252A2E] font-extrabold border-b border-[#737A7F] uppercase text-[10px]">
                      <th className="py-2.5 px-4">#</th>
                      <th className="py-2.5 px-4">Material & Grade</th>
                      <th className="py-2.5 px-4">Dimensions / Specs</th>
                      <th className="py-2.5 px-4">Quantity</th>
                      <th className="py-2.5 px-4 text-right">Unit Rate</th>
                      <th className="py-2.5 px-4 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#737A7F]/30">
                    {quotation.items.map((item, index) => (
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
                          {item.specialInstructions && (
                            <p className="mt-1 text-[10px] text-[#49352D] italic font-medium">
                              Req: {item.specialInstructions}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-[#252A2E]">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          {item.unitPrice ? (
                            <span className="font-black text-[#252A2E]">
                              {formatINR(item.unitPrice)}
                            </span>
                          ) : (
                            <span className="text-[#E5A34B] font-bold italic">Pending</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-black text-[#252A2E]">
                          {item.lineTotal ? (
                            formatINR(item.lineTotal)
                          ) : (
                            <span className="text-[#626B72]">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price Breakdown Footer */}
              {quotation.grandTotal ? (
                <div className="bg-[#A8ADB1] p-5 border-t border-[#737A7F]">
                  <div className="max-w-sm ml-auto space-y-2 text-xs">
                    <div className="flex justify-between text-[#252A2E] font-medium">
                      <span>Subtotal (Base Value):</span>
                      <span className="font-mono font-bold text-[#252A2E]">
                        {formatINR(quotation.subtotal || 0)}
                      </span>
                    </div>

                    {quotation.discountAmount ? (
                      <div className="flex justify-between text-[#10B981] font-bold">
                        <span>Commercial Discount:</span>
                        <span className="font-mono font-bold">
                          - {formatINR(quotation.discountAmount)}
                        </span>
                      </div>
                    ) : null}

                    <div className="flex justify-between text-[#252A2E] font-medium">
                      <span>Applicable GST ({quotation.taxRate}%):</span>
                      <span className="font-mono font-bold text-[#252A2E]">
                        {formatINR(quotation.taxAmount || 0)}
                      </span>
                    </div>

                    {quotation.transportationCharges ? (
                      <div className="flex justify-between text-[#252A2E] font-medium">
                        <span>Transportation / Freight:</span>
                        <span className="font-mono font-bold text-[#252A2E]">
                          {formatINR(quotation.transportationCharges)}
                        </span>
                      </div>
                    ) : null}

                    <div className="pt-2 border-t border-[#737A7F] flex justify-between text-sm font-black text-[#252A2E]">
                      <span>Grand Total:</span>
                      <span className="font-mono text-base text-[#604333]">
                        {formatINR(quotation.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#858C92] border-t border-[#737A7F] text-xs text-[#252A2E] text-center font-bold">
                  Quotation request is currently with the pricing desk. You will receive an official notification with prices and freight breakdown shortly.
                </div>
              )}
            </div>

            {/* 2. Terms and Conditions & Notes */}
            <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-5 shadow-xs text-[#252A2E]">
              <h3 className="text-xs font-extrabold text-[#252A2E] uppercase tracking-wider mb-2">
                Quotation Terms & Conditions
              </h3>
              <p className="text-xs text-[#252A2E] whitespace-pre-line leading-relaxed bg-[#A8ADB1] p-3 rounded border border-[#737A7F] font-mono">
                {quotation.termsAndConditions ||
                  `1. Prices are based on current raw material spot benchmarks and valid for 3 working days.
2. Payment terms: 100% against proforma invoice before dispatch.
3. Test certificate (TC) with heat chemical trace supplied with all prime lots.
4. Weighment at Kalamboli accredited electronic weighbridge is final.`}
              </p>

              {quotation.specialNotes && (
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-[#49352D] uppercase">Customer Requirements:</span>
                  <p className="text-xs text-[#252A2E] mt-0.5 font-medium">{quotation.specialNotes}</p>
                </div>
              )}

              {quotation.adminNotes && (
                <div className="mt-3 p-2.5 bg-[#858C92] border border-[#737A7F] rounded">
                  <span className="text-[11px] font-bold text-[#252A2E] uppercase">Trading Desk Remarks:</span>
                  <p className="text-xs text-[#252A2E] mt-0.5 font-medium">{quotation.adminNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Customer Info & Status Timeline (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Customer Snapshot Box */}
            <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-5 shadow-xs text-[#252A2E]">
              <h3 className="text-xs font-extrabold text-[#252A2E] uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-[#76513F]" />
                <span>Customer & Destination</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[#49352D] block text-[10px] uppercase font-bold">Company</span>
                  <span className="font-extrabold text-[#252A2E]">{quotation.customerSnapshot.companyName}</span>
                </div>
                <div>
                  <span className="text-[#49352D] block text-[10px] uppercase font-bold">Authorized Contact</span>
                  <span className="font-semibold text-[#252A2E]">
                    {quotation.customerSnapshot.fullName} ({quotation.customerSnapshot.mobile})
                  </span>
                </div>
                <div>
                  <span className="text-[#49352D] block text-[10px] uppercase font-bold">GSTIN</span>
                  <span className="font-mono text-[#252A2E] font-semibold">
                    {quotation.customerSnapshot.gstin || 'Commercial / Not Registered'}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#737A7F]/40">
                  <span className="text-[#49352D] block text-[10px] uppercase font-bold">Delivery Destination</span>
                  <span className="text-[#252A2E] leading-tight block mt-0.5 font-medium">
                    {quotation.customerSnapshot.deliveryAddress || 'Kalamboli Ex-Yard Delivery'}
                  </span>
                </div>
              </div>
            </div>

            {/* Status History Timeline */}
            <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-5 shadow-xs text-[#252A2E]">
              <h3 className="text-xs font-extrabold text-[#252A2E] uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-[#76513F]" />
                <span>Status & Audit History</span>
              </h3>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-[#737A7F]">
                {quotation.statusHistory.map((history, idx) => (
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

            {/* Accept Actions Box */}
            {isActionable && (
              <div className="bg-[#49352D] text-[#F1EAE1] rounded-lg p-5 shadow-md border border-[#343A3F]">
                <h4 className="font-extrabold text-sm text-[#F1EAE1]">Accept Official Quotation</h4>
                <p className="text-xs text-[#A8ADB1] mt-1 leading-relaxed">
                  Locking this quotation immediately converts it into Purchase Order #{quotation.quotationNumber.replace('FTI-QT', 'FTI-ORD')} and generates your official Tax Invoice.
                </p>

                <button
                  onClick={handleAccept}
                  disabled={isProcessing}
                  className="mt-4 w-full bg-[#10B981] hover:bg-[#059669] text-[#252A2E] text-xs font-black py-2.5 px-4 rounded shadow flex items-center justify-center space-x-2 transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-[#252A2E]/80 flex items-center justify-center p-4">
          <div className="bg-[#BAC0C5] rounded-lg max-w-md w-full p-6 shadow-2xl border-2 border-[#737A7F] text-[#252A2E]">
            <h3 className="font-extrabold text-base text-[#252A2E] mb-2">Decline Quotation</h3>
            <p className="text-xs text-[#49352D] mb-3 font-medium">
              Please let our trading desk know the reason for declining so we may revise specifications or pricing if possible.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Price higher than current market, requirement postponed, changed specification..."
              className="w-full text-xs bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] mb-4 font-medium"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="bg-[#858C92] text-[#252A2E] text-xs font-bold px-4 py-2 rounded border border-[#737A7F] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-[#DC6262] hover:bg-[#DC6262]/80 text-[#F1EAE1] text-xs font-bold px-4 py-2 rounded transition cursor-pointer"
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
