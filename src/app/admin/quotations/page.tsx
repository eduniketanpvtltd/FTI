'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate } from '@/lib/utils';
import { Quotation, QuotationItem, QuotationStatus } from '@/types';
import {
  FileSpreadsheet,
  Search,
  CheckCircle2,
  Send,
  Edit3,
  Download,
  ArrowLeft,
} from 'lucide-react';
import { generateQuotationPDF } from '@/lib/pdf-generator';

export default function AdminQuotationsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#94A3B8]">Loading quotations desk...</div>
      }
    >
      <AdminQuotationsContent />
    </React.Suspense>
  );
}

function AdminQuotationsContent() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams?.get('selected');

  const { quotations, updateQuotationPricing } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mobileTab, setMobileTab] = useState<'queue' | 'desk'>(preselectedId ? 'desk' : 'queue');

  // Currently opened quotation for pricing
  const [activeQuotation, setActiveQuotation] = useState<Quotation | null>(() => {
    if (preselectedId) {
      return quotations.find((q) => q.id === preselectedId) || null;
    }
    return quotations[0] || null;
  });

  // Pricing Form State for the active quotation
  const [itemsPricing, setItemsPricing] = useState<QuotationItem[]>([]);
  const [taxRate, setTaxRate] = useState<number>(18);
  const [transportationCharges, setTransportationCharges] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [validUntil, setValidUntil] = useState<string>('');
  const [termsAndConditions, setTermsAndConditions] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Sync pricing state when active quotation changes
  React.useEffect(() => {
    if (activeQuotation) {
      setItemsPricing(
        activeQuotation.items.map((it) => ({
          ...it,
          unitPrice: it.unitPrice || 50000,
          lineTotal: it.lineTotal || (it.unitPrice || 50000) * it.quantity,
        }))
      );
      setTaxRate(activeQuotation.taxRate || 18);
      setTransportationCharges(activeQuotation.transportationCharges || 8500);
      setDiscountAmount(activeQuotation.discountAmount || 0);

      const defaultValid = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setValidUntil(
        activeQuotation.validUntil
          ? activeQuotation.validUntil.split('T')[0]
          : defaultValid
      );
      setTermsAndConditions(
        activeQuotation.termsAndConditions ||
          `1. Quotation valid strictly for 3 days due to steel price volatility.\n2. Payment terms: 100% against proforma invoice before dispatch.\n3. Taxes: 18% GST extra.\n4. Subject to Ludhiana jurisdiction.`
      );
      setAdminNotes(activeQuotation.adminNotes || '');
    }
  }, [activeQuotation]);

  // Handle changing unit price for a line item
  const handlePriceChange = (index: number, newUnitPrice: number) => {
    setItemsPricing((prev) => {
      const copy = [...prev];
      const item = { ...copy[index] };
      item.unitPrice = newUnitPrice;
      item.lineTotal = Math.round(newUnitPrice * item.quantity);
      copy[index] = item;
      return copy;
    });
  };

  // Calculations
  const subtotal = itemsPricing.reduce((sum, it) => sum + (it.lineTotal || 0), 0);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const calculatedTax = (taxableAmount * taxRate) / 100;
  const grandTotal = taxableAmount + calculatedTax + transportationCharges;

  // Save Pricing (Draft or Official Issue)
  const handleSaveQuotation = (targetStatus: QuotationStatus) => {
    if (!activeQuotation) return;

    updateQuotationPricing(activeQuotation.id, {
      items: itemsPricing,
      taxRate,
      transportationCharges,
      discountAmount,
      validUntil: new Date(validUntil).toISOString(),
      termsAndConditions,
      adminNotes,
      status: targetStatus,
    });

    setSaveFeedback(
      targetStatus === 'quotation_sent'
        ? 'Official Quotation Sent! Customer has been notified and can now accept the pricing.'
        : 'Quotation pricing saved as draft.'
    );

    setTimeout(() => {
      setSaveFeedback(null);
    }, 4000);
  };

  const filtered = quotations.filter((q) => {
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesSearch =
      q.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerSnapshot.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.customerSnapshot.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Quotation Management & <span className="text-[#E8732A]">Pricing Desk</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Review customer material specification requests, assign mill-direct rates, add freight, and issue official quotations.
          </p>
        </div>
      </div>

      {/* Mobile-only Segmented View Switcher */}
      <div className="lg:hidden flex rounded-xl bg-[#14181F] border border-[#28303E] p-1 shadow-inner text-xs">
        <button
          type="button"
          onClick={() => setMobileTab('queue')}
          className={`flex-1 py-2 font-bold rounded-lg transition touch-manipulation flex items-center justify-center space-x-1.5 cursor-pointer ${
            mobileTab === 'queue'
              ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white shadow-sm'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>RFQ Queue ({filtered.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('desk')}
          className={`flex-1 py-2 font-bold rounded-lg transition touch-manipulation flex items-center justify-center space-x-1.5 cursor-pointer ${
            mobileTab === 'desk'
              ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white shadow-sm'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>
            Pricing Desk {activeQuotation ? `(${activeQuotation.quotationNumber.slice(-4)})` : ''}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quotation Requests Queue (4 Cols) */}
        <div
          className={`lg:col-span-4 space-y-3 ${
            mobileTab === 'queue' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-3.5 shadow-lg space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search RFQs by ID or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white placeholder-[#64748B]"
              />
            </div>

            <div className="flex items-center space-x-1.5 text-[11px] overflow-x-auto pb-1 no-scrollbar">
              {['all', 'pending', 'quotation_sent', 'accepted'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full font-bold whitespace-nowrap touch-manipulation cursor-pointer transition ${
                    statusFilter === st
                      ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/40'
                      : 'bg-[#191F28] text-[#CBD5E1] hover:bg-[#222936] border border-[#2A3342]'
                  }`}
                >
                  {st === 'all' ? 'All' : st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-6 text-center text-xs text-[#94A3B8]">
                No quotation requests found matching filter.
              </div>
            ) : (
              filtered.map((q) => {
                const isSelected = activeQuotation?.id === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setActiveQuotation(q);
                      setMobileTab('desk');
                    }}
                    className={`cursor-pointer p-4 rounded-2xl border text-xs transition touch-manipulation ${
                      isSelected
                        ? 'bg-[#251811] border-[#E06924] shadow-md ring-1 ring-[#E06924]'
                        : 'bg-[#14181F] border-[#28303E] hover:border-[#3A4659]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-extrabold text-white">
                        {q.quotationNumber}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          q.status === 'pending'
                            ? 'bg-[#332114] text-[#E58A3C] border border-[#C86D28]/50'
                            : q.status === 'quotation_sent'
                            ? 'bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40'
                            : 'bg-[#191F28] text-[#CBD5E1] border border-[#2A3342]'
                        }`}
                      >
                        {q.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="font-bold text-[#E2E8F0] truncate">
                      {q.customerSnapshot.companyName}
                    </p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      {q.customerSnapshot.fullName} • {q.items.length} Combination(s) •{' '}
                      {formatIndianDate(q.createdAt)}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-[#222934] flex items-center justify-between text-[11px]">
                      <span className="text-[#64748B]">Total:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-extrabold text-[#E8732A]">
                          {q.grandTotal ? formatINR(q.grandTotal) : 'Unpriced'}
                        </span>
                        <span className="lg:hidden text-[#E8732A] font-bold text-[10px]">
                          Edit →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Quotation Preparation Desk (8 Cols) */}
        <div className={`lg:col-span-8 ${mobileTab === 'desk' ? 'block' : 'hidden lg:block'}`}>
          {activeQuotation ? (
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-4 sm:p-6 shadow-lg space-y-5 sm:space-y-6">
              {/* Mobile Back to Queue Button */}
              <div className="lg:hidden flex items-center justify-between pb-2 border-b border-[#222934]">
                <button
                  type="button"
                  onClick={() => setMobileTab('queue')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#E8732A] bg-[#251811] border border-[#E06924]/40 px-3 py-1.5 rounded-xl touch-manipulation"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to RFQ Queue</span>
                </button>
                <span className="text-[10px] text-[#94A3B8] font-mono">
                  {filtered.findIndex((q) => q.id === activeQuotation.id) + 1} of {filtered.length}
                </span>
              </div>

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-[#222934] pb-4">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h2 className="text-base sm:text-lg font-extrabold text-white font-mono">
                      {activeQuotation.quotationNumber}
                    </h2>
                    <span className="bg-[#251811] text-[#E8732A] border border-[#E06924]/40 text-[10px] font-mono px-2 py-0.5 rounded-md font-bold">
                      Version {activeQuotation.version}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Client:{' '}
                    <span className="font-bold text-white">
                      {activeQuotation.customerSnapshot.companyName}
                    </span>{' '}
                    ({activeQuotation.customerSnapshot.fullName})
                  </p>
                  <p className="text-[11px] text-[#64748B] break-words mt-0.5">
                    Delivery To: {activeQuotation.customerSnapshot.deliveryAddress}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => generateQuotationPDF(activeQuotation)}
                    className="px-3.5 py-2 rounded-xl bg-[#191F28] hover:bg-[#222936] border border-[#2A3342] text-white text-xs font-bold flex items-center space-x-1.5 touch-manipulation cursor-pointer transition"
                    title="Download Quotation PDF"
                  >
                    <Download className="w-4 h-4 text-[#E8732A]" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {saveFeedback && (
                <div className="p-3.5 bg-[#122D21] border border-[#22C55E]/40 text-[#4ADE80] text-xs rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#22C55E]" />
                  <span className="font-bold">{saveFeedback}</span>
                </div>
              )}

              {/* Line Items Pricing */}
              <div>
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2.5">
                  Line Items Specification & Unit Price Assignment
                </h3>

                {/* Desktop/Tablet Table View */}
                <div className="hidden md:block border border-[#2A3342] rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead>
                      <tr className="bg-[#191F28] text-[#CBD5E1] font-bold text-[10px] uppercase border-b border-[#2A3342]">
                        <th className="py-3 px-3">#</th>
                        <th className="py-3 px-3">Category & Grade</th>
                        <th className="py-3 px-3">Specifications</th>
                        <th className="py-3 px-3">Quantity</th>
                        <th className="py-3 px-3">Unit Price (₹)</th>
                        <th className="py-3 px-3 text-right">Line Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222934]">
                      {itemsPricing.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-[#191F28]/50">
                          <td className="py-3 px-3 font-mono text-[#64748B]">{idx + 1}</td>
                          <td className="py-3 px-3 font-bold text-white">
                            {item.categoryName}
                            <span className="block font-mono text-[10px] text-[#E8732A]">
                              {item.grade}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[11px] text-[#CBD5E1]">
                            {Object.entries(item.specifications).map(([k, v]) => (
                              <div key={k}>
                                <span className="text-[#94A3B8] capitalize">{k}:</span> {v}
                              </div>
                            ))}
                            {item.specialInstructions && (
                              <span className="italic text-[10px] text-[#E58A3C] block mt-0.5">
                                Req: {item.specialInstructions}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-white">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="number"
                              step="500"
                              value={item.unitPrice || ''}
                              onChange={(e) =>
                                handlePriceChange(idx, parseFloat(e.target.value) || 0)
                              }
                              className="w-28 p-2 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl font-mono font-bold text-white"
                            />
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-extrabold text-[#E8732A]">
                            {formatINR(item.lineTotal || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden space-y-3">
                  {itemsPricing.map((item, idx) => (
                    <div
                      key={item.id}
                      className="bg-[#191F28] border border-[#2A3342] rounded-xl p-3.5 space-y-2.5 text-xs shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-white text-sm">{item.categoryName}</span>
                          <span className="block font-mono text-xs text-[#E8732A] font-semibold">
                            {item.grade}
                          </span>
                        </div>
                        <span className="bg-[#14181F] text-[#CBD5E1] border border-[#28303E] text-[10px] font-mono px-2 py-0.5 rounded-md font-bold">
                          Item #{idx + 1}
                        </span>
                      </div>

                      {/* Specs pills */}
                      <div className="bg-[#14181F] rounded-xl p-2.5 border border-[#28303E] space-y-1 text-[11px] text-[#CBD5E1]">
                        {Object.entries(item.specifications).map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span className="text-[#94A3B8] capitalize">{k}:</span>
                            <span className="font-medium text-white">{v}</span>
                          </div>
                        ))}
                        {item.specialInstructions && (
                          <p className="italic text-[10px] text-[#E58A3C] pt-1 border-t border-[#222934]">
                            Req: {item.specialInstructions}
                          </p>
                        )}
                      </div>

                      {/* Quantity & Unit Rate Inputs */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1 items-end">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#94A3B8] block mb-1">
                            Quantity ({item.unit})
                          </label>
                          <div className="font-mono font-bold text-white bg-[#14181F] border border-[#28303E] rounded-xl px-2.5 py-2 text-xs">
                            {item.quantity} {item.unit}
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-[#E8732A] block mb-1">
                            Unit Price (₹/{item.unit})
                          </label>
                          <input
                            type="number"
                            step="500"
                            value={item.unitPrice || ''}
                            onChange={(e) =>
                              handlePriceChange(idx, parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-2.5 py-2 text-xs bg-[#14181F] border border-[#E06924] rounded-xl font-mono font-bold text-white"
                          />
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#28303E]">
                        <span className="text-[#94A3B8] font-medium">Item Total:</span>
                        <span className="font-mono font-extrabold text-[#E8732A] text-sm">
                          {formatINR(item.lineTotal || 0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commercial Terms & Taxes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">
                      Quotation Validity Date
                    </label>
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">
                      Desk Notes (Visible to Client)
                    </label>
                    <textarea
                      rows={2}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g. Material ready at Ludhiana Works (Industrial Area-C). Ready for immediate loading."
                      className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-xs text-white placeholder-[#64748B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-white mb-1">
                      Commercial Terms & Conditions
                    </label>
                    <textarea
                      rows={3}
                      value={termsAndConditions}
                      onChange={(e) => setTermsAndConditions(e.target.value)}
                      className="w-full bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                {/* Financial Summary & Add-on Charges */}
                <div className="bg-[#191F28] border border-[#2A3342] rounded-2xl p-4 space-y-3 text-xs">
                  <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] border-b border-[#28303E] pb-2">
                    Pricing Breakdown
                  </h4>

                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8]">Material Subtotal:</span>
                    <span className="font-mono font-bold text-white">{formatINR(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8]">Special Discount (₹):</span>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                      className="w-28 p-1.5 text-xs bg-[#14181F] border border-[#28303E] rounded-lg font-mono text-right text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8]">Transportation / Freight (₹):</span>
                    <input
                      type="number"
                      value={transportationCharges}
                      onChange={(e) => setTransportationCharges(parseFloat(e.target.value) || 0)}
                      className="w-28 p-1.5 text-xs bg-[#14181F] border border-[#28303E] rounded-lg font-mono text-right text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8]">GST Rate (%):</span>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 18)}
                      className="w-28 p-1.5 text-xs bg-[#14181F] border border-[#28303E] rounded-lg font-mono text-right text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-[#28303E] text-[#CBD5E1]">
                    <span>Tax Amount:</span>
                    <span className="font-mono font-bold text-white">
                      {formatINR(calculatedTax)}
                    </span>
                  </div>

                  <div className="pt-2.5 border-t border-[#28303E] flex items-center justify-between text-sm font-extrabold text-white">
                    <span>Quotation Grand Total:</span>
                    <span className="font-mono text-base text-[#E8732A]">
                      {formatINR(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#222934] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveQuotation('quotation_prepared')}
                  className="bg-[#191F28] hover:bg-[#222936] text-[#CBD5E1] hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-[#2A3342] transition text-center touch-manipulation cursor-pointer"
                >
                  Save as Draft (Do Not Send)
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveQuotation('quotation_sent')}
                  className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-extrabold px-6 py-2.5 rounded-xl border border-[#F59352]/50 shadow-[0_4px_15px_rgba(224,105,36,0.3)] flex items-center justify-center space-x-2 transition touch-manipulation cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Issue & Send Official Quotation</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-12 text-center text-[#94A3B8]">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 text-[#E8732A]" />
              <p className="text-xs font-semibold text-white">
                Select a quotation from the list on the left to review and assign line item pricing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
