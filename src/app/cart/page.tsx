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
  ShieldCheck,
  Layers,
} from 'lucide-react';

export default function QuotationCartPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, addresses, submitQuotationRequest } = useStore();

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
      {/* Top Banner - Dark Chocolate Brown */}
      <div className="bg-[#49352D] text-[#F1EAE1] py-6 px-4 sm:px-6 border-b border-[#343A3F]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-[#A8ADB1] mb-2 font-medium">
            <Link href="/" className="hover:text-[#F1EAE1] transition">Home</Link>
            <span>/</span>
            <span className="text-[#B18A70] font-bold">Quotation Cart</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F1EAE1]">
                Quotation Request Cart
              </h1>
              <p className="text-xs sm:text-sm text-[#A8ADB1] mt-1 leading-relaxed">
                Review your requested material combinations. Prices and delivery freight will be computed and issued by the FTI Trading Desk.
              </p>
            </div>

            <div className="bg-[#343A3F] border border-[#737A7F] px-3 py-1.5 rounded text-xs flex items-center space-x-2 shrink-0 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="text-[#F1EAE1] font-semibold">B2B Zero Retail Markup RFQ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {cart.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-16 bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#858C92] text-[#252A2E] flex items-center justify-center mx-auto mb-4 border border-[#737A7F]">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-extrabold text-[#252A2E]">Your Quotation Cart is Empty</h2>
            <p className="text-xs text-[#49352D] mt-1 mb-6 max-w-sm mx-auto leading-relaxed font-medium">
              Explore our seven industrial raw material categories, configure specifications (diameter, length, grade), and add multiple combinations.
            </p>
            <Link
              href="/raw-materials"
              className="inline-flex items-center space-x-2 bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold px-5 py-2.5 rounded border border-[#B18A70] shadow transition cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#F1EAE1]" />
              <span>Browse Raw Materials</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuotation}>
            {submissionError && (
              <div className="mb-6 p-4 bg-[#DC6262]/20 border border-[#DC6262] text-[#252A2E] text-xs rounded-lg flex items-center space-x-2 font-bold">
                <AlertCircle className="w-4 h-4 text-[#DC6262] shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Cart Line Items (8 Cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-5 shadow-xs text-[#252A2E]">
                  <div className="flex items-center justify-between border-b border-[#737A7F] pb-3 mb-4">
                    <div>
                      <h2 className="text-sm font-extrabold text-[#252A2E]">
                        Requested Material Combinations ({cart.length})
                      </h2>
                      <p className="text-[11px] text-[#49352D] font-medium">
                        Each item represents a distinct dimension, grade, and lot size.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs text-[#DC6262] hover:text-[#DC6262]/80 font-bold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* List of Cart Items */}
                  <div className="space-y-4">
                    {cart.map((item, index) => {
                      const specEntries = Object.entries(item.specifications).filter(
                        ([_, v]) => v !== undefined && v !== null && String(v).trim() !== ''
                      );
                      const dimensionKeys = ['diameter', 'length', 'thickness', 'width', 'size', 'outerdiameter', 'wallthickness'];
                      const dimensions = specEntries.filter(([k]) => dimensionKeys.includes(k.toLowerCase()));
                      const technicalSpecs = specEntries.filter(([k]) => !dimensionKeys.includes(k.toLowerCase()));

                      const formatSpecKey = (key: string): string => {
                        const map: Record<string, string> = {
                          diameter: 'Diameter',
                          length: 'Length',
                          supplyCondition: 'Supply Condition',
                          testingRequirement: 'Testing Requirement',
                          tolerance: 'Tolerance Standard',
                          surfaceFinish: 'Surface Finish',
                          outerDiameter: 'Outer Diameter',
                          wallThickness: 'Wall Thickness',
                          width: 'Width',
                          thickness: 'Thickness',
                          size: 'Size / Dimension',
                          temper: 'Temper / Hardness',
                        };
                        if (map[key]) return map[key];
                        return key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/_/g, ' ')
                          .trim()
                          .replace(/^\w/, (c) => c.toUpperCase());
                      };

                      return (
                        <div
                          key={item.id}
                          className="bg-[#A8ADB1] border border-[#737A7F] rounded-xl p-4 sm:p-5 shadow-xs hover:border-[#76513F] transition-all space-y-3.5"
                        >
                          {/* Top Row: Icon, Grade Header, and Delete */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start space-x-3 min-w-0">
                              <div className="w-11 h-11 rounded-lg bg-[#858C92] border border-[#737A7F] p-1.5 flex items-center justify-center shrink-0">
                                <ProductIcon slug={item.categorySlug} className="w-full h-full object-contain" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="text-[10px] font-bold text-[#F1EAE1] bg-[#76513F] border border-[#B18A70] px-2 py-0.5 rounded font-mono">
                                    Combination #{index + 1}
                                  </span>
                                  <span className="text-xs font-bold text-[#49352D] uppercase tracking-wide">
                                    {item.categoryName}
                                  </span>
                                </div>

                                <h3 className="text-sm sm:text-base font-extrabold text-[#252A2E] leading-snug">
                                  {item.grade}
                                </h3>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-[#DC6262] hover:bg-[#BAC0C5] rounded-lg transition shrink-0 cursor-pointer"
                              title="Remove this combination"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Primary Dimensions Strip */}
                          {dimensions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              {dimensions.map(([k, v]) => (
                                <div
                                  key={k}
                                  className="inline-flex items-center space-x-1.5 bg-[#BAC0C5] border border-[#737A7F] px-2.5 py-1 rounded-md text-xs"
                                >
                                  <span className="text-[10px] font-bold text-[#49352D] uppercase tracking-wider">
                                    {formatSpecKey(k)}:
                                  </span>
                                  <span className="font-bold text-[#252A2E] font-mono">{v}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Technical Standards & Testing Conditions */}
                          {technicalSpecs.length > 0 && (
                            <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-3 space-y-2 text-xs">
                              {technicalSpecs.map(([k, v]) => (
                                <div key={k} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-xs">
                                  <span className="text-[11px] font-bold text-[#49352D] shrink-0 sm:w-44 uppercase tracking-wider">
                                    {formatSpecKey(k)}:
                                  </span>
                                  <span className="text-[#252A2E] font-medium leading-relaxed">{v}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Special Instructions Note */}
                          {item.specialInstructions && (
                            <div className="text-xs text-[#252A2E] bg-[#E5A34B]/20 border border-[#E5A34B] p-2.5 rounded-lg flex items-start space-x-2 font-medium">
                              <span className="font-bold shrink-0 text-[#49352D]">Note:</span>
                              <span className="leading-relaxed">{item.specialInstructions}</span>
                            </div>
                          )}

                          {/* Footer Strip: Quantity & Dispatch Status */}
                          <div className="bg-[#858C92] border border-[#737A7F] rounded-lg px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#252A2E]">
                                Requested Lot Size:
                              </span>
                              <span className="text-sm font-black text-[#252A2E] font-mono bg-[#F1EAE1] px-2.5 py-0.5 rounded border border-[#737A7F] shadow-xs">
                                {item.quantity.toLocaleString('en-IN')} {item.unit}
                              </span>
                            </div>

                            <div className="text-[11px] text-[#252A2E] font-bold flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                              <span>Zero Retail Markup • Ex-Kalamboli Yard</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#737A7F] flex items-center justify-between">
                    <Link
                      href="/raw-materials"
                      className="text-xs font-bold text-[#76513F] hover:text-[#604333] flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      <span>Add More Specifications</span>
                    </Link>

                    <div className="text-right">
                      <span className="text-[11px] text-[#49352D] block font-medium">Pricing Status</span>
                      <span className="text-xs font-extrabold text-[#252A2E]">Official Quotation Only</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Delivery Location & Quotation Request Submission (4 Cols) */}
              <div className="lg:col-span-4 space-y-4">
                {/* 1. Delivery Location Selection */}
                <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-5 shadow-xs text-[#252A2E]">
                  <h3 className="text-xs font-extrabold text-[#252A2E] uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-[#76513F]" />
                    <span>Delivery Location</span>
                  </h3>
                  <p className="text-[11px] text-[#49352D] mb-3 font-medium">
                    Freight charges will be calculated from our Kalamboli yard to this destination.
                  </p>

                  <div className="space-y-2">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`block p-3 rounded border text-xs cursor-pointer transition ${
                          selectedAddressId === addr.id
                            ? 'bg-[#A8ADB1] border-2 border-[#76513F] ring-1 ring-[#76513F] text-[#252A2E]'
                            : 'bg-[#A8ADB1]/60 border-[#737A7F] text-[#252A2E] hover:bg-[#A8ADB1]'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="deliveryAddress"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="accent-[#76513F]"
                          />
                          <span className="font-bold text-[#252A2E]">{addr.recipientName}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] bg-[#858C92] text-[#252A2E] font-bold px-1.5 rounded border border-[#737A7F]">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#343A3F] mt-1 pl-5 leading-tight font-medium">
                          {addr.streetAddress}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </label>
                    ))}
                  </div>

                  <div className="mt-3 text-right">
                    <Link
                      href="/profile?tab=addresses"
                      className="text-[11px] text-[#76513F] hover:text-[#604333] font-bold"
                    >
                      + Add New Delivery Address
                    </Link>
                  </div>
                </div>

                {/* 2. Customer Notes / Delivery Timeline */}
                <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg p-5 shadow-xs text-[#252A2E]">
                  <h3 className="text-xs font-extrabold text-[#252A2E] uppercase tracking-wider mb-1">
                    Special Requirements or Notes
                  </h3>
                  <p className="text-[11px] text-[#49352D] mb-2 font-medium">
                    Mention required dispatch date, transit insurance, or packaging instructions.
                  </p>
                  <textarea
                    rows={3}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Need delivery by next Tuesday. Crane unloading available at works gate 2..."
                    className="w-full text-xs bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium"
                  />
                </div>

                {/* 3. Official Quotation Submission Action - Dark Chocolate Brown */}
                <div className="bg-[#49352D] text-[#F1EAE1] rounded-lg p-5 shadow-md border border-[#343A3F]">
                  <div className="flex items-center space-x-2 text-xs text-[#B18A70] font-bold mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span>Direct Trading Desk Quotation</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-[#F1EAE1]">
                    Ready to receive official pricing?
                  </h4>
                  <p className="text-[11px] text-[#A8ADB1] mt-1 leading-relaxed font-medium">
                    Submitting this request creates an official Quotation Request. The trading desk assigns line prices, freight, and terms, then sends it back to your account for one-click acceptance.
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 w-full bg-[#76513F] hover:bg-[#604333] disabled:opacity-60 text-[#F1EAE1] text-xs font-bold py-3 px-4 rounded border border-[#B18A70] shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Submitting Request...</span>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-4 h-4 text-[#10B981]" />
                        <span>Request a Quotation</span>
                      </>
                    )}
                  </button>

                  <p className="mt-2 text-center text-[10px] text-[#A8ADB1] font-medium">
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
