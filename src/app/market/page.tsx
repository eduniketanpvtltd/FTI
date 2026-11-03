'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate } from '@/lib/utils';
import { MarketMaterial } from '@/types';
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
} from 'lucide-react';

export default function MarketPage() {
  const { marketMaterials, mandiBulletin, lastMarketSyncTime, refreshMarketPrices } = useStore();

  const [activeTab, setActiveTab] = useState<'all' | 'ingot' | 'scrap' | 'billet' | 'benchmark' | 'whatsapp'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [movementFilter, setMovementFilter] = useState<'all' | 'up' | 'down' | 'neutral'>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<MarketMaterial | null>(null);
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'>('1M');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedBulletin, setCopiedBulletin] = useState(false);

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

  // Filter materials
  const filteredMaterials = useMemo(() => {
    return marketMaterials.filter((m) => {
      // Tab filter
      const matchesTab = activeTab === 'all' || activeTab === 'whatsapp' || m.categorySlug === activeTab;

      // Search filter (name, city, symbol, grade)
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.hubCity && m.hubCity.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.specification && m.specification.toLowerCase().includes(searchTerm.toLowerCase())) ||
        m.symbol.toLowerCase().includes(searchTerm.toLowerCase());

      // Movement direction filter
      const matchesMovement =
        movementFilter === 'all' || m.movementDirection === movementFilter;

      return matchesTab && matchesSearch && matchesMovement;
    });
  }, [marketMaterials, activeTab, searchTerm, movementFilter]);

  // Mandi Gobindgarh Benchmark Hub Materials (Top highlight)
  const benchmarkMaterials = useMemo(() => {
    return marketMaterials.filter((m) => m.categorySlug === 'benchmark');
  }, [marketMaterials]);

  // Auto-select first item
  React.useEffect(() => {
    if (!selectedMaterial && filteredMaterials.length > 0) {
      setSelectedMaterial(filteredMaterials[0]);
    }
  }, [selectedMaterial, filteredMaterials]);

  // Historical chart data
  const chartData = useMemo(() => {
    if (!selectedMaterial || !selectedMaterial.historicalPrices) return [];
    const prices = [...selectedMaterial.historicalPrices];
    const total = prices.length;

    let sliceCount = total;
    if (timeRange === '1D') sliceCount = Math.min(2, total);
    else if (timeRange === '1W') sliceCount = Math.min(7, total);
    else if (timeRange === '1M') sliceCount = Math.min(30, total);
    else if (timeRange === '3M') sliceCount = Math.min(45, total);
    else if (timeRange === '6M') sliceCount = Math.min(60, total);
    else if (timeRange === '1Y') sliceCount = Math.min(90, total);

    return prices.slice(total - sliceCount).map((p) => ({
      date: p.date,
      formattedDate: formatIndianDate(p.date),
      price: p.price,
    }));
  }, [selectedMaterial, timeRange]);

  // Export CSV
  const handleExportCSV = (mat: MarketMaterial) => {
    const headers = ['Date', 'Price (INR)', 'Unit', 'Hub / Material', 'Symbol', 'Category'];
    const rows = mat.historicalPrices.map((p) => [
      p.date,
      p.price,
      mat.unit,
      `"${mat.name}"`,
      mat.symbol,
      mat.categoryName,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${mat.symbol}_mandi_spot_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Category counts
  const countIngot = marketMaterials.filter((m) => m.categorySlug === 'ingot').length;
  const countScrap = marketMaterials.filter((m) => m.categorySlug === 'scrap').length;
  const countBillet = marketMaterials.filter((m) => m.categorySlug === 'billet').length;
  const countBenchmark = benchmarkMaterials.length;

  return (
    <CustomerLayout>
      {/* 1. Header with authentic Mandi bulletin info */}
      <div className="bg-slate-950 text-white py-6 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-200">Home</Link>
            <span>/</span>
            <span className="text-emerald-400 font-semibold">Live Mandi Steel & Scrap Benchmark</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-blue-400 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded">
                  FIELDFAST TECH INTERNATIONAL
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LIVE MANDI SPOT BENCHMARK</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Mandi Gobindgarh & National Steel Hub Price Desk
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Daily live spot fixings for Billet, Ingot, and Melting Scrap across Mandi Gobindgarh, Ludhiana,
                Muzaffarnagar, Raipur, Ghaziabad, and major industrial hubs.
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

          {/* Authentic Live Bulletin Strip (Date, Time, Trend, USD-INR) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            {/* 1. Date */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex items-center space-x-2.5">
              <span className="text-xl">🗓️</span>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Bulletin Date</span>
                <span className="text-xs sm:text-sm font-extrabold text-white font-mono">
                  {mandiBulletin?.dateStr || '28-OCTOBER-2026'}
                </span>
              </div>
            </div>

            {/* 2. Time */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex items-center space-x-2.5">
              <span className="text-xl">⏰</span>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Fixing Time</span>
                <span className="text-xs sm:text-sm font-extrabold text-white font-mono">
                  {mandiBulletin?.timeStr || '12:00'} IST
                </span>
              </div>
            </div>

            {/* 3. Overall Market Trend */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex items-center space-x-2.5">
              <span className="text-xl">
                {mandiBulletin?.overallTrend === 'up' ? '📈' : '📉'}
              </span>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Market Sentiment</span>
                <span
                  className={`text-xs sm:text-sm font-extrabold block truncate ${
                    mandiBulletin?.overallTrend === 'up'
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {mandiBulletin?.trendText || 'Mandi Trend downwards'}
                </span>
              </div>
            </div>

            {/* 4. USD-INR Forex Spot */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg flex items-center space-x-2.5">
              <span className="text-xl">🇺🇸</span>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">USD / INR Spot</span>
                <span className="text-xs sm:text-sm font-extrabold text-amber-400 font-mono">
                  1 ($) = {mandiBulletin?.usdInrRate || 95.04} (₹) 🇮🇳
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Benchmark Highlights: Mandi Gobindgarh Trend & Core Benchmarks */}
      <div className="bg-slate-900 py-4 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-200">
                Mandi Gobindgarh Core Benchmarks ᵃˢᵗ
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              ᵃˢᵗ =&gt; Applicable Sales Tax Extra (Spot)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {benchmarkMaterials.map((mat) => {
              const isSelected = selectedMaterial?.id === mat.id;
              const isUp = mat.movementDirection === 'up';
              const isDown = mat.movementDirection === 'down';

              return (
                <div
                  key={mat.id}
                  onClick={() => {
                    setSelectedMaterial(mat);
                    if (activeTab === 'whatsapp') setActiveTab('all');
                  }}
                  className={`cursor-pointer p-3 rounded-lg border transition ${
                    isSelected
                      ? 'bg-blue-950/80 border-blue-500 ring-2 ring-blue-500/30'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-bold text-slate-300">{mat.name} ᵃˢᵗ</span>
                    <span className="font-mono text-[10px] text-slate-500">Spot</span>
                  </div>

                  <div className="mt-1.5 flex items-baseline justify-between">
                    <span className="text-base sm:text-lg font-black text-white font-mono">
                      {formatINR(mat.currentPrice)}
                    </span>
                    <span
                      className={`inline-flex items-center text-xs font-bold font-mono ${
                        isUp
                          ? 'text-emerald-400'
                          : isDown
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {mat.priceChange > 0 ? `+${mat.priceChange}` : mat.priceChange}
                      {isUp ? (
                        <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                      ) : isDown ? (
                        <ArrowDownRight className="w-3.5 h-3.5 ml-0.5" />
                      ) : (
                        <Minus className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Category Tabs & Search Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-2.5">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Hubs ({marketMaterials.length})
            </button>

            <button
              onClick={() => setActiveTab('ingot')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition whitespace-nowrap flex items-center space-x-1 ${
                activeTab === 'ingot'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Ingot💬</span>
              <span className="text-[10px] opacity-80">({countIngot})</span>
            </button>

            <button
              onClick={() => setActiveTab('scrap')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition whitespace-nowrap flex items-center space-x-1 ${
                activeTab === 'scrap'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Scrap💬</span>
              <span className="text-[10px] opacity-80">({countScrap})</span>
            </button>

            <button
              onClick={() => setActiveTab('billet')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition whitespace-nowrap flex items-center space-x-1 ${
                activeTab === 'billet'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Billet💬</span>
              <span className="text-[10px] opacity-80">({countBillet})</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmark')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition whitespace-nowrap ${
                activeTab === 'benchmark'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Mandi Benchmark ({countBenchmark})
            </button>

            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>WhatsApp Bulletin View 📲</span>
            </button>
          </div>

          {/* Search & Movement Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search hub / city (e.g. Ludhiana)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Movement filter selector */}
            <select
              value={movementFilter}
              onChange={(e) => setMovementFilter(e.target.value as any)}
              aria-label="Filter by movement direction"
              className="py-1 px-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Trends</option>
              <option value="down">Losers 🔻</option>
              <option value="up">Gainers 🔼</option>
              <option value="neutral">Neutral ⏺️</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'whatsapp' ? (
          /* ========================================================= */
          /* Dedicated WhatsApp Broadcast View                        */
          /* ========================================================= */
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-[#0b141a] text-slate-100 rounded-xl shadow-xl overflow-hidden border border-[#202c33]">
              {/* WhatsApp Mock Header */}
              <div className="bg-[#202c33] p-3 px-4 flex items-center justify-between border-b border-[#2a3942]">
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

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyBulletin}
                    className="px-3 py-1.5 bg-[#00a884] hover:bg-[#008f6f] text-slate-950 font-bold text-xs rounded flex items-center space-x-1.5 transition cursor-pointer"
                  >
                    {copiedBulletin ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBulletin ? 'Copied!' : 'Copy Broadcast'}</span>
                  </button>
                </div>
              </div>

              {/* Message bubble */}
              <div className="p-4 sm:p-6 bg-[#0b141a] bg-radial from-[#111b21] to-[#0b141a]">
                <div className="max-w-xl bg-[#202c33] rounded-lg p-4 sm:p-5 shadow border border-[#2a3942]/60 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
                  {mandiBulletin?.rawMessageText}
                </div>
              </div>

              {/* WhatsApp Footer */}
              <div className="p-3 bg-[#111b21] border-t border-[#202c33] flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 gap-2">
                <span>Verified Trading Desk broadcast updated {mandiBulletin?.dateStr} at {mandiBulletin?.timeStr}</span>
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
          /* ========================================================= */
          /* Two-Column Grid: Left (Hub Rates List) & Right (Analytics) */
          /* ========================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Live City Rates Board */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
                <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div>
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                      {activeTab === 'all'
                        ? 'All Mandi Steel & Scrap City Rates'
                        : `${activeTab.toUpperCase()} Spot Benchmark Board`}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Showing {filteredMaterials.length} hub fixings. Click any row to view price analytics.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    ₹ / Metric Ton
                  </span>
                </div>

                <div className="overflow-x-auto max-h-[640px] overflow-y-auto divide-y divide-slate-100">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200 z-10">
                      <tr>
                        <th className="py-2.5 px-3">City / Market Hub</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3 text-right">Price / MT ᵃˢᵗ</th>
                        <th className="py-2.5 px-3 text-right">Change (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMaterials.map((mat) => {
                        const isSelected = selectedMaterial?.id === mat.id;
                        const isUp = mat.movementDirection === 'up';
                        const isDown = mat.movementDirection === 'down';

                        return (
                          <tr
                            key={mat.id}
                            onClick={() => setSelectedMaterial(mat)}
                            className={`cursor-pointer transition ${
                              isSelected
                                ? 'bg-blue-50/90 font-semibold border-l-4 border-l-blue-600'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-2.5 px-3">
                              <div className="flex items-center space-x-2">
                                {isSelected ? (
                                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                )}
                                <div>
                                  <p className="font-bold text-slate-900 text-xs">
                                    {mat.name} <span className="text-[10px] font-normal text-slate-400">ᵃˢᵗ</span>
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    {mat.symbol}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-2.5 px-3">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                                  mat.categorySlug === 'ingot'
                                    ? 'bg-purple-100 text-purple-800'
                                    : mat.categorySlug === 'scrap'
                                    ? 'bg-amber-100 text-amber-900'
                                    : mat.categorySlug === 'billet'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {mat.categoryName}
                              </span>
                            </td>

                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 text-xs sm:text-sm">
                              {formatINR(mat.currentPrice)}
                            </td>

                            <td className="py-2.5 px-3 text-right">
                              <span
                                className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                                  isUp
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : isDown
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {isUp ? (
                                  <ArrowUpRight className="w-3 h-3" />
                                ) : isDown ? (
                                  <ArrowDownRight className="w-3 h-3" />
                                ) : (
                                  <Minus className="w-3 h-3" />
                                )}
                                <span>
                                  {mat.priceChange > 0 ? `+${mat.priceChange}` : mat.priceChange}
                                </span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {filteredMaterials.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No mandi rates found matching "{searchTerm}". Try clearing your search filter.
                  </div>
                )}
              </div>

              {/* Informational Box */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-lg text-xs text-blue-900 flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Trade Benchmarks Note:</strong> All rates represent primary & secondary induction spot trade fixings.
                  Applicable Sales Tax (ast) is extra as per destination state rules. Prices fluctuate during morning and evening trading sessions.
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Stock-Market Style Chart & Analytics */}
            <div className="lg:col-span-6 space-y-4">
              {selectedMaterial ? (
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
                  {/* Selected Material Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-200 pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">
                          {selectedMaterial.symbol}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded uppercase font-mono">
                          {selectedMaterial.categoryName}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mt-1">
                        {selectedMaterial.name} <span className="text-sm font-normal text-slate-400">ᵃˢᵗ</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedMaterial.notes || 'Secondary & Primary Indian Mill Benchmark ex-hub.'}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono block">
                        {formatINR(selectedMaterial.currentPrice)}
                      </span>
                      <div className="flex items-center sm:justify-end space-x-1.5 text-xs font-bold">
                        <span
                          className={`inline-flex items-center ${
                            selectedMaterial.movementDirection === 'up'
                              ? 'text-emerald-600'
                              : selectedMaterial.movementDirection === 'down'
                              ? 'text-rose-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {selectedMaterial.priceChange > 0 ? '+' : ''}
                          {selectedMaterial.priceChange} ({selectedMaterial.percentageChange}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeframe Filters & Chart Switcher */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-md text-xs font-semibold">
                      {(['1D', '1W', '1M', '3M', '6M', '1Y', 'ALL'] as const).map((range) => (
                        <button
                          key={range}
                          onClick={() => setTimeRange(range)}
                          className={`px-2.5 py-1 rounded transition text-xs ${
                            timeRange === range
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <button
                        onClick={() => setChartType(chartType === 'area' ? 'line' : 'area')}
                        className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-700 font-medium hover:bg-slate-100 transition"
                      >
                        {chartType === 'area' ? 'Area Chart' : 'Line Chart'}
                      </button>

                      <button
                        onClick={() => handleExportCSV(selectedMaterial)}
                        className="p-1.5 rounded border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition flex items-center space-x-1"
                        title="Download CSV Price Report"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-600" />
                        <span className="text-[11px] font-semibold">CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Recharts Graph */}
                  <div className="h-64 w-full bg-slate-50/50 rounded-lg p-2 border border-slate-100">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'area' ? (
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="mandiGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={{ stroke: '#cbd5e1' }}
                          />
                          <YAxis
                            domain={['auto', 'auto']}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={{ stroke: '#cbd5e1' }}
                            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                          />
                          <Tooltip
                            formatter={(value: any) => [formatINR(Number(value)), 'Spot Price / MT']}
                            labelFormatter={(label) => `Date: ${label}`}
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
                            stroke="#2563eb"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#mandiGradient)"
                          />
                        </AreaChart>
                      ) : (
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={{ stroke: '#cbd5e1' }}
                          />
                          <YAxis
                            domain={['auto', 'auto']}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            tickLine={false}
                            axisLine={{ stroke: '#cbd5e1' }}
                            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                          />
                          <Tooltip
                            formatter={(value: any) => [formatINR(Number(value)), 'Spot Price / MT']}
                            labelFormatter={(label) => `Date: ${label}`}
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderColor: '#334155',
                              color: '#ffffff',
                              borderRadius: '6px',
                              fontSize: '11px',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#2563eb"
                            strokeWidth={2.5}
                            dot={{ r: 2 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  </div>

                  {/* Stock Statistics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Previous Fixing</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatINR(selectedMaterial.previousPrice)}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Period High</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {formatINR(selectedMaterial.highPrice)}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Period Low</span>
                      <span className="font-mono font-bold text-rose-700">
                        {formatINR(selectedMaterial.lowPrice)}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Volatility</span>
                      <span className="font-mono font-bold text-slate-800">
                        {selectedMaterial.volatility}%
                      </span>
                    </div>
                  </div>

                  {/* Action CTA: Lock Physical Material Quotation */}
                  <div className="p-3.5 bg-slate-900 rounded-lg text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold">Lock Spot Quotation for this Hub</p>
                      <p className="text-[11px] text-slate-300">
                        Submit custom grade combinations directly to FTI dispatch desk.
                      </p>
                    </div>
                    <Link
                      href={`/raw-materials`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs shadow transition text-center shrink-0"
                    >
                      Request Quotation
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400">
                  <Activity className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-600">
                    Select any hub rate to view historical stock-market style graph.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. Authentic Mandi Notes, Rumours Disclaimer & Alert Channels Footer */}
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
            {/* Notes Section */}
            <div className="space-y-1.5 font-mono bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
              <p className="font-bold text-amber-300 mb-1">*_Note_*</p>
              <p>• # All Rates Are Quoted, Estimated (As per Rumours)</p>
              <p>• # All Rates Are P.m.t , Spot & only information not any offer for sale & purchase.</p>
              <p>• # We are not responsible for any profit or loss.</p>
              <p>• # 💯% Reliability and Top Service</p>
              <p>• # Best Service, Right Time, Right People</p>
              <p className="text-slate-100 font-bold mt-2">
                # Support 24×7: <a href="tel:+919780830333" className="text-blue-400 underline">+91-9780830333</a>
              </p>
            </div>

            {/* Live Alerts Desk */}
            <div className="space-y-3 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 flex flex-col justify-between">
              <div>
                <p className="font-bold text-emerald-400 mb-2">👉🏻 Live Mandi Alerts Channels</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="font-bold text-slate-200">👉🏻 SMS ALERTS💬</span>
                    <a href="sms:+919780830333" className="font-mono text-blue-400 hover:text-blue-300">
                      📲 +91-9780830333
                    </a>
                  </div>

                  <div className="p-2 bg-slate-900 rounded border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">👉🏻 Whatsapp Alerts💬</span>
                      <a href="https://wa.me/919780830333" target="_blank" rel="noreferrer" className="font-mono text-emerald-400 hover:text-emerald-300">
                        📲 +91-9780830333
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Secondary Desk</span>
                      <a href="https://wa.me/919589971567" target="_blank" rel="noreferrer" className="font-mono text-emerald-400 hover:text-emerald-300">
                        📲 +91-9589971567
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <a
                  href="tel:+919780830333"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded text-center text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Trading Desk</span>
                </a>
                <a
                  href="https://wa.me/919780830333?text=Hi%20FTI,%20Please%20subscribe%20me%20to%20Mandi%20Live%20Rates"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-center text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Subscribe on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
