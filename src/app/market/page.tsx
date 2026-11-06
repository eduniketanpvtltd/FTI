'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Search,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  History,
  FileSpreadsheet,
  MapPin,
  Layers,
  Filter,
  Building2,
  X,
  Eye,
  Calendar,
  MessageSquare,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from 'lucide-react';
import { MarketMaterial, MarketMainCategory } from '@/types';
import { formatIstBulletinDateTime } from '@/lib/mandi-parser';

function getMaterialThumbnail(materialName: string, mainCategory: MarketMainCategory): string {
  const lower = materialName.toLowerCase();

  // Specific Scrap Material Thumbnails (each scrap type gets its own distinct image)
  if (lower.includes('old scrap') || (mainCategory === 'scrap_materials' && lower.includes('old'))) {
    return '/images/old-scrap-fg.jpg';
  }
  if (lower.includes('hms') || lower.includes('heavy melting') || lower.includes('ship breaking')) {
    return '/images/hms-scrap-fg.jpg';
  }
  if (lower.includes('turning') || lower.includes('boring')) {
    return '/images/turning-scrap-fg.jpg';
  }
  if (lower.includes('end cutting') || lower.includes('cutting') || lower.includes('crop') || lower.includes('toka') || lower.includes('flash')) {
    return '/images/end-cutting-scrap-fg.jpg';
  }
  if (lower.includes('melting scrap') || mainCategory === 'scrap_materials' || lower.includes('scrap')) {
    return '/images/melting-scrap-fg.jpg';
  }

  // Specific Raw Material Thumbnails
  if (lower.includes('ingot')) {
    return '/images/ingot-fg.jpg';
  }
  if (lower.includes('wire')) {
    return '/images/wire-rod-fg.jpg';
  }
  if (lower.includes('tmt') || lower.includes('rebar') || lower.includes('sariya')) {
    return '/images/tmt-rebar-fg.jpg';
  }
  if (lower.includes('flat') || lower.includes('strip') || lower.includes('patra')) {
    return '/images/flat-bar-fg.jpg';
  }
  if (
    lower.includes('coil') ||
    lower.includes('sheet') ||
    lower.includes('plate') ||
    lower.includes('hr ') ||
    lower.includes('cr ')
  ) {
    return '/images/sheet-plate-fg.jpg';
  }
  if (lower.includes('square') && lower.includes('bright')) {
    return '/images/square-bright-bar-fg.jpg';
  }
  if (lower.includes('square')) {
    return '/images/square-bar-fg.jpg';
  }
  if (lower.includes('bright')) {
    return '/images/bright-bar-fg.jpg';
  }
  if (lower.includes('round') || lower.includes('angle') || lower.includes('channel') || lower.includes('girder')) {
    return '/images/round-bar-fg.jpg';
  }
  return '/images/billet-fg.jpg';
}

export default function MarketPage() {
  const {
    marketMaterials,
    mandiBulletin,
    lastMarketSyncTime,
    refreshMarketPrices,
  } = useStore();

  const latestSyncDisplay = useMemo(
    () => formatIstBulletinDateTime(lastMarketSyncTime),
    [lastMarketSyncTime]
  );

  // Primary Category Tab: Strictly Raw Materials vs Scrap Materials
  const [mainCategory, setMainCategory] = useState<MarketMainCategory>('raw_materials');

  // Secondary Filter: Specific Material Name (e.g., 'all', 'Ingot', 'Billet', 'Melting Scrap')
  const [selectedMaterialGroup, setSelectedMaterialGroup] = useState<string>('all');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [directionFilter, setDirectionFilter] = useState<'all' | 'up' | 'down'>('all');

  // Selected Material-Mandi entry for the 50-record popup modal
  const [selectedMaterial, setSelectedMaterial] = useState<MarketMaterial | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRawBulletin, setShowRawBulletin] = useState(false);
  const [copiedBulletin, setCopiedBulletin] = useState(false);

  // Collapsible states for the 3 dedicated Mandi sections below metadata bar (collapsed by default)
  const [openHubSections, setOpenHubSections] = useState<{
    gobindgarh: boolean;
    ludhianaEn8d: boolean;
    ludhianaMs: boolean;
  }>({
    gobindgarh: false,
    ludhianaEn8d: false,
    ludhianaMs: false,
  });

  const toggleHubSection = (key: 'gobindgarh' | 'ludhianaEn8d' | 'ludhianaMs') => {
    setOpenHubSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Close modal on Escape key and handle body scroll lock
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHistoryModalOpen(false);
      }
    };
    if (historyModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [historyModalOpen]);

  // Manual refresh fetches latest market rates & syncs time
  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await refreshMarketPrices();
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  // Copy WhatsApp broadcast to clipboard
  const handleCopyBulletin = () => {
    if (!mandiBulletin?.rawMessageText) return;
    navigator.clipboard.writeText(mandiBulletin.rawMessageText);
    setCopiedBulletin(true);
    setTimeout(() => setCopiedBulletin(false), 2500);
  };

  // Reset secondary filter when primary category changes
  const handleCategoryChange = (cat: MarketMainCategory) => {
    setMainCategory(cat);
    setSelectedMaterialGroup('all');
  };

  // 1. Available materials in active primary category (Strictly 2 divisions: Raw Materials & Scrap Materials)
  const categoryMaterials = useMemo(() => {
    const seenKeys = new Set<string>();
    const result: MarketMaterial[] = [];

    for (const m of marketMaterials) {
      if (m.materialName === 'Mandi Benchmark' || m.categoryName === 'Mandi Benchmark') {
        continue;
      }
      const matchesCat = m.mainCategory
        ? m.mainCategory === mainCategory
        : mainCategory === 'scrap_materials'
        ? m.categorySlug === 'scrap' ||
          m.name.toLowerCase().includes('scrap') ||
          m.symbol.toLowerCase().includes('scrap')
        : m.categorySlug !== 'scrap' && !m.name.toLowerCase().includes('scrap');

      if (!matchesCat) continue;

      const normalizedId =
        m.specification &&
        (m.id === 'mat-raw-materials-ingot-ludhiana' ||
          m.id === 'mat-scrap-materials-melting-scrap-ludhiana')
          ? `${m.id}-${m.specification.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
          : m.id;

      const uniqueKey = `${normalizedId}::${m.symbol}`;
      if (seenKeys.has(uniqueKey) || seenKeys.has(normalizedId)) {
        continue;
      }
      seenKeys.add(uniqueKey);
      seenKeys.add(normalizedId);

      result.push(normalizedId !== m.id ? { ...m, id: normalizedId } : m);
    }

    return result;
  }, [marketMaterials, mainCategory]);

  // 2. Extract distinct Material Names within active category
  const materialGroups = useMemo(() => {
    const counts: Record<string, number> = {};
    categoryMaterials.forEach((m) => {
      const matName = m.materialName || m.categoryName || 'General';
      counts[matName] = (counts[matName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [categoryMaterials]);

  // 3. Filtered Materials based on search, material group, and movement direction
  const filteredMaterials = useMemo(() => {
    return categoryMaterials.filter((mat) => {
      const matName = mat.materialName || mat.categoryName || '';
      const mandi = mat.mandiCity || mat.hubCity || '';

      const matchesGroup =
        selectedMaterialGroup === 'all' || matName === selectedMaterialGroup;

      const matchesSearch =
        mat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        matName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mandi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mat.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mat.specification || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDirection =
        directionFilter === 'all' || mat.movementDirection === directionFilter;

      return matchesGroup && matchesSearch && matchesDirection;
    });
  }, [categoryMaterials, selectedMaterialGroup, searchQuery, directionFilter]);

  // 3b. Dedicated 3 Collapsible Hub Sections Data
  const hubSectionMaterials = useMemo(() => {
    const gobindgarh: MarketMaterial[] = [];
    const ludhianaEn8d: MarketMaterial[] = [];
    const ludhianaMs: MarketMaterial[] = [];

    categoryMaterials.forEach((mat) => {
      const city = (mat.mandiCity || mat.hubCity || '').toLowerCase();
      const spec = (mat.specification || '').toUpperCase();
      const name = (mat.name || '').toUpperCase();
      const symbol = (mat.symbol || '').toUpperCase();

      if (city.includes('gobindgarh')) {
        gobindgarh.push(mat);
      } else if (city.includes('ludhiana')) {
        if (spec.includes('EN8D') || name.includes('EN8D') || symbol.includes('EN8D')) {
          ludhianaEn8d.push(mat);
        } else if (spec.includes('MS') || name.includes('(MS)') || symbol.includes('-MS')) {
          ludhianaMs.push(mat);
        } else {
          ludhianaMs.push(mat);
        }
      }
    });

    return {
      gobindgarh,
      ludhianaEn8d,
      ludhianaMs,
    };
  }, [categoryMaterials]);

  // 4. Group filtered materials by Material Name so all Mandis for each Material are compared side-by-side
  const groupedByMaterialName = useMemo(() => {
    const groups: Record<string, MarketMaterial[]> = {};
    filteredMaterials.forEach((mat) => {
      const key = mat.materialName || mat.categoryName || 'Other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(mat);
    });
    return Object.entries(groups);
  }, [filteredMaterials]);

  // Keep selectedMaterial synced with live updates from store
  const activeSelectedMaterial = useMemo(() => {
    if (!selectedMaterial) return null;
    return (
      marketMaterials.find((m) => m.id === selectedMaterial.id) || selectedMaterial
    );
  }, [marketMaterials, selectedMaterial]);

  // Export CSV of past 50 price records
  const handleDownloadCSV = (mat: MarketMaterial) => {
    const history = (mat.historicalPrices || []).slice(-50);
    const headers = [
      'Record #',
      'Date',
      'Price (INR/MT)',
      'Up/Down Change (INR)',
      'Movement',
      'Material',
      'Mandi / Place',
      'Tax Type',
      'Session Notes',
    ];
    const rows = history.map((h, i) => [
      i + 1,
      h.date,
      h.price,
      h.priceChange !== undefined ? (h.priceChange > 0 ? `+${h.priceChange}` : h.priceChange) : 0,
      (h.movementDirection || 'neutral').toUpperCase(),
      `"${mat.materialName}"`,
      `"${mat.mandiCity}"`,
      `"ᵃˢᵗ (GST Extra)"`,
      `"${h.notes || mat.notes || 'Spot Session'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${mat.materialName.replace(/\s+/g, '_')}_${mat.mandiCity.replace(/\s+/g, '_')}_50_Records.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Counts for top tabs
  const rawCount = useMemo(
    () =>
      marketMaterials.filter(
        (m) =>
          m.materialName !== 'Mandi Benchmark' &&
          m.categoryName !== 'Mandi Benchmark' &&
          (m.mainCategory ? m.mainCategory === 'raw_materials' : m.categorySlug !== 'scrap')
      ).length,
    [marketMaterials]
  );
  const scrapCount = useMemo(
    () =>
      marketMaterials.filter(
        (m) =>
          m.materialName !== 'Mandi Benchmark' &&
          m.categoryName !== 'Mandi Benchmark' &&
          (m.mainCategory ? m.mainCategory === 'scrap_materials' : m.categorySlug === 'scrap')
      ).length,
    [marketMaterials]
  );

  // Helper to render rows inside the 3 collapsible Mandi Hub sections
  const renderHubTable = (materials: MarketMaterial[], emptyLabel: string) => {
    if (materials.length === 0) {
      return (
        <div className="p-6 text-center text-xs text-[#94A3B8] font-medium bg-[#12161D]">
          {emptyLabel}
        </div>
      );
    }

    return (
      <div className="overflow-x-auto bg-[#12161D]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#222934] bg-[#0F1319] text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
              <th className="py-2.5 px-3.5">
                {mainCategory === 'raw_materials' ? 'Raw Material / Grade' : 'Scrap Item / Grade'}
              </th>
              <th className="py-2.5 px-3 text-right">Spot Price ᵃˢᵗ</th>
              <th className="py-2.5 px-3 text-right">Δ (vs Prev)</th>
              <th className="py-2.5 px-3 text-right hidden sm:table-cell">Prev. Session</th>
              <th className="py-2.5 px-3.5 text-center hidden md:table-cell">50-Rec Analysis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2530]">
            {materials.map((mat, idx) => {
              const isSelected = selectedMaterial?.id === mat.id;
              const isUp = mat.movementDirection === 'up';
              const isDown = mat.movementDirection === 'down';
              const pctChange =
                typeof mat.percentageChange === 'number' && !isNaN(mat.percentageChange)
                  ? mat.percentageChange
                  : mat.previousPrice > 0
                  ? Number(((mat.priceChange / mat.previousPrice) * 100).toFixed(2))
                  : 0;

              return (
                <tr
                  key={`${mat.id}-${mat.symbol}-${idx}`}
                  onClick={() => {
                    setSelectedMaterial(mat);
                    setHistoryModalOpen(true);
                  }}
                  className={`cursor-pointer transition group ${
                    isSelected
                      ? 'bg-[#251811] border-l-4 border-l-[#E8732A]'
                      : 'hover:bg-[#181E27]'
                  }`}
                >
                  {/* Material & Grade */}
                  <td className="py-3 px-3.5">
                    <div className="flex items-center space-x-3">
                      <img
                        src={getMaterialThumbnail(mat.materialName || mat.name, mainCategory)}
                        alt={mat.materialName || mat.name}
                        className="w-9 h-9 rounded-lg object-cover border border-[#2C3545] shrink-0"
                      />
                      <div>
                        <p className="font-extrabold text-white text-xs sm:text-sm flex items-center space-x-1.5">
                          <span>{mat.materialName || mat.name}</span>
                          {mat.specification && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#251811] text-[#E8732A] border border-[#E06924]/40">
                              {mat.specification}
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                          {mat.symbol} • {mat.mandiCity}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Spot Price */}
                  <td className="py-3 px-3 text-right font-mono">
                    <span className="text-sm sm:text-base font-extrabold text-white">
                      ₹{mat.currentPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[9px] text-[#64748B] font-sans">
                      ᵃˢᵗ GST Extra
                    </span>
                  </td>

                  {/* Movement Delta Pill Box - Matching Mockup */}
                  <td className="py-3 px-3 text-right font-mono">
                    <div className="inline-flex flex-col items-end">
                      <span
                        className={`inline-flex flex-col items-center justify-center px-2.5 py-1 rounded-xl text-[11px] font-bold min-w-[72px] ${
                          isUp
                            ? 'bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40'
                            : isDown
                            ? 'bg-[#2F1619] text-[#F87171] border border-[#EF4444]/40'
                            : 'bg-[#1C222C] text-[#94A3B8] border border-[#2E3746]'
                        }`}
                      >
                        <span className="flex items-center">
                          {isUp && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                          {isDown && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                          {!isUp && !isDown && <Minus className="w-3 h-3 mr-0.5" />}
                          ₹{Math.abs(mat.priceChange).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9px] opacity-90">
                          ({pctChange > 0 ? '+' : ''}
                          {pctChange}%)
                        </span>
                      </span>
                    </div>
                  </td>

                  {/* Previous Session Price */}
                  <td className="py-3 px-3 text-right font-mono text-xs text-[#94A3B8] hidden sm:table-cell">
                    ₹{mat.previousPrice.toLocaleString('en-IN')}
                  </td>

                  {/* View 50 Records Button */}
                  <td className="py-3 px-3.5 text-center hidden md:table-cell">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMaterial(mat);
                        setHistoryModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition inline-flex items-center space-x-1 cursor-pointer bg-[#1B212B] text-[#E2E8F0] hover:bg-[#E8732A] hover:text-white border border-[#2E3746]"
                    >
                      <Eye className="w-3 h-3" />
                      <span>50 Recs</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <CustomerLayout>
      {/* 0. Directly Below Navbar: Primary Category Switcher (Raw Materials | Scrap Materials) */}
      <div className="bg-[#080A0D] border-b border-[#1E242D] px-3.5 sm:px-6 py-2.5 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs text-[#94A3B8]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
            <span className="font-extrabold uppercase tracking-wider text-white text-[11px]">
              Select Market Division
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 bg-[#12161D] p-1.5 rounded-2xl border border-[#262E3B] w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleCategoryChange('raw_materials')}
              className={`px-3 sm:px-5 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-2 cursor-pointer ${
                mainCategory === 'raw_materials'
                  ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white shadow-[0_2px_15px_rgba(224,105,36,0.35)] border border-[#F59352]/50'
                  : 'bg-[#181D26] text-[#CBD5E1] hover:text-white hover:bg-[#1F2632]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>Raw Materials</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                  mainCategory === 'raw_materials'
                    ? 'bg-black/35 text-white'
                    : 'bg-[#242C38] text-[#94A3B8]'
                }`}
              >
                {rawCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryChange('scrap_materials')}
              className={`px-3 sm:px-5 py-2 rounded-xl text-xs font-extrabold transition flex items-center justify-center space-x-2 cursor-pointer ${
                mainCategory === 'scrap_materials'
                  ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white shadow-[0_2px_15px_rgba(224,105,36,0.35)] border border-[#F59352]/50'
                  : 'bg-[#181D26] text-[#CBD5E1] hover:text-white hover:bg-[#1F2632]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>Scrap Materials</span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                  mainCategory === 'scrap_materials'
                    ? 'bg-black/35 text-white'
                    : 'bg-[#242C38] text-[#94A3B8]'
                }`}
              >
                {scrapCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Top Industrial Mandi Banner with AI Foundry Background Image */}
        <div className="relative overflow-hidden border-b border-[#1E242D]">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/foundry-hero-bg.jpg"
              alt="Industrial Steel Foundry"
              className="w-full h-56 sm:h-64 object-cover object-center opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E11]/35 via-[#0B0E11]/85 to-[#0B0E11]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E11]/90 via-[#0B0E11]/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto pt-16 sm:pt-20 pb-5 px-3.5 sm:px-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-1.5 text-xs text-[#CBD5E1] mb-2 font-medium">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="text-[#CBD5E1]">Live Mandi Steel & Scrap Trading Desk</span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Industrial Raw Materials & Scrap{' '}
                  <span className="text-[#E8732A]">Mandi Price Desk</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5 max-w-2xl leading-relaxed">
                  Daily regional spot prices across Mandi Gobindgarh, Ludhiana, Raipur, Muzaffarnagar,
                  Alang, Mumbai & 15+ trading hubs. Click any row to inspect its{' '}
                  <span className="text-white font-semibold">Past 50 Price Records</span>.
                </p>
              </div>

              {mandiBulletin?.rawMessageText && (
                <button
                  type="button"
                  onClick={() => setShowRawBulletin(!showRawBulletin)}
                  className="bg-[#14181F] hover:bg-[#1C222C] text-white border border-[#2C3545] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer self-start lg:self-auto"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>{showRawBulletin ? 'Hide Bulletin' : 'View Daily Bulletin'}</span>
                </button>
              )}
            </div>

            {/* 4 Metadata Cards (Date, Time, Mandi Trend, Live Sync) - Exact Mockup Styling */}
            <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
              {/* 1. Bulletin Date */}
              <div className="bg-[#14181F]/95 border border-[#28303E] rounded-2xl p-3 sm:p-3.5 flex items-center space-x-3 shadow-md">
                <div className="w-9 h-9 rounded-xl bg-[#251811] border border-[#E06924]/40 flex items-center justify-center text-[#E8732A] shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-extrabold text-white font-mono truncate">
                    {latestSyncDisplay.dateStr || mandiBulletin?.dateStr}
                  </p>
                  <span className="text-[11px] font-medium text-[#94A3B8] block">Date</span>
                </div>
              </div>

              {/* 2. Bulletin Time */}
              <div className="bg-[#14181F]/95 border border-[#28303E] rounded-2xl p-3 sm:p-3.5 flex items-center space-x-3 shadow-md">
                <div className="w-9 h-9 rounded-xl bg-[#251811] border border-[#E06924]/40 flex items-center justify-center text-[#E8732A] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-extrabold text-white font-mono truncate">
                    {latestSyncDisplay.timeStr || mandiBulletin?.timeStr} IST
                  </p>
                  <span className="text-[11px] font-medium text-[#94A3B8] block">
                    Time • Auto 3m
                  </span>
                </div>
              </div>

              {/* 3. Mandi Trend */}
              <div className="bg-[#14181F]/95 border border-[#28303E] rounded-2xl p-3 sm:p-3.5 flex items-center space-x-3 shadow-md">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    mandiBulletin?.overallTrend === 'down'
                      ? 'bg-[#2F1619] border-[#EF4444]/40 text-[#F87171]'
                      : 'bg-[#122D21] border-[#22C55E]/40 text-[#4ADE80]'
                  }`}
                >
                  {mandiBulletin?.overallTrend === 'down' ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-medium text-[#94A3B8] block">Mandi Trend</span>
                  <p
                    className={`text-xs sm:text-sm font-extrabold truncate ${
                      mandiBulletin?.overallTrend === 'down'
                        ? 'text-[#F87171]'
                        : 'text-[#4ADE80]'
                    }`}
                  >
                    {mandiBulletin?.overallTrend === 'down'
                      ? 'Mandi Gobindgarh ↓'
                      : 'Mandi Gobindgarh ↑'}
                  </p>
                </div>
              </div>

              {/* 4. Live Sync / Refresh Rates */}
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="bg-[#14181F]/95 hover:bg-[#1A2029] border border-[#28303E] hover:border-[#E06924]/50 rounded-2xl p-3 sm:p-3.5 flex items-center space-x-3 text-left transition cursor-pointer shadow-md disabled:opacity-75"
              >
                <div className="w-9 h-9 rounded-xl bg-[#251811] border border-[#E06924]/40 flex items-center justify-center text-[#E8732A] shrink-0">
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-medium text-[#94A3B8] block">
                    Live Sync (3m)
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-white truncate">
                    {isRefreshing ? 'Syncing Rates...' : 'Refresh Rates'}
                  </p>
                </div>
              </button>
            </div>

            {/* Collapsible Raw WhatsApp Bulletin Drawer */}
            {showRawBulletin && mandiBulletin?.rawMessageText && (
              <div className="mt-4 bg-[#12161D] border border-[#2A323E] rounded-2xl p-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[#222934] pb-2.5 mb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#22C55E]" />
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                      Official Daily Mandi Broadcast Message
                    </span>
                  </div>
                  <button
                    onClick={handleCopyBulletin}
                    className="text-[11px] bg-[#1A2029] hover:bg-[#E8732A] text-white px-3 py-1 rounded-lg border border-[#2E3746] flex items-center space-x-1.5 transition cursor-pointer font-bold"
                  >
                    {copiedBulletin ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs font-mono text-[#E2E8F0] whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto bg-[#0B0E11] p-3.5 rounded-xl border border-[#1E242D]">
                  {mandiBulletin.rawMessageText}
                </pre>
              </div>
            )}

            {/* 3 Collapsible Market Rate Dropdowns (1. Mandi Gobindgarh, 2. Ludhiana EN8D, 3. Ludhiana MS) */}
            <div className="mt-4 space-y-3">
              {/* Collapsible 1: Mandi Gobindgarh */}
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl overflow-hidden shadow-lg">
                <button
                  type="button"
                  onClick={() => toggleHubSection('gobindgarh')}
                  className="w-full px-4 py-3.5 bg-[#161B23] hover:bg-[#1B212B] flex items-center justify-between text-left transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#9A4B1A] to-[#6E3410] border border-[#E06924]/60 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-inner">
                      1
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wide">
                          Mandi Gobindgarh
                        </h3>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#5C2D12] text-[#FDE68A] border border-[#C86D28]/60">
                          {mainCategory === 'raw_materials' ? 'Raw Materials' : 'Scrap Materials'}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#202631] text-[#E2E8F0] border border-[#323B49]">
                          {hubSectionMaterials.gobindgarh.length} Items
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-1">
                        Iron & Steel Capital of India • Spot Benchmark Desk
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-[#202631] border border-[#323B49] flex items-center justify-center text-[#CBD5E1]">
                      {openHubSections.gobindgarh ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>
                {openHubSections.gobindgarh && (
                  <div className="border-t border-[#242C38]">
                    {renderHubTable(
                      hubSectionMaterials.gobindgarh,
                      `No ${
                        mainCategory === 'raw_materials' ? 'Raw Material' : 'Scrap'
                      } rates available for Mandi Gobindgarh.`
                    )}
                  </div>
                )}
              </div>

              {/* Collapsible 2: Ludhiana EN8D */}
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl overflow-hidden shadow-lg">
                <button
                  type="button"
                  onClick={() => toggleHubSection('ludhianaEn8d')}
                  className="w-full px-4 py-3.5 bg-[#161B23] hover:bg-[#1B212B] flex items-center justify-between text-left transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#9A4B1A] to-[#6E3410] border border-[#E06924]/60 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-inner">
                      2
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wide">
                          Ludhiana EN8D
                        </h3>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#5C2D12] text-[#FDE68A] border border-[#C86D28]/60">
                          {mainCategory === 'raw_materials' ? 'Raw Materials' : 'Scrap Materials'}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#202631] text-[#E2E8F0] border border-[#323B49]">
                          {hubSectionMaterials.ludhianaEn8d.length} Items
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-1">
                        High Carbon & Alloy Engineering Forging Steel Desk
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-[#202631] border border-[#323B49] flex items-center justify-center text-[#CBD5E1]">
                      {openHubSections.ludhianaEn8d ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>
                {openHubSections.ludhianaEn8d && (
                  <div className="border-t border-[#242C38]">
                    {renderHubTable(
                      hubSectionMaterials.ludhianaEn8d,
                      `No ${
                        mainCategory === 'raw_materials' ? 'Raw Material' : 'Scrap'
                      } rates available for Ludhiana EN8D.`
                    )}
                  </div>
                )}
              </div>

              {/* Collapsible 3: Ludhiana MS */}
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl overflow-hidden shadow-lg">
                <button
                  type="button"
                  onClick={() => toggleHubSection('ludhianaMs')}
                  className="w-full px-4 py-3.5 bg-[#161B23] hover:bg-[#1B212B] flex items-center justify-between text-left transition cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#9A4B1A] to-[#6E3410] border border-[#E06924]/60 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-inner">
                      3
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wide">
                          Ludhiana MS
                        </h3>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#5C2D12] text-[#FDE68A] border border-[#C86D28]/60">
                          {mainCategory === 'raw_materials' ? 'Raw Materials' : 'Scrap Materials'}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#202631] text-[#E2E8F0] border border-[#323B49]">
                          {hubSectionMaterials.ludhianaMs.length} Items
                        </span>
                      </div>
                      <p className="text-[11px] text-[#94A3B8] mt-1">
                        Commercial Mild Steel & Secondary Re-rolling Desk
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-[#202631] border border-[#323B49] flex items-center justify-center text-[#CBD5E1]">
                      {openHubSections.ludhianaMs ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>
                {openHubSections.ludhianaMs && (
                  <div className="border-t border-[#242C38]">
                    {renderHubTable(
                      hubSectionMaterials.ludhianaMs,
                      `No ${
                        mainCategory === 'raw_materials' ? 'Raw Material' : 'Scrap'
                      } rates available for Ludhiana MS.`
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Sticky Search, Movement Dropdown & Material Pills Bar - Exact Mockup Styling */}
        <div className="bg-[#0B0E11]/95 backdrop-blur-md border-b border-[#1E242D] sticky top-14 z-30">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-3 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search Mandi or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#14181F] border border-[#2A323E] rounded-xl text-white placeholder-[#94A3B8] font-medium"
                />
              </div>

              {/* Movement Filter Dropdown */}
              <select
                value={directionFilter}
                onChange={(e) => setDirectionFilter(e.target.value as any)}
                className="text-xs bg-[#14181F] border border-[#2A323E] rounded-xl py-2.5 px-3.5 text-white font-bold cursor-pointer"
              >
                <option value="all">All Movements</option>
                <option value="up">Price Up (Bullish ↑)</option>
                <option value="down">Price Down (Bearish ↓)</option>
              </select>
            </div>

            {/* Secondary Material Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-0.5">
              <span className="text-xs font-bold text-white shrink-0 mr-1">Materials:</span>

              <button
                onClick={() => setSelectedMaterialGroup('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                  selectedMaterialGroup === 'all'
                    ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 shadow-[0_2px_10px_rgba(224,105,36,0.3)]'
                    : 'bg-[#14181F] text-[#CBD5E1] hover:bg-[#1C222C] border border-[#2A323E]'
                }`}
              >
                All {mainCategory === 'raw_materials' ? 'Raw Materials' : 'Scrap'} (
                {categoryMaterials.length})
              </button>

              {materialGroups.map((group) => (
                <button
                  key={group.name}
                  onClick={() => setSelectedMaterialGroup(group.name)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
                    selectedMaterialGroup === group.name
                      ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 shadow-[0_2px_10px_rgba(224,105,36,0.3)]'
                      : 'bg-[#14181F] text-[#CBD5E1] hover:bg-[#1C222C] border border-[#2A323E]'
                  }`}
                >
                  {group.name} ({group.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Main Market Workspace - Grouped by Material with AI Foreground Thumbnail Cards */}
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-5 sm:py-7">
          <div className="space-y-5">
            {groupedByMaterialName.map(([materialName, mandis]) => {
              const prices = mandis.map((m) => m.currentPrice);
              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);
              const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
              const avgPercent =
                Math.round(
                  (mandis.reduce((acc, m) => acc + (m.percentageChange || 0), 0) / mandis.length) * 10
                ) / 10;
              const isGroupUp = avgPercent >= 0;

              return (
                <div
                  key={materialName}
                  className="bg-[#14181F] border border-[#2A323E] rounded-2xl shadow-[0_6px_30px_rgba(0,0,0,0.45)] overflow-hidden"
                >
                  {/* Material Group Header with AI Foreground Thumbnail - Exact Match to Mockup */}
                  <div className="bg-gradient-to-b from-[#1A2029] to-[#14181F] px-4 py-4 border-b border-[#262E3B]">
                    <div className="flex items-start sm:items-center justify-between gap-3.5">
                      <div className="flex items-start sm:items-center space-x-3.5 min-w-0 flex-1">
                        {/* Square AI Foreground Image */}
                        <img
                          src={getMaterialThumbnail(materialName, mainCategory)}
                          alt={materialName}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#323C4C] shrink-0 shadow-md"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                              {materialName}
                            </h2>
                            <span className="text-[11px] font-bold bg-[#202733] text-[#E2E8F0] px-2.5 py-0.5 rounded-md border border-[#333D4D]">
                              {mandis.length} {mandis.length === 1 ? 'Mandi' : 'Mandis & Places'}
                            </span>
                          </div>
                          <p className="text-xs text-[#94A3B8] mt-1">
                            Price Range:{' '}
                            <span className="font-mono font-bold text-white">
                              ₹{minPrice.toLocaleString('en-IN')} – ₹
                              {maxPrice.toLocaleString('en-IN')}
                            </span>{' '}
                            / MT ᵃˢᵗ
                          </p>

                          {/* Avg Spot Row inside Header for Mobile & Desktop */}
                          <div className="mt-2 flex items-end justify-between sm:hidden">
                            <div>
                              <span className="text-[10px] text-[#94A3B8] block font-medium">
                                Avg Spot
                              </span>
                              <span className="text-base font-black text-white font-mono">
                                ₹{avgPrice.toLocaleString('en-IN')} / MT
                              </span>
                            </div>
                            <div
                              className={`flex flex-col items-end font-mono text-xs font-extrabold ${
                                isGroupUp ? 'text-[#4ADE80]' : 'text-[#F87171]'
                              }`}
                            >
                              {isGroupUp ? (
                                <TrendingUp className="w-4 h-4 mb-0.5" />
                              ) : (
                                <TrendingDown className="w-4 h-4 mb-0.5" />
                              )}
                              <span>
                                {avgPercent >= 0 ? `+${avgPercent}%` : `${avgPercent}%`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Right Avg Spot + Trend */}
                      <div className="hidden sm:flex items-center space-x-4 shrink-0">
                        <div className="text-right">
                          <span className="text-[11px] text-[#94A3B8] block font-medium">
                            Avg Spot
                          </span>
                          <span className="text-lg font-black text-white font-mono">
                            ₹{avgPrice.toLocaleString('en-IN')} / MT
                          </span>
                        </div>
                        <div
                          className={`flex flex-col items-end font-mono text-xs font-extrabold ${
                            isGroupUp ? 'text-[#4ADE80]' : 'text-[#F87171]'
                          }`}
                        >
                          {isGroupUp ? (
                            <TrendingUp className="w-5 h-5 mb-0.5" />
                          ) : (
                            <TrendingDown className="w-5 h-5 mb-0.5" />
                          )}
                          <span>{avgPercent >= 0 ? `+${avgPercent}%` : `${avgPercent}%`}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mandis Table for this Material - Exact Match to Screen 3 of Mockup */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#222934] bg-[#10141B] text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                          <th className="py-2.5 px-4">Mandi / Place</th>
                          <th className="py-2.5 px-3 text-right">Spot Price ᵃˢᵗ</th>
                          <th className="py-2.5 px-3.5 text-right">Δ (vs Prev)</th>
                          <th className="py-2.5 px-3 text-right hidden sm:table-cell">
                            Prev. Session
                          </th>
                          <th className="py-2.5 px-3.5 text-center hidden md:table-cell">
                            50-Rec Analysis
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E2530]">
                        {mandis.map((mat, idx) => {
                          const isSelected = selectedMaterial?.id === mat.id;
                          const isUp = mat.movementDirection === 'up';
                          const isDown = mat.movementDirection === 'down';
                          const pctChange =
                            typeof mat.percentageChange === 'number' && !isNaN(mat.percentageChange)
                              ? mat.percentageChange
                              : mat.previousPrice > 0
                              ? Number(((mat.priceChange / mat.previousPrice) * 100).toFixed(2))
                              : 0;
                          const isPrimaryMandi =
                            mat.mandiCity.toLowerCase().includes('gobindgarh') ||
                            mat.mandiCity.toLowerCase().includes('ludhiana');

                          return (
                            <tr
                              key={`${mat.id}-${mat.symbol}-${idx}`}
                              onClick={() => {
                                setSelectedMaterial(mat);
                                setHistoryModalOpen(true);
                              }}
                              className={`cursor-pointer transition group ${
                                isSelected
                                  ? 'bg-[#251811] border-l-4 border-l-[#E8732A]'
                                  : 'hover:bg-[#191F28]'
                              }`}
                            >
                              {/* Place / Mandi Name */}
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-2.5">
                                  <MapPin
                                    className={`w-4 h-4 shrink-0 ${
                                      isSelected || isPrimaryMandi
                                        ? 'text-[#E8732A]'
                                        : 'text-[#94A3B8]'
                                    }`}
                                  />
                                  <div>
                                    <p className="font-extrabold text-white text-xs sm:text-sm leading-tight">
                                      {mat.mandiCity}
                                    </p>
                                    <p className="text-[10px] text-[#94A3B8] font-mono mt-0.5">
                                      {mat.symbol}
                                      {mat.specification ? ` • ${mat.specification}` : ''}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Current Spot Price */}
                              <td className="py-3 px-3 text-right font-mono">
                                <span className="text-sm sm:text-base font-extrabold text-white">
                                  ₹{mat.currentPrice.toLocaleString('en-IN')}
                                </span>
                              </td>

                              {/* Ups / Downs Delta Box */}
                              <td className="py-3 px-3.5 text-right font-mono">
                                <div className="inline-flex flex-col items-end">
                                  <span
                                    className={`inline-flex flex-col items-center justify-center px-2.5 py-1 rounded-xl text-[11px] font-bold min-w-[74px] ${
                                      isUp
                                        ? 'bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40'
                                        : isDown
                                        ? 'bg-[#2F1619] text-[#F87171] border border-[#EF4444]/40'
                                        : 'bg-[#1C222C] text-[#94A3B8] border border-[#2E3746]'
                                    }`}
                                  >
                                    <span className="flex items-center">
                                      {isUp && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                                      {isDown && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                      {!isUp && !isDown && <Minus className="w-3 h-3 mr-0.5" />}
                                      ₹{Math.abs(mat.priceChange).toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-[9px] opacity-90">
                                      ({pctChange > 0 ? '+' : ''}
                                      {pctChange}%)
                                    </span>
                                  </span>
                                </div>
                              </td>

                              {/* Previous Session Price */}
                              <td className="py-3 px-3 text-right font-mono text-xs text-[#94A3B8] hidden sm:table-cell">
                                ₹{mat.previousPrice.toLocaleString('en-IN')}
                              </td>

                              {/* View 50 Records Action */}
                              <td className="py-3 px-3.5 text-center hidden md:table-cell">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMaterial(mat);
                                    setHistoryModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition inline-flex items-center space-x-1 cursor-pointer bg-[#1B212B] text-[#E2E8F0] hover:bg-[#E8732A] hover:text-white border border-[#2E3746]"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>50 Recs</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}

            {groupedByMaterialName.length === 0 && (
              <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-10 text-center">
                <Filter className="w-8 h-8 text-[#E8732A] mx-auto mb-2" />
                <p className="text-sm font-extrabold text-white">
                  No matching Mandi price feeds found
                </p>
                <p className="text-xs text-[#94A3B8] mt-1">
                  Try clearing your search or selecting "All" in the material filter bar above.
                </p>
                <button
                  onClick={() => {
                    setSelectedMaterialGroup('all');
                    setSearchQuery('');
                    setDirectionFilter('all');
                  }}
                  className="mt-4 text-xs bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white font-bold px-4 py-2 rounded-xl border border-[#F59352]/50 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Tax & Footnote Legend */}
            <div className="bg-[#14181F] border border-[#262E3B] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#94A3B8]">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-[#E8732A] bg-[#251811] px-2 py-0.5 rounded border border-[#E06924]/40">
                  ᵃˢᵗ
                </span>
                <span>
                  Indicates <strong className="text-white">GST Extra</strong> ex-works / ex-mandi spot rate per Metric Ton (MT).
                </span>
              </div>
              <span className="text-[11px] text-[#64748B]">
                Click any Mandi row to inspect its 50-record historical ledger
              </span>
            </div>
          </div>

          {/* 50-Record Popup Modal */}
          {historyModalOpen && activeSelectedMaterial && (
            <div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
              onClick={() => setHistoryModalOpen(false)}
            >
              <div
                className="bg-[#14181F] border border-[#2C3545] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-white"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Top Header */}
                <div className="bg-[#0E1217] text-white p-4 sm:p-5 border-b border-[#222934]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase bg-[#251811] text-[#E8732A] px-2 py-0.5 rounded border border-[#E06924]/40 font-bold">
                          {activeSelectedMaterial.symbol}
                        </span>
                        <span className="text-[10px] font-bold uppercase bg-[#1A2029] text-[#CBD5E1] px-2 py-0.5 rounded border border-[#2C3545]">
                          {activeSelectedMaterial.mainCategory === 'scrap_materials'
                            ? 'Scrap Division'
                            : 'Raw Materials Division'}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1.5">
                        {activeSelectedMaterial.materialName} — {activeSelectedMaterial.mandiCity}
                      </h3>
                      <p className="text-xs text-[#94A3B8] mt-0.5 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-[#E8732A]" />
                        {activeSelectedMaterial.mandiCity}
                        {activeSelectedMaterial.specification
                          ? ` • Spec: ${activeSelectedMaterial.specification}`
                          : ''}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleDownloadCSV(activeSelectedMaterial)}
                        className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white p-2 px-3 rounded-xl border border-[#F59352]/50 transition flex items-center space-x-1.5 text-xs font-bold cursor-pointer"
                        title="Download 50-Record CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                      <button
                        onClick={() => setHistoryModalOpen(false)}
                        className="bg-[#1A2029] hover:bg-[#EF4444] text-white p-2 rounded-xl border border-[#2C3545] transition cursor-pointer"
                        aria-label="Close modal"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Current Spot & Session High/Low Summary */}
                  <div className="mt-4 pt-3 border-t border-[#222934] flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-[#94A3B8] uppercase block font-bold">
                        Current Spot Rate ({activeSelectedMaterial.unit} ᵃˢᵗ)
                      </span>
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                        ₹{activeSelectedMaterial.currentPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-mono font-bold ${
                          activeSelectedMaterial.movementDirection === 'up'
                            ? 'bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40'
                            : activeSelectedMaterial.movementDirection === 'down'
                            ? 'bg-[#2F1619] text-[#F87171] border border-[#EF4444]/40'
                            : 'bg-[#1C222C] text-[#94A3B8] border border-[#2E3746]'
                        }`}
                      >
                        {activeSelectedMaterial.priceChange > 0 ? '+' : ''}₹
                        {activeSelectedMaterial.priceChange} (
                        {activeSelectedMaterial.percentageChange > 0 ? '+' : ''}
                        {activeSelectedMaterial.percentageChange}%)
                      </span>
                      <span className="block text-[10px] text-[#94A3B8] mt-1 font-mono">
                        Prev: ₹{activeSelectedMaterial.previousPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Scrollable Body */}
                <div className="flex-1 overflow-y-auto divide-y divide-[#222934]">
                  {/* 50-Record Bar Chart */}
                  <div className="p-4 bg-[#11151C]">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#CBD5E1] mb-2">
                      <span className="flex items-center">
                        <History className="w-3.5 h-3.5 mr-1 text-[#E8732A]" />
                        50-Session Trend ({activeSelectedMaterial.materialName} @{' '}
                        {activeSelectedMaterial.mandiCity})
                      </span>
                      <span className="font-mono text-[10px] text-[#E8732A]">
                        {(activeSelectedMaterial.historicalPrices || []).length} / 50 Stored
                      </span>
                    </div>

                    {(() => {
                      const history = (activeSelectedMaterial.historicalPrices || []).slice(-50);
                      if (history.length === 0) return null;
                      const prices = history.map((h) => h.price);
                      const minP = Math.min(...prices);
                      const maxP = Math.max(...prices);
                      const range = maxP - minP || 1;

                      return (
                        <div>
                          <div className="h-24 flex items-end space-x-1 pt-3 px-1 bg-[#161B23] rounded-xl border border-[#262E3B]">
                            {history.map((pt, i) => {
                              const heightPct = Math.max(
                                15,
                                Math.round(((pt.price - minP) / range) * 85)
                              );
                              const isLatest = i === history.length - 1;
                              const isPtUp = (pt.priceChange || 0) > 0;
                              const isPtDown = (pt.priceChange || 0) < 0;

                              return (
                                <div
                                  key={i}
                                  className="flex-1 flex flex-col items-center group relative h-full justify-end"
                                  title={`#${i + 1} (${pt.date}): ₹${pt.price.toLocaleString(
                                    'en-IN'
                                  )} (${pt.priceChange && pt.priceChange > 0 ? '+' : ''}${
                                    pt.priceChange || 0
                                  })`}
                                >
                                  <div
                                    style={{ height: `${heightPct}%` }}
                                    className={`w-full rounded-t transition-all ${
                                      isLatest
                                        ? 'bg-[#E8732A]'
                                        : isPtUp
                                        ? 'bg-[#22C55E]/80 group-hover:bg-[#22C55E]'
                                        : isPtDown
                                        ? 'bg-[#EF4444]/80 group-hover:bg-[#EF4444]'
                                        : 'bg-[#64748B] group-hover:bg-[#94A3B8]'
                                    }`}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-[#94A3B8] mt-1.5 font-semibold">
                            <span>Low: ₹{minP.toLocaleString('en-IN')}</span>
                            <span>Range: ₹{range.toLocaleString('en-IN')}</span>
                            <span>High: ₹{maxP.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Scrollable 50-Record Ledger Table */}
                  <div>
                    <div className="p-3 px-4 bg-[#14181F] flex items-center justify-between border-b border-[#222934]">
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                        Past 50 Price Records (Newest First)
                      </h4>
                      <span className="text-[10px] bg-[#251811] text-[#E8732A] px-2 py-0.5 rounded border border-[#E06924]/40 font-mono font-bold">
                        Max 50 Cap
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#0F1319] sticky top-0 border-b border-[#222934] text-[10px] text-[#94A3B8] uppercase">
                          <tr>
                            <th className="py-2 px-3">#</th>
                            <th className="py-2 px-2">Session Date</th>
                            <th className="py-2 px-2 text-right">Spot Price</th>
                            <th className="py-2 px-3 text-right">Up / Down</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1E2530] font-mono">
                          {[...(activeSelectedMaterial.historicalPrices || [])]
                            .slice(-50)
                            .reverse()
                            .map((record, index, arr) => {
                              const recNum = arr.length - index;
                              const change = record.priceChange || 0;
                              const dir =
                                record.movementDirection ||
                                (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral');

                              return (
                                <tr
                                  key={index}
                                  className={
                                    index === 0
                                      ? 'bg-[#251811]/60 font-bold'
                                      : 'hover:bg-[#191F28]'
                                  }
                                >
                                  <td className="py-2.5 px-3 text-[10px] text-[#94A3B8]">
                                    #{recNum}
                                  </td>
                                  <td className="py-2.5 px-2 text-[11px] text-white font-sans">
                                    <div className="flex items-center space-x-1.5">
                                      <span className="font-mono font-semibold">{record.date}</span>
                                      {index === 0 && (
                                        <span className="text-[9px] bg-[#E8732A] text-white px-1.5 py-0.2 rounded font-bold uppercase">
                                          Latest
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-2 text-right font-extrabold text-white">
                                    ₹{record.price.toLocaleString('en-IN')}
                                  </td>
                                  <td className="py-2.5 px-3 text-right">
                                    <span
                                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                        dir === 'up'
                                          ? 'bg-[#122D21] text-[#4ADE80]'
                                          : dir === 'down'
                                          ? 'bg-[#2F1619] text-[#F87171]'
                                          : 'text-[#94A3B8]'
                                      }`}
                                    >
                                      {change > 0 ? `+₹${change}` : change < 0 ? `-₹${Math.abs(change)}` : '₹0'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Modal Bottom CTA */}
                <div className="p-4 bg-[#0E1217] border-t border-[#222934] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-[11px] text-[#94A3B8]">
                    Need physical delivery of{' '}
                    <strong className="text-white">{activeSelectedMaterial.materialName}</strong> from{' '}
                    <strong className="text-white">{activeSelectedMaterial.mandiCity}</strong>?
                  </p>
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setHistoryModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-[#1A2029] hover:bg-[#242C38] text-[#CBD5E1] text-xs font-bold border border-[#2C3545] transition cursor-pointer"
                    >
                      Close
                    </button>
                    <Link
                      href="/raw-materials"
                      className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center space-x-1.5 border border-[#F59352]/50 transition"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Configure & Request Quote</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
    </CustomerLayout>
  );
}
