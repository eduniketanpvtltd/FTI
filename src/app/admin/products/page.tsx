'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { ProductIcon } from '@/components/ui/ProductIcon';
import { ProductCategory } from '@/types';
import { Boxes, ArrowLeft } from 'lucide-react';

export default function AdminProductsPage() {
  const { categories } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(
    categories[0] || null
  );
  const [mobileTab, setMobileTab] = useState<'categories' | 'details'>('categories');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Product Catalog & <span className="text-[#E8732A]">Category Configurations</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Configure dynamic specification fields, dimensional parameters, and alloy grades per material category.
          </p>
        </div>
      </div>

      {/* Mobile-only Segmented Control */}
      <div className="lg:hidden flex rounded-xl bg-[#14181F] border border-[#28303E] p-1 shadow-inner text-xs">
        <button
          type="button"
          onClick={() => setMobileTab('categories')}
          className={`flex-1 py-2 font-bold rounded-lg transition touch-manipulation flex items-center justify-center space-x-1.5 cursor-pointer ${
            mobileTab === 'categories'
              ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white shadow-sm'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('details')}
          className={`flex-1 py-2 font-bold rounded-lg transition touch-manipulation flex items-center justify-center space-x-1.5 cursor-pointer ${
            mobileTab === 'details'
              ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white shadow-sm'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <span>{selectedCategory ? selectedCategory.name : 'Details'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Categories List (5 Cols) */}
        <div
          className={`lg:col-span-5 space-y-3 ${
            mobileTab === 'categories' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-4 shadow-lg">
            <h2 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">
              Categories ({categories.length})
            </h2>

            <div className="space-y-2.5">
              {categories.map((cat: ProductCategory) => {
                const isSelected = selectedCategory?.id === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setMobileTab('details');
                    }}
                    className={`cursor-pointer p-3.5 rounded-xl border flex items-center justify-between transition text-xs touch-manipulation ${
                      isSelected
                        ? 'bg-[#251811] border-[#E06924] shadow-md ring-1 ring-[#E06924]'
                        : 'bg-[#191F28] border-[#2A3342] hover:border-[#3A4659]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ProductIcon slug={cat.slug} className="w-9 h-9 shrink-0" />
                      <div>
                        <h3 className="font-bold text-white">{cat.name}</h3>
                        <p className="text-[11px] text-[#94A3B8] font-mono">
                          {cat.specificationFields.length} specs • {cat.availableGrades.length}{' '}
                          grades
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          cat.isComingSoon
                            ? 'bg-[#332114] text-[#E58A3C] border border-[#C86D28]/50'
                            : 'bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40'
                        }`}
                      >
                        {cat.isComingSoon ? 'Coming Soon' : 'Active'}
                      </span>
                      <span className="lg:hidden text-[#E8732A] font-bold text-xs">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Category Configuration Details (7 Cols) */}
        <div
          className={`lg:col-span-7 ${
            mobileTab === 'details' ? 'block' : 'hidden lg:block'
          }`}
        >
          {selectedCategory ? (
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-5 sm:p-6 shadow-lg space-y-5">
              {/* Mobile Back Button */}
              <div className="lg:hidden flex items-center justify-between pb-2 border-b border-[#222934]">
                <button
                  type="button"
                  onClick={() => setMobileTab('categories')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#E8732A] bg-[#251811] border border-[#E06924]/40 px-3 py-1.5 rounded-xl touch-manipulation"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Categories</span>
                </button>
              </div>
              <div className="flex items-start justify-between border-b border-[#222934] pb-4">
                <div className="flex items-center space-x-3.5">
                  <ProductIcon slug={selectedCategory.slug} className="w-12 h-12" />
                  <div>
                    <h2 className="text-lg font-extrabold text-white">
                      {selectedCategory.name}
                    </h2>
                    <p className="text-xs text-[#94A3B8] font-mono">
                      Slug: {selectedCategory.slug}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-lg ${
                    selectedCategory.isComingSoon
                      ? 'bg-[#332114] text-[#E58A3C] border border-[#C86D28]/50'
                      : 'bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40'
                  }`}
                >
                  {selectedCategory.isComingSoon
                    ? 'Catalog Inactive (Coming Soon)'
                    : 'Active for RFQs'}
                </span>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1.5">
                  Category Description
                </label>
                <p className="text-xs text-[#CBD5E1] bg-[#191F28] p-3.5 rounded-xl border border-[#2A3342] leading-relaxed">
                  {selectedCategory.description}
                </p>
              </div>

              {/* Configured Specification Fields */}
              <div>
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2.5">
                  Configured Specification Fields ({selectedCategory.specificationFields.length})
                </h3>
                {selectedCategory.specificationFields.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] italic bg-[#191F28] p-4 rounded-xl border border-dashed border-[#2A3342]">
                    No specifications configured (Category is in Coming Soon status).
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {selectedCategory.specificationFields.map((field) => (
                      <div
                        key={field.key}
                        className="bg-[#191F28] border border-[#2A3342] rounded-xl p-3.5 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-white">{field.label}</span>
                          <span className="font-mono text-[10px] bg-[#251811] text-[#E8732A] border border-[#E06924]/40 px-2 py-0.5 rounded-md uppercase font-bold">
                            {field.type} • {field.required ? 'Required' : 'Optional'}
                          </span>
                        </div>
                        {field.options && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {field.options.map((opt) => (
                              <span
                                key={opt}
                                className="bg-[#14181F] border border-[#28303E] text-[#CBD5E1] text-[10px] px-2 py-0.5 rounded-md font-mono"
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
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2.5">
                  Available Material Grades ({selectedCategory.availableGrades.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory.availableGrades.map((grade) => (
                    <span
                      key={grade}
                      className="bg-[#251811] border border-[#E06924]/40 text-[#E8732A] text-xs px-3 py-1 rounded-lg font-mono font-bold"
                    >
                      {grade}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-12 text-center text-[#94A3B8]">
              Select a category to view specifications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
