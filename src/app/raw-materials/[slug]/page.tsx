'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { ProductIcon } from '@/components/ui/ProductIcon';
import { FTI_ISO_CERTIFICATE } from '@/lib/fti-catalog-data';
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronRight,
  Sliders,
  Ruler,
  Tag,
  Check,
  FileText,
  Download,
  ShieldCheck,
  Truck,
  Maximize2,
  X,
  ExternalLink,
} from 'lucide-react';

import { ProductCategory, SpecificationField } from '@/types';

export default function CategoryDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#94A3B8]">
          Loading material specifications...
        </div>
      }
    >
      <CategoryDetailContent />
    </React.Suspense>
  );
}

function CategoryDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const { categories, cart, addToCart, removeFromCart } = useStore();

  const rawMaterialCategories = useMemo(
    () =>
      categories.filter(
        (c: ProductCategory) =>
          !c.isComingSoon && c.slug !== 'fasteners' && c.slug !== 'tractor-parts'
      ),
    [categories]
  );

  const category = categories.find((c: ProductCategory) => c.slug === slug);

  // Set browser title dynamically
  useEffect(() => {
    if (category?.name) {
      document.title = `${category.name} – Direct Mill Grades, Sizes & B2B Quotation | FTI`;
    }
  }, [category?.name]);

  // Active tab matching https://fti-app-sooty.vercel.app/ ('build' | 'specs' | 'docs')
  const [activeTab, setActiveTab] = useState<'build' | 'specs' | 'docs'>('build');

  // Required Step 1: Size (Standard Sizes pills vs Custom Size input)
  const primarySizeField = useMemo(
    () => category?.specificationFields.find((f) => f.required) || category?.specificationFields[0],
    [category]
  );
  const standardSizes = useMemo(() => primarySizeField?.options || [], [primarySizeField]);

  const [isCustomSize, setIsCustomSize] = useState<boolean>(false);
  const [selectedStandardSize, setSelectedStandardSize] = useState<string>('');
  const [customSizeText, setCustomSizeText] = useState<string>('');

  // Required Step 2: Steel Grade (or Brand for TMT Bar)
  const isTmt = slug === 'tmt-bar' || slug === 'tmt';
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState<boolean>(false);
  const [gradeSearch, setGradeSearch] = useState<string>('');

  // Required Step 3: Quantity Stepper (default 5.00 MT like fti-app-sooty.vercel.app, step 0.5 MT)
  const [quantity, setQuantity] = useState<number>(5.0);
  const [unit, setUnit] = useState<string>('Metric Ton');

  // Optional Section: Extra Engineering / Handbook Specifications
  const optionalSpecFields = useMemo(
    () => category?.specificationFields.filter((f) => !f.required) || [],
    [category]
  );
  const [optionalSpecsOpen, setOptionalSpecsOpen] = useState<boolean>(false);
  const [optionalSpecValues, setOptionalSpecValues] = useState<Record<string, string>>({});
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Feedback & "+ Add Another Product" quick-switcher modal
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addAnotherModalOpen, setAddAnotherModalOpen] = useState<boolean>(false);

  // Initialize default size and grade when category loads
  useEffect(() => {
    if (category) {
      if (category.availableGrades.length > 0) {
        setSelectedGrade(category.availableGrades[0]);
      }
      const reqField =
        category.specificationFields.find((f) => f.required) || category.specificationFields[0];
      if (reqField?.options && reqField.options.length > 0) {
        const defaultSz = reqField.options.includes('25 mm')
          ? '25 mm'
          : reqField.options.includes('10 mm')
          ? '10 mm'
          : reqField.options[0];
        setSelectedStandardSize(defaultSz);
      }
      setOptionalSpecValues({});
      setIsCustomSize(false);
      setCustomSizeText('');
    }
  }, [category]);

  const effectiveSizeLabel = useMemo(() => {
    if (isCustomSize && customSizeText.trim()) {
      return `${customSizeText.trim()} (Custom)`;
    }
    return selectedStandardSize || standardSizes[0] || 'Standard';
  }, [isCustomSize, customSizeText, selectedStandardSize, standardSizes]);

  const filteredGrades = useMemo(() => {
    if (!category) return [];
    const q = gradeSearch.trim().toLowerCase();
    if (!q) return category.availableGrades;
    return category.availableGrades.filter((g) => g.toLowerCase().includes(q));
  }, [category, gradeSearch]);

  const activeCombinations = useMemo(
    () => cart.filter((item) => item.categorySlug === slug),
    [cart, slug]
  );

  if (!category) {
    return (
      <CustomerLayout>
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <AlertCircle className="w-12 h-12 text-[#E8732A] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white">Category Not Found</h2>
          <p className="text-xs text-[#94A3B8] mt-1 mb-4">
            The material category you requested does not exist or has been modified.
          </p>
          <Link
            href="/raw-materials"
            className="inline-flex items-center space-x-1.5 bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-[#F59352]/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Raw Materials</span>
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  const handleStepQuantity = (delta: number) => {
    setQuantity((prev) => {
      const step = unit === 'Metric Ton' ? 0.5 : 1;
      const min = unit === 'Metric Ton' ? 0.5 : 1;
      const next = Math.round((prev + delta * step) * 100) / 100;
      return Math.max(min, next);
    });
  };

  const handleAddCombination = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdding) return;
    setFormError(null);

    if (!selectedGrade) {
      setFormError(`Please select a ${isTmt ? 'TMT Brand' : 'Steel Grade'}.`);
      return;
    }

    if (isCustomSize && !customSizeText.trim()) {
      setFormError('Please enter your custom size dimensions or switch to Standard Sizes.');
      return;
    }

    if (!quantity || quantity <= 0) {
      setFormError('Please specify a valid quantity greater than 0.');
      return;
    }

    setIsAdding(true);

    // Combine the required Size with any Optional specs the user chose to fill
    const cleanSpecs: Record<string, string> = {};
    const sizeKey = primarySizeField?.key || 'size';
    cleanSpecs[sizeKey] = effectiveSizeLabel;

    Object.entries(optionalSpecValues).forEach(([k, v]) => {
      if (v && typeof v === 'string' && v.trim() !== '') {
        cleanSpecs[k] = v.trim();
      }
    });

    addToCart({
      categoryId: category.id,
      categorySlug: category.slug,
      categoryName: isTmt ? `TMT Bar — ${selectedGrade}` : category.name,
      specifications: cleanSpecs,
      grade: selectedGrade,
      quantity: Number(quantity),
      unit,
      specialInstructions: specialInstructions.trim() || undefined,
    });

    setSuccessMessage(
      `Added ${category.name} (${selectedGrade} • ${effectiveSizeLabel} • ${quantity.toFixed(2)} ${
        unit === 'Metric Ton' ? 'MT' : unit
      }) to Quotation Cart!`
    );
    setSpecialInstructions('');

    setTimeout(() => {
      setIsAdding(false);
    }, 400);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  return (
    <CustomerLayout>
      {/* Category Header Banner */}
      <div className="relative overflow-hidden border-b border-[#1E242D]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/foundry-hero-bg.jpg"
            alt="Industrial Steel Foundry"
            className="w-full h-56 sm:h-64 object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/40 via-[#0B0E11]/85 to-[#0B0E11]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E11]/90 via-[#0B0E11]/45 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto pt-10 sm:pt-14 pb-6 px-3.5 sm:px-6">
          <div className="flex items-center space-x-1.5 text-xs text-[#CBD5E1] mb-3 font-medium">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
            <Link href="/raw-materials" className="hover:text-white transition">
              Raw Materials
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-[#E8732A] font-bold">{category.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <ProductIcon slug={category.slug} className="w-14 h-14 shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {category.name} <span className="text-[#E8732A]">Order Builder</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setAddAnotherModalOpen(true)}
                className="bg-[#161B24] hover:bg-[#1E2532] text-[#E8732A] text-xs font-extrabold px-3.5 py-2.5 rounded-xl border border-[#E8732A]/50 transition cursor-pointer"
              >
                + Switch / Add Another Product
              </button>
              <Link
                href="/cart"
                className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-[#F59352]/50 flex items-center space-x-2 shadow-[0_4px_15px_rgba(224,105,36,0.3)] transition"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
                <span>View Cart ({cart.length})</span>
              </Link>
            </div>
          </div>

          {/* 4 Quick Info Badges from fti-app-sooty.vercel.app */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
            <div className="bg-[#14181F]/90 border border-[#262E3B] rounded-xl p-3 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[#251811] text-[#E8732A] border border-[#E06924]/40 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold block">
                  {isTmt ? 'Approved Brands' : 'Steel Grades'}
                </span>
                <span className="text-xs font-extrabold text-white truncate block">
                  {category.availableGrades.length > 2
                    ? `${category.availableGrades.slice(0, 2).join(' / ')} +${
                        category.availableGrades.length - 2
                      }`
                    : category.availableGrades.join(' / ')}
                </span>
              </div>
            </div>

            <div className="bg-[#14181F]/90 border border-[#262E3B] rounded-xl p-3 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[#251811] text-[#E8732A] border border-[#E06924]/40 shrink-0">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold block">
                  Standard Size Range
                </span>
                <span className="text-xs font-extrabold text-white truncate block">
                  {standardSizes.length > 1
                    ? `${standardSizes[0]} – ${standardSizes[standardSizes.length - 1]}`
                    : 'Standard Sizes'}
                </span>
              </div>
            </div>

            <div className="bg-[#14181F]/90 border border-[#262E3B] rounded-xl p-3 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[#112A1F] text-[#34D399] border border-[#22C55E]/40 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold block">
                  Dimension Flexibility
                </span>
                <span className="text-xs font-extrabold text-white truncate block">
                  Custom Size Available
                </span>
              </div>
            </div>

            <div className="bg-[#14181F]/90 border border-[#262E3B] rounded-xl p-3 flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[#192231] text-[#38BDF8] border border-[#38BDF8]/40 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold block">
                  Fulfillment Model
                </span>
                <span className="text-xs font-extrabold text-white truncate block">
                  Bulk & Project Supply
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Builder & Combinations Workspace */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-7">
        {/* 3 Action Tabs from fti-app-sooty.vercel.app: Build Order | Specifications | Documents */}
        <div className="flex items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('build')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'build'
                ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 shadow-[0_2px_12px_rgba(224,105,36,0.3)]'
                : 'bg-[#14181F] text-[#94A3B8] hover:text-white border border-[#262E3B]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Build Order</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'specs'
                ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 shadow-[0_2px_12px_rgba(224,105,36,0.3)]'
                : 'bg-[#14181F] text-[#94A3B8] hover:text-white border border-[#262E3B]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Specifications</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('docs')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              activeTab === 'docs'
                ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 shadow-[0_2px_12px_rgba(224,105,36,0.3)]'
                : 'bg-[#14181F] text-[#94A3B8] hover:text-white border border-[#262E3B]'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Documents & Certificates</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left 7 Columns */}
          <div className="lg:col-span-7 space-y-6">
            {activeTab === 'build' ? (
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl shadow-lg p-5 sm:p-6 text-white">
                <div className="flex items-center justify-between border-b border-[#222934] pb-3.5 mb-5">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-[#251811] border border-[#E06924]/40 text-[#E8732A]">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-white">
                        Configure Your Requirement
                      </h2>
                      <p className="text-xs text-[#94A3B8] mt-0.5">
                        Select Size, {isTmt ? 'Brand' : 'Steel Grade'}, and Quantity to add to your Quotation Cart.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#34D399] bg-[#112A1F] px-2.5 py-1 rounded-lg border border-[#22C55E]/40 shrink-0">
                    Quick 3-Step Booking
                  </span>
                </div>

                {formError && (
                  <div className="mb-4 p-3 bg-[#2F1619] border border-[#EF4444]/40 text-[#F87171] text-xs rounded-xl flex items-center space-x-2 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-3.5 bg-[#122D21] border border-[#22C55E]/40 text-[#4ADE80] text-xs rounded-xl flex items-center justify-between gap-2 font-bold animate-in fade-in">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{successMessage}</span>
                    </div>
                    <Link
                      href="/cart"
                      className="px-2.5 py-1 rounded-lg bg-[#22C55E] text-[#081C15] text-[11px] font-black shrink-0"
                    >
                      View Cart →
                    </Link>
                  </div>
                )}

                <form onSubmit={handleAddCombination} className="space-y-6">
                  {/* ============================================================== */}
                  {/* REQUIRED STEP 1: CHOOSE SIZE (Standard Sizes vs Custom Size) */}
                  {/* ============================================================== */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-1.5 text-xs font-extrabold text-white uppercase tracking-wider">
                        <Ruler className="w-3.5 h-3.5 text-[#E8732A]" />
                        <span>1. Choose Size ({primarySizeField?.label || 'mm'})</span>
                        <span className="text-[#E8732A]">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-[#94A3B8]">
                        {standardSizes.length} Standard Sizes
                      </span>
                    </div>

                    {/* Standard Sizes vs Custom Size Toggle */}
                    <div className="grid grid-cols-2 bg-[#0E1218] p-1 rounded-xl border border-[#262F3D]">
                      <button
                        type="button"
                        onClick={() => setIsCustomSize(false)}
                        className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                          !isCustomSize
                            ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white shadow'
                            : 'text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        Standard Sizes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCustomSize(true)}
                        className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                          isCustomSize
                            ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white shadow'
                            : 'text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        Custom Size
                      </button>
                    </div>

                    {isCustomSize ? (
                      <div className="bg-[#191F28] p-3.5 rounded-xl border border-[#2A3342]">
                        <label className="block text-[11px] font-bold text-[#CBD5E1] mb-1.5">
                          Enter Required Custom Section / Size Dimensions (mm)
                        </label>
                        <input
                          type="text"
                          value={customSizeText}
                          onChange={(e) => setCustomSizeText(e.target.value)}
                          placeholder="e.g. 12 mm × 120 mm, or 46.5 mm Dia × 5500 mm"
                          className="w-full text-xs bg-[#0E1218] border border-[#2E3848] focus:border-[#E8732A] rounded-xl p-2.5 text-white placeholder-[#64748B] font-medium outline-none"
                        />
                      </div>
                    ) : (
                      <div className="bg-[#191F28] p-3.5 rounded-xl border border-[#2A3342]">
                        <span className="block text-[11px] font-semibold text-[#94A3B8] mb-2">
                          {primarySizeField?.label || 'Available Sizes (mm)'} — Tap to Select:
                        </span>
                        <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                          {standardSizes.map((sz: string) => {
                            const active = selectedStandardSize === sz;
                            return (
                              <button
                                key={sz}
                                type="button"
                                onClick={() => setSelectedStandardSize(sz)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition cursor-pointer ${
                                  active
                                    ? 'bg-[#251811] border-[#E8732A] text-[#E8732A] shadow-[0_0_10px_rgba(232,115,42,0.25)]'
                                    : 'bg-[#12161D] border-[#283140] text-[#CBD5E1] hover:border-[#3A4659] hover:text-white'
                                }`}
                              >
                                {sz}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Selected Size Banner (Exact match to fti-app-sooty.vercel.app) */}
                    <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#131D2E] border border-[#253B5E] text-xs">
                      <span className="text-[#93C5FD] font-semibold">
                        Selected Size:{' '}
                        <strong className="text-white font-mono">{effectiveSizeLabel}</strong>
                      </span>
                      <span className="text-[10px] font-mono text-[#60A5FA] uppercase font-bold">
                        {isCustomSize ? 'Custom Spec' : 'Standard Mill Size'}
                      </span>
                    </div>
                  </div>

                  {/* ============================================================== */}
                  {/* REQUIRED STEP 2: STEEL GRADE OR TMT BRAND */}
                  {/* ============================================================== */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-1.5 text-xs font-extrabold text-white uppercase tracking-wider">
                        <Tag className="w-3.5 h-3.5 text-[#E8732A]" />
                        <span>2. {isTmt ? 'Choose TMT Brand' : 'Choose Steel Grade'}</span>
                        <span className="text-[#E8732A]">*</span>
                      </label>
                      <span className="text-[10px] font-mono text-[#94A3B8]">
                        {category.availableGrades.length}{' '}
                        {isTmt ? 'Approved Brands' : 'Grades Available'}
                      </span>
                    </div>

                    {/* Dropdown Trigger (Matches fti-app-sooty.vercel.app) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setGradeDropdownOpen(!gradeDropdownOpen)}
                        className="w-full flex items-center justify-between bg-[#191F28] hover:bg-[#1E2530] border border-[#2E3848] rounded-xl px-4 py-3 text-left transition cursor-pointer"
                      >
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold block">
                            Selected {isTmt ? 'Brand' : 'Steel Grade'}
                          </span>
                          <span className="text-sm font-black text-white font-mono">
                            {selectedGrade}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-[#E8732A] transition-transform ${
                            gradeDropdownOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {gradeDropdownOpen && (
                        <div className="mt-1.5 bg-[#12161E] border border-[#2E3848] rounded-xl shadow-2xl overflow-hidden z-20">
                          {category.availableGrades.length > 6 && (
                            <div className="p-2 border-b border-[#222936]">
                              <input
                                type="text"
                                value={gradeSearch}
                                onChange={(e) => setGradeSearch(e.target.value)}
                                placeholder={`Filter ${
                                  isTmt ? 'brands' : 'grades'
                                } (e.g. EN-8D, 20MNCR5, SAE-4140)...`}
                                className="w-full bg-[#0B0E11] border border-[#283140] rounded-lg px-3 py-1.5 text-xs text-white placeholder-[#64748B] outline-none focus:border-[#E8732A]"
                              />
                            </div>
                          )}
                          <div className="max-h-56 overflow-y-auto divide-y divide-[#1C222D]">
                            {filteredGrades.map((grade: string) => {
                              const active = selectedGrade === grade;
                              return (
                                <button
                                  key={grade}
                                  type="button"
                                  onClick={() => {
                                    setSelectedGrade(grade);
                                    setGradeDropdownOpen(false);
                                  }}
                                  className={`w-full px-4 py-2.5 text-xs font-mono flex items-center justify-between text-left transition cursor-pointer ${
                                    active
                                      ? 'bg-[#251811] text-[#E8732A] font-extrabold'
                                      : 'text-[#CBD5E1] hover:bg-[#191F28] hover:text-white'
                                  }`}
                                >
                                  <span>{grade}</span>
                                  {active && <Check className="w-4 h-4 text-[#E8732A]" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick-Select Grade / Brand Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1 max-h-36 overflow-y-auto">
                      {category.availableGrades.map((grade: string) => {
                        const active = selectedGrade === grade;
                        return (
                          <button
                            key={grade}
                            type="button"
                            onClick={() => setSelectedGrade(grade)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition cursor-pointer border ${
                              active
                                ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] border-[#F59352]/50 text-white font-bold shadow'
                                : 'bg-[#191F28] border-[#2A3342] text-[#CBD5E1] hover:text-white'
                            }`}
                          >
                            {grade}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ============================================================== */}
                  {/* REQUIRED STEP 3: QUANTITY STEPPER (MT) */}
                  {/* ============================================================== */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-white uppercase tracking-wider">
                        3. Required Quantity <span className="text-[#E8732A]">*</span>
                      </label>
                      <span className="text-[11px] text-[#94A3B8] font-medium">
                        Unit: <strong className="text-white">{unit}</strong> (Min 0.5 MT)
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-[#191F28] border border-[#2A3342] rounded-xl p-1.5">
                      <button
                        type="button"
                        onClick={() => handleStepQuantity(-1)}
                        className="w-11 h-10 rounded-lg bg-[#12161D] hover:bg-[#232B38] border border-[#283140] flex items-center justify-center text-white transition cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 text-[#E8732A]" />
                      </button>

                      <div className="flex items-center justify-center space-x-2 flex-1 px-3">
                        <input
                          type="number"
                          step="0.5"
                          min="0.1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                          className="w-24 text-center bg-transparent text-base sm:text-lg font-black text-white font-mono outline-none"
                          required
                        />
                        <span className="text-xs font-extrabold text-[#E8732A] uppercase font-mono">
                          {unit === 'Metric Ton' ? 'MT' : unit}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStepQuantity(1)}
                        className="w-11 h-10 rounded-lg bg-[#12161D] hover:bg-[#232B38] border border-[#283140] flex items-center justify-center text-white transition cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4 text-[#E8732A]" />
                      </button>
                    </div>
                  </div>

                  {/* ============================================================== */}
                  {/* OPTIONAL STEP 4: EXTRA TECHNICAL & MILL SPECIFICATIONS */}
                  {/* ============================================================== */}
                  <div className="pt-1">
                    <div className="border border-[#2A3342] rounded-xl overflow-hidden bg-[#191F28] transition">
                      <button
                        type="button"
                        onClick={() => setOptionalSpecsOpen(!optionalSpecsOpen)}
                        className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1E2530] transition cursor-pointer select-none"
                        aria-expanded={optionalSpecsOpen}
                      >
                        <div className="flex items-center space-x-2">
                          <Sliders className="w-4 h-4 text-[#E8732A]" />
                          <div>
                            <span className="text-xs font-extrabold text-white uppercase tracking-wider block">
                              Additional Technical & Mill Specifications
                            </span>
                            <span className="text-[11px] text-[#94A3B8] block">
                              Supply condition, length, tolerances, IS handbook equivalent & notes
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="text-[10px] font-mono font-bold bg-[#112A1F] text-[#34D399] px-2.5 py-1 rounded-md border border-[#22C55E]/40">
                            Optional
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              optionalSpecsOpen ? 'rotate-180 text-[#E8732A]' : 'text-[#94A3B8]'
                            }`}
                          />
                        </div>
                      </button>

                      {optionalSpecsOpen && (
                        <div className="p-4 border-t border-[#2A3342] space-y-4 bg-[#13171E]">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Optional Unit Override */}
                            <div>
                              <label className="block text-xs font-bold text-white mb-1.5">
                                Unit of Measurement{' '}
                                <span className="text-[#64748B] font-normal text-[11px]">
                                  (Optional)
                                </span>
                              </label>
                              <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-full text-xs bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                              >
                                <option value="Metric Ton">
                                  Metric Ton (MT - Industrial Standard)
                                </option>
                                <option value="Kilogram">Kilogram (kg)</option>
                                <option value="Pieces / Bundles">Pieces / Bundles</option>
                                <option value="Meters">Meters</option>
                              </select>
                            </div>

                            {optionalSpecFields.map((field: SpecificationField) => (
                              <div key={field.key}>
                                <label className="block text-xs font-bold text-white mb-1.5">
                                  {field.label}{' '}
                                  <span className="text-[#64748B] font-normal text-[11px]">
                                    (Optional)
                                  </span>
                                </label>
                                {field.type === 'select' && field.options ? (
                                  <select
                                    value={optionalSpecValues[field.key] || ''}
                                    onChange={(e) =>
                                      setOptionalSpecValues({
                                        ...optionalSpecValues,
                                        [field.key]: e.target.value,
                                      })
                                    }
                                    className="w-full text-xs bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white font-medium"
                                  >
                                    <option value="">-- Standard Mill Default (Optional) --</option>
                                    {field.options.map((opt: string) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type={field.type}
                                    value={optionalSpecValues[field.key] || ''}
                                    onChange={(e) =>
                                      setOptionalSpecValues({
                                        ...optionalSpecValues,
                                        [field.key]: e.target.value,
                                      })
                                    }
                                    placeholder={
                                      field.placeholder || `Enter ${field.label} (Optional)`
                                    }
                                    className="w-full text-xs bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white placeholder-[#64748B] font-medium"
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-white mb-1.5">
                              Special Instructions / Cutting Tolerances / Delivery Notes{' '}
                              <span className="text-[#64748B] font-normal text-[11px]">
                                (Optional)
                              </span>
                            </label>
                            <textarea
                              rows={2}
                              value={specialInstructions}
                              onChange={(e) => setSpecialInstructions(e.target.value)}
                              placeholder="e.g. Mill test certificate 3.1 required, cutting length tolerance ±2mm, ultrasonic test..."
                              className="w-full text-xs bg-[#191F28] border border-[#2A3342] rounded-xl p-2.5 text-white placeholder-[#64748B] font-medium"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Primary Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isAdding}
                      className={`w-full sm:flex-1 bg-gradient-to-b from-[#E8732A] to-[#C45316] hover:from-[#F2823B] hover:to-[#D45E1C] text-white text-xs sm:text-sm font-black py-3.5 px-5 rounded-xl border border-[#F59352]/50 shadow-[0_4px_15px_rgba(224,105,36,0.35)] flex items-center justify-center space-x-2 transition cursor-pointer ${
                        isAdding ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{isAdding ? 'Adding to Cart...' : 'Add to Quotation Cart'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAddAnotherModalOpen(true)}
                      className="w-full sm:w-auto bg-[#191F28] hover:bg-[#222A36] text-[#E8732A] text-xs font-extrabold py-3.5 px-4 rounded-xl border border-[#E8732A]/40 transition cursor-pointer"
                    >
                      + Add Another Product
                    </button>
                  </div>
                </form>
              </div>
            ) : activeTab === 'specs' ? (
              /* Tab 2: Technical Specifications (from fti-app-sooty.vercel.app) */
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl shadow-lg p-6 text-white space-y-5">
                <div>
                  <h2 className="text-base font-extrabold text-white">
                    Technical Specifications — {category.name}
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Standard mill production parameters and inspection regimes for {category.name}.
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-[#CBD5E1] bg-[#191F28] p-4 rounded-xl border border-[#2A3342]">
                  <p>• <strong className="text-white">Grade Standards:</strong> IS 2062 / IS 2073 / IS 5517 / IS 1786 / ASTM A36 / DIN 17100</p>
                  <p>• <strong className="text-white">Supply Condition:</strong> As Rolled, Bright Drawn, Normalized, Annealed, Peeled & Ground</p>
                  <p>• <strong className="text-white">Standard Size Range:</strong> {standardSizes[0] || '2 mm'} to {standardSizes[standardSizes.length - 1] || '150 mm'} (Custom sizes on request)</p>
                  <p>• <strong className="text-white">Width / Length Range:</strong> Width 20 mm to 300 mm • Length 3.0 m to 12.0 m</p>
                  <p>• <strong className="text-white">Testing:</strong> Mill Test Certificate (MTC) with chemical and mechanical test results provided</p>
                </div>

                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E8732A] mb-2">
                    Stocked {isTmt ? 'TMT Brands' : 'Steel Grades'} ({category.availableGrades.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {category.availableGrades.map((g: string) => (
                      <span
                        key={g}
                        className="px-2.5 py-1 rounded-lg bg-[#191F28] border border-[#2A3342] text-xs font-mono font-bold text-white"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Tab 3: Documentation & Certificates (from fti-app-sooty.vercel.app) */
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl shadow-lg p-6 text-white space-y-5">
                <div>
                  <h2 className="text-base font-extrabold text-white">
                    Documentation & Quality Certificates
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Every bulk dispatch from FieldFast Tech International includes verified test and quality documentation.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#191F28] border border-[#2A3342] flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-[#E8732A]" />
                      <div>
                        <h4 className="text-xs font-extrabold text-white">
                          Material Test Certificate (MTC 3.1)
                        </h4>
                        <p className="text-[11px] text-[#94A3B8]">
                          Batch heat number, ladle chemical composition & tensile test report
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#34D399] bg-[#112A1F] px-2.5 py-1 rounded border border-[#22C55E]/30">
                      Included with Dispatch
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#191F28] border border-[#2A3342] flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ShieldCheck className="w-5 h-5 text-[#34D399]" />
                      <div>
                        <h4 className="text-xs font-extrabold text-white">
                          ISO 9001:2015 Quality Certificate ({FTI_ISO_CERTIFICATE.certificateNumber})
                        </h4>
                        <p className="text-[11px] text-[#94A3B8]">
                          {FTI_ISO_CERTIFICATE.accreditation} • Valid until {FTI_ISO_CERTIFICATE.validUntil}
                        </p>
                      </div>
                    </div>
                    <a
                      href={FTI_ISO_CERTIFICATE.cdnUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#E8732A] hover:underline flex items-center space-x-1"
                    >
                      <span>View Certificate</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-4 rounded-xl bg-[#191F28] border border-[#2A3342] flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileSpreadsheet className="w-5 h-5 text-[#38BDF8]" />
                      <div>
                        <h4 className="text-xs font-extrabold text-white">
                          Compliance, Dimensional & Weighbridge Inspection Report
                        </h4>
                        <p className="text-[11px] text-[#94A3B8]">
                          Electronic weighbridge slip & pre-dispatch dimensional check
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#38BDF8] bg-[#132235] px-2.5 py-1 rounded border border-[#38BDF8]/30">
                      Standard
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right 5 Columns: Added Items & Quotation Cart Flow */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl shadow-lg p-5 text-white">
              <div className="flex items-center justify-between border-b border-[#222934] pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-white">
                    Your Added Items ({activeCombinations.length})
                  </h3>
                  <p className="text-[11px] text-[#94A3B8]">
                    Configured {category.name} combinations in your Quotation Cart
                  </p>
                </div>

                <Link
                  href="/cart"
                  className="text-xs text-[#E8732A] hover:text-[#F28B49] font-bold"
                >
                  Full Cart ({cart.length}) →
                </Link>
              </div>

              {activeCombinations.length === 0 ? (
                <div className="text-center py-8 px-4 bg-[#191F28] border border-dashed border-[#2C3545] rounded-xl">
                  <Layers className="w-8 h-8 text-[#E8732A] mx-auto mb-2" />
                  <p className="text-xs font-bold text-white">No combinations added yet</p>
                  <p className="text-[11px] text-[#94A3B8] mt-1">
                    Select Size, {isTmt ? 'Brand' : 'Steel Grade'}, and Quantity on the left and click &ldquo;Add to Quotation Cart&rdquo;.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeCombinations.map((item, index) => (
                    <div
                      key={item.id}
                      className="border border-[#2A3342] rounded-xl p-3.5 bg-[#191F28] transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#E8732A] bg-[#251811] px-2 py-0.5 rounded-md font-mono border border-[#E06924]/40">
                            Item #{index + 1}
                          </span>
                          <h4 className="text-xs font-extrabold text-white mt-1.5 font-mono">
                            {item.categoryName} — {item.grade}
                          </h4>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#F87171] hover:text-[#EF4444] p-1 rounded transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-2.5 text-[11px] text-[#CBD5E1] space-y-1 border-t border-[#2A3342] pt-2.5">
                        {Object.entries(item.specifications).map(([k, v]) => (
                          <div key={k} className="flex justify-between text-xs">
                            <span className="text-[#94A3B8] font-medium capitalize">
                              {k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}:
                            </span>
                            <span className="font-bold text-white font-mono">{v}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold text-white pt-1.5 border-t border-[#2A3342]">
                          <span>Quantity:</span>
                          <span className="text-[#E8732A] font-mono">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                        {item.specialInstructions && (
                          <p className="text-[10px] text-[#94A3B8] italic pt-1">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="pt-3 space-y-2.5">
                    <Link
                      href="/cart"
                      className="w-full bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-black py-3 px-4 rounded-xl border border-[#F59352]/50 flex items-center justify-center space-x-2 transition shadow-md cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-white" />
                      <span>Proceed to Quotation Cart & Request RFQ ({cart.length}) →</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setAddAnotherModalOpen(true)}
                      className="w-full bg-[#191F28] hover:bg-[#222A36] text-[#CBD5E1] hover:text-white text-xs font-bold py-2.5 px-4 rounded-xl border border-[#2C3545] transition cursor-pointer"
                    >
                      + Add Another Raw Material
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* B2B Quotation Flow Notice */}
            <div className="p-4 bg-[#14181F] border border-[#262E3B] rounded-2xl text-xs text-white flex items-start space-x-3">
              <HelpCircle className="w-4 h-4 text-[#E8732A] shrink-0 mt-0.5" />
              <div className="space-y-1 text-[11px] text-[#94A3B8] leading-relaxed">
                <p className="font-bold text-white">How Our Quotation & Ordering Flow Works:</p>
                <p>1. Configure your required Size, Grade/Brand, and Quantity (and optional technical specs if needed) and add to Cart.</p>
                <p>2. Submit your Quotation Request from the Cart in one click.</p>
                <p>3. Our Ludhiana trading desk assigns official mill-direct rates & freight so you can review and confirm your order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "+ Add Another Product" Quick-Switcher Modal (from fti-app-sooty.vercel.app) */}
      {addAnotherModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setAddAnotherModalOpen(false)}
        >
          <div
            className="bg-[#131820] border border-[#2C3545] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 bg-[#0E1218] border-b border-[#222A36] flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">
                  Switch or Add Another Raw Material
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Choose any steel category below to configure and add to your Quotation Cart.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddAnotherModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#1A2029] text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto">
              {rawMaterialCategories.map((cat: ProductCategory) => {
                const isCurrent = cat.slug === slug;
                return (
                  <Link
                    key={cat.id}
                    href={`/raw-materials/${cat.slug}`}
                    onClick={() => setAddAnotherModalOpen(false)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                      isCurrent
                        ? 'bg-[#251811] border-[#E8732A] text-white'
                        : 'bg-[#181E27] hover:bg-[#1E2631] border-[#283140] text-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ProductIcon slug={cat.slug} className="w-10 h-10 shrink-0" />
                      <div>
                        <h4 className="text-xs font-extrabold text-white">{cat.name}</h4>
                        <p className="text-[10px] text-[#94A3B8] font-mono">
                          {cat.availableGrades.length}{' '}
                          {cat.slug === 'tmt-bar' ? 'Brands' : 'Grades'} •{' '}
                          {cat.specificationFields[0]?.options?.length || 0} Sizes
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#E8732A]" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
