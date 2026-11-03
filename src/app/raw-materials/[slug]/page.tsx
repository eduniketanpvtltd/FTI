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
} from 'lucide-react';

import { ProductCategory, SpecificationField } from '@/types';

export default function CategoryDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading material specifications...</div>}>
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
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800">Category Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            The material category you requested does not exist or has been modified.
          </p>
          <Link
            href="/raw-materials"
            className="inline-flex items-center space-x-1.5 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded"
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

    // Add combination line item to Quotation Cart
    addToCart({
      categoryId: category.id,
      categorySlug: category.slug,
      categoryName: category.name,
      specifications: specValues,
      grade: selectedGrade,
      quantity: Number(quantity),
      unit,
      specialInstructions: specialInstructions.trim() || undefined,
    });

    setSuccessMessage(`Added combination for ${category.name} (${selectedGrade}) to Quotation Cart!`);
    setSpecialInstructions('');

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <CustomerLayout>
      {/* Category Header Banner */}
      <div className="bg-slate-900 text-white py-6 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-200">Home</Link>
            <span>/</span>
            <Link href="/raw-materials" className="hover:text-slate-200">Raw Materials</Link>
            <span>/</span>
            <span className="text-blue-400 font-semibold">{category.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <ProductIcon slug={category.slug} className="w-14 h-14 shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {category.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {category.description}
                </p>
              </div>
            </div>

            <Link
              href="/cart"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded flex items-center space-x-2 shadow shrink-0 transition"
            >
              <ShoppingCart className="w-4 h-4" />
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
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Add Specification Combination
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure dimension, grade, and lot quantity. You can add multiple combinations.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Step 1 of 2
                </span>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center space-x-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleAddCombination} className="space-y-4">
                {/* 1. Grade Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Material Grade <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {category.availableGrades.map((grade: string) => (
                      <button
                        type="button"
                        key={grade}
                        onClick={() => setSelectedGrade(grade)}
                        className={`py-2 px-2.5 text-xs rounded border text-left font-mono transition ${
                          selectedGrade === grade
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold ring-1 ring-blue-600'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Dynamic Specification Fields (Configured in Admin) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {category.specificationFields.map((field: SpecificationField) => (
                    <div key={field.key}>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>

                      {field.type === 'select' && field.options ? (
                        <select
                          value={specValues[field.key] || ''}
                          onChange={(e) =>
                            setSpecValues({ ...specValues, [field.key]: e.target.value })
                          }
                          className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
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
                          className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                          required={field.required}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* 3. Quantity & Unit of Measurement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Required Quantity <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-hidden font-mono font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Unit of Measurement <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-hidden font-medium"
                    >
                      <option value="Metric Ton">Metric Ton (MT - Industrial Standard)</option>
                      <option value="Kilogram">Kilogram (kg)</option>
                      <option value="Pieces / Bundles">Pieces / Bundles</option>
                      <option value="Meters">Meters</option>
                    </select>
                  </div>
                </div>

                {/* 4. Special Instructions (e.g. MTC, ultrasonic test, cut tolerance) */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Special Requirements / Tolerances (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Mill test certificate required, cutting tolerance ±2mm, ultrasonic testing..."
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* Important Notice: No Prices Displayed */}
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded text-xs text-amber-900 flex items-start space-x-2">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-[11px]">
                    <span className="font-bold">B2B Quotation Model:</span> Prices are not displayed publicly.
                    After adding all required combinations, click "Request a Quotation".
                    The trading desk will prepare and send custom mill-direct pricing to your account.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded shadow flex items-center justify-center space-x-2 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add This Combination to Cart</span>
                  </button>

                  <Link
                    href="/cart"
                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold py-2.5 px-4 rounded flex items-center justify-center space-x-2 transition"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                    <span>Go to Cart ({cart.length})</span>
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Active Combinations for this Material (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Added Combinations ({activeCombinations.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Items of {category.name} currently in your cart
                  </p>
                </div>

                <Link
                  href="/cart"
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  View All Cart ({cart.length})
                </Link>
              </div>

              {activeCombinations.length === 0 ? (
                <div className="text-center py-8 px-4 bg-slate-50 border border-dashed border-slate-200 rounded">
                  <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No combinations added yet</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Configure your specifications on the left and click "Add This Combination to Cart".
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeCombinations.map((item, index) => (
                    <div
                      key={item.id}
                      className="border border-slate-200 rounded-lg p-3 bg-slate-50/60 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded font-mono">
                            Comb #{index + 1}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 mt-1">
                            {item.grade}
                          </h4>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                          title="Remove combination"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Specification Details List */}
                      <div className="mt-2 text-[11px] text-slate-600 space-y-0.5 border-t border-slate-200/80 pt-2">
                        {Object.entries(item.specifications).map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span className="text-slate-500 capitalize">{k}:</span>
                            <span className="font-medium text-slate-800">{v}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-semibold text-slate-900 pt-1 border-t border-slate-200/60">
                          <span>Quantity:</span>
                          <span className="text-blue-700">{item.quantity} {item.unit}</span>
                        </div>
                        {item.specialInstructions && (
                          <p className="text-[10px] text-slate-500 italic pt-1">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="pt-3">
                    <Link
                      href="/cart"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 rounded flex items-center justify-center space-x-2 transition shadow"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
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
