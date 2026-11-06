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
  ChevronRight,
} from 'lucide-react';

export default function QuotationDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#94A3B8]">
          Loading quotation details...
        </div>
      }
    >
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
          <AlertCircle className="w-12 h-12 text-[#E8732A] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Quotation Not Found</h2>
          <p className="text-xs text-[#94A3B8] mt-1 mb-4">
            The quotation you requested could not be located or may have been archived.
          </p>
          <Link
            href="/quotations"
            className="inline-flex items-center space-x-1.5 bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-[#F59352]/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Quotations List</span>
          </Link>
        </div>
      </CustomerLayout>
    );
  }

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
            <Link href="/quotations" className="hover:text-white transition">
              My Quotations
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-[#E8732A] font-bold">{quotation.quotationNumber}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-10 h-10 rounded-xl p-1 bg-[#14181F] border border-[#E06924]/50 flex items-center justify-center shrink-0">
                  <img src="/fti-logo.png" alt="FTI Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  Quotation <span className="text-[#E8732A]">#{quotation.quotationNumber}</span>
                </h1>
                <span className="bg-[#251811] text-[#E8732A] text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg border border-[#E06924]/40">
                  Version {quotation.version}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-1.5">
                Requested on {formatIndianDateTime(quotation.createdAt)} • Prepared by FTI Trading Desk
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => generateQuotationPDF(quotation)}
                className="bg-[#14181F] hover:bg-[#1C222C] text-white border border-[#2C3545] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#E8732A]" />
                <span>Download PDF Quotation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-7">
        {isActionable && (
          <div className="mb-6 p-4 bg-[#14181F] border-2 border-[#22C55E]/60 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-white">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40 rounded-xl mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">
                  Official Pricing Issued by FTI Trading Desk
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Review the unit prices, freight, and terms below. Click "Accept Quotation" to lock pricing and generate your official Purchase Order.
                </p>
                <p className="text-[11px] font-bold text-[#4ADE80] mt-1">
                  Validity: {quotation.validUntil ? formatIndianDate(quotation.validUntil) : '3 Working Days'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setRejectModalOpen(true)}
                className="bg-[#191F28] hover:bg-[#2F1619] text-[#CBD5E1] hover:text-[#F87171] border border-[#2A3342] text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={isProcessing}
                className="bg-gradient-to-b from-[#22C55E] to-[#16A34A] text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-md flex items-center space-x-1.5 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isProcessing ? 'Converting to Order...' : 'Accept Quotation & Buy'}</span>
              </button>
            </div>
          </div>
        )}

        {associatedOrder && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#251811] to-[#14181F] border border-[#E06924]/50 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#251811] text-[#E8732A] border border-[#E06924]/40 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  Quotation Converted into Purchase Order #{associatedOrder.orderNumber}
                </h4>
                <p className="text-xs text-[#94A3B8]">
                  This quotation has been officially locked and accepted. View order status, dispatch tracking, and invoice.
                </p>
              </div>
            </div>

            <Link
              href={`/orders/${associatedOrder.id}`}
              className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-[#F59352]/50 shadow-md transition self-start sm:self-auto"
            >
              View Purchase Order
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl shadow-lg overflow-hidden text-white">
              <div className="p-5 border-b border-[#222934]">
                <h3 className="text-sm font-extrabold text-white">
                  Quotation Line Items ({quotation.items.length})
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Detailed technical specifications, alloy grades, quantities, and assigned unit prices.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0F1319] text-[#94A3B8] font-extrabold border-b border-[#222934] uppercase text-[10px]">
                      <th className="py-2.5 px-4">#</th>
                      <th className="py-2.5 px-4">Material & Grade</th>
                      <th className="py-2.5 px-4">Dimensions / Specs</th>
                      <th className="py-2.5 px-4">Quantity</th>
                      <th className="py-2.5 px-4 text-right">Unit Rate</th>
                      <th className="py-2.5 px-4 text-right">Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2530]">
                    {quotation.items.map((item, index) => (
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
                          {item.specialInstructions && (
                            <p className="mt-1 text-[10px] text-[#E8732A] italic">
                              Req: {item.specialInstructions}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-white">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          {item.unitPrice ? (
                            <span className="font-black text-white">{formatINR(item.unitPrice)}</span>
                          ) : (
                            <span className="text-[#E58A3C] font-bold italic">Pending</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-black text-[#E8732A]">
                          {item.lineTotal ? formatINR(item.lineTotal) : <span className="text-[#64748B]">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {quotation.grandTotal ? (
                <div className="bg-[#10141A] p-5 border-t border-[#222934]">
                  <div className="max-w-sm ml-auto space-y-2 text-xs">
                    <div className="flex justify-between text-[#CBD5E1] font-medium">
                      <span>Subtotal (Base Value):</span>
                      <span className="font-mono font-bold text-white">
                        {formatINR(quotation.subtotal || 0)}
                      </span>
                    </div>

                    {quotation.discountAmount ? (
                      <div className="flex justify-between text-[#4ADE80] font-bold">
                        <span>Commercial Discount:</span>
                        <span className="font-mono font-bold">
                          - {formatINR(quotation.discountAmount)}
                        </span>
                      </div>
                    ) : null}

                    <div className="flex justify-between text-[#CBD5E1] font-medium">
                      <span>Applicable GST ({quotation.taxRate}%):</span>
                      <span className="font-mono font-bold text-white">
                        {formatINR(quotation.taxAmount || 0)}
                      </span>
                    </div>

                    {quotation.transportationCharges ? (
                      <div className="flex justify-between text-[#CBD5E1] font-medium">
                        <span>Transportation / Freight:</span>
                        <span className="font-mono font-bold text-white">
                          {formatINR(quotation.transportationCharges)}
                        </span>
                      </div>
                    ) : null}

                    <div className="pt-2 border-t border-[#242C38] flex justify-between text-sm font-black text-white">
                      <span>Grand Total:</span>
                      <span className="font-mono text-base text-[#E8732A]">
                        {formatINR(quotation.grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#191F28] border-t border-[#222934] text-xs text-[#CBD5E1] text-center font-bold">
                  Quotation request is currently with the pricing desk. You will receive an official notification with prices and freight breakdown shortly.
                </div>
              )}
            </div>

            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 shadow-lg text-white">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2">
                Quotation Terms & Conditions
              </h3>
              <p className="text-xs text-[#CBD5E1] whitespace-pre-line leading-relaxed bg-[#10141A] p-3.5 rounded-xl border border-[#222934] font-mono">
                {quotation.termsAndConditions ||
                  `1. Prices are based on current raw material spot benchmarks and valid for 3 working days.
2. Payment terms: 100% against proforma invoice before dispatch.
3. Test certificate (TC) with heat chemical trace supplied with all prime lots.
4. Weighment at Ludhiana accredited electronic weighbridge is final.`}
              </p>

              {quotation.specialNotes && (
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-[#E8732A] uppercase">Customer Requirements:</span>
                  <p className="text-xs text-white mt-0.5">{quotation.specialNotes}</p>
                </div>
              )}

              {quotation.adminNotes && (
                <div className="mt-3 p-3 bg-[#191F28] border border-[#2A3342] rounded-xl">
                  <span className="text-[11px] font-bold text-[#E8732A] uppercase">Trading Desk Remarks:</span>
                  <p className="text-xs text-white mt-0.5">{quotation.adminNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 shadow-lg text-white">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-[#E8732A]" />
                <span>Customer & Destination</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Company</span>
                  <span className="font-extrabold text-white">{quotation.customerSnapshot.companyName}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Authorized Contact</span>
                  <span className="font-semibold text-[#CBD5E1]">
                    {quotation.customerSnapshot.fullName} ({quotation.customerSnapshot.mobile})
                  </span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">GSTIN</span>
                  <span className="font-mono text-[#E8732A] font-semibold">
                    {quotation.customerSnapshot.gstin || 'Commercial / Not Registered'}
                  </span>
                </div>
                <div className="pt-2.5 border-t border-[#222934]">
                  <span className="text-[#94A3B8] block text-[10px] uppercase font-bold">Delivery Destination</span>
                  <span className="text-white leading-tight block mt-0.5">
                    {quotation.customerSnapshot.deliveryAddress || 'Ludhiana Ex-Works Delivery'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 shadow-lg text-white">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-[#E8732A]" />
                <span>Status & Audit History</span>
              </h3>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-2 before:w-0.5 before:bg-[#28303E]">
                {quotation.statusHistory.map((history, idx) => (
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

            {isActionable && (
              <div className="bg-gradient-to-br from-[#231710] to-[#14181F] text-white rounded-2xl p-5 shadow-lg border border-[#E06924]/40">
                <h4 className="font-extrabold text-sm text-white">Accept Official Quotation</h4>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  Locking this quotation immediately converts it into Purchase Order #{quotation.quotationNumber.replace('FTI-QT', 'FTI-ORD')} and generates your official Tax Invoice.
                </p>

                <button
                  onClick={handleAccept}
                  disabled={isProcessing}
                  className="mt-4 w-full bg-gradient-to-b from-[#22C55E] to-[#16A34A] text-white text-xs font-black py-3 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing Order...' : 'Accept & Confirm Purchase Order'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14181F] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#2C3545] text-white">
            <h3 className="font-extrabold text-base text-white mb-2">Decline Quotation</h3>
            <p className="text-xs text-[#94A3B8] mb-3">
              Please let our trading desk know the reason for declining so we may revise specifications or pricing if possible.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Price higher than current market, requirement postponed, changed specification..."
              className="w-full text-xs bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="bg-[#191F28] text-[#CBD5E1] text-xs font-bold px-4 py-2 rounded-xl border border-[#2A3342] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
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
