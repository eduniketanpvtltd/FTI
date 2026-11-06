'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { ProductIcon } from '@/components/ui/ProductIcon';
import { Layers, ArrowRight, Search, ShieldCheck, ChevronDown, ChevronRight } from 'lucide-react';

import { ProductCategory } from '@/types';

function CollapsibleGrades({ grades }: { grades: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#191F28] border border-[#2A3342] rounded-xl overflow-hidden transition">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex items-center justify-between text-left hover:bg-[#1F2631] transition cursor-pointer select-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2">
          <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wider">
            Available Grades
          </h4>
          <span className="text-[10px] font-mono font-bold bg-[#251811] text-[#E8732A] px-2 py-0.5 rounded-md border border-[#E06924]/40">
            {grades.length}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-[11px] font-bold text-[#E8732A]">
          <span>{isOpen ? 'Hide' : 'View'}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#E8732A]' : 'text-[#94A3B8]'
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="p-3 pt-1 border-t border-[#2A3342] animate-in fade-in duration-150">
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {grades.map((grade: string) => (
              <span
                key={grade}
                className="bg-[#12161D] border border-[#2C3545] text-[#E2E8F0] text-[10px] px-2.5 py-1 rounded-lg font-mono font-semibold"
              >
                {grade}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RawMaterialsPage() {
  const { categories } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const rawMaterials: ProductCategory[] = categories.filter(
    (c: ProductCategory) =>
      !c.isComingSoon && c.slug !== 'fasteners' && c.slug !== 'tractor-parts'
  );

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
      {/* Top Hero Banner with AI Foundry Background - Exact Match to Mockup */}
      <div className="relative overflow-hidden border-b border-[#1E242D]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/foundry-hero-bg.jpg"
            alt="Industrial Steel Foundry"
            className="w-full h-56 sm:h-64 object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/35 via-[#0B0E11]/85 to-[#0B0E11]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E11]/90 via-[#0B0E11]/45 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto pt-20 sm:pt-24 pb-5 px-3.5 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-1.5 text-xs text-[#CBD5E1] mb-2 font-medium">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-[#E8732A] font-bold">Raw Materials</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Industrial Raw Materials <span className="text-[#E8732A]">Catalog</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 leading-relaxed">
                Explore seven core steel and alloy material categories. Select a category to configure sizes, diameters, grades, and add multiple combinations to your Quotation Cart.
              </p>
            </div>

            <div className="bg-[#14181F] border border-[#2A323E] px-4 py-3 rounded-xl text-xs flex items-center space-x-2.5 shrink-0 shadow-inner">
              <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0" />
              <span className="text-white font-bold">B2B Direct Mill Sourcing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar - Exact Match to Mockup */}
      <div className="bg-[#0B0E11]/95 backdrop-blur-md border-b border-[#1E242D] py-3.5 px-3.5 sm:px-6 sticky top-14 z-30">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by material (e.g. Round Bar, EN8, Flat)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#14181F] border border-[#2A323E] rounded-xl text-white placeholder-[#64748B] font-medium"
            />
          </div>

          {/* Grade Quick Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            <span className="text-white text-xs font-bold shrink-0">Filter Grade:</span>
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                selectedGrade === 'all'
                  ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 shadow-[0_2px_10px_rgba(224,105,36,0.3)]'
                  : 'bg-[#14181F] text-[#CBD5E1] hover:bg-[#1C222C] border border-[#2A323E]'
              }`}
            >
              All Grades
            </button>
            {allGrades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 shadow-[0_2px_10px_rgba(224,105,36,0.3)]'
                    : 'bg-[#14181F] text-[#CBD5E1] hover:bg-[#1C222C] border border-[#2A323E]'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>

          {/* Accent Progress Line */}
          <div className="h-1 w-full bg-[#161B22] rounded-full overflow-hidden">
            <div className="h-full w-16 bg-gradient-to-r from-[#E8732A] to-[#F59E0B] rounded-full" />
          </div>
        </div>
      </div>

      {/* Material Categories Grid */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cat: ProductCategory, idx: number) => (
            <div
              key={cat.id}
              className="bg-[#14181F] border border-[#28303E] hover:border-[#E06924] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="flex items-center space-x-3.5">
                    <ProductIcon slug={cat.slug} className="w-13 h-13 shrink-0" />
                    <div>
                      <span className="text-[11px] font-extrabold text-[#E8732A] uppercase tracking-wider block">
                        CATEGORY 0{idx + 1}
                      </span>
                      <h3 className="text-lg font-extrabold text-white leading-tight mt-0.5">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                  <span className="bg-[#163828] text-[#6EE7B7] text-[11px] font-bold px-2.5 py-1 rounded-lg border border-[#34D399]/30 whitespace-nowrap">
                    Quotations Active
                  </span>
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Configurable Specifications Box - Exact Match to Mockup */}
                <div className="bg-[#191F28] border border-[#2A3342] rounded-xl p-3.5 mb-3.5">
                  <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wider pb-2.5 mb-2.5 border-b border-[#2A3342]">
                    CONFIGURABLE SPECIFICATIONS
                  </h4>
                  <div className="space-y-2.5 text-xs">
                    {cat.specificationFields.map((field: any) => (
                      <div key={field.key} className="flex items-center justify-between gap-3">
                        <span className="text-[#CBD5E1] font-medium leading-snug">
                          {field.label}
                          {!field.required && (
                            <span className="text-[10px] text-[#64748B] font-normal ml-1">
                              (Optional)
                            </span>
                          )}
                          :
                        </span>
                        <span className="font-extrabold text-[#E8732A] text-right shrink-0">
                          {field.options ? (
                            <>
                              {field.options.length} Sizes
                              <br className="sm:hidden" /> Available
                            </>
                          ) : (
                            <span className="text-white">Custom Input</span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collapsible Available Grades */}
                <CollapsibleGrades grades={cat.availableGrades} />
              </div>

              {/* Bottom Action Card Footer */}
              <div className="bg-[#10141A] border-t border-[#242C38] p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#64748B] block uppercase font-bold tracking-wider">
                    Pricing Model
                  </span>
                  <span className="text-xs font-extrabold text-white">Official Quotation Only</span>
                </div>

                <Link
                  href={`/raw-materials/${cat.slug}`}
                  className="bg-gradient-to-b from-[#E8732A] to-[#C45316] hover:from-[#F2823B] hover:to-[#D45E1C] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 border border-[#F59352]/50 shadow-[0_2px_12px_rgba(224,105,36,0.3)] transition cursor-pointer"
                >
                  <span>Select Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-[#14181F] rounded-2xl border border-[#262E3B]">
            <Layers className="w-10 h-10 text-[#E8732A] mx-auto mb-2" />
            <h3 className="font-extrabold text-white text-sm">No Material Categories Found</h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Try adjusting your search query or grade filter.
            </p>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
