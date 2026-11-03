'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { ProductIcon } from '@/components/ui/ProductIcon';
import {
  FileSpreadsheet,
  Trash2,
  MapPin,
  Plus,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Building2,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';

export default function QuotationCartPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, addresses, submitQuotationRequest, currentUser } = useStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const defaultAddr = addresses.find((a) => a.isDefault);
    return defaultAddr ? defaultAddr.id : addresses[0]?.id || '';
  });

  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleSubmitQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (cart.length === 0) {
      setSubmissionError('Your quotation cart is empty. Please add at least one material combination.');
      return;
    }

    if (!selectedAddress) {
      setSubmissionError('Please select or specify a delivery location for freight estimation.');
      return;
    }

    setIsSubmitting(true);

    try {
      const quotationId = submitQuotationRequest(selectedAddress, specialNotes);
      // Redirect to quotation details page
      router.push(`/quotations/${quotationId}`);
    } catch (err) {
      console.error('Error submitting quotation:', err);
      setSubmissionError('An unexpected error occurred while submitting your quotation request. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <CustomerLayout>
      {/* Top Banner */}
      <div className="bg-slate-900 text-white py-6 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-200">Home</Link>
            <span>/</span>
            <span className="text-blue-400 font-semibold">Quotation Cart</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Quotation Request Cart
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Review your requested material combinations. Prices and delivery freight will be computed and issued by the FTI Trading Desk.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded text-xs flex items-center space-x-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-slate-300 font-medium">B2B Zero Retail Markup RFQ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {cart.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-16 bg-white border border-slate-200 rounded-lg p-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Your Quotation Cart is Empty</h2>
            <p className="text-xs text-slate-500 mt-1 mb-6 max-w-sm mx-auto leading-relaxed">
              Explore our seven industrial raw material categories, configure specifications (diameter, length, grade), and add multiple combinations.
            </p>
            <Link
              href="/raw-materials"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded shadow transition"
            >
              <Layers className="w-4 h-4" />
              <span>Browse Raw Materials</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuotation}>
            {submissionError && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Cart Line Items (8 Cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Requested Material Combinations ({cart.length})
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Each item represents a distinct dimension, grade, and lot size.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* List of Cart Items */}
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div
                        key={item.id}
                        className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 hover:bg-slate-50 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-3">
                            <ProductIcon slug={item.categorySlug} className="w-10 h-10 shrink-0 mt-0.5" />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded font-mono">
                                  #{index + 1}
                                </span>
                                <h3 className="text-sm font-bold text-slate-900">
                                  {item.categoryName} – {item.grade}
                                </h3>
                              </div>

                              {/* Specification Parameters */}
                              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                                {Object.entries(item.specifications).map(([key, value]) => (
                                  <div key={key} className="bg-white px-2 py-1 rounded border border-slate-200">
                                    <span className="text-[10px] text-slate-400 block uppercase capitalize">
                                      {key}
                                    </span>
                                    <span className="font-semibold text-slate-800">{value}</span>
                                  </div>
                                ))}

                                <div className="bg-blue-50 px-2 py-1 rounded border border-blue-200">
                                  <span className="text-[10px] text-blue-600 block uppercase font-bold">
                                    Quantity
                                  </span>
                                  <span className="font-bold text-blue-900">
                                    {item.quantity} {item.unit}
                                  </span>
                                </div>
                              </div>

                              {item.specialInstructions && (
                                <p className="mt-2 text-[11px] text-slate-600 italic bg-amber-50/60 p-2 rounded border border-amber-200/60">
                                  <span className="font-semibold text-amber-900">Note:</span> {item.specialInstructions}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition"
                            title="Remove combination"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                    <Link
                      href="/raw-materials"
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      <span>Add More Specifications</span>
                    </Link>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Pricing Status</span>
                      <span className="text-xs font-bold text-slate-700">Official Quotation Only</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Delivery Location & Quotation Request Submission (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                {/* 1. Delivery Location Selection */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Delivery Location</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Freight charges will be calculated from our Kalamboli yard to this destination.
                  </p>

                  <div className="space-y-2">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`block p-3 rounded border text-xs cursor-pointer transition ${
                          selectedAddressId === addr.id
                            ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600 text-blue-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="deliveryAddress"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-bold text-slate-900">{addr.recipientName}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-1.5 rounded">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 pl-5 leading-tight">
                          {addr.streetAddress}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </label>
                    ))}
                  </div>

                  <div className="mt-3 text-right">
                    <Link
                      href="/profile?tab=addresses"
                      className="text-[11px] text-blue-600 hover:underline font-semibold"
                    >
                      + Add New Delivery Address
                    </Link>
                  </div>
                </div>

                {/* 2. Customer Notes / Delivery Timeline */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Special Requirements or Notes
                  </h3>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Mention required dispatch date, transit insurance, or packaging instructions.
                  </p>
                  <textarea
                    rows={3}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Need delivery by next Tuesday. Crane unloading available at works gate 2..."
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* 3. Official Quotation Submission Action */}
                <div className="bg-slate-900 text-white rounded-lg p-5 shadow-md">
                  <div className="flex items-center space-x-2 text-xs text-blue-400 font-semibold mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Direct Trading Desk Quotation</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-100">
                    Ready to receive official pricing?
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Submitting this request creates an official Quotation Request. The trading desk assigns line prices, freight, and terms, then sends it back to your account for one-click acceptance.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-bold py-3 px-4 rounded shadow flex items-center justify-center space-x-2 transition"
                  >
                    {isSubmitting ? (
                      <span>Submitting Request...</span>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        <span>Request a Quotation</span>
                      </>
                    )}
                  </button>

                  <p className="mt-2 text-center text-[10px] text-slate-400">
                    Expected response: Within 2 hours during market hours
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </CustomerLayout>
  );
}
