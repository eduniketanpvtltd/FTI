'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import {
  FTI_FASTENER_SUBCATEGORIES,
  FTI_ISO_CERTIFICATE,
  FTI_COMPANY_INFO,
  FastenerSubcategoryItem,
} from '@/lib/fti-catalog-data';
import {
  ShieldCheck,
  PhoneCall,
  ChevronRight,
  Search,
  ShoppingCart,
  CheckCircle2,
  FileCode2,
  Flame,
  Snowflake,
  Layers,
} from 'lucide-react';

export default function FastenersPage() {
  const { addToCart } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'with-drawings' | 'bolts' | 'nuts-washers'>('all');
  const [selectedSubcat, setSelectedSubcat] = useState<FastenerSubcategoryItem>(FTI_FASTENER_SUBCATEGORIES[0]);

  const initialDiameter =
    FTI_FASTENER_SUBCATEGORIES[0].sizes[0] ||
    (FTI_FASTENER_SUBCATEGORIES[0].diameters[0] ? `${FTI_FASTENER_SUBCATEGORIES[0].diameters[0]} mm` : 'M12');
  const initialLength = FTI_FASTENER_SUBCATEGORIES[0].lengths[0]
    ? `${FTI_FASTENER_SUBCATEGORIES[0].lengths[0]} mm`
    : '50 mm';

  const [selectedStandard, setSelectedStandard] = useState<string>(
    FTI_FASTENER_SUBCATEGORIES[0].standards[0] || 'Standard / Custom Drawing'
  );
  const [selectedShape, setSelectedShape] = useState<string>(
    FTI_FASTENER_SUBCATEGORIES[0].shapes[0] || 'Standard'
  );
  const [selectedDiameter, setSelectedDiameter] = useState<string>(initialDiameter);
  const [selectedLength, setSelectedLength] = useState<string>(initialLength);
  const [selectedGrade, setSelectedGrade] = useState<string>(
    FTI_FASTENER_SUBCATEGORIES[0].grades[0] || 'EN-8D'
  );
  const [selectedThread, setSelectedThread] = useState<string>(
    FTI_FASTENER_SUBCATEGORIES[0].threads[0] || 'Coarse metric'
  );
  const [selectedFinish, setSelectedFinish] = useState<string>(
    FTI_FASTENER_SUBCATEGORIES[0].finishes[0] || 'Auto black'
  );
  const [quantity, setQuantity] = useState<string>('1');
  const [unit, setUnit] = useState<string>('Metric Ton');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [addedBanner, setAddedBanner] = useState<string | null>(null);
  const [activeDrawingIdx, setActiveDrawingIdx] = useState<number>(0);

  const handleSelectSubcategory = (sub: FastenerSubcategoryItem) => {
    setSelectedSubcat(sub);
    setSelectedStandard(sub.standards[0] || 'Standard / Custom Drawing');
    setSelectedShape(sub.shapes[0] || 'Standard');
    setSelectedDiameter(
      sub.sizes[0] || (sub.diameters[0] ? `${sub.diameters[0]} mm` : 'M12')
    );
    setSelectedLength(sub.lengths[0] ? `${sub.lengths[0]} mm` : 'Standard');
    setSelectedGrade(sub.grades[0] || 'EN-8D');
    setSelectedThread(sub.threads[0] || 'Coarse metric');
    setSelectedFinish(sub.finishes[0] || 'Auto black');
    setActiveDrawingIdx(0);
  };

  const filteredSubcategories = useMemo(() => {
    return FTI_FASTENER_SUBCATEGORIES.filter((sub: FastenerSubcategoryItem) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        sub.title.toLowerCase().includes(q) ||
        sub.description.toLowerCase().includes(q) ||
        sub.standards.some((s: string) => s.toLowerCase().includes(q)) ||
        sub.grades.some((g: string) => g.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (filterMode === 'with-drawings') return sub.drawingsCount > 0;
      if (filterMode === 'bolts') {
        return (
          sub.slug.includes('bolt') ||
          sub.slug.includes('screw') ||
          sub.slug.includes('hook')
        );
      }
      if (filterMode === 'nuts-washers') {
        return (
          sub.slug.includes('nut') ||
          sub.slug.includes('washer') ||
          sub.slug.includes('plate')
        );
      }
      return true;
    });
  }, [searchQuery, filterMode]);

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) return;

    const specs: Record<string, string> = {
      Subcategory: selectedSubcat.title,
      Standard: selectedStandard,
      Diameter: selectedDiameter,
    };
    if (selectedSubcat.lengths.length > 0) {
      specs.Length = selectedLength;
    }
    if (selectedSubcat.shapes.length > 0) {
      specs.Shape = selectedShape;
    }
    if (selectedSubcat.threads.length > 0) {
      specs['Thread Type'] = selectedThread;
    }
    specs['Surface Finish'] = selectedFinish;

    addToCart({
      categoryId: 'cat-fasteners',
      categoryName: `Fasteners — ${selectedSubcat.title}`,
      categorySlug: 'fasteners',
      specifications: specs,
      grade: selectedGrade,
      quantity: numQty,
      unit,
      specialInstructions:
        specialInstructions.trim() ||
        `IS Standard: ${selectedStandard} | Finish: ${selectedFinish}`,
    });

    setAddedBanner(
      `${selectedSubcat.title} (${selectedDiameter}, Grade ${selectedGrade}) added to Quotation Cart!`
    );
    setTimeout(() => setAddedBanner(null), 4500);
  };

  const activeDrawing = selectedSubcat.sampleDrawings[activeDrawingIdx];

  return (
    <CustomerLayout>
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden border-b border-[#1E242D]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/foundry-hero-bg.jpg"
            alt="Industrial Fastener Forging Facility"
            className="w-full h-64 sm:h-72 object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/40 via-[#0B0E11]/85 to-[#0B0E11]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E11]/95 via-[#0B0E11]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto pt-8 sm:pt-12 pb-7 px-3.5 sm:px-6">
          <div className="flex items-center space-x-1.5 text-xs text-[#CBD5E1] mb-3 font-medium">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-[#E8732A] font-bold">Industrial Fasteners Catalog</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#112A1F] border border-[#22C55E]/40 px-3 py-1 rounded-full text-[11px] font-bold text-[#34D399] mb-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>ISO 9001:2015 Certified Manufacturing ({FTI_ISO_CERTIFICATE.certificateNumber})</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Industrial Fasteners & <span className="text-[#E8732A]">IS Engineering Catalog</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed max-w-2xl">
                Cold & hot forged high-tensile fasteners across <strong className="text-white">17 subcategories</strong> and{' '}
                <strong className="text-white">543 IS engineering dimension records</strong> (IS 1363, IS 1364, IS 730, IS 1120).
                Direct mill dispatch from our Ludhiana Works.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
              <div className="bg-[#14181F]/90 border border-[#2A323E] px-3.5 py-2.5 rounded-xl">
                <div className="flex items-center space-x-1.5 text-[#38BDF8] text-[11px] font-bold">
                  <Snowflake className="w-3.5 h-3.5" />
                  <span>Cold Forging</span>
                </div>
                <p className="text-xs font-extrabold text-white mt-0.5">Ø 5–24 mm · L 10–200 mm</p>
              </div>
              <div className="bg-[#14181F]/90 border border-[#2A323E] px-3.5 py-2.5 rounded-xl">
                <div className="flex items-center space-x-1.5 text-[#E8732A] text-[11px] font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Hot Forging</span>
                </div>
                <p className="text-xs font-extrabold text-white mt-0.5">Ø 24–56 mm · L 50–450 mm</p>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-[#14181F]/90 border border-[#2A323E] px-3.5 py-2.5 rounded-xl">
                <div className="flex items-center space-x-1.5 text-[#34D399] text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Grades Stocked</span>
                </div>
                <p className="text-xs font-extrabold text-white mt-0.5">8.8, 10.9, 12.9, EN-8D, Boron</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-7">
        {/* Added to Cart Toast */}
        {addedBanner && (
          <div className="mb-6 p-4 rounded-2xl bg-[#11291F] border border-[#22C55E]/50 text-[#34D399] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-lg">
            <div className="flex items-center space-x-2.5 text-xs sm:text-sm font-bold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{addedBanner}</span>
            </div>
            <Link
              href="/cart"
              className="inline-flex items-center space-x-1.5 bg-[#22C55E] text-[#081C15] font-black text-xs px-3.5 py-2 rounded-xl hover:bg-[#34D399] transition shrink-0"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>View Quotation Cart</span>
            </Link>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fasteners by name, IS standard (IS 1363, IS 730), grade..."
              className="w-full bg-[#131820] border border-[#262F3D] focus:border-[#E8732A] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#64748B] outline-none transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: `All Subcategories (${FTI_FASTENER_SUBCATEGORIES.length})` },
              { id: 'with-drawings', label: 'With IS Drawings & Photos (6)' },
              { id: 'bolts', label: 'Bolts, Screws & Hooks (8)' },
              { id: 'nuts-washers', label: 'Nuts, Washers & Plates (9)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterMode(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterMode === tab.id
                    ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 shadow'
                    : 'bg-[#131820] text-[#94A3B8] hover:text-white border border-[#242C38]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Column Layout: Left Subcategory Grid + Right Interactive Configurator & IS Dimension Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Columns: 17 Fastener Subcategories Grid */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredSubcategories.map((sub: FastenerSubcategoryItem) => {
                const isSelected = selectedSubcat.slug === sub.slug;
                return (
                  <div
                    key={sub.slug}
                    onClick={() => handleSelectSubcategory(sub)}
                    className={`group rounded-2xl border p-3.5 transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-[#231812] to-[#151A22] border-[#E8732A] shadow-[0_0_20px_rgba(232,115,42,0.2)]'
                        : 'bg-[#131820] hover:bg-[#171D27] border-[#242C3A] hover:border-[#384559]'
                    }`}
                  >
                    <div>
                      <div className="relative h-36 rounded-xl overflow-hidden bg-[#0D1117] border border-[#1F2632] mb-3 flex items-center justify-center">
                        {sub.imageUrl ? (
                          <img
                            src={sub.imageUrl}
                            alt={sub.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-4">
                            <Layers className="w-8 h-8 text-[#E8732A] mb-1.5 opacity-80" />
                            <span className="text-[11px] font-bold text-[#94A3B8]">
                              {sub.title}
                            </span>
                            <span className="text-[10px] text-[#64748B] mt-0.5">
                              Custom & IS Standard Forging
                            </span>
                          </div>
                        )}

                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          {sub.drawingsCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-md bg-[#0B0E11]/90 border border-[#E8732A]/60 text-[#E8732A] font-mono text-[10px] font-bold">
                              {sub.drawingsCount} IS Drawings
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-[#0B0E11]/85 border border-[#2E3746] text-[#CBD5E1] font-mono text-[10px] font-semibold">
                              RFQ Active
                            </span>
                          )}
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#E8732A] text-white text-[10px] font-black uppercase">
                            Selected
                          </div>
                        )}
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-[#F59352] transition">
                          {sub.title}
                        </h3>
                        {sub.standards.length > 0 && (
                          <span className="text-[10px] font-mono font-bold text-[#34D399] bg-[#112A1F] px-2 py-0.5 rounded border border-[#22C55E]/30 shrink-0">
                            {sub.standards[0]}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#1F2633] flex items-center justify-between text-[11px]">
                      <span className="text-[#CBD5E1] font-medium truncate">
                        Grades: <strong className="text-white">{sub.grades.slice(0, 4).join(', ')}</strong>
                      </span>
                      <span className="text-[#E8732A] font-bold shrink-0 ml-2">
                        Configure →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 5 Columns: Sticky Interactive Fastener Configurator & IS Engineering Dimension Sheet */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-5">
            <div className="bg-[#14181F] border border-[#2A3342] rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#222A36]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8732A] font-bold block">
                    Fastener RFQ Configurator
                  </span>
                  <h2 className="text-lg font-black text-white mt-0.5">
                    {selectedSubcat.title}
                  </h2>
                </div>
                {selectedSubcat.drawingsCount > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-[#231812] border border-[#E8732A]/50 text-[#E8732A] font-mono text-xs font-bold">
                    {selectedSubcat.drawingsCount} Specs
                  </span>
                )}
              </div>

              {/* Forging & Spec Capabilities Summary */}
              {selectedSubcat.specifications.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-xs">
                  {selectedSubcat.specifications.slice(0, 4).map((spec: { label: string; value: string }) => (
                    <div key={spec.label} className="bg-[#0F1319] p-2.5 rounded-xl border border-[#222A36]">
                      <span className="text-[10px] text-[#E8732A] font-bold uppercase block">
                        {spec.label}
                      </span>
                      <span className="text-[#E2E8F0] font-semibold mt-0.5 block text-[11px]">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Sample IS Engineering Dimension Sheet Viewer if available */}
              {selectedSubcat.sampleDrawings.length > 0 && activeDrawing && (
                <div className="mb-4 bg-[#0D1117] border border-[#232C3A] rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                      <FileCode2 className="w-3.5 h-3.5 text-[#E8732A]" />
                      <span>IS Engineering Dimension Record ({activeDrawing.standard})</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#34D399] font-bold">
                      Size: {activeDrawing.size}
                    </span>
                  </div>

                  {selectedSubcat.sampleDrawings.length > 1 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {selectedSubcat.sampleDrawings.map(
                        (
                          drw: {
                            id: string;
                            size: string;
                            shape: string;
                            standard: string;
                          },
                          idx: number
                        ) => (
                          <button
                            key={drw.id}
                            type="button"
                            onClick={() => setActiveDrawingIdx(idx)}
                            className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition cursor-pointer ${
                              activeDrawingIdx === idx
                                ? 'bg-[#E8732A] text-white'
                                : 'bg-[#161B24] text-[#94A3B8] hover:text-white'
                            }`}
                          >
                            {drw.standard || drw.shape} ({drw.size})
                          </button>
                        )
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-1.5 bg-[#121720] p-2.5 rounded-lg border border-[#1E2634] text-[11px]">
                    {Object.entries(activeDrawing.dimensions || {})
                      .slice(0, 6)
                      .map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between gap-1">
                          <span className="text-[#94A3B8] truncate">
                            {k.replace(/_/g, ' ')}:
                          </span>
                          <span className="font-mono font-bold text-white shrink-0">
                            {String(v)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Configurator Form */}
              <form onSubmit={handleAddToCart} className="space-y-3.5">
                {selectedSubcat.standards.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                      IS / DIN Reference Standard
                    </label>
                    <select
                      value={selectedStandard}
                      onChange={(e) => setSelectedStandard(e.target.value)}
                      className="w-full bg-[#0E1218] border border-[#283140] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#E8732A]"
                    >
                      {selectedSubcat.standards.map((std: string) => (
                        <option key={std} value={std}>
                          {std}
                        </option>
                      ))}
                      <option value="Custom Drawing / OEM Spec">Custom Drawing / OEM Spec</option>
                    </select>
                  </div>
                )}

                {selectedSubcat.shapes.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                      Bend / Profile Shape
                    </label>
                    <select
                      value={selectedShape}
                      onChange={(e) => setSelectedShape(e.target.value)}
                      className="w-full bg-[#0E1218] border border-[#283140] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#E8732A]"
                    >
                      {selectedSubcat.shapes.map((sh: string) => (
                        <option key={sh} value={sh}>
                          {sh}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                      Nominal Size / Diameter
                    </label>
                    <select
                      value={selectedDiameter}
                      onChange={(e) => setSelectedDiameter(e.target.value)}
                      className="w-full bg-[#0E1218] border border-[#283140] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#E8732A]"
                    >
                      {(selectedSubcat.sizes.length > 0
                        ? selectedSubcat.sizes
                        : selectedSubcat.diameters.length > 0
                        ? selectedSubcat.diameters.map((d: number) => `${d} mm`)
                        : ['M6', 'M8', 'M10', 'M12', 'M16', 'M20', 'M24', 'M30', 'M36', 'M42', 'M48', 'M56', 'M64']
                      ).map((sz: string) => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedSubcat.lengths.length > 0 && (
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                        Length (mm)
                      </label>
                      <select
                        value={selectedLength}
                        onChange={(e) => setSelectedLength(e.target.value)}
                        className="w-full bg-[#0E1218] border border-[#283140] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#E8732A]"
                      >
                        {selectedSubcat.lengths.map((len: number) => (
                          <option key={len} value={`${len} mm`}>
                            {len} mm
                          </option>
                        ))}
                        <option value="Custom Length per Drawing">Custom Length per Drawing</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                      Material / Tensile Grade
                    </label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full bg-[#0E1218] border border-[#283140] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#E8732A]"
                    >
                      {selectedSubcat.grades.map((g: string) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                      Surface Coating / Finish
                    </label>
                    <select
                      value={selectedFinish}
                      onChange={(e) => setSelectedFinish(e.target.value)}
                      className="w-full bg-[#0E1218] border border-[#283140] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#E8732A]"
                    >
                      {(selectedSubcat.finishes.length > 0
                        ? selectedSubcat.finishes
                        : ['Auto black', 'Zinc plating', 'Hot dip galvanizing', 'Zinc flake']
                      ).map((fin: string) => (
                        <option key={fin} value={fin}>
                          {fin}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedSubcat.threads.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                      Thread Series
                    </label>
                    <select
                      value={selectedThread}
                      onChange={(e) => setSelectedThread(e.target.value)}
                      className="w-full bg-[#0E1218] border border-[#283140] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#E8732A]"
                    >
                      {selectedSubcat.threads.map((th: string) => (
                        <option key={th} value={th}>
                          {th}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                      Order Quantity
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full bg-[#0E1218] border border-[#283140] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#E8732A]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                      Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full bg-[#0E1218] border border-[#283140] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#E8732A]"
                    >
                      <option value="Metric Ton">Metric Ton (MT)</option>
                      <option value="Kg">Kilograms (Kg)</option>
                      <option value="Pieces">Pieces (Nos)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                    Custom Drawing / Thread Length / Packing Notes
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g., Full thread / Half thread, Nut & Washer assembly required..."
                    className="w-full bg-[#0E1218] border border-[#283140] rounded-xl px-3 py-2 text-xs text-white placeholder-[#64748B] outline-none focus:border-[#E8732A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-b from-[#E8732A] to-[#C45316] hover:from-[#F2823B] hover:to-[#D45E1C] text-white font-black text-xs sm:text-sm py-3 rounded-xl border border-[#F59352]/50 shadow-[0_4px_15px_rgba(232,115,42,0.35)] flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add {selectedSubcat.title} to Quotation Cart</span>
                </button>
              </form>
            </div>

            {/* Direct Ludhiana Works Support Card */}
            <div className="bg-gradient-to-br from-[#231710] to-[#14181F] rounded-2xl p-4 border border-[#E06924]/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8732A] block">
                Ludhiana Fastener Forging Desk
              </span>
              <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed">
                Need custom cold/hot forging per client blueprint? Reach our Ludhiana engineering team directly:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`tel:${FTI_COMPANY_INFO.supportPhone}`}
                  className="inline-flex items-center space-x-1.5 bg-[#1A202C] hover:bg-[#242C3D] text-white text-xs font-bold px-3 py-2 rounded-xl border border-[#2E3748] transition"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#E8732A]" />
                  <span>{FTI_COMPANY_INFO.supportPhone}</span>
                </a>
                <a
                  href="https://wa.me/919589971567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 bg-[#112A1F] hover:bg-[#163829] text-[#34D399] text-xs font-bold px-3 py-2 rounded-xl border border-[#22C55E]/40 transition"
                >
                  <span>WhatsApp: {FTI_COMPANY_INFO.whatsappPhones[1]}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
