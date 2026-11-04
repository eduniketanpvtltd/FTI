'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { ProductIcon } from '@/components/ui/ProductIcon';
import { ProductCategory } from '@/types';
import { Boxes, Plus, Edit, CheckCircle2, ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function AdminProductsPage() {
  const { categories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(categories[0] || null);
  const [mobileTab, setMobileTab] = useState<'categories' | 'details'>('categories');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Product Catalog & Category Configurations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure dynamic specification fields, dimensional parameters, and alloy grades per material category.
          </p>
        </div>
      </div>

      {/* Mobile-only Segmented Control */}
      <div className="lg:hidden flex rounded-lg bg-slate-200 p-1 shadow-inner text-xs">
        <button
          type="button"
          onClick={() => setMobileTab('categories')}
          className={`flex-1 py-2 font-bold rounded-md transition touch-manipulation flex items-center justify-center space-x-1.5 ${
            mobileTab === 'categories'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('details')}
          className={`flex-1 py-2 font-bold rounded-md transition touch-manipulation flex items-center justify-center space-x-1.5 ${
            mobileTab === 'details'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>{selectedCategory ? selectedCategory.name : 'Details'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Categories List (5 Cols) */}
        <div className={`lg:col-span-5 space-y-3 ${mobileTab === 'categories' ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Categories ({categories.length})
            </h2>

            <div className="space-y-2">
              {categories.map((cat: ProductCategory) => {
                const isSelected = selectedCategory?.id === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMobileTab('details');
                    }}
                    className={`cursor-pointer p-3 rounded-lg border flex items-center justify-between transition text-xs touch-manipulation ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-600'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ProductIcon slug={cat.slug} className="w-9 h-9 shrink-0" />
                      <div>
                        <h3 className="font-bold text-slate-900">{cat.name}</h3>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {cat.specificationFields.length} specs • {cat.availableGrades.length} grades
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          cat.isComingSoon
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {cat.isComingSoon ? 'Coming Soon' : 'Active'}
                      </span>
                      <span className="lg:hidden text-blue-600 font-bold text-xs">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Category Configuration Details (7 Cols) */}
        <div className={`lg:col-span-7 ${mobileTab === 'details' ? 'block' : 'hidden lg:block'}`}>
          {selectedCategory ? (
            <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-6 shadow-xs space-y-5">
              {/* Mobile Back Button */}
              <div className="lg:hidden flex items-center justify-between pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setMobileTab('categories')}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1.5 rounded touch-manipulation"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Categories</span>
                </button>
              </div>
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-3">
                  <ProductIcon slug={selectedCategory.slug} className="w-12 h-12" />
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{selectedCategory.name}</h2>
                    <p className="text-xs text-slate-500 font-mono">Slug: {selectedCategory.slug}</p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded ${
                    selectedCategory.isComingSoon
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedCategory.isComingSoon ? 'Catalog Inactive (Coming Soon)' : 'Active for RFQs'}
                </span>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category Description
                </label>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed">
                  {selectedCategory.description}
                </p>
              </div>

              {/* Configured Specification Fields */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Configured Specification Fields ({selectedCategory.specificationFields.length})
                </h3>
                {selectedCategory.specificationFields.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded border border-dashed border-slate-200">
                    No specifications configured (Category is in Coming Soon status).
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedCategory.specificationFields.map((field) => (
                      <div
                        key={field.key}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900">{field.label}</span>
                          <span className="font-mono text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded uppercase">
                            {field.type} • {field.required ? 'Required' : 'Optional'}
                          </span>
                        </div>
                        {field.options && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {field.options.map((opt) => (
                              <span
                                key={opt}
                                className="bg-white border border-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-mono"
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Configured Grades */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Available Material Grades ({selectedCategory.availableGrades.length})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCategory.availableGrades.map((grade) => (
                    <span
                      key={grade}
                      className="bg-blue-50 border border-blue-200 text-blue-900 text-xs px-2.5 py-1 rounded font-mono font-semibold"
                    >
                      {grade}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400">
              Select a category to view specifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
