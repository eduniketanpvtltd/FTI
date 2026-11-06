'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import {
  FTI_TRACTOR_PARTS,
  FTI_TRACTOR_CATEGORIES,
  FTI_COMPANY_INFO,
  FTI_ISO_CERTIFICATE,
  TractorPartItem,
} from '@/lib/fti-catalog-data';
import {
  ShieldCheck,
  PhoneCall,
  ChevronRight,
  Search,
  ShoppingCart,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function TractorPartsPage() {
  const { addToCart } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePart, setActivePart] = useState<TractorPartItem | null>(null);

  const [materialGrade, setMaterialGrade] = useState<string>(
    'OEM Standard Forged Alloy (20MnCr5 / EN-19 / EN-8D)'
  );
  const [tractorMakeFitment, setTractorMakeFitment] = useState<string>(
    'Universal / Multi-Brand OEM Spec (Mahindra / Swaraj / Sonalika / John Deere / New Holland / TAFE)'
  );
  const [quantity, setQuantity] = useState<string>('50');
  const [unit, setUnit] = useState<string>('Pieces');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [addedBanner, setAddedBanner] = useState<string | null>(null);

  const filteredParts = useMemo(() => {
    return FTI_TRACTOR_PARTS.filter((part: TractorPartItem) => {
      const matchesCat =
        selectedCategory === 'All' || part.category === selectedCategory;
      if (!matchesCat) return false;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        part.name.toLowerCase().includes(q) ||
        part.sku.toLowerCase().includes(q) ||
        part.category.toLowerCase().includes(q) ||
        part.description.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  const handleOpenPartModal = (part: TractorPartItem) => {
    setActivePart(part);
    setQuantity('50');
    setUnit('Pieces');
    setSpecialNotes('');
  };

  const handleQuickAddToCart = (part: TractorPartItem) => {
    addToCart({
      categoryId: 'cat-tractor-parts',
      categoryName: `Tractor Parts — ${part.name}`,
      categorySlug: 'tractor-parts',
      specifications: {
        'Part Name': part.name,
        'FTI Catalog SKU': part.sku,
        'Tractor System': part.category,
        Fitment: 'Standard OEM Replacement Spec',
      },
      grade: 'OEM Standard Forged / Machined Spec',
      quantity: 50,
      unit: 'Pieces',
      specialInstructions: part.description,
    });

    setAddedBanner(`${part.name} (${part.sku}) added to Quotation Cart!`);
    setTimeout(() => setAddedBanner(null), 4500);
  };

  const handleModalAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePart) return;
    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) return;

    addToCart({
      categoryId: 'cat-tractor-parts',
      categoryName: `Tractor Parts — ${activePart.name}`,
      categorySlug: 'tractor-parts',
      specifications: {
        'Part Name': activePart.name,
        'FTI Catalog SKU': activePart.sku,
        'Tractor System': activePart.category,
        'Tractor Make / Fitment': tractorMakeFitment,
      },
      grade: materialGrade,
      quantity: numQty,
      unit,
      specialInstructions: specialNotes.trim() || activePart.description,
    });

    setAddedBanner(
      `${activePart.name} (${activePart.sku} • ${numQty} ${unit}) added to Quotation Cart!`
    );
    setActivePart(null);
    setTimeout(() => setAddedBanner(null), 4500);
  };

  return (
    <CustomerLayout>
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden border-b border-[#1E242D]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/foundry-hero-bg.jpg"
            alt="Agricultural Tractor Parts & Forgings"
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
            <span className="text-[#E8732A] font-bold">Tractor Spare Parts Catalog</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#112A1F] border border-[#22C55E]/40 px-3 py-1 rounded-full text-[11px] font-bold text-[#34D399] mb-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>50 Published OEM-Grade SKUs • ISO 9001:2015 ({FTI_ISO_CERTIFICATE.certificateNumber})</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Agricultural Tractor Parts & <span className="text-[#E8732A]">Precision Forgings</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed max-w-2xl">
                Complete B2B catalog of <strong className="text-white">50 agricultural tractor spare parts</strong> across{' '}
                <strong className="text-white">19 assembly systems</strong> — Engine, Clutch, Transmission, PTO,
                Differential, Steering, Hydraulics, Linkage & Brakes. Manufactured & dispatched from Ludhiana.
              </p>
            </div>

            <div className="bg-[#14181F]/90 border border-[#2A323E] px-4 py-3 rounded-xl text-xs flex items-center space-x-3 shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#22C55E] shrink-0" />
              <div>
                <span className="text-white font-bold block">Ludhiana Agri-Forging Hub</span>
                <span className="text-[11px] text-[#94A3B8]">SKUs: FTI-AGRI-XLSX-001 to 050</span>
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

        {/* Search & Assembly System Filter Pills */}
        <div className="space-y-4 mb-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 50 tractor parts by name, SKU (FTI-AGRI-XLSX-001), or system..."
                className="w-full bg-[#131820] border border-[#262F3D] focus:border-[#E8732A] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-[#64748B] outline-none transition"
              />
            </div>

            <div className="text-xs text-[#94A3B8] font-semibold">
              Showing <span className="text-white font-bold">{filteredParts.length}</span> of{' '}
              <span className="text-white font-bold">{FTI_TRACTOR_PARTS.length}</span> Tractor Parts
            </div>
          </div>

          {/* 19 Tractor Categories Horizontal Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 shadow'
                  : 'bg-[#131820] text-[#94A3B8] hover:text-white border border-[#242C38]'
              }`}
            >
              All Systems ({FTI_TRACTOR_PARTS.length})
            </button>
            {FTI_TRACTOR_CATEGORIES.map((cat: string) => {
              const count = FTI_TRACTOR_PARTS.filter((p: TractorPartItem) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 shadow'
                      : 'bg-[#131820] text-[#94A3B8] hover:text-white border border-[#242C38]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* 50 Tractor Parts Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredParts.map((part: TractorPartItem) => (
            <div
              key={part.id}
              className="group bg-[#131820] hover:bg-[#171D27] border border-[#242C3A] hover:border-[#E8732A]/60 rounded-2xl p-3.5 flex flex-col justify-between transition shadow-md"
            >
              <div>
                <div
                  onClick={() => handleOpenPartModal(part)}
                  className="relative h-44 rounded-xl overflow-hidden bg-white border border-[#1F2632] mb-3 flex items-center justify-center p-2 cursor-pointer"
                >
                  <img
                    src={part.imageUrl}
                    alt={part.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#0B0E11]/90 text-[#E8732A] font-mono text-[10px] font-bold border border-[#E8732A]/40">
                    {part.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] mb-1">
                  <span>{part.sku}</span>
                  <span className="text-[#34D399] font-bold">In Stock / RFQ</span>
                </div>

                <h3
                  onClick={() => handleOpenPartModal(part)}
                  className="text-sm font-extrabold text-white group-hover:text-[#F59352] transition cursor-pointer"
                >
                  {part.name}
                </h3>

                <p className="text-xs text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">
                  {part.description}
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-[#1F2633] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenPartModal(part)}
                  className="flex-1 bg-[#1B222D] hover:bg-[#252E3D] text-white text-xs font-bold py-2 px-2.5 rounded-xl border border-[#2C3646] transition cursor-pointer"
                >
                  Configure Specs
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAddToCart(part)}
                  className="bg-gradient-to-b from-[#E8732A] to-[#C45316] hover:from-[#F2823B] hover:to-[#D45E1C] text-white text-xs font-bold py-2 px-3 rounded-xl border border-[#F59352]/50 transition cursor-pointer flex items-center space-x-1 shrink-0"
                  title="Quick Add 50 Pieces to Quotation Cart"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>+ RFQ</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Direct Contact Banner */}
        <div className="mt-10 bg-gradient-to-br from-[#231710] to-[#14181F] text-white rounded-2xl p-6 sm:p-8 border border-[#E06924]/40 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-bold text-[#E8732A] uppercase tracking-wider">
                Ludhiana Agricultural Forging & CNC Desk
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Need Custom OEM Tractor Forgings or Bulk Export Lots?
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed">
                Registered Works: {FTI_COMPANY_INFO.fullAddress}. Direct dispatch with ISO 9001:2015 batch inspection reports.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href={`tel:${FTI_COMPANY_INFO.supportPhone}`}
                className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-5 py-3 rounded-xl border border-[#F59352]/50 flex items-center justify-center space-x-2 transition shadow-md"
              >
                <PhoneCall className="w-4 h-4 text-white" />
                <span>{FTI_COMPANY_INFO.supportPhone}</span>
              </a>
              <a
                href="https://wa.me/919589971567"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#181D26] hover:bg-[#222936] text-white text-xs font-bold px-5 py-3 rounded-xl border border-[#2E3746] flex items-center justify-center space-x-2 transition"
              >
                <span>WhatsApp: {FTI_COMPANY_INFO.whatsappPhones[1]}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Configuring Selected Tractor Part */}
      {activePart && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActivePart(null)}
        >
          <div
            className="bg-[#131820] border border-[#2C3545] rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 bg-[#0E1218] border-b border-[#222A36] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8732A] font-bold block">
                  {activePart.sku} • {activePart.category}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {activePart.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePart(null)}
                className="p-1.5 rounded-lg bg-[#1A2029] text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalAddToCart} className="p-5 space-y-4">
              <div className="flex items-center space-x-4 bg-[#0D1117] p-3 rounded-xl border border-[#222A36]">
                <div className="w-20 h-20 rounded-lg bg-white p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={activePart.imageUrl}
                    alt={activePart.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-xs text-[#CBD5E1] leading-relaxed">
                  <p className="font-bold text-white mb-1">{activePart.name}</p>
                  <p className="text-[#94A3B8]">{activePart.description}</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                  Material / Metallurgy Specification
                </label>
                <select
                  value={materialGrade}
                  onChange={(e) => setMaterialGrade(e.target.value)}
                  className="w-full bg-[#0E1218] border border-[#283140] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#E8732A]"
                >
                  <option value="OEM Standard Forged Alloy (20MnCr5 / EN-19 / EN-8D)">
                    OEM Standard Forged Alloy (20MnCr5 / EN-19 / EN-8D)
                  </option>
                  <option value="Case Hardened Gear Steel (16MnCr5 / SAE-8620)">
                    Case Hardened Gear Steel (16MnCr5 / SAE-8620)
                  </option>
                  <option value="Boron Steel (30MnB5 Heat Treated)">
                    Boron Steel (30MnB5 Heat Treated)
                  </option>
                  <option value="High-Duty Cast / Ductile Iron (SG Iron / FG 260)">
                    High-Duty Cast / Ductile Iron (SG Iron / FG 260)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                  Tractor Make / Model Compatibility
                </label>
                <select
                  value={tractorMakeFitment}
                  onChange={(e) => setTractorMakeFitment(e.target.value)}
                  className="w-full bg-[#0E1218] border border-[#283140] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#E8732A]"
                >
                  <option value="Universal / Multi-Brand OEM Spec (Mahindra / Swaraj / Sonalika / John Deere / New Holland / TAFE)">
                    Universal / Multi-Brand OEM Spec
                  </option>
                  <option value="Mahindra & Swaraj Series">Mahindra & Swaraj Series</option>
                  <option value="John Deere & New Holland Series">John Deere & New Holland Series</option>
                  <option value="Sonalika, Massey Ferguson (TAFE) & Eicher">
                    Sonalika, Massey Ferguson (TAFE) & Eicher
                  </option>
                  <option value="Custom OEM Drawing / Sample Match">
                    Custom OEM Drawing / Sample Match
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                    Order Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
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
                    <option value="Pieces">Pieces / Sets</option>
                    <option value="Kg">Kilograms (Kg)</option>
                    <option value="Metric Ton">Metric Ton (MT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
                  OEM Part Reference / Custom Machining Notes
                </label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g., Spline count, bore diameter, or OEM reference number..."
                  className="w-full bg-[#0E1218] border border-[#283140] rounded-xl px-3 py-2 text-xs text-white placeholder-[#64748B] outline-none focus:border-[#E8732A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePart(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#1B222D] text-xs font-bold text-[#CBD5E1] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-black border border-[#F59352]/50 shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Quotation Cart</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
