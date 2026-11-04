'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { ProductIcon } from '@/components/ui/ProductIcon';
import { Layers, ArrowRight, Search, ShieldCheck } from 'lucide-react';

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
      {/* Top Breadcrumb & Title - Dark Chocolate Brown */}
      <div className="bg-[#49352D] text-[#F1EAE1] py-6 px-4 sm:px-6 border-b border-[#343A3F]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-[#A8ADB1] mb-2 font-medium">
            <Link href="/" className="hover:text-[#F1EAE1] transition">Home</Link>
            <span>/</span>
            <span className="text-[#B18A70] font-bold">Raw Materials</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F1EAE1]">
                Industrial Raw Materials Catalog
              </h1>
              <p className="text-xs sm:text-sm text-[#A8ADB1] mt-1 leading-relaxed">
                Explore seven core steel and alloy material categories. Select a category to configure sizes, diameters, grades, and add multiple combinations to your Quotation Cart.
              </p>
            </div>

            <div className="bg-[#343A3F] border border-[#737A7F] px-3 py-1.5 rounded text-xs flex items-center space-x-2 shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span className="text-[#F1EAE1] font-semibold">B2B Direct Mill Sourcing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar - Medium Steel Grey */}
      <div className="bg-[#858C92] border-b border-[#737A7F] py-3.5 px-4 sm:px-6 sticky top-14 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#49352D] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by material (e.g. Round Bar, EN8, Flat)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#BAC0C5] border border-[#737A7F] rounded text-[#252A2E] placeholder-[#626B72] font-medium"
            />
          </div>

          {/* Grade Quick Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            <span className="text-[#252A2E] text-[11px] font-bold shrink-0">Filter Grade:</span>
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                selectedGrade === 'all'
                  ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70] shadow-xs'
                  : 'bg-[#A8ADB1] text-[#252A2E] hover:bg-[#BAC0C5] border border-[#737A7F]'
              }`}
            >
              All Grades
            </button>
            {allGrades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70] shadow-xs'
                    : 'bg-[#A8ADB1] text-[#252A2E] hover:bg-[#BAC0C5] border border-[#737A7F]'
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
              className="bg-[#BAC0C5] border border-[#737A7F] hover:border-[#76513F] rounded-lg shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <ProductIcon slug={cat.slug} className="w-12 h-12 shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-[#49352D] uppercase tracking-wider">
                        Category 0{idx + 1}
                      </span>
                      <h3 className="text-base font-extrabold text-[#252A2E]">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                  <span className="bg-[#858C92] text-[#252A2E] text-[11px] font-bold px-2 py-0.5 rounded border border-[#737A7F]">
                    Quotations Active
                  </span>
                </div>

                <p className="text-xs text-[#343A3F] leading-relaxed mb-4 font-medium">
                  {cat.description}
                </p>

                {/* Available Specifications */}
                <div className="bg-[#A8ADB1] border border-[#737A7F] rounded p-3 mb-3">
                  <h4 className="text-[11px] font-extrabold text-[#252A2E] uppercase tracking-wider mb-2">
                    Configurable Specifications
                  </h4>
                  <div className="space-y-1.5 text-xs text-[#252A2E]">
                    {cat.specificationFields.map((field: any) => (
                      <div key={field.key} className="flex items-center justify-between">
                        <span className="text-[#343A3F] font-medium">{field.label}:</span>
                        <span className="font-bold text-[#252A2E] text-right">
                          {field.options ? `${field.options.length} Sizes Available` : 'Custom Input'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Grades Chips */}
                <div>
                  <h4 className="text-[11px] font-extrabold text-[#252A2E] uppercase tracking-wider mb-1.5">
                    Available Grades
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {cat.availableGrades.map((grade: string) => (
                      <span
                        key={grade}
                        className="bg-[#858C92] border border-[#737A7F] text-[#252A2E] text-[10px] px-2 py-0.5 rounded font-mono font-bold"
                      >
                        {grade}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Card Footer */}
              <div className="bg-[#A8ADB1] border-t border-[#737A7F] p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#49352D] block uppercase font-bold">Pricing Model</span>
                  <span className="text-xs font-extrabold text-[#252A2E]">Official Quotation Only</span>
                </div>

                <Link
                  href={`/raw-materials/${cat.slug}`}
                  className="bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] text-xs font-bold px-4 py-2 rounded flex items-center space-x-1.5 border border-[#B18A70] shadow-xs transition cursor-pointer"
                >
                  <span>Select Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-[#BAC0C5] rounded-lg border border-[#737A7F]">
            <Layers className="w-10 h-10 text-[#49352D] mx-auto mb-2" />
            <h3 className="font-extrabold text-[#252A2E] text-sm">No Material Categories Found</h3>
            <p className="text-xs text-[#49352D] mt-1 font-medium">
              Try adjusting your search query or grade filter.
            </p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
