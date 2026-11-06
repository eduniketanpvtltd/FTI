'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Lock,
  UserCheck,
  Building2,
  ArrowRight,
} from 'lucide-react';

export default function QuotationCartPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    isProfileComplete,
    currentUser,
    cart,
    removeFromCart,
    clearCart,
    addresses,
    submitQuotationRequest,
  } = useStore();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const defaultAddr = addresses.find((a) => a.isDefault);
    return defaultAddr ? defaultAddr.id : addresses[0]?.id || '';
  });

  useEffect(() => {
    if (addresses.length > 0 && (!selectedAddressId || !addresses.some((a) => a.id === selectedAddressId))) {
      const defaultAddr = addresses.find((a) => a.isDefault);
      setSelectedAddressId(defaultAddr ? defaultAddr.id : addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

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

    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }

    if (!isProfileComplete) {
      router.push('/login?redirect=/cart&mode=signup');
      return;
    }

    if (!selectedAddress) {
      setSubmissionError('Please select or add a delivery location for freight estimation.');
      return;
    }

    setIsSubmitting(true);

    try {
      const quotationId = submitQuotationRequest(selectedAddress, specialNotes);
      router.push(`/quotations/${quotationId}`);
    } catch (err) {
      console.error('Error submitting quotation:', err);
      setSubmissionError('An unexpected error occurred while submitting your quotation request. Please try again.');
      setIsSubmitting(false);
    }
  };

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
            <span className="text-[#E8732A] font-bold">Quotation Cart</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Quotation Request <span className="text-[#E8732A]">Cart</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 leading-relaxed max-w-2xl">
                Review your requested material combinations. Prices and delivery freight will be computed and issued by the FTI Trading Desk.
              </p>
            </div>

            <div className="bg-[#14181F] border border-[#2A323E] px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
              <span className="text-white font-bold">B2B Zero Retail Markup RFQ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-7">
        {cart.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-16 bg-[#14181F] border border-[#28303E] rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-[#251811] text-[#E8732A] flex items-center justify-center mx-auto mb-4 border border-[#E06924]/40">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-extrabold text-white">Your Quotation Cart is Empty</h2>
            <p className="text-xs text-[#94A3B8] mt-1.5 mb-6 max-w-sm mx-auto leading-relaxed">
              Explore our seven industrial raw material categories, configure specifications (diameter, length, grade), and add multiple combinations.
            </p>
            <Link
              href="/raw-materials"
              className="inline-flex items-center space-x-2 bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-5 py-3 rounded-xl border border-[#F59352]/50 shadow-[0_4px_15px_rgba(224,105,36,0.3)] transition cursor-pointer"
            >
              <Layers className="w-4 h-4 text-white" />
              <span>Browse Raw Materials</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitQuotation}>
            {submissionError && (
              <div className="mb-6 p-4 bg-[#2F1619] border border-[#EF4444]/40 text-[#F87171] text-xs rounded-xl flex items-center space-x-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
              {/* Left Column: Cart Line Items */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 shadow-lg text-white">
                  <div className="flex items-center justify-between border-b border-[#222934] pb-3.5 mb-4">
                    <div>
                      <h2 className="text-sm font-extrabold text-white">
                        Requested Material Combinations ({cart.length})
                      </h2>
                      <p className="text-[11px] text-[#94A3B8]">
                        Each item represents a distinct dimension, grade, and lot size.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-xs text-[#F87171] hover:text-[#EF4444] font-bold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

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
                          className="bg-[#191F28] border border-[#2A3342] rounded-xl p-4 sm:p-5 hover:border-[#E06924] transition-all space-y-3.5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start space-x-3 min-w-0">
                              <ProductIcon slug={item.categorySlug} className="w-11 h-11 shrink-0" />

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="text-[10px] font-bold text-[#E8732A] bg-[#251811] border border-[#E06924]/40 px-2 py-0.5 rounded-md font-mono">
                                    Combination #{index + 1}
                                  </span>
                                  <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wide">
                                    {item.categoryName}
                                  </span>
                                </div>

                                <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                                  {item.grade}
                                </h3>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 text-[#F87171] hover:bg-[#2F1619] rounded-lg transition shrink-0 cursor-pointer"
                              title="Remove this combination"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {dimensions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              {dimensions.map(([k, v]) => (
                                <div
                                  key={k}
                                  className="inline-flex items-center space-x-1.5 bg-[#12161D] border border-[#28303E] px-2.5 py-1 rounded-lg text-xs"
                                >
                                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                                    {formatSpecKey(k)}:
                                  </span>
                                  <span className="font-bold text-[#E8732A] font-mono">{v}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {technicalSpecs.length > 0 && (
                            <div className="bg-[#12161D] border border-[#242C38] rounded-xl p-3 space-y-2 text-xs">
                              {technicalSpecs.map(([k, v]) => (
                                <div key={k} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-xs">
                                  <span className="text-[11px] font-bold text-[#94A3B8] shrink-0 sm:w-44 uppercase tracking-wider">
                                    {formatSpecKey(k)}:
                                  </span>
                                  <span className="text-white font-medium leading-relaxed">{v}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {item.specialInstructions && (
                            <div className="text-xs text-[#E2E8F0] bg-[#251811] border border-[#E06924]/40 p-2.5 rounded-xl flex items-start space-x-2">
                              <span className="font-bold shrink-0 text-[#E8732A]">Note:</span>
                              <span className="leading-relaxed">{item.specialInstructions}</span>
                            </div>
                          )}

                          <div className="bg-[#12161D] border border-[#242C38] rounded-xl px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                                Requested Lot Size:
                              </span>
                              <span className="text-sm font-black text-white font-mono bg-[#251811] px-2.5 py-0.5 rounded-lg border border-[#E06924]/40">
                                {item.quantity.toLocaleString('en-IN')} {item.unit}
                              </span>
                            </div>

                            <div className="text-[11px] text-[#4ADE80] font-bold flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                              <span>Zero Retail Markup • Ex-Ludhiana Works</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#222934] flex items-center justify-between">
                    <Link
                      href="/raw-materials"
                      className="text-xs font-bold text-[#E8732A] hover:text-[#F28B49] flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      <span>Add More Specifications</span>
                    </Link>

                    <div className="text-right">
                      <span className="text-[11px] text-[#64748B] block font-medium">Pricing Status</span>
                      <span className="text-xs font-extrabold text-white">Official Quotation Only</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Delivery Location & Quotation Request Submission */}
              <div className="lg:col-span-4 space-y-4">
                {!isAuthenticated ? (
                  /* Guest User: Login Required Gate to Request Quotation */
                  <div className="bg-gradient-to-br from-[#251811] via-[#171C24] to-[#14181F] border-2 border-[#E06924] rounded-2xl p-5 shadow-2xl text-white space-y-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2.5 rounded-xl bg-[#251811] border border-[#E06924]/50 text-[#E8732A]">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8732A] font-bold block">
                          B2B Buyer Verification Required
                        </span>
                        <h3 className="text-sm font-extrabold text-white">
                          Sign In to Request Quotation
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-[#CBD5E1] leading-relaxed">
                      You can explore specifications and build your quotation cart without an account. However, submitting an official{' '}
                      <strong className="text-white">Quotation Request (RFQ)</strong> requires signing in with Google and completing your company & delivery profile.
                    </p>

                    <div className="bg-[#12161D] border border-[#28303E] rounded-xl p-3.5 space-y-2 text-[11px] text-[#94A3B8]">
                      <div className="flex items-center space-x-2 text-white font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
                        <span>Your {cart.length} cart combination{cart.length > 1 ? 's are' : ' is'} safely saved</span>
                      </div>
                      <p>
                        After signing in with Google and confirming your company & delivery PIN code, you will return right here to submit your RFQ.
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <Link
                        href="/login?redirect=/cart"
                        className="w-full bg-white hover:bg-slate-100 text-[#0F172A] font-extrabold text-xs py-3 px-4 rounded-xl shadow-md flex items-center justify-center space-x-2.5 transition"
                      >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span>Sign In with Google to Request Quote</span>
                      </Link>

                      <Link
                        href="/login?redirect=/cart&mode=signup"
                        className="w-full bg-gradient-to-b from-[#E8732A] to-[#C45316] hover:from-[#F2823B] hover:to-[#D45E1C] text-white font-bold text-xs py-3 px-4 rounded-xl border border-[#F59352]/50 flex items-center justify-center space-x-2 transition shadow-md"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>New Buyer? Sign Up & Complete Profile</span>
                      </Link>
                    </div>
                  </div>
                ) : !isProfileComplete ? (
                  /* Logged in with Google, but B2B Profiling incomplete */
                  <div className="bg-gradient-to-br from-[#251811] via-[#171C24] to-[#14181F] border-2 border-[#E06924] rounded-2xl p-5 shadow-2xl text-white space-y-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2.5 rounded-xl bg-[#251811] border border-[#E06924]/50 text-[#E8732A]">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8732A] font-bold block">
                          Step 2 of 2 Required
                        </span>
                        <h3 className="text-sm font-extrabold text-white">
                          Complete Your B2B Buyer Profile
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-[#CBD5E1] leading-relaxed">
                      Signed in as <strong className="text-white">{currentUser.email}</strong>. Before submitting your Quotation Request, please provide your Company Name, Mobile Number, and Delivery Location.
                    </p>

                    <Link
                      href="/login?redirect=/cart&mode=signup"
                      className="w-full bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white font-extrabold text-xs py-3.5 px-4 rounded-xl border border-[#F59352]/50 flex items-center justify-center space-x-2 transition shadow-lg"
                    >
                      <span>Complete Buyer Profile Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  /* Authenticated & Profiled B2B Buyer: Full Quotation Submission Panel */
                  <>
                    <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-4 shadow-md text-xs flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-mono uppercase text-[#4ADE80] font-bold block">
                          ✓ Verified B2B Account
                        </span>
                        <p className="font-extrabold text-white truncate">{currentUser.companyName}</p>
                        <p className="text-[11px] text-[#94A3B8] truncate">
                          {currentUser.fullName} • {currentUser.mobile}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        className="text-[11px] text-[#E8732A] hover:underline font-bold shrink-0"
                      >
                        Edit Profile
                      </Link>
                    </div>

                    <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 shadow-lg text-white">
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                        <MapPin className="w-4 h-4 text-[#E8732A]" />
                        <span>Delivery Location</span>
                      </h3>
                      <p className="text-[11px] text-[#94A3B8] mb-3">
                        Freight charges will be calculated from our Ludhiana Dispatch Hub to this destination.
                      </p>

                      {addresses.length === 0 ? (
                        <div className="p-3.5 bg-[#191F28] border border-dashed border-[#2C3545] rounded-xl text-center space-y-2">
                          <p className="text-xs text-[#CBD5E1] font-bold">No delivery address saved yet</p>
                          <Link
                            href="/profile?tab=addresses"
                            className="inline-block bg-[#251811] text-[#E8732A] border border-[#E06924]/40 text-xs font-bold px-3.5 py-2 rounded-lg"
                          >
                            + Add Delivery Address
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {addresses.map((addr) => (
                            <label
                              key={addr.id}
                              className={`block p-3 rounded-xl border text-xs cursor-pointer transition ${
                                selectedAddressId === addr.id
                                  ? 'bg-[#251811] border-2 border-[#E8732A] text-white'
                                  : 'bg-[#191F28] border-[#2A3342] text-[#CBD5E1] hover:bg-[#1E2530]'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name="deliveryAddress"
                                  checked={selectedAddressId === addr.id}
                                  onChange={() => setSelectedAddressId(addr.id)}
                                  className="accent-[#E8732A]"
                                />
                                <span className="font-bold text-white">{addr.recipientName}</span>
                                {addr.isDefault && (
                                  <span className="text-[9px] bg-[#123123] text-[#4ADE80] font-bold px-1.5 py-0.5 rounded border border-[#22C55E]/40">
                                    DEFAULT
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#94A3B8] mt-1 pl-5 leading-tight">
                                {addr.streetAddress}, {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                            </label>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 text-right">
                        <Link
                          href="/profile?tab=addresses"
                          className="text-[11px] text-[#E8732A] hover:text-[#F28B49] font-bold"
                        >
                          + Add New Delivery Address
                        </Link>
                      </div>
                    </div>

                    <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 shadow-lg text-white">
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-1">
                        Special Requirements or Notes
                      </h3>
                      <p className="text-[11px] text-[#94A3B8] mb-2">
                        Mention required dispatch date, transit insurance, or packaging instructions.
                      </p>
                      <textarea
                        rows={3}
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        placeholder="e.g. Need delivery by next Tuesday. Crane unloading available at works gate 2..."
                        className="w-full text-xs bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white placeholder-[#64748B] font-medium"
                      />
                    </div>

                    <div className="bg-gradient-to-br from-[#231710] to-[#14181F] text-white rounded-2xl p-5 shadow-lg border border-[#E06924]/40">
                      <div className="flex items-center space-x-2 text-xs text-[#E8732A] font-bold mb-2">
                        <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                        <span>Direct Trading Desk Quotation</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white">
                        Ready to receive official pricing?
                      </h4>
                      <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                        Submitting this request creates an official Quotation Request. The trading desk assigns line prices, freight, and terms, then sends it back to your account for one-click acceptance.
                      </p>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 w-full bg-gradient-to-b from-[#E8732A] to-[#C45316] hover:from-[#F2823B] hover:to-[#D45E1C] disabled:opacity-60 text-white text-xs font-bold py-3 px-4 rounded-xl border border-[#F59352]/50 shadow-[0_4px_20px_rgba(224,105,36,0.35)] flex items-center justify-center space-x-2 transition cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span>Submitting Request...</span>
                        ) : (
                          <>
                            <FileSpreadsheet className="w-4 h-4 text-white" />
                            <span>Request a Quotation</span>
                          </>
                        )}
                      </button>

                      <p className="mt-2.5 text-center text-[10px] text-[#94A3B8]">
                        Expected response: Within 2 hours during market hours
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </CustomerLayout>
  );
}
