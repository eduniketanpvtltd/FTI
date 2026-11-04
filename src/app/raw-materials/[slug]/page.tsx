'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { ProductIcon } from '@/components/ui/ProductIcon';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ShoppingCart,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Layers,
  ChevronDown,
  Sliders,
} from 'lucide-react';

import { ProductCategory, SpecificationField } from '@/types';

export default function CategoryDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-[#252A2E]">Loading material specifications...</div>}>
      <CategoryDetailContent />
    </React.Suspense>
  );
}

function CategoryDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { categories, cart, addToCart, removeFromCart, updateCartItem } = useStore();

  const category = categories.find((c: ProductCategory) => c.slug === slug);

  // Form State for combination builder
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [specValues, setSpecValues] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState<number>(1.0);
  const [unit, setUnit] = useState<string>('Metric Ton');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [advanceRequirementsOpen, setAdvanceRequirementsOpen] = useState<boolean>(false);

  // Separate required specifications from advance / optional specifications
  const requiredSpecFields = useMemo(
    () => category?.specificationFields.filter((f) => f.required) || [],
    [category]
  );
  const optionalSpecFields = useMemo(
    () => category?.specificationFields.filter((f) => !f.required) || [],
    [category]
  );

  // Filter current cart items belonging to this category
  const activeCombinations = useMemo(
    () => cart.filter((item) => item.categorySlug === slug),
    [cart, slug]
  );

  // Default setup when category is loaded
  React.useEffect(() => {
    if (category) {
      if (category.availableGrades.length > 0 && !selectedGrade) {
        setSelectedGrade(category.availableGrades[0]);
      }
      const initialSpecs: Record<string, string> = {};
      category.specificationFields.forEach((field: SpecificationField) => {
        if (field.options && field.options.length > 0) {
          initialSpecs[field.key] = field.options[0];
        }
      });
      setSpecValues(initialSpecs);
    }
  }, [category, selectedGrade]);

  if (!category) {
    return (
      <CustomerLayout>
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <AlertCircle className="w-12 h-12 text-[#49352D] mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[#252A2E]">Category Not Found</h2>
          <p className="text-xs text-[#49352D] mt-1 mb-4 font-medium">
            The material category you requested does not exist or has been modified.
          </p>
          <Link
            href="/raw-materials"
            className="inline-flex items-center space-x-1.5 bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold px-4 py-2 rounded border border-[#B18A70]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Raw Materials</span>
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  // Handle adding a combination
  const handleAddCombination = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdding) return;
    setFormError(null);

    if (!selectedGrade) {
      setFormError('Please select a material grade.');
      return;
    }

    if (!quantity || quantity <= 0) {
      setFormError('Please specify a valid quantity greater than 0.');
      return;
    }

    // Check required fields
    for (const field of category.specificationFields) {
      if (field.required && !specValues[field.key]) {
        setFormError(`Please select or enter the required field: ${field.label}`);
        return;
      }
    }

    setIsAdding(true);

    // Filter out empty/unspecified optional specifications
    const cleanSpecs: Record<string, string> = {};
    Object.entries(specValues).forEach(([k, v]) => {
      if (v && typeof v === 'string' && v.trim() !== '') {
        cleanSpecs[k] = v.trim();
      }
    });

    // Add combination line item to Quotation Cart
    addToCart({
      categoryId: category.id,
      categorySlug: category.slug,
      categoryName: category.name,
      specifications: cleanSpecs,
      grade: selectedGrade,
      quantity: Number(quantity),
      unit,
      specialInstructions: specialInstructions.trim() || undefined,
    });

    setSuccessMessage(`Added combination for ${category.name} (${selectedGrade}) to Quotation Cart!`);
    setSpecialInstructions('');

    // Re-enable submission after 500ms
    setTimeout(() => {
      setIsAdding(false);
    }, 500);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <CustomerLayout>
      {/* Category Header Banner - Dark Chocolate Brown */}
      <div className="bg-[#49352D] text-[#F1EAE1] py-6 px-4 sm:px-6 border-b border-[#343A3F]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-[#A8ADB1] mb-2 font-medium">
            <Link href="/" className="hover:text-[#F1EAE1] transition">Home</Link>
            <span>/</span>
            <Link href="/raw-materials" className="hover:text-[#F1EAE1] transition">Raw Materials</Link>
            <span>/</span>
            <span className="text-[#B18A70] font-bold">{category.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <ProductIcon slug={category.slug} className="w-14 h-14 shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F1EAE1]">
                  {category.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#A8ADB1] mt-1 max-w-2xl leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>

            <Link
              href="/cart"
              className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold px-4 py-2.5 rounded border border-[#B18A70] flex items-center space-x-2 shadow shrink-0 transition"
            >
              <ShoppingCart className="w-4 h-4 text-[#F1EAE1]" />
              <span>View Quotation Cart ({cart.length})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Builder & Combinations Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Combination Configuration Form (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg shadow-sm p-6 text-[#252A2E]">
              <div className="flex items-center justify-between border-b border-[#737A7F] pb-3 mb-5">
                <div>
                  <h2 className="text-base font-extrabold text-[#252A2E]">
                    Add Specification Combination
                  </h2>
                  <p className="text-xs text-[#49352D] font-medium">
                    Configure dimension, grade, and lot quantity. You can add multiple combinations.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#F1EAE1] bg-[#76513F] px-2.5 py-0.5 rounded border border-[#B18A70]">
                  Step 1 of 2
                </span>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-[#DC6262]/20 border border-[#DC6262] text-[#252A2E] text-xs rounded flex items-center space-x-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-[#DC6262] shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-[#10B981]/20 border border-[#10B981] text-[#252A2E] text-xs rounded flex items-center space-x-2 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleAddCombination} className="space-y-4">
                {/* 1. Grade Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#252A2E] mb-1.5">
                    Material Grade <span className="text-[#DC6262]">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {category.availableGrades.map((grade: string) => (
                      <button
                        type="button"
                        key={grade}
                        onClick={() => setSelectedGrade(grade)}
                        className={`py-2 px-2.5 text-xs rounded border text-left font-mono transition cursor-pointer ${
                          selectedGrade === grade
                            ? 'bg-[#76513F] border-[#604333] text-[#F1EAE1] font-bold ring-2 ring-[#B18A70] shadow-xs'
                            : 'bg-[#A8ADB1] border-[#737A7F] text-[#252A2E] hover:bg-[#C7CBD0] font-semibold'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Required Specification Fields */}
                {requiredSpecFields.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {requiredSpecFields.map((field: SpecificationField) => (
                      <div key={field.key}>
                        <label className="block text-xs font-bold text-[#252A2E] mb-1">
                          {field.label} <span className="text-[#DC6262]">*</span>
                        </label>

                        {field.type === 'select' && field.options ? (
                          <select
                            value={specValues[field.key] || ''}
                            onChange={(e) =>
                              setSpecValues({ ...specValues, [field.key]: e.target.value })
                            }
                            className="w-full text-xs bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium"
                            required={field.required}
                          >
                            {field.options.map((opt: string) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            value={specValues[field.key] || ''}
                            onChange={(e) =>
                              setSpecValues({ ...specValues, [field.key]: e.target.value })
                            }
                            placeholder={field.placeholder || `Enter ${field.label}`}
                            className="w-full text-xs bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium"
                            required={field.required}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Quantity & Unit of Measurement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#252A2E] mb-1">
                      Required Quantity <span className="text-[#DC6262]">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-mono font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#252A2E] mb-1">
                      Unit of Measurement <span className="text-[#DC6262]">*</span>
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full text-xs bg-[#A8ADB1] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium"
                    >
                      <option value="Metric Ton">Metric Ton (MT - Industrial Standard)</option>
                      <option value="Kilogram">Kilogram (kg)</option>
                      <option value="Pieces / Bundles">Pieces / Bundles</option>
                      <option value="Meters">Meters</option>
                    </select>
                  </div>
                </div>

                {/* 4. Advance Requirements (Collapsible) */}
                <div className="pt-2">
                  <div className="border border-[#737A7F] rounded-lg overflow-hidden bg-[#A8ADB1]/40 transition">
                    <button
                      type="button"
                      onClick={() => setAdvanceRequirementsOpen(!advanceRequirementsOpen)}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-[#A8ADB1] transition cursor-pointer select-none"
                      aria-expanded={advanceRequirementsOpen}
                    >
                      <div className="flex items-center space-x-2">
                        <Sliders className="w-4 h-4 text-[#76513F]" />
                        <span className="text-xs font-extrabold text-[#252A2E] uppercase tracking-wider">
                          Advance Requirements
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-[#858C92] text-[#252A2E] px-2 py-0.5 rounded border border-[#737A7F]">
                          Optional ({optionalSpecFields.length + 1})
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-xs font-bold text-[#49352D]">
                        <span>{advanceRequirementsOpen ? 'Hide' : 'Expand'}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            advanceRequirementsOpen ? 'rotate-180 text-[#76513F]' : 'text-[#626B72]'
                          }`}
                        />
                      </div>
                    </button>

                    {advanceRequirementsOpen && (
                      <div className="p-3 sm:p-4 border-t border-[#737A7F]/40 space-y-4 animate-in fade-in duration-150 bg-[#A8ADB1]/20">
                        {/* Optional Dynamic Specifications */}
                        {optionalSpecFields.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {optionalSpecFields.map((field: SpecificationField) => (
                              <div key={field.key}>
                                <label className="block text-xs font-bold text-[#252A2E] mb-1">
                                  {field.label}{' '}
                                  <span className="text-[#49352D] font-medium text-[11px] ml-1.5">
                                    (Optional)
                                  </span>
                                </label>
                                {field.type === 'select' && field.options ? (
                                  <select
                                    value={specValues[field.key] || ''}
                                    onChange={(e) =>
                                      setSpecValues({ ...specValues, [field.key]: e.target.value })
                                    }
                                    className="w-full text-xs bg-[#BAC0C5] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium"
                                  >
                                    <option value="">-- Not Specified (Optional) --</option>
                                    {field.options.map((opt: string) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type={field.type}
                                    value={specValues[field.key] || ''}
                                    onChange={(e) =>
                                      setSpecValues({ ...specValues, [field.key]: e.target.value })
                                    }
                                    placeholder={
                                      field.placeholder || `Enter ${field.label} (Optional)`
                                    }
                                    className="w-full text-xs bg-[#BAC0C5] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Special Requirements / Tolerances */}
                        <div>
                          <label className="block text-xs font-bold text-[#252A2E] mb-1">
                            Special Requirements / Tolerances{' '}
                            <span className="text-[#49352D] font-medium text-[11px] ml-1.5">
                              (Optional)
                            </span>
                          </label>
                          <textarea
                            rows={2}
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                            placeholder="e.g. Mill test certificate required, cutting tolerance ±2mm, ultrasonic testing..."
                            className="w-full text-xs bg-[#BAC0C5] border border-[#737A7F] rounded p-2 text-[#252A2E] font-medium"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Important Notice: No Prices Displayed */}
                <div className="p-3 bg-[#343A3F] border border-[#737A7F] rounded text-xs text-[#F1EAE1] flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-[#B18A70] shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-[11px] text-[#A8ADB1]">
                    <span className="font-bold text-[#F1EAE1]">B2B Quotation Model:</span> Prices are not displayed publicly.
                    After adding all required combinations, click "Request a Quotation".
                    The trading desk will prepare and send custom mill-direct pricing to your account.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isAdding}
                    className={`w-full sm:flex-1 bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold py-2.5 px-4 rounded border border-[#B18A70] shadow flex items-center justify-center space-x-2 transition cursor-pointer ${
                      isAdding ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAdding ? 'Adding to Cart...' : 'Add This Combination to Cart'}</span>
                  </button>

                  <Link
                    href="/cart"
                    className="w-full sm:w-auto bg-[#343A3F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold py-2.5 px-4 rounded border border-[#737A7F] flex items-center justify-center space-x-2 transition"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#B18A70]" />
                    <span>Go to Cart ({cart.length})</span>
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Active Combinations for this Material (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-lg shadow-sm p-5 text-[#252A2E]">
              <div className="flex items-center justify-between border-b border-[#737A7F] pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-[#252A2E]">
                    Added Combinations ({activeCombinations.length})
                  </h3>
                  <p className="text-[11px] text-[#49352D] font-medium">
                    Items of {category.name} currently in your cart
                  </p>
                </div>

                <Link
                  href="/cart"
                  className="text-xs text-[#76513F] hover:text-[#604333] font-bold"
                >
                  View All Cart ({cart.length})
                </Link>
              </div>

              {activeCombinations.length === 0 ? (
                <div className="text-center py-8 px-4 bg-[#A8ADB1] border border-dashed border-[#737A7F] rounded">
                  <Layers className="w-8 h-8 text-[#49352D] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#252A2E]">No combinations added yet</p>
                  <p className="text-[11px] text-[#49352D] mt-1 font-medium">
                    Configure your specifications on the left and click "Add This Combination to Cart".
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeCombinations.map((item, index) => (
                    <div
                      key={item.id}
                      className="border border-[#737A7F] rounded-lg p-3 bg-[#A8ADB1] transition shadow-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#F1EAE1] bg-[#76513F] px-1.5 py-0.2 rounded font-mono border border-[#B18A70]">
                            Comb #{index + 1}
                          </span>
                          <h4 className="text-xs font-bold text-[#252A2E] mt-1">
                            {item.grade}
                          </h4>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#DC6262] hover:text-[#DC6262]/80 p-1 rounded transition cursor-pointer"
                          title="Remove combination"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Specification Details List */}
                      <div className="mt-2 text-[11px] text-[#252A2E] space-y-0.5 border-t border-[#737A7F]/40 pt-2">
                        {Object.entries(item.specifications).map(([k, v]) => (
                          <div key={k} className="flex justify-between text-xs">
                            <span className="text-[#49352D] font-medium capitalize">
                              {k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim()}:
                            </span>
                            <span className="font-bold text-[#252A2E]">{v}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold text-[#252A2E] pt-1 border-t border-[#737A7F]/40">
                          <span>Quantity:</span>
                          <span className="text-[#604333]">{item.quantity} {item.unit}</span>
                        </div>
                        {item.specialInstructions && (
                          <p className="text-[10px] text-[#49352D] italic pt-1 font-medium">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="pt-3">
                    <Link
                      href="/cart"
                      className="w-full bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold py-2.5 px-4 rounded border border-[#B18A70] flex items-center justify-center space-x-2 transition shadow cursor-pointer"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-[#F1EAE1]" />
                      <span>Proceed to Quotation Cart</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
