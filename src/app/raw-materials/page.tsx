'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { ProductIcon } from '@/components/ui/ProductIcon';
import { Layers, ArrowRight, Check, Search, ShieldCheck } from 'lucide-react';

import { ProductCategory } from '@/types';

export default function RawMaterialsPage() {
  const { categories } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const rawMaterials: ProductCategory[] = categories.filter((c: ProductCategory) => !c.isComingSoon);

  // Collect all unique grades across categories for quick filtering
  const allGrades: string[] = Array.from(
    new Set<string>(rawMaterials.flatMap((c: ProductCategory) => c.availableGrades))
  ).slice(0, 8);

  const filtered = rawMaterials.filter((cat: ProductCategory) => {
    const matchesSearch =
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.availableGrades.some((g: string) => g.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGrade =
      selectedGrade === 'all' || cat.availableGrades.includes(selectedGrade);

    return matchesSearch && matchesGrade;
  });

  return (
    <CustomerLayout>
      {/* Top Breadcrumb & Title */}
      <div className="bg-slate-900 text-white py-6 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-200">Home</Link>
            <span>/</span>
            <span className="text-blue-400">Raw Materials</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Industrial Raw Materials Catalog
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Explore seven core steel and alloy material categories. Select a category to configure sizes, diameters, grades, and add multiple combinations to your Quotation Cart.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded text-xs flex items-center space-x-2 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">B2B Direct Mill Sourcing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 sticky top-14 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by material (e.g. Round Bar, EN8, Flat)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900"
            />
          </div>

          {/* Grade Quick Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <span className="text-slate-500 text-[11px] font-semibold shrink-0">Filter Grade:</span>
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition shrink-0 ${
                selectedGrade === 'all'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Grades
            </button>
            {allGrades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition shrink-0 ${
                  selectedGrade === grade
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Material Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cat: ProductCategory, idx: number) => (
            <div
              key={cat.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm hover:shadow transition flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <ProductIcon slug={cat.slug} className="w-12 h-12 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Category 0{idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                  <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                    Quotations Active
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Available Specifications */}
                <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-3">
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Configurable Specifications
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    {cat.specificationFields.map((field: any) => (
                      <div key={field.key} className="flex items-center justify-between">
                        <span className="text-slate-500">{field.label}:</span>
                        <span className="font-medium text-slate-800 text-right">
                          {field.options ? `${field.options.length} Sizes Available` : 'Custom Input'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Grades Chips */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Available Grades
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {cat.availableGrades.map((grade: string) => (
                      <span
                        key={grade}
                        className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono"
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Card Footer */}
              <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Pricing Model</span>
                  <span className="text-xs font-semibold text-slate-700">Official Quotation Only</span>
                </div>

                <Link
                  href={`/raw-materials/${cat.slug}`}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded flex items-center space-x-1.5 shadow transition"
                >
                  <span>Select Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <Layers className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700 text-sm">No Material Categories Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or grade filter.
            </p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
