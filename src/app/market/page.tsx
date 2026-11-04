'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate } from '@/lib/utils';
import { MarketMaterial, MarketMainCategory } from '@/types';
import {
  LineChart,
  Line,
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
  TrendingDown,
  RefreshCw,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Download,
  Copy,
  Check,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  Info,
  Calendar,
  Clock,
  ChevronRight,
  Filter,
  BarChart3,
  History,
  Building2,
  MapPin,
  ArrowUpDown,
  ArrowLeft,
} from 'lucide-react';

export default function MarketPage() {
  const { marketMaterials, mandiBulletin, lastMarketSyncTime, refreshMarketPrices } = useStore();

  // Primary Level 1: 'raw_materials' vs 'scrap_materials' (or 'whatsapp')
  const [mainCategory, setMainCategory] = useState<MarketMainCategory | 'whatsapp'>('raw_materials');

  // Secondary Level 2: Specific Material Name filter (e.g. 'All', 'Ingot', 'Billet', 'Melting Scrap')
  const [selectedMaterialGroup, setSelectedMaterialGroup] = useState<string>('all');

  const [searchTerm, setSearchTerm] = useState('');
  const [movementFilter, setMovementFilter] = useState<'all' | 'up' | 'down' | 'neutral'>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<MarketMaterial | null>(null);
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
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
          m.categorySlug === 'scrap_materials' ||
          m.name.toLowerCase().includes('scrap')
        );
      }
      return (
        m.categorySlug !== 'scrap' &&
        m.categorySlug !== 'scrap_materials' &&
        !m.name.toLowerCase().includes('scrap')
      );
    });
  }, [marketMaterials, mainCategory]);

  // 2. Distinct Material Names for Level 2 selector
  const availableMaterialNames = useMemo(() => {
    const set = new Set<string>();
    categoryMaterials.forEach((m) => {
      if (m.materialName) set.add(m.materialName);
      else if (m.categoryName) set.add(m.categoryName);
    });
    return Array.from(set);
  }, [categoryMaterials]);

  // 3. Filtered materials (Level 3: Mandis & Places)
  const filteredMaterials = useMemo(() => {
    return categoryMaterials.filter((m) => {
      // Level 2 Material Group filter
      const matchesGroup =
        selectedMaterialGroup === 'all' ||
        m.materialName === selectedMaterialGroup ||
        m.categoryName === selectedMaterialGroup;

      // Search filter
      const matchesSearch =
        searchTerm === '' ||
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.mandiCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.hubCity && m.hubCity.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.specification && m.specification.toLowerCase().includes(searchTerm.toLowerCase())) ||
        m.symbol.toLowerCase().includes(searchTerm.toLowerCase());

      // Movement direction filter (ups vs downs)
      const matchesMovement =
        movementFilter === 'all' || m.movementDirection === movementFilter;

      return matchesGroup && matchesSearch && matchesMovement;
    });
  }, [categoryMaterials, selectedMaterialGroup, searchTerm, movementFilter]);

  // Group materials by Material Name for clean organized sections
  const groupedByMaterial = useMemo(() => {
    const groups: Record<string, MarketMaterial[]> = {};
    filteredMaterials.forEach((m) => {
      const key = m.materialName || m.categoryName || 'Other Rates';
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });
    return groups;
  }, [filteredMaterials]);

  // Auto-select first item on mount or filter change
  useEffect(() => {
    if (filteredMaterials.length > 0) {
      if (!selectedMaterial || !filteredMaterials.some((m) => m.id === selectedMaterial.id)) {
        setSelectedMaterial(filteredMaterials[0]);
      }
    }
  }, [filteredMaterials, selectedMaterial]);

  // Historical chart data for selected material (Past 50 records)
  const chartData = useMemo(() => {
    if (!selectedMaterial || !selectedMaterial.historicalPrices) return [];
    const prices = [...selectedMaterial.historicalPrices];
    const total = prices.length;
    const sliceCount = Math.min(historyLimit, total);

    return prices.slice(total - sliceCount).map((p, idx) => ({
      index: idx + 1,
      date: p.date,
      formattedDate: formatIndianDate(p.date),
      price: p.price,
      change: p.priceChange || 0,
      direction: p.movementDirection || (p.priceChange && p.priceChange > 0 ? 'up' : 'down'),
      notes: p.notes || `Trading session #${idx + 1}`,
    }));
  }, [selectedMaterial, historyLimit]);

  // Export CSV of past 50 records
  const handleExportCSV = (mat: MarketMaterial) => {
    const headers = ['Record #', 'Date', 'Price (INR / MT)', 'Change (INR)', 'Direction', 'Material', 'Mandi / Place', 'Notes'];
    const rows = (mat.historicalPrices || []).slice(-50).map((p, idx) => [
      idx + 1,
      p.date,
      p.price,
      p.priceChange || 0,
      p.movementDirection || 'neutral',
      `"${mat.materialName || mat.categoryName}"`,
      `"${mat.mandiCity || mat.hubCity}"`,
      `"${p.notes || mat.notes || ''}"`,
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
      {/* 1. Header with authentic Mandi bulletin info */}
      <div className="bg-slate-950 text-white py-6 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-200">
              Home
            </Link>
            <span>/</span>
            <span className="text-emerald-400 font-semibold">
              Live Mandi Steel & Scrap Trading Desk
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-blue-400 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded">
                  FIELDFAST TECH INTERNATIONAL
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LIVE MANDI SPOT BENCHMARK</span>
                </span>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-indigo-500/30 flex items-center space-x-1">
                  <History className="w-3.5 h-3.5" />
                  <span>PAST 50 RECORDS SAVED</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Industrial Raw Materials & Scrap Mandi Price Desk
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Live spot rates categorized by <strong>Raw Materials</strong> & <strong>Scrap Materials</strong>,
                broken down by material and tracked across Mandi Gobindgarh, Ludhiana, Raipur, Muzaffarnagar,
                and national trading hubs with full 50-record audit history.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyBulletin}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-md text-xs font-semibold flex items-center space-x-1.5 transition"
                title="Copy entire WhatsApp bulletin text"
              >
                {copiedBulletin ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Bulletin Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-blue-400" />
                    <span>Copy WhatsApp Bulletin</span>
                  </>
                )}
              </button>

              <a
                href="https://wa.me/919780830333?text=Hello%20FTI,%20I%20am%20inquiring%20about%20today's%20Mandi%20Gobindgarh%20Live%20Rates"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold flex items-center space-x-1.5 shadow transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Desk</span>
              </a>

              <button
                onClick={handleManualRefresh}
                className={`p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition ${
                  isRefreshing ? 'animate-spin text-blue-400' : ''
                }`}
                title="Refresh Live Rates"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bulletin Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="bg-slate-900/90 border border-slate-800 p-2 sm:p-2.5 rounded-lg flex items-center space-x-2 min-w-0">
              <span className="text-lg sm:text-xl shrink-0">🗓️</span>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono block">Date</span>
                <span className="text-xs sm:text-sm font-extrabold text-white font-mono truncate block">
                  {mandiBulletin?.dateStr || '28-OCT-2026'}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-2 sm:p-2.5 rounded-lg flex items-center space-x-2 min-w-0">
              <span className="text-lg sm:text-xl shrink-0">⏰</span>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono block">Time</span>
                <span className="text-xs sm:text-sm font-extrabold text-white font-mono truncate block">
                  {mandiBulletin?.timeStr || '12:00'} IST
                </span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-2 sm:p-2.5 rounded-lg flex items-center space-x-2 min-w-0">
              <span className="text-lg sm:text-xl shrink-0">
                {mandiBulletin?.overallTrend === 'up' ? '📈' : '📉'}
              </span>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono block">Mandi Trend</span>
                <span
                  className={`text-xs sm:text-sm font-extrabold block truncate ${
                    mandiBulletin?.overallTrend === 'up' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {mandiBulletin?.trendText || 'Mandi Trend downwards'}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-2 sm:p-2.5 rounded-lg flex items-center space-x-2 min-w-0">
              <span className="text-lg sm:text-xl shrink-0">🇺🇸</span>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-mono block">USD / INR</span>
                <span className="text-xs sm:text-sm font-extrabold text-amber-400 font-mono truncate block">
                  1$ = ₹{mandiBulletin?.usdInrRate || 95.04}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRIMARY CATEGORY LEVEL 1: RAW MATERIAL vs SCRAP MATERIAL */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-14 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 py-2.5 sm:py-3">
            {/* Primary Category Switcher Tabs - Horizontally scrollable on mobile */}
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => handleCategoryChange('raw_materials')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-black rounded-lg transition flex items-center space-x-1.5 sm:space-x-2 shrink-0 cursor-pointer ${
                  mainCategory === 'raw_materials'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-300 shrink-0" />
                <span className="whitespace-nowrap">RAW MATERIALS</span>
                <span className="text-[10px] sm:text-xs font-mono bg-blue-900/60 text-blue-200 px-1.5 py-0.5 rounded">
                  {rawCount} Mandis
                </span>
              </button>

              <button
                onClick={() => handleCategoryChange('scrap_materials')}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-black rounded-lg transition flex items-center space-x-1.5 sm:space-x-2 shrink-0 cursor-pointer ${
                  mainCategory === 'scrap_materials'
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="whitespace-nowrap">SCRAP MATERIALS</span>
                <span className="text-[10px] sm:text-xs font-mono bg-amber-900/60 text-amber-200 px-1.5 py-0.5 rounded">
                  {scrapCount} Mandis
                </span>
              </button>

              <button
                onClick={() => handleCategoryChange('whatsapp')}
                className={`px-3 py-2 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                  mainCategory === 'whatsapp'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-slate-800 text-emerald-400 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">WhatsApp Mandi Feed</span>
                <span className="sm:hidden">Feed</span>
              </button>
            </div>

            {/* Search & Ups / Downs Filter */}
            {mainCategory !== 'whatsapp' && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search Mandi or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-md text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Ups or Downs Trend Filter */}
                <select
                  value={movementFilter}
                  onChange={(e) => setMovementFilter(e.target.value as any)}
                  aria-label="Filter by price movement"
                  className="py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-md text-slate-200 focus:outline-hidden"
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
            <div className="py-2 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center space-x-1">
                <Filter className="w-3 h-3 text-slate-400" />
                <span>Materials:</span>
              </span>

              <button
                onClick={() => setSelectedMaterialGroup('all')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition shrink-0 ${
                  selectedMaterialGroup === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
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
                    className={`px-3 py-1 text-xs font-bold rounded-full transition shrink-0 flex items-center space-x-1.5 ${
                      isSelected
                        ? mainCategory === 'raw_materials'
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
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
          /* ========================================================= */
          /* Dedicated WhatsApp Broadcast View                        */
          /* ========================================================= */
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-[#0b141a] text-slate-100 rounded-xl shadow-xl overflow-hidden border border-[#202c33]">
              <div className="bg-[#202c33] p-3.5 px-4 flex items-center justify-between border-b border-[#2a3942]">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                    FTI
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-bold text-sm text-white">FIELDFAST TECH INTERNATIONAL</h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-slate-400">Official Daily Mandi Live Rates Broadcast</p>
                  </div>
                </div>

                <button
                  onClick={handleCopyBulletin}
                  className="px-3 py-1.5 bg-[#00a884] hover:bg-[#008f6f] text-slate-950 font-bold text-xs rounded flex items-center space-x-1.5 transition cursor-pointer"
                >
                  {copiedBulletin ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBulletin ? 'Copied!' : 'Copy Broadcast'}</span>
                </button>
              </div>

              <div className="p-4 sm:p-6 bg-[#0b141a]">
                <div className="max-w-xl mx-auto bg-[#202c33] rounded-lg p-4 sm:p-5 shadow border border-[#2a3942]/60 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
                  {mandiBulletin?.rawMessageText}
                </div>
              </div>

              <div className="p-3 bg-[#111b21] border-t border-[#202c33] flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 gap-2">
                <span>Updated {mandiBulletin?.dateStr} at {mandiBulletin?.timeStr}</span>
                <a
                  href="https://wa.me/919780830333"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1"
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
          <div className="flex lg:hidden bg-white p-1 rounded-xl border border-slate-200 shadow-xs mb-4">
            <button
              onClick={() => setMobileTab('mandis')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                mobileTab === 'mandis'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Mandi Rates ({filteredMaterials.length})</span>
            </button>
            <button
              onClick={() => setMobileTab('history')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                mobileTab === 'history'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
                  <Search className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-800 text-sm">No matching Mandi prices found</p>
                  <p className="text-xs text-slate-500 mt-1">Try adjusting your material or search filter.</p>
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
                      className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden"
                    >
                      {/* Material Name Group Header */}
                      <div className="bg-slate-50 border-b border-slate-200 p-3.5 px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`w-3 h-3 rounded-full ${
                              mainCategory === 'raw_materials' ? 'bg-blue-600' : 'bg-amber-600'
                            }`}
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                                {materialName}
                              </h3>
                              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                {mandis.length} {mandis.length === 1 ? 'Mandi' : 'Mandis & Places'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              Price Range: <strong className="text-slate-700">{formatINR(minPrice)}</strong> –{' '}
                              <strong className="text-slate-700">{formatINR(maxPrice)}</strong> / MT ᵃˢᵗ
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] uppercase font-mono text-slate-400 block">Avg Spot</span>
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono">
                            {formatINR(avgPrice)} / MT
                          </span>
                        </div>
                      </div>

                      {/* Mandis & Places List Table */}
                      <div className="divide-y divide-slate-100 overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead className="bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-100">
                            <tr>
                              <th className="py-2 px-3.5">Mandi / Place</th>
                              <th className="py-2 px-3 text-right">Spot Price ᵃˢᵗ</th>
                              <th className="py-2 px-3 text-right">Ups / Downs</th>
                              <th className="py-2 px-3 text-right hidden sm:table-cell">Prev. Session</th>
                              <th className="py-2 px-3.5 text-center">Audit</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
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
                                      ? 'bg-blue-50/90 font-semibold border-l-4 border-l-blue-600'
                                      : 'hover:bg-slate-50'
                                  }`}
                                >
                                  {/* Place / Mandi Name */}
                                  <td className="py-2.5 px-3.5">
                                    <div className="flex items-center space-x-2">
                                      <MapPin
                                        className={`w-3.5 h-3.5 shrink-0 ${
                                          isSelected ? 'text-blue-600' : 'text-slate-400'
                                        }`}
                                      />
                                      <div>
                                        <p className="font-bold text-slate-900 text-xs flex items-center space-x-1">
                                          <span>{mat.mandiCity}</span>
                                          <span className="text-[10px] font-normal text-slate-400 font-mono">
                                            ᵃˢᵗ
                                          </span>
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-mono">
                                          {mat.symbol}
                                          {mat.specification ? ` • ${mat.specification}` : ''}
                                        </p>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Spot Price */}
                                  <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900 text-xs sm:text-sm">
                                    {formatINR(mat.currentPrice)}
                                  </td>

                                  {/* Ups / Downs Badge */}
                                  <td className="py-2.5 px-3 text-right">
                                    <span
                                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-black font-mono shadow-xs ${
                                        isUp
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                                          : isDown
                                          ? 'bg-rose-50 text-rose-700 border border-rose-300'
                                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                                      }`}
                                    >
                                      {isUp ? (
                                        <>
                                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                                          <span>+₹{mat.priceChange}</span>
                                          <span className="text-[9px] opacity-80">(+{mat.percentageChange}%)</span>
                                        </>
                                      ) : isDown ? (
                                        <>
                                          <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                                          <span>-₹{Math.abs(mat.priceChange)}</span>
                                          <span className="text-[9px] opacity-80">({mat.percentageChange}%)</span>
                                        </>
                                      ) : (
                                        <>
                                          <Minus className="w-3.5 h-3.5 text-slate-400" />
                                          <span>₹0</span>
                                          <span className="text-[9px] opacity-80">(0.0%)</span>
                                        </>
                                      )}
                                    </span>
                                  </td>

                                  {/* Previous Price */}
                                  <td className="py-2.5 px-3 text-right text-slate-500 font-mono text-xs hidden sm:table-cell">
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
                                      className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-800 transition border border-slate-200 cursor-pointer"
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
              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Spot Fixing Rules:</strong> All Mandi and place benchmark spot prices are quoted in INR per Metric Ton (MT).
                  Applicable Sales Tax (ast) is extra. Rates reflect morning & afternoon primary/secondary furnace sessions.
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Selected Mandi's Past 50 Historical Records Panel */}
            <div className={`lg:col-span-5 space-y-4 lg:sticky lg:top-36 ${mobileTab === 'history' ? 'block' : 'hidden lg:block'}`}>
              {selectedMaterial ? (
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-5 shadow-sm space-y-4">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setMobileTab('mandis')}
                    className="lg:hidden w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer border border-slate-200 mb-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>← Back to Mandi Rates List</span>
                  </button>
                  {/* Selected Mandi Details Header */}
                  <div className="border-b border-slate-200 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">
                          {selectedMaterial.symbol}
                        </span>
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded uppercase font-mono">
                          {selectedMaterial.mainCategory === 'raw_materials' ? 'Raw Material' : 'Scrap Material'}
                        </span>
                      </div>

                      <button
                        onClick={() => handleExportCSV(selectedMaterial)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center space-x-1 transition"
                        title="Download Past 50 Records as CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export 50 Rec</span>
                      </button>
                    </div>

                    <div className="mt-2 flex items-baseline justify-between">
                      <div>
                        <h2 className="text-xl font-black text-slate-900">
                          {selectedMaterial.materialName}
                        </h2>
                        <p className="text-xs font-semibold text-slate-600 flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-red-500" />
                          <span>{selectedMaterial.mandiCity} Spot Market</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-black text-slate-900 font-mono block">
                          {formatINR(selectedMaterial.currentPrice)}
                        </span>
                        <span
                          className={`inline-flex items-center text-xs font-black font-mono ${
                            selectedMaterial.movementDirection === 'up'
                              ? 'text-emerald-600'
                              : selectedMaterial.movementDirection === 'down'
                              ? 'text-rose-600'
                              : 'text-slate-500'
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
                      <History className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold text-slate-800">
                        Past 50 Records Trend
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded text-xs font-bold font-mono">
                      {([7, 15, 30, 50] as const).map((count) => (
                        <button
                          key={count}
                          onClick={() => setHistoryLimit(count)}
                          className={`px-2 py-0.5 rounded transition ${
                            historyLimit === count
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recharts Historical Curve */}
                  <div className="h-56 w-full bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                        <defs>
                          <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor={selectedMaterial.movementDirection === 'up' ? '#10b981' : '#2563eb'}
                              stopOpacity={0.35}
                            />
                            <stop
                              offset="95%"
                              stopColor={selectedMaterial.movementDirection === 'up' ? '#10b981' : '#2563eb'}
                              stopOpacity={0.0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 9, fill: '#64748b' }}
                          tickLine={false}
                          axisLine={{ stroke: '#cbd5e1' }}
                        />
                        <YAxis
                          domain={['auto', 'auto']}
                          tick={{ fontSize: 9, fill: '#64748b' }}
                          tickLine={false}
                          axisLine={{ stroke: '#cbd5e1' }}
                          tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          formatter={(value: any) => [formatINR(Number(value)), 'Price / MT']}
                          labelFormatter={(label) => `Session Date: ${label}`}
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            color: '#ffffff',
                            borderRadius: '6px',
                            fontSize: '11px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={selectedMaterial.movementDirection === 'up' ? '#059669' : '#2563eb'}
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#historyGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 50-Record Statistics Bar */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 uppercase font-mono block">Previous</span>
                      <span className="font-mono font-bold text-slate-800 text-xs">
                        {formatINR(selectedMaterial.previousPrice)}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 uppercase font-mono block">50-Rec High</span>
                      <span className="font-mono font-bold text-emerald-700 text-xs">
                        {formatINR(selectedMaterial.highPrice)}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 uppercase font-mono block">50-Rec Low</span>
                      <span className="font-mono font-bold text-rose-700 text-xs">
                        {formatINR(selectedMaterial.lowPrice)}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="text-[9px] text-slate-400 uppercase font-mono block">Volatility</span>
                      <span className="font-mono font-bold text-blue-700 text-xs">
                        {selectedMaterial.volatility}%
                      </span>
                    </div>
                  </div>

                  {/* TABULAR AUDIT LIST OF PAST 50 RECORDS */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-100 p-2 px-3 flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="flex items-center space-x-1">
                        <History className="w-3.5 h-3.5 text-slate-500" />
                        <span>Chronological Past 50 Records</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {(selectedMaterial.historicalPrices || []).length} Records Total
                      </span>
                    </div>

                    <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 text-xs">
                      {chartData
                        .slice()
                        .reverse()
                        .map((point) => (
                          <div
                            key={point.index}
                            className="p-2 px-3 flex items-center justify-between hover:bg-slate-50 transition"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-[10px] text-slate-400 font-bold">
                                  #{point.index}
                                </span>
                                <span className="font-bold text-slate-800 text-xs">{point.date}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 truncate max-w-[200px]">
                                {point.notes}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="font-mono font-bold text-slate-900 block text-xs">
                                {formatINR(point.price)}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold inline-flex items-center ${
                                  point.direction === 'up'
                                    ? 'text-emerald-600'
                                    : point.direction === 'down'
                                    ? 'text-rose-600'
                                    : 'text-slate-400'
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
                  <div className="p-3.5 bg-slate-900 rounded-lg text-white flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold">Source Material at this Spot Rate</p>
                      <p className="text-[10px] text-slate-300">
                        Lock custom specs for dispatch from {selectedMaterial.mandiCity}.
                      </p>
                    </div>
                    <Link
                      href={`/raw-materials`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs shadow transition text-center shrink-0"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
                  <Activity className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">
                    Click any Mandi or Place on the left to view the past 50 historical price records.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

        {/* 5. Authentic Mandi Notes & Rumours Disclaimer */}
        <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold tracking-wide uppercase text-white">
                Official Disclaimer & Trading Terms
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              FIELDFAST TECH INTERNATIONAL
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="space-y-1.5 font-mono bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
              <p className="font-bold text-amber-300 mb-1">*_Note_*</p>
              <p>• # All Rates Are Quoted, Estimated (As per Rumours)</p>
              <p>• # All Rates Are P.m.t , Spot & only information not any offer for sale & purchase.</p>
              <p>• # We are not responsible for any profit or loss.</p>
              <p>• # 💯% Reliability and Top Service</p>
              <p>• # Best Service, Right Time, Right People</p>
              <p className="text-slate-100 font-bold mt-2">
                # Support 24×7:{' '}
                <a href="tel:+919780830333" className="text-blue-400 underline">
                  +91-9780830333
                </a>
              </p>
            </div>

            <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 flex flex-col justify-between">
              <div>
                <p className="font-bold text-emerald-300 mb-1">Direct Mandi Alert Channels</p>
                <p className="text-slate-300 leading-relaxed">
                  Subscribe to instant morning and afternoon spot price SMS & WhatsApp notifications
                  for primary induction billets, ingots, rebar, and foundry melting scrap.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs font-mono">
                <span className="bg-slate-900 px-2 py-1 rounded text-slate-300 border border-slate-800">
                  SMS: +91-9780830333
                </span>
                <span className="bg-slate-900 px-2 py-1 rounded text-slate-300 border border-slate-800">
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
