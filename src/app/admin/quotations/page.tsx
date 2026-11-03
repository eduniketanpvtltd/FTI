'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import { Quotation, QuotationItem, QuotationStatus } from '@/types';
import {
  FileSpreadsheet,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Edit3,
  Download,
  AlertCircle,
  Building2,
  DollarSign,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';
import { generateQuotationPDF } from '@/lib/pdf-generator';

export default function AdminQuotationsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading quotations desk...</div>}>
      <AdminQuotationsContent />
    </React.Suspense>
  );
}

function AdminQuotationsContent() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams?.get('selected');

  const { quotations, updateQuotationPricing, acceptQuotation } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
          `1. Quotation valid strictly for 3 days due to steel price volatility.\n2. Payment terms: 100% against proforma invoice before dispatch.\n3. Taxes: 18% GST extra.\n4. Subject to Kalamboli jurisdiction.`
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

    // Refresh active quotation reference from store
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Quotation Management & Pricing Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review customer material specification requests, assign mill-direct rates, add freight, and issue official quotations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quotation Requests Queue (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search RFQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
              />
            </div>

            <div className="flex items-center space-x-1 text-[11px] overflow-x-auto pb-1">
              {['all', 'pending', 'quotation_sent', 'accepted'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-0.5 rounded font-medium whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {st === 'all' ? 'All' : st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[75vh] overflow-y-auto">
            {filtered.map((q) => {
              const isSelected = activeQuotation?.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setActiveQuotation(q)}
                  className={`cursor-pointer p-3.5 rounded-lg border text-xs transition ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-slate-900">{q.quotationNumber}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        q.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : q.status === 'quotation_sent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {q.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-800 truncate">
                    {q.customerSnapshot.companyName}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {q.items.length} Combination(s) • {formatIndianDate(q.createdAt)}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Total:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {q.grandTotal ? formatINR(q.grandTotal) : 'Unpriced'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pricing & Quotation Preparation Desk (8 Cols) */}
        <div className="lg:col-span-8">
          {activeQuotation ? (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-slate-900 font-mono">
                      {activeQuotation.quotationNumber}
                    </h2>
                    <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                      Version {activeQuotation.version}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Client: <span className="font-bold text-slate-800">{activeQuotation.customerSnapshot.companyName}</span> ({activeQuotation.customerSnapshot.fullName})
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Delivery To: {activeQuotation.customerSnapshot.deliveryAddress}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => generateQuotationPDF(activeQuotation)}
                    className="p-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1"
                    title="Download Quotation PDF"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              {saveFeedback && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-md flex items-center space-x-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{saveFeedback}</span>
                </div>
              )}

              {/* Line Items Pricing Table */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Line Items Specification & Unit Price Assignment
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase border-b border-slate-200">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Category & Grade</th>
                        <th className="py-2.5 px-3">Specifications</th>
                        <th className="py-2.5 px-3">Quantity</th>
                        <th className="py-2.5 px-3">Unit Price (₹)</th>
                        <th className="py-2.5 px-3 text-right">Line Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {itemsPricing.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-3 font-bold text-slate-900">
                            {item.categoryName}
                            <span className="block font-mono text-[10px] text-blue-700">
                              {item.grade}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[11px] text-slate-600">
                            {Object.entries(item.specifications).map(([k, v]) => (
                              <div key={k}>
                                <span className="text-slate-400 capitalize">{k}:</span> {v}
                              </div>
                            ))}
                            {item.specialInstructions && (
                              <span className="italic text-[10px] text-amber-700 block mt-0.5">
                                Req: {item.specialInstructions}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">
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
                              className="w-24 p-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                            {formatINR(item.lineTotal || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Commercial Terms & Taxes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Quotation Validity Date
                    </label>
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Desk Notes (Visible to Client)
                    </label>
                    <textarea
                      rows={2}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g. Material ready in Kalamboli yard. Ready for immediate loading."
                      className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Commercial Terms & Conditions
                    </label>
                    <textarea
                      rows={3}
                      value={termsAndConditions}
                      onChange={(e) => setTermsAndConditions(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs font-mono text-slate-900"
                    />
                  </div>
                </div>

                {/* Financial Summary & Add-on Charges */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-2">
                    Pricing Breakdown
                  </h4>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Material Subtotal:</span>
                    <span className="font-mono font-bold text-slate-900">{formatINR(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Special Discount (₹):</span>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 text-xs bg-white border border-slate-300 rounded font-mono text-right"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Transportation / Freight (₹):</span>
                    <input
                      type="number"
                      value={transportationCharges}
                      onChange={(e) => setTransportationCharges(parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 text-xs bg-white border border-slate-300 rounded font-mono text-right"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">GST Rate (%):</span>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 18)}
                      className="w-24 p-1 text-xs bg-white border border-slate-300 rounded font-mono text-right"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-600">
                    <span>Tax Amount:</span>
                    <span className="font-mono font-semibold text-slate-800">{formatINR(calculatedTax)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-sm font-bold text-slate-900">
                    <span>Quotation Grand Total:</span>
                    <span className="font-mono text-base text-blue-700">{formatINR(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveQuotation('quotation_prepared')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded border border-slate-300 transition"
                >
                  Save as Draft (Do Not Send)
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveQuotation('quotation_sent')}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-2.5 rounded shadow flex items-center space-x-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Issue & Send Official Quotation to Customer</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">
                Select a quotation from the list on the left to review and assign line item pricing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
