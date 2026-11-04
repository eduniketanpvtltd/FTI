'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { formatINR } from '@/lib/utils';
import { MarketMaterial, MarketMainCategory } from '@/types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  RefreshCw,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Download,
  Copy,
  Check,
  MessageSquare,
  ShieldCheck,
  Activity,
  Layers,
  ExternalLink,
  Info,
  Filter,
  History,
  Building2,
  MapPin,
  ArrowLeft,
} from 'lucide-react';

export default function MarketPage() {
  const { marketMaterials, mandiBulletin, refreshMarketPrices } = useStore();

  // Primary Level 1: 'raw_materials' vs 'scrap_materials' (or 'whatsapp')
  const [mainCategory, setMainCategory] = useState<MarketMainCategory | 'whatsapp'>('raw_materials');

  // Secondary Level 2: Specific Material Name filter (e.g. 'All', 'Ingot', 'Billet', 'Melting Scrap')
  const [selectedMaterialGroup, setSelectedMaterialGroup] = useState<string>('all');

  const [searchTerm, setSearchTerm] = useState('');
  const [movementFilter, setMovementFilter] = useState<'all' | 'up' | 'down' | 'neutral'>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<MarketMaterial | null>(null);
  const [historyLimit, setHistoryLimit] = useState<7 | 15 | 30 | 50>(50);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedBulletin, setCopiedBulletin] = useState(false);
  // Mobile tab switcher ('mandis' vs 'history')
  const [mobileTab, setMobileTab] = useState<'mandis' | 'history'>('mandis');

  // Manual refresh animation
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshMarketPrices();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Copy WhatsApp broadcast to clipboard
  const handleCopyBulletin = () => {
    if (!mandiBulletin?.rawMessageText) return;
    navigator.clipboard.writeText(mandiBulletin.rawMessageText);
    setCopiedBulletin(true);
    setTimeout(() => setCopiedBulletin(false), 2500);
  };

  // Reset secondary filter when primary category changes
  const handleCategoryChange = (cat: MarketMainCategory | 'whatsapp') => {
    setMainCategory(cat);
    setSelectedMaterialGroup('all');
  };

  // 1. Available materials in active primary category
  const categoryMaterials = useMemo(() => {
    if (mainCategory === 'whatsapp') return [];
    return marketMaterials.filter((m) => {
      if (m.mainCategory) return m.mainCategory === mainCategory;
      // Fallback
      if (mainCategory === 'scrap_materials') {
        return (
          m.categorySlug === 'scrap' ||
          m.name.toLowerCase().includes('scrap') ||
          m.symbol.toLowerCase().includes('scrap')
        );
      }
      return m.categorySlug !== 'scrap' && !m.name.toLowerCase().includes('scrap');
    });
  }, [marketMaterials, mainCategory]);

  // 2. Distinct material names available in this category
  const availableMaterialNames = useMemo(() => {
    const names = new Set<string>();
    categoryMaterials.forEach((m) => {
      if (m.materialName) names.add(m.materialName);
      else if (m.categoryName) names.add(m.categoryName);
      else names.add(m.name);
    });
    return Array.from(names);
  }, [categoryMaterials]);

  // 3. Apply secondary group filter + search filter + movement filter
  const filteredMaterials = useMemo(() => {
    return categoryMaterials.filter((m) => {
      const matName = m.materialName || m.categoryName || m.name;
      if (selectedMaterialGroup !== 'all' && matName !== selectedMaterialGroup) {
        return false;
      }

      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesCity = m.mandiCity?.toLowerCase().includes(query);
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesMat = m.materialName?.toLowerCase().includes(query);
        const matchesSymbol = m.symbol.toLowerCase().includes(query);
        if (!matchesCity && !matchesName && !matchesMat && !matchesSymbol) {
          return false;
        }
      }

      if (movementFilter !== 'all') {
        if (movementFilter === 'up' && m.movementDirection !== 'up') return false;
        if (movementFilter === 'down' && m.movementDirection !== 'down') return false;
        if (movementFilter === 'neutral' && m.movementDirection !== 'neutral') return false;
      }

      return true;
    });
  }, [categoryMaterials, selectedMaterialGroup, searchTerm, movementFilter]);

  // Automatically select first material for history panel if none selected or invalid
  React.useEffect(() => {
    if (filteredMaterials.length > 0) {
      if (!selectedMaterial || !filteredMaterials.some((m) => m.id === selectedMaterial.id)) {
        setSelectedMaterial(filteredMaterials[0]);
      }
    }
  }, [filteredMaterials, selectedMaterial]);

  // 4. Group filtered items by Material Name for clean industrial sectioning
  const groupedByMaterial = useMemo(() => {
    const groups: Record<string, MarketMaterial[]> = {};
    filteredMaterials.forEach((m) => {
      const groupKey = m.materialName || m.categoryName || m.name;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(m);
    });
    return groups;
  }, [filteredMaterials]);

  // Chart data for selected material's 50 historical records
  const chartData = useMemo(() => {
    if (!selectedMaterial?.historicalPrices) return [];
    return selectedMaterial.historicalPrices.slice(0, historyLimit).map((h, i) => ({
      index: i + 1,
      date: h.date,
      price: h.price,
      change: h.priceChange ?? 0,
      direction: h.movementDirection ?? 'neutral',
      notes: h.notes,
    }));
  }, [selectedMaterial, historyLimit]);

  // Export 50 records as CSV
  const handleExportCSV = (mat: MarketMaterial) => {
    if (!mat.historicalPrices || mat.historicalPrices.length === 0) return;

    const headers = ['Record #', 'Session Date', 'Mandi / Place', 'Material', 'Price (INR/MT)', 'Change', 'Notes'];
    const rows = mat.historicalPrices.map((h, i) => [
      i + 1,
      h.date,
      mat.mandiCity,
      mat.materialName,
      h.price,
      h.priceChange ?? 0,
      `"${(h.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${mat.symbol}_past_50_market_records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Summary counts
  const rawCount = marketMaterials.filter(
    (m) =>
      m.mainCategory === 'raw_materials' ||
      (m.categorySlug !== 'scrap' && !m.name.toLowerCase().includes('scrap'))
  ).length;

  const scrapCount = marketMaterials.filter(
    (m) =>
      m.mainCategory === 'scrap_materials' ||
      m.categorySlug === 'scrap' ||
      m.name.toLowerCase().includes('scrap')
  ).length;

  return (
    <CustomerLayout>
      {/* 1. Header with authentic Mandi bulletin info - Dark Chocolate Brown */}
      <div className="bg-[#49352D] text-[#F1EAE1] py-6 px-4 sm:px-6 border-b border-[#343A3F]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center space-x-2 text-xs text-[#A8ADB1] font-medium">
            <Link href="/" className="hover:text-[#F1EAE1] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#B18A70] font-bold">
              Live Mandi Steel & Scrap Trading Desk
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#F1EAE1] bg-[#343A3F] border border-[#737A7F] px-2 py-0.5 rounded">
                  FIELDFAST TECH INTERNATIONAL
                </span>
                <span className="bg-[#10B981]/20 text-[#10B981] text-xs font-bold px-2.5 py-0.5 rounded border border-[#10B981]/40 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                  <span>LIVE MANDI SPOT BENCHMARK</span>
                </span>
                <span className="bg-[#76513F] text-[#F1EAE1] text-xs font-bold px-2.5 py-0.5 rounded border border-[#B18A70] flex items-center space-x-1">
                  <History className="w-3.5 h-3.5 text-[#B18A70]" />
                  <span>PAST 50 RECORDS SAVED</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F1EAE1]">
                Industrial Raw Materials & Scrap Mandi Price Desk
              </h1>
              <p className="text-xs sm:text-sm text-[#A8ADB1] mt-1 max-w-2xl leading-relaxed">
                Live spot rates categorized by <strong>Raw Materials</strong> & <strong>Scrap Materials</strong>,
                broken down by material and tracked across Mandi Gobindgarh, Ludhiana, Raipur, Muzaffarnagar,
                and national trading hubs with full 50-record audit history.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyBulletin}
                className="px-3 py-2 bg-[#343A3F] hover:bg-[#604333] text-[#F1EAE1] border border-[#737A7F] rounded-md text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                title="Copy entire WhatsApp bulletin text"
              >
                {copiedBulletin ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[#10B981] font-bold">Bulletin Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#B18A70]" />
                    <span>Copy WhatsApp Bulletin</span>
                  </>
                )}
              </button>

              <a
                href="https://wa.me/919780830333?text=Hello%20FTI,%20I%20am%20inquiring%20about%20today's%20Mandi%20Gobindgarh%20Live%20Rates"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-[#10B981] hover:bg-[#059669] text-[#252A2E] font-bold rounded-md text-xs flex items-center space-x-1.5 shadow transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>

              <button
                onClick={handleManualRefresh}
                className={`p-2 rounded-md bg-[#343A3F] hover:bg-[#604333] text-[#F1EAE1] border border-[#737A7F] transition cursor-pointer ${
                  isRefreshing ? 'animate-spin text-[#B18A70]' : ''
                }`}
                title="Refresh Live Rates"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bulletin Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-[#343A3F] border border-[#737A7F] p-2 sm:p-2.5 rounded-lg flex items-center space-x-2 min-w-0">
              <span className="text-lg sm:text-xl shrink-0">🗓️</span>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] text-[#A8ADB1] uppercase font-mono block">Date</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#F1EAE1] font-mono truncate block">
                  {mandiBulletin?.dateStr || '28-OCT-2026'}
                </span>
              </div>
            </div>

            <div className="bg-[#343A3F] border border-[#737A7F] p-2 sm:p-2.5 rounded-lg flex items-center space-x-2 min-w-0">
              <span className="text-lg sm:text-xl shrink-0">⏰</span>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] text-[#A8ADB1] uppercase font-mono block">Time</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#F1EAE1] font-mono truncate block">
                  {mandiBulletin?.timeStr || '12:00'} IST
                </span>
              </div>
            </div>

            <div className="bg-[#343A3F] border border-[#737A7F] p-2 sm:p-2.5 rounded-lg flex items-center space-x-2 min-w-0">
              <span className="text-lg sm:text-xl shrink-0">
                {mandiBulletin?.overallTrend === 'up' ? '📈' : '📉'}
              </span>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] text-[#A8ADB1] uppercase font-mono block">Mandi Trend</span>
                <span
                  className={`text-xs sm:text-sm font-extrabold block truncate ${
                    mandiBulletin?.overallTrend === 'up' ? 'text-[#10B981]' : 'text-[#DC6262]'
                  }`}
                >
                  {mandiBulletin?.trendText || 'Mandi Trend downwards'}
                </span>
              </div>
            </div>

            <div className="bg-[#343A3F] border border-[#737A7F] p-2 sm:p-2.5 rounded-lg flex items-center space-x-2 min-w-0">
              <span className="text-lg sm:text-xl shrink-0">🇺🇸</span>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] text-[#A8ADB1] uppercase font-mono block">USD / INR</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#E5A34B] font-mono truncate block">
                  1$ = ₹{mandiBulletin?.usdInrRate || 95.04}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY CATEGORY LEVEL 1: RAW MATERIAL vs SCRAP MATERIAL - Deep Copper Header */}
      <div className="bg-[#604333] border-b border-[#49352D] sticky top-14 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 py-2.5 sm:py-3">
            {/* Primary Category Switcher Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => handleCategoryChange('raw_materials')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-extrabold rounded-lg transition flex items-center space-x-1.5 sm:space-x-2 shrink-0 cursor-pointer ${
                  mainCategory === 'raw_materials'
                    ? 'bg-[#76513F] text-[#F1EAE1] shadow-md border border-[#B18A70]'
                    : 'bg-[#49352D] text-[#A8ADB1] hover:text-[#F1EAE1] border border-[#737A7F]'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#B18A70] shrink-0" />
                <span className="whitespace-nowrap">RAW MATERIALS</span>
                <span className="text-[10px] sm:text-xs font-mono bg-[#343A3F] text-[#F1EAE1] px-1.5 py-0.5 rounded border border-[#737A7F]">
                  {rawCount} Mandis
                </span>
              </button>

              <button
                onClick={() => handleCategoryChange('scrap_materials')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-extrabold rounded-lg transition flex items-center space-x-1.5 sm:space-x-2 shrink-0 cursor-pointer ${
                  mainCategory === 'scrap_materials'
                    ? 'bg-[#76513F] text-[#F1EAE1] shadow-md border border-[#B18A70]'
                    : 'bg-[#49352D] text-[#A8ADB1] hover:text-[#F1EAE1] border border-[#737A7F]'
                }`}
              >
                <Layers className="w-4 h-4 text-[#B18A70] shrink-0" />
                <span className="whitespace-nowrap">SCRAP MATERIALS</span>
                <span className="text-[10px] sm:text-xs font-mono bg-[#343A3F] text-[#F1EAE1] px-1.5 py-0.5 rounded border border-[#737A7F]">
                  {scrapCount} Mandis
                </span>
              </button>

              <button
                onClick={() => handleCategoryChange('whatsapp')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                  mainCategory === 'whatsapp'
                    ? 'bg-[#10B981] text-[#252A2E] shadow-md'
                    : 'bg-[#49352D] text-[#10B981] hover:bg-[#343A3F] border border-[#737A7F]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">WhatsApp Mandi Feed</span>
                <span className="sm:hidden">Feed</span>
              </button>
            </div>

            {/* Search & Ups / Downs Filter */}
            {mainCategory !== 'whatsapp' && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-[#A8ADB1] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search Mandi or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#343A3F] border border-[#737A7F] rounded-md text-[#F1EAE1] placeholder-[#A8ADB1] font-medium"
                  />
                </div>

                {/* Ups or Downs Trend Filter */}
                <select
                  value={movementFilter}
                  onChange={(e) => setMovementFilter(e.target.value as any)}
                  aria-label="Filter by price movement"
                  className="py-1.5 px-2.5 text-xs bg-[#343A3F] border border-[#737A7F] rounded-md text-[#F1EAE1] font-semibold"
                >
                  <option value="all">All Movements</option>
                  <option value="up">Only Ups (Gainers ▲)</option>
                  <option value="down">Only Downs (Losers ▼)</option>
                  <option value="neutral">Neutral (Unchanged ▬)</option>
                </select>
              </div>
            )}
          </div>

          {/* 3. SECONDARY LEVEL 2: MATERIAL NAME PILLS */}
          {mainCategory !== 'whatsapp' && (
            <div className="py-2 border-t border-[#49352D] flex items-center space-x-2 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A8ADB1] shrink-0 flex items-center space-x-1">
                <Filter className="w-3 h-3 text-[#B18A70]" />
                <span>Materials:</span>
              </span>

              <button
                onClick={() => setSelectedMaterialGroup('all')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition shrink-0 cursor-pointer ${
                  selectedMaterialGroup === 'all'
                    ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70] shadow-xs'
                    : 'bg-[#49352D] text-[#A8ADB1] hover:text-[#F1EAE1] border border-[#737A7F]'
                }`}
              >
                All {mainCategory === 'raw_materials' ? 'Raw Materials' : 'Scrap Materials'} ({categoryMaterials.length})
              </button>

              {availableMaterialNames.map((matName) => {
                const count = categoryMaterials.filter(
                  (m) => m.materialName === matName || m.categoryName === matName
                ).length;
                const isSelected = selectedMaterialGroup === matName;

                return (
                  <button
                    key={matName}
                    onClick={() => setSelectedMaterialGroup(matName)}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70] shadow-xs'
                        : 'bg-[#49352D] text-[#A8ADB1] hover:text-[#F1EAE1] border border-[#737A7F]'
                    }`}
                  >
                    <span>{matName}</span>
                    <span className="text-[10px] opacity-80 font-mono">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. MAIN BODY CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {mainCategory === 'whatsapp' ? (
          /* Dedicated WhatsApp Broadcast View */
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-[#343A3F] text-[#F1EAE1] rounded-xl shadow-xl overflow-hidden border border-[#737A7F]">
              <div className="bg-[#49352D] p-3.5 px-4 flex items-center justify-between border-b border-[#343A3F]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#76513F] border border-[#B18A70] flex items-center justify-center text-[#F1EAE1] font-black text-sm">
                    FTI
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-bold text-sm text-[#F1EAE1]">FIELDFAST TECH INTERNATIONAL</h3>
                      <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <p className="text-[11px] text-[#A8ADB1]">Official Daily Mandi Live Rates Broadcast</p>
                  </div>
                </div>

                <button
                  onClick={handleCopyBulletin}
                  className="px-3 py-1.5 bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] font-bold text-xs rounded border border-[#B18A70] flex items-center space-x-1.5 transition cursor-pointer"
                >
                  {copiedBulletin ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBulletin ? 'Copied!' : 'Copy Broadcast'}</span>
                </button>
              </div>

              <div className="p-4 sm:p-6 bg-[#252A2E]">
                <div className="max-w-xl mx-auto bg-[#343A3F] rounded-lg p-4 sm:p-5 shadow border border-[#737A7F] font-mono text-xs text-[#F1EAE1] whitespace-pre-wrap leading-relaxed select-all">
                  {mandiBulletin?.rawMessageText}
                </div>
              </div>

              <div className="p-3 bg-[#49352D] border-t border-[#343A3F] flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-[#A8ADB1] gap-2">
                <span>Updated {mandiBulletin?.dateStr} at {mandiBulletin?.timeStr}</span>
                <a
                  href="https://wa.me/919780830333"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#10B981] hover:underline font-bold flex items-center space-x-1"
                >
                  <span>Join FTI WhatsApp Alert Broadcast List</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Segmented View Switcher (< lg) */}
            <div className="flex lg:hidden bg-[#BAC0C5] p-1 rounded-xl border border-[#737A7F] shadow-xs mb-4">
              <button
                onClick={() => setMobileTab('mandis')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  mobileTab === 'mandis'
                    ? 'bg-[#76513F] text-[#F1EAE1] shadow-xs'
                    : 'text-[#252A2E] hover:bg-[#A8ADB1]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Mandi Rates ({filteredMaterials.length})</span>
              </button>
              <button
                onClick={() => setMobileTab('history')}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                  mobileTab === 'history'
                    ? 'bg-[#76513F] text-[#F1EAE1] shadow-xs'
                    : 'text-[#252A2E] hover:bg-[#A8ADB1]'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>50-Rec Analysis {selectedMaterial ? `(${selectedMaterial.mandiCity})` : ''}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (7 cols): Mandis and Places grouped by Material Name */}
              <div className={`lg:col-span-7 space-y-6 ${mobileTab === 'mandis' ? 'block' : 'hidden lg:block'}`}>
                {Object.keys(groupedByMaterial).length === 0 ? (
                  <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-xl p-12 text-center text-[#252A2E]">
                    <Search className="w-10 h-10 mx-auto mb-2 text-[#49352D]" />
                    <p className="font-extrabold text-[#252A2E] text-sm">No matching Mandi prices found</p>
                    <p className="text-xs text-[#49352D] mt-1 font-medium">Try adjusting your material or search filter.</p>
                  </div>
                ) : (
                  Object.entries(groupedByMaterial).map(([materialName, mandis]) => {
                    const avgPrice = Math.round(
                      mandis.reduce((acc, m) => acc + m.currentPrice, 0) / mandis.length
                    );
                    const minPrice = Math.min(...mandis.map((m) => m.currentPrice));
                    const maxPrice = Math.max(...mandis.map((m) => m.currentPrice));

                    return (
                      <div
                        key={materialName}
                        className="bg-[#BAC0C5] border border-[#737A7F] rounded-xl shadow-xs overflow-hidden"
                      >
                        {/* Material Name Group Header */}
                        <div className="bg-[#A8ADB1] border-b border-[#737A7F] p-3.5 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center space-x-2.5">
                            <span className="w-3 h-3 rounded-full bg-[#76513F]" />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-sm font-extrabold text-[#252A2E] uppercase tracking-wide">
                                  {materialName}
                                </h3>
                                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#858C92] text-[#252A2E] border border-[#737A7F]">
                                  {mandis.length} {mandis.length === 1 ? 'Mandi' : 'Mandis & Places'}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#343A3F] font-medium">
                                Price Range: <strong className="text-[#252A2E]">{formatINR(minPrice)}</strong> –{' '}
                                <strong className="text-[#252A2E]">{formatINR(maxPrice)}</strong> / MT ᵃˢᵗ
                              </p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-[10px] uppercase font-mono text-[#49352D] block font-bold">Avg Spot</span>
                            <span className="text-xs sm:text-sm font-extrabold text-[#252A2E] font-mono">
                              {formatINR(avgPrice)} / MT
                            </span>
                          </div>
                        </div>

                        {/* Mandis & Places List Table */}
                        <div className="divide-y divide-[#737A7F]/30 overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-[#858C92] text-[#252A2E] font-extrabold uppercase text-[10px] border-b border-[#737A7F]">
                              <tr>
                                <th className="py-2.5 px-3.5">Mandi / Place</th>
                                <th className="py-2.5 px-3 text-right">Spot Price ᵃˢᵗ</th>
                                <th className="py-2.5 px-3 text-right">Ups / Downs</th>
                                <th className="py-2.5 px-3 text-right hidden sm:table-cell">Prev. Session</th>
                                <th className="py-2.5 px-3.5 text-center">Audit</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#737A7F]/30">
                              {mandis.map((mat) => {
                                const isSelected = selectedMaterial?.id === mat.id;
                                const isUp = mat.movementDirection === 'up';
                                const isDown = mat.movementDirection === 'down';

                                return (
                                  <tr
                                    key={mat.id}
                                    onClick={() => {
                                      setSelectedMaterial(mat);
                                      setMobileTab('history');
                                    }}
                                    className={`cursor-pointer transition group ${
                                      isSelected
                                        ? 'bg-[#76513F]/25 font-bold border-l-4 border-l-[#76513F]'
                                        : 'hover:bg-[#C7CBD0]'
                                    }`}
                                  >
                                    {/* Place / Mandi Name */}
                                    <td className="py-2.5 px-3.5">
                                      <div className="flex items-center space-x-2">
                                        <MapPin
                                          className={`w-3.5 h-3.5 shrink-0 ${
                                            isSelected ? 'text-[#76513F]' : 'text-[#626B72]'
                                          }`}
                                        />
                                        <div>
                                          <p className="font-extrabold text-[#252A2E] text-xs flex items-center space-x-1">
                                            <span>{mat.mandiCity}</span>
                                            <span className="text-[10px] font-normal text-[#49352D] font-mono">
                                              ᵃˢᵗ
                                            </span>
                                          </p>
                                          <p className="text-[10px] text-[#49352D] font-mono font-medium">
                                            {mat.symbol}
                                            {mat.specification ? ` • ${mat.specification}` : ''}
                                          </p>
                                        </div>
                                      </div>
                                    </td>

                                    {/* Spot Price */}
                                    <td className="py-2.5 px-3 text-right font-mono font-black text-[#252A2E] text-xs sm:text-sm">
                                      {formatINR(mat.currentPrice)}
                                    </td>

                                    {/* Ups / Downs Badge */}
                                    <td className="py-2.5 px-3 text-right">
                                      <span
                                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-black font-mono shadow-xs ${
                                          isUp
                                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                                            : isDown
                                            ? 'bg-[#DC6262]/20 text-[#DC6262] border border-[#DC6262]/40'
                                            : 'bg-[#858C92] text-[#252A2E] border border-[#737A7F]'
                                        }`}
                                      >
                                        {isUp ? (
                                          <>
                                            <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />
                                            <span>+₹{mat.priceChange}</span>
                                            <span className="text-[9px] opacity-80">(+{mat.percentageChange}%)</span>
                                          </>
                                        ) : isDown ? (
                                          <>
                                            <ArrowDownRight className="w-3.5 h-3.5 text-[#DC6262]" />
                                            <span>-₹{Math.abs(mat.priceChange)}</span>
                                            <span className="text-[9px] opacity-80">({mat.percentageChange}%)</span>
                                          </>
                                        ) : (
                                          <>
                                            <Minus className="w-3.5 h-3.5 text-[#626B72]" />
                                            <span>₹0</span>
                                            <span className="text-[9px] opacity-80">(0.0%)</span>
                                          </>
                                        )}
                                      </span>
                                    </td>

                                    {/* Previous Price */}
                                    <td className="py-2.5 px-3 text-right text-[#49352D] font-mono font-bold text-xs hidden sm:table-cell">
                                      {formatINR(mat.previousPrice)}
                                    </td>

                                    {/* Past 50 Records Indicator */}
                                    <td className="py-2.5 px-3.5 text-center">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedMaterial(mat);
                                          setMobileTab('history');
                                        }}
                                        className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-[#858C92] text-[#252A2E] hover:bg-[#76513F] hover:text-[#F1EAE1] transition border border-[#737A7F] cursor-pointer"
                                        title="View all 50 recorded price sessions"
                                      >
                                        50 Rec
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
                  })
                )}

                {/* Informational Disclaimer Box */}
                <div className="p-3.5 bg-[#343A3F] border border-[#737A7F] rounded-xl text-xs text-[#F1EAE1] flex items-start space-x-2.5">
                  <Info className="w-4 h-4 text-[#B18A70] shrink-0 mt-0.5" />
                  <div className="leading-relaxed text-[#A8ADB1]">
                    <strong className="text-[#F1EAE1]">Spot Fixing Rules:</strong> All Mandi and place benchmark spot prices are quoted in INR per Metric Ton (MT).
                    Applicable Sales Tax (ast) is extra. Rates reflect morning & afternoon primary/secondary furnace sessions.
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Selected Mandi's Past 50 Historical Records Panel */}
              <div className={`lg:col-span-5 space-y-4 lg:sticky lg:top-36 ${mobileTab === 'history' ? 'block' : 'hidden lg:block'}`}>
                {selectedMaterial ? (
                  <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-xl p-3.5 sm:p-5 shadow-sm space-y-4 text-[#252A2E]">
                    {/* Mobile Back Button */}
                    <button
                      onClick={() => setMobileTab('mandis')}
                      className="lg:hidden w-full py-2 px-3 bg-[#858C92] hover:bg-[#A8ADB1] text-[#252A2E] text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer border border-[#737A7F] mb-2"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>← Back to Mandi Rates List</span>
                    </button>
                    {/* Selected Mandi Details Header */}
                    <div className="border-b border-[#737A7F] pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-[#F1EAE1] bg-[#76513F] px-2 py-0.5 rounded border border-[#B18A70] font-mono">
                            {selectedMaterial.symbol}
                          </span>
                          <span className="text-[10px] font-bold text-[#252A2E] bg-[#858C92] px-2 py-0.5 rounded uppercase font-mono border border-[#737A7F]">
                            {selectedMaterial.mainCategory === 'raw_materials' ? 'Raw Material' : 'Scrap Material'}
                          </span>
                        </div>

                        <button
                          onClick={() => handleExportCSV(selectedMaterial)}
                          className="px-2.5 py-1 bg-[#858C92] hover:bg-[#76513F] hover:text-[#F1EAE1] text-[#252A2E] rounded text-xs font-bold flex items-center space-x-1 transition border border-[#737A7F] cursor-pointer"
                          title="Download Past 50 Records as CSV"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export 50 Rec</span>
                        </button>
                      </div>

                      <div className="mt-2 flex items-baseline justify-between">
                        <div>
                          <h2 className="text-xl font-black text-[#252A2E]">
                            {selectedMaterial.materialName}
                          </h2>
                          <p className="text-xs font-bold text-[#49352D] flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-[#76513F]" />
                            <span>{selectedMaterial.mandiCity} Spot Market</span>
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black text-[#252A2E] font-mono block">
                            {formatINR(selectedMaterial.currentPrice)}
                          </span>
                          <span
                            className={`inline-flex items-center text-xs font-black font-mono ${
                              selectedMaterial.movementDirection === 'up'
                                ? 'text-[#10B981]'
                                : selectedMaterial.movementDirection === 'down'
                                ? 'text-[#DC6262]'
                                : 'text-[#626B72]'
                            }`}
                          >
                            {selectedMaterial.movementDirection === 'up' && '▲ +'}
                            {selectedMaterial.movementDirection === 'down' && '▼ '}
                            {selectedMaterial.movementDirection === 'neutral' && '▬ '}
                            ₹{Math.abs(selectedMaterial.priceChange)} ({selectedMaterial.percentageChange}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Past 50 Records Chart Control */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1">
                        <History className="w-4 h-4 text-[#49352D]" />
                        <span className="text-xs font-extrabold text-[#252A2E]">
                          Past 50 Records Trend
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 bg-[#858C92] p-0.5 rounded text-xs font-bold font-mono border border-[#737A7F]">
                        {([7, 15, 30, 50] as const).map((count) => (
                          <button
                            key={count}
                            onClick={() => setHistoryLimit(count)}
                            className={`px-2 py-0.5 rounded transition cursor-pointer ${
                              historyLimit === count
                                ? 'bg-[#76513F] text-[#F1EAE1] shadow-xs'
                                : 'text-[#252A2E] hover:text-[#F1EAE1]'
                            }`}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recharts Historical Curve */}
                    <div className="h-56 w-full bg-[#343A3F] rounded-lg p-2 border border-[#737A7F]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                          <defs>
                            <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="5%"
                                stopColor="#B18A70"
                                stopOpacity={0.45}
                              />
                              <stop
                                offset="95%"
                                stopColor="#76513F"
                                stopOpacity={0.0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#49352D" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 9, fill: '#A8ADB1' }}
                            tickLine={false}
                            axisLine={{ stroke: '#737A7F' }}
                          />
                          <YAxis
                            domain={['auto', 'auto']}
                            tick={{ fontSize: 9, fill: '#A8ADB1' }}
                            tickLine={false}
                            axisLine={{ stroke: '#737A7F' }}
                            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                          />
                          <Tooltip
                            formatter={(value: any) => [formatINR(Number(value)), 'Price / MT']}
                            labelFormatter={(label) => `Session Date: ${label}`}
                            contentStyle={{
                              backgroundColor: '#49352D',
                              borderColor: '#737A7F',
                              color: '#F1EAE1',
                              borderRadius: '6px',
                              fontSize: '11px',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#B18A70"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#historyGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* 50-Record Statistics Bar */}
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-[#A8ADB1] p-2 rounded border border-[#737A7F]">
                        <span className="text-[9px] text-[#49352D] uppercase font-mono block font-bold">Previous</span>
                        <span className="font-mono font-black text-[#252A2E] text-xs">
                          {formatINR(selectedMaterial.previousPrice)}
                        </span>
                      </div>

                      <div className="bg-[#A8ADB1] p-2 rounded border border-[#737A7F]">
                        <span className="text-[9px] text-[#49352D] uppercase font-mono block font-bold">50-Rec High</span>
                        <span className="font-mono font-black text-[#10B981] text-xs">
                          {formatINR(selectedMaterial.highPrice)}
                        </span>
                      </div>

                      <div className="bg-[#A8ADB1] p-2 rounded border border-[#737A7F]">
                        <span className="text-[9px] text-[#49352D] uppercase font-mono block font-bold">50-Rec Low</span>
                        <span className="font-mono font-black text-[#DC6262] text-xs">
                          {formatINR(selectedMaterial.lowPrice)}
                        </span>
                      </div>

                      <div className="bg-[#A8ADB1] p-2 rounded border border-[#737A7F]">
                        <span className="text-[9px] text-[#49352D] uppercase font-mono block font-bold">Volatility</span>
                        <span className="font-mono font-black text-[#604333] text-xs">
                          {selectedMaterial.volatility}%
                        </span>
                      </div>
                    </div>

                    {/* TABULAR AUDIT LIST OF PAST 50 RECORDS */}
                    <div className="border border-[#737A7F] rounded-lg overflow-hidden">
                      <div className="bg-[#858C92] p-2 px-3 flex items-center justify-between text-xs font-extrabold text-[#252A2E]">
                        <span className="flex items-center space-x-1">
                          <History className="w-3.5 h-3.5 text-[#252A2E]" />
                          <span>Chronological Past 50 Records</span>
                        </span>
                        <span className="text-[10px] text-[#49352D] font-mono font-bold">
                          {(selectedMaterial.historicalPrices || []).length} Records Total
                        </span>
                      </div>

                      <div className="max-h-56 overflow-y-auto divide-y divide-[#737A7F]/30 text-xs">
                        {chartData
                          .slice()
                          .reverse()
                          .map((point) => (
                            <div
                              key={point.index}
                              className="p-2 px-3 flex items-center justify-between hover:bg-[#C7CBD0] transition"
                            >
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-[10px] text-[#49352D] font-bold">
                                    #{point.index}
                                  </span>
                                  <span className="font-bold text-[#252A2E] text-xs">{point.date}</span>
                                </div>
                                <p className="text-[10px] text-[#49352D] truncate max-w-[200px] font-medium">
                                  {point.notes}
                                </p>
                              </div>

                              <div className="text-right">
                                <span className="font-mono font-extrabold text-[#252A2E] block text-xs">
                                  {formatINR(point.price)}
                                </span>
                                <span
                                  className={`text-[10px] font-mono font-bold inline-flex items-center ${
                                    point.direction === 'up'
                                      ? 'text-[#10B981]'
                                      : point.direction === 'down'
                                      ? 'text-[#DC6262]'
                                      : 'text-[#626B72]'
                                  }`}
                                >
                                  {point.direction === 'up' && '▲ +'}
                                  {point.direction === 'down' && '▼ -'}
                                  ₹{Math.abs(point.change)}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Physical Material Sourcing CTA */}
                    <div className="p-3.5 bg-[#49352D] rounded-lg text-[#F1EAE1] flex items-center justify-between gap-3 border border-[#343A3F]">
                      <div>
                        <p className="text-xs font-bold">Source Material at this Spot Rate</p>
                        <p className="text-[10px] text-[#A8ADB1]">
                          Lock custom specs for dispatch from {selectedMaterial.mandiCity}.
                        </p>
                      </div>
                      <Link
                        href={`/raw-materials`}
                        className="px-3.5 py-2 bg-[#76513F] hover:bg-[#604333] text-[#F1EAE1] rounded font-bold text-xs shadow border border-[#B18A70] transition text-center shrink-0"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#BAC0C5] border border-[#737A7F] rounded-xl p-12 text-center text-[#49352D]">
                    <Activity className="w-10 h-10 mx-auto mb-2 text-[#76513F]" />
                    <p className="text-xs font-bold text-[#252A2E]">
                      Click any Mandi or Place on the left to view the past 50 historical price records.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* 5. Authentic Mandi Notes & Rumours Disclaimer - Dark Chocolate Brown */}
        <div className="bg-[#49352D] text-[#F1EAE1] rounded-xl p-5 sm:p-6 border border-[#343A3F] space-y-4 shadow-sm">
          <div className="border-b border-[#343A3F] pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              <h3 className="text-sm font-extrabold tracking-wide uppercase text-[#F1EAE1]">
                Official Disclaimer & Trading Terms
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#A8ADB1] font-bold">
              FIELDFAST TECH INTERNATIONAL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#A8ADB1]">
            <div className="space-y-1.5 font-mono bg-[#343A3F] p-3.5 rounded-lg border border-[#737A7F]">
              <p className="font-bold text-[#E5A34B] mb-1">*_Note_*</p>
              <p>• # All Rates Are Quoted, Estimated (As per Rumours)</p>
              <p>• # All Rates Are P.m.t , Spot & only information not any offer for sale & purchase.</p>
              <p>• # We are not responsible for any profit or loss.</p>
              <p>• # 💯% Reliability and Top Service</p>
              <p>• # Best Service, Right Time, Right People</p>
              <p className="text-[#F1EAE1] font-bold mt-2">
                # Support 24×7:{' '}
                <a href="tel:+919780830333" className="text-[#B18A70] underline">
                  +91-9780830333
                </a>
              </p>
            </div>

            <div className="space-y-2 bg-[#343A3F] p-3.5 rounded-lg border border-[#737A7F] flex flex-col justify-between">
              <div>
                <p className="font-bold text-[#10B981] mb-1">Direct Mandi Alert Channels</p>
                <p className="text-[#F1EAE1] leading-relaxed font-medium">
                  Subscribe to instant morning and afternoon spot price SMS & WhatsApp notifications
                  for primary induction billets, ingots, rebar, and foundry melting scrap.
                </p>
              </div>

              <div className="pt-2 border-t border-[#737A7F]/40 flex flex-wrap gap-2 text-xs font-mono">
                <span className="bg-[#49352D] px-2 py-1 rounded text-[#F1EAE1] border border-[#737A7F]">
                  SMS: +91-9780830333
                </span>
                <span className="bg-[#49352D] px-2 py-1 rounded text-[#F1EAE1] border border-[#737A7F]">
                  WA: +91-9589971567
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
