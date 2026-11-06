'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import { MarketMaterial, MarketMainCategory } from '@/types';
import {
  DEFAULT_MANDI_BULLETIN_TEXT,
  parseMandiBroadcast,
  formatIstBulletinDateTime,
} from '@/lib/mandi-parser';
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
  Plus,
  Edit,
  CheckCircle2,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  FileText,
  AlertCircle,
  Building2,
  Layers,
  History,
  MapPin,
  Download,
  Filter,
  BarChart3,
  ChevronRight,
  SlidersHorizontal,
  ArrowLeft,
} from 'lucide-react';

export default function AdminMarketManagementPage() {
  const {
    marketMaterials,
    mandiBulletin,
    updateMarketPrice,
    updateMandiBulletin,
    addMarketMaterial,
    lastMarketSyncTime,
    refreshMarketPrices,
  } = useStore();

  const [isRefreshingAdmin, setIsRefreshingAdmin] = useState(false);
  const latestSyncDisplay = useMemo(
    () => formatIstBulletinDateTime(lastMarketSyncTime),
    [lastMarketSyncTime]
  );

  const handleAdminRefresh = async () => {
    if (isRefreshingAdmin) return;
    setIsRefreshingAdmin(true);
    try {
      await refreshMarketPrices();
    } finally {
      setTimeout(() => setIsRefreshingAdmin(false), 500);
    }
  };

  // Mobile View Switcher (< xl screens: 'mandis' vs 'inspector')
  const [mobileTab, setMobileTab] = useState<'mandis' | 'inspector'>('mandis');

  // LEVEL 1: Primary Category ('raw_materials' vs 'scrap_materials')
  const [mainCategory, setMainCategory] = useState<MarketMainCategory>('raw_materials');

  // LEVEL 2: Specific Material Group filter ('all', 'Ingot', 'Billet', etc.)
  const [selectedMaterialGroup, setSelectedMaterialGroup] = useState<string>('all');

  // Movement Filter ('all', 'up', 'down', 'neutral')
  const [movementFilter, setMovementFilter] = useState<'all' | 'up' | 'down' | 'neutral'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Mandi for 50-Record Panel
  const [selectedMaterial, setSelectedMaterial] = useState<MarketMaterial | null>(null);

  // 50-Record Chart Controls
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [historyLimit, setHistoryLimit] = useState<7 | 15 | 30 | 50>(50);

  // Quick Fixing Session input inside the 50-record panel
  const [deskPriceInput, setDeskPriceInput] = useState<string>('');
  const [deskNotesInput, setDeskNotesInput] = useState<string>('');

  // WhatsApp Broadcast Parser Modal State
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [rawBroadcastInput, setRawBroadcastInput] = useState(
    mandiBulletin?.rawMessageText || DEFAULT_MANDI_BULLETIN_TEXT
  );
  const [parsePreview, setParsePreview] = useState<{
    bulletin: any;
    materials: MarketMaterial[];
  } | null>(null);

  // Edit Single Price Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MarketMaterial | null>(null);
  const [modalNewPrice, setModalNewPrice] = useState<number>(0);
  const [modalUpdateNotes, setModalUpdateNotes] = useState<string>('');
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // Add Material Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addMandiCity, setAddMandiCity] = useState('');
  const [addMaterialName, setAddMaterialName] = useState('Ingot');
  const [addMainCategory, setAddMainCategory] = useState<MarketMainCategory>('raw_materials');
  const [addSymbol, setAddSymbol] = useState('');
  const [addInitialPrice, setAddInitialPrice] = useState<number>(45000);
  const [addNotes, setAddNotes] = useState('');

  // 1. Available materials in active primary category (Level 1)
  const categoryMaterials = useMemo(() => {
    return marketMaterials.filter((m) => {
      // Safety guard: Never show legacy "Mandi Benchmark" pseudo-material
      if (m.materialName === 'Mandi Benchmark' || m.categoryName === 'Mandi Benchmark') {
        return false;
      }
      if (m.mainCategory) return m.mainCategory === mainCategory;
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

  // Counts for Category Tabs
  const rawCount = useMemo(
    () =>
      marketMaterials.filter(
        (m) =>
          m.mainCategory === 'raw_materials' ||
          (m.categorySlug !== 'scrap' && !m.name.toLowerCase().includes('scrap'))
      ).length,
    [marketMaterials]
  );

  const scrapCount = useMemo(
    () =>
      marketMaterials.filter(
        (m) =>
          m.mainCategory === 'scrap_materials' ||
          m.categorySlug === 'scrap' ||
          m.name.toLowerCase().includes('scrap')
      ).length,
    [marketMaterials]
  );

  // 2. Distinct Material Names for Level 2 Selector
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
      const matchesGroup =
        selectedMaterialGroup === 'all' ||
        m.materialName === selectedMaterialGroup ||
        m.categoryName === selectedMaterialGroup;

      const matchesSearch =
        searchTerm === '' ||
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.mandiCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.hubCity && m.hubCity.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (m.specification && m.specification.toLowerCase().includes(searchTerm.toLowerCase())) ||
        m.symbol.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMovement =
        movementFilter === 'all' || m.movementDirection === movementFilter;

      return matchesGroup && matchesSearch && matchesMovement;
    });
  }, [categoryMaterials, selectedMaterialGroup, searchTerm, movementFilter]);

  // Group materials by Material Name for organized Level 2 sections
  const groupedByMaterial = useMemo(() => {
    const groups: Record<string, MarketMaterial[]> = {};
    filteredMaterials.forEach((m) => {
      const key = m.materialName || m.categoryName || 'Other Benchmarks';
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });
    return groups;
  }, [filteredMaterials]);

  // Auto-select first item when category or filter changes
  useEffect(() => {
    if (filteredMaterials.length > 0) {
      if (!selectedMaterial || !filteredMaterials.some((m) => m.id === selectedMaterial.id)) {
        setSelectedMaterial(filteredMaterials[0]);
        setDeskPriceInput(String(filteredMaterials[0].currentPrice));
      }
    }
  }, [filteredMaterials, selectedMaterial]);

  // Sync desk input when selected material changes
  useEffect(() => {
    if (selectedMaterial) {
      setDeskPriceInput(String(selectedMaterial.currentPrice));
      setDeskNotesInput(
        `Session fixing update ex-${selectedMaterial.mandiCity}. AST extra.`
      );
    }
  }, [selectedMaterial?.id]);

  // Chart data for selected material (Past 50 records)
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
      notes: p.notes || `Session fixing #${idx + 1}`,
    }));
  }, [selectedMaterial, historyLimit]);

  // Open edit single price modal
  const openPriceUpdateModal = (mat: MarketMaterial) => {
    setEditingMaterial(mat);
    setModalNewPrice(mat.currentPrice);
    setModalUpdateNotes(mat.notes || '');
    setEditModalOpen(true);
  };

  // Quick adjust price (+100, +200, -100, -200)
  const handleQuickAdjust = (mat: MarketMaterial, delta: number) => {
    const updated = mat.currentPrice + delta;
    updateMarketPrice(
      mat.id,
      updated,
      `Trading Desk Adjustment: ${delta > 0 ? '+' : ''}₹${delta} (${new Date().toLocaleTimeString()})`
    );
    setUpdateSuccess(
      `${mat.materialName} (${mat.mandiCity}): Adjusted ${delta > 0 ? '+' : ''}₹${delta} -> ₹${updated.toLocaleString('en-IN')}`
    );
    if (selectedMaterial?.id === mat.id) {
      setDeskPriceInput(String(updated));
    }
    setTimeout(() => setUpdateSuccess(null), 3000);
  };

  // Direct Session Record from the 50-Record Panel
  const handleDeskRecordSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;
    const priceNum = Number(deskPriceInput);
    if (!priceNum || isNaN(priceNum)) {
      alert('Please enter a valid numeric price');
      return;
    }

    updateMarketPrice(
      selectedMaterial.id,
      priceNum,
      deskNotesInput || `Mandi fixing session at ${new Date().toLocaleTimeString()}`
    );

    setUpdateSuccess(
      `Recorded session fix for ${selectedMaterial.materialName} (${selectedMaterial.mandiCity}): ₹${priceNum.toLocaleString('en-IN')} saved to 50-record store!`
    );
    setTimeout(() => setUpdateSuccess(null), 4000);
  };

  // Modal Price Update Save
  const handleModalPriceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;

    updateMarketPrice(editingMaterial.id, modalNewPrice, modalUpdateNotes);
    setUpdateSuccess(
      `Spot rate for ${editingMaterial.materialName} (${editingMaterial.mandiCity}) updated to ₹${modalNewPrice.toLocaleString('en-IN')} (Archived to 50-record store)`
    );
    setEditModalOpen(false);

    if (selectedMaterial?.id === editingMaterial.id) {
      setDeskPriceInput(String(modalNewPrice));
    }
    setTimeout(() => setUpdateSuccess(null), 4000);
  };

  // Export CSV of past 50 records
  const handleExportCSV = (mat: MarketMaterial) => {
    const headers = [
      'Record #',
      'Date',
      'Price (INR / MT)',
      'Change (INR)',
      'Direction',
      'Material Name',
      'Mandi / Place',
      'Notes',
    ];
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
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${mat.materialName}_${mat.mandiCity}_past_50_records.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp Broadcast Parser Handlers
  const handlePreviewBroadcast = () => {
    try {
      const res = parseMandiBroadcast(rawBroadcastInput);
      setParsePreview(res);
    } catch (err: any) {
      alert('Error parsing broadcast: ' + err.message);
    }
  };

  const handleApplyBroadcast = () => {
    try {
      updateMandiBulletin(rawBroadcastInput);
      setUpdateSuccess(
        `Successfully updated all Mandi rates from WhatsApp bulletin (${parsePreview?.materials.length || 38} rates updated and saved to 50 records)!`
      );
      setBroadcastModalOpen(false);
      setParsePreview(null);
      setTimeout(() => setUpdateSuccess(null), 5000);
    } catch (err: any) {
      alert('Error applying broadcast: ' + err.message);
    }
  };

  // Add New Mandi Handler
  const handleAddNewMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const city = addMandiCity.trim() || addName.trim() || 'Mandi Gobindgarh';
    const matName = addMaterialName.trim() || 'Ingot';
    const displayName = `${matName} - ${city}`;
    const generatedSymbol =
      addSymbol.toUpperCase() ||
      `${addMainCategory === 'raw_materials' ? 'RAW' : 'SCR'}-${matName.substring(0, 3).toUpperCase()}-${city.substring(0, 3).toUpperCase()}`;

    addMarketMaterial({
      mainCategory: addMainCategory,
      materialName: matName,
      mandiCity: city,
      categorySlug: addMainCategory,
      categoryName: matName,
      name: displayName,
      symbol: generatedSymbol,
      hubCity: city,
      unit: '₹ / Metric Ton',
      currentPrice: addInitialPrice,
      previousPrice: addInitialPrice,
      priceChange: 0,
      percentageChange: 0,
      movementDirection: 'neutral',
      highPrice: addInitialPrice,
      lowPrice: addInitialPrice,
      averagePrice: addInitialPrice,
      volatility: 1.2,
      displayOrder: marketMaterials.length + 1,
      isActive: true,
      notes: addNotes || `${matName} spot benchmark ex-${city}. Applicable Sales Tax (ast) extra.`,
    });

    setAddModalOpen(false);
    setAddName('');
    setAddMandiCity('');
    setAddSymbol('');
    setAddNotes('');
    setUpdateSuccess(`New hub rate ${displayName} added to live price desk.`);
    setTimeout(() => setUpdateSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#E8732A] bg-[#251811] border border-[#E06924]/40 px-2.5 py-0.5 rounded-md">
              ADMIN LIVE TRADING DESK
            </span>
            <span className="bg-[#191F28] text-[#CBD5E1] text-xs font-bold px-2.5 py-0.5 rounded-md border border-[#2A3342] flex items-center space-x-1">
              <History className="w-3.5 h-3.5 text-[#E8732A]" />
              <span>Past 50 Records Live Audit</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Mandi Gobindgarh <span className="text-[#E8732A]">Spot Rate Desk</span> & Multi-City Manager
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Strict 3-Level Architecture: <strong className="text-white">1. Raw / Scrap Category</strong> → <strong className="text-white">2. Material Name</strong> → <strong className="text-white">3. Mandis & Places</strong> with live Ups/Downs and 50 past session records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/market"
            target="_blank"
            className="px-3.5 py-2 bg-[#191F28] hover:bg-[#222936] text-[#CBD5E1] hover:text-white border border-[#2A3342] text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition"
          >
            <span>Customer View</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#E8732A]" />
          </Link>

          <button
            onClick={() => {
              setRawBroadcastInput(mandiBulletin?.rawMessageText || DEFAULT_MANDI_BULLETIN_TEXT);
              setParsePreview(null);
              setBroadcastModalOpen(true);
            }}
            className="bg-[#122D21] hover:bg-[#163829] text-[#4ADE80] border border-[#22C55E]/40 text-xs font-extrabold px-3.5 py-2 rounded-xl shadow transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#22C55E]" />
            <span>Paste WhatsApp Broadcast</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 text-xs font-extrabold px-3.5 py-2 rounded-xl shadow transition flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Mandi</span>
          </button>
        </div>
      </div>

      {updateSuccess && (
        <div className="p-3.5 bg-[#122D21] border border-[#22C55E]/40 text-[#4ADE80] text-xs rounded-xl flex items-center space-x-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#22C55E]" />
          <span className="font-bold">{updateSuccess}</span>
        </div>
      )}

      {/* Live Bulletin Summary Banner */}
      <div className="bg-[#14181F] text-white p-4 rounded-2xl border border-[#28303E] flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-5 text-xs font-mono">
          <div>
            <span className="text-[10px] text-[#94A3B8] block uppercase">Fixing Session (Auto 3m)</span>
            <span className="font-bold text-white text-[11px] sm:text-xs">
              🗓️ {latestSyncDisplay.dateStr || mandiBulletin?.dateStr} ({latestSyncDisplay.timeStr || mandiBulletin?.timeStr} IST)
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#94A3B8] block uppercase">USD / INR</span>
            <span className="font-bold text-[#E58A3C] text-[11px] sm:text-xs">
              🇺🇸 1($) = {mandiBulletin?.usdInrRate || 95.04} (₹)
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#94A3B8] block uppercase">Sentiment</span>
            <span
              className={`font-bold text-[11px] sm:text-xs ${
                mandiBulletin?.overallTrend === 'up' ? 'text-[#4ADE80]' : 'text-[#F87171]'
              }`}
            >
              {mandiBulletin?.trendText || 'Mandi Gobindgarh ↓'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-[#94A3B8] block uppercase">Total Mandi Fixings</span>
            <span className="font-bold text-[#E8732A] text-[11px] sm:text-xs">{marketMaterials.length} Hubs Tracked</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-start md:self-auto">
          <button
            type="button"
            onClick={handleAdminRefresh}
            disabled={isRefreshingAdmin}
            className="px-3.5 py-2 bg-[#191F28] hover:bg-[#222936] text-white border border-[#2A3342] hover:border-[#E06924]/50 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-75"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#E8732A] ${isRefreshingAdmin ? 'animate-spin' : ''}`} />
            <span>{isRefreshingAdmin ? 'Syncing...' : 'Refresh Rates'}</span>
          </button>

          <button
            onClick={() => {
              setRawBroadcastInput(mandiBulletin?.rawMessageText || DEFAULT_MANDI_BULLETIN_TEXT);
              setParsePreview(null);
              setBroadcastModalOpen(true);
            }}
            className="px-3.5 py-2 bg-[#191F28] hover:bg-[#222936] text-white border border-[#2A3342] hover:border-[#E06924]/50 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5 text-[#E8732A]" />
            <span>Update via Daily Broadcast</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* LEVEL 1: Primary Category Tabs (Raw vs Scrap)             */}
      {/* ========================================================= */}
      <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Level 1 Tabs */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setMainCategory('raw_materials');
                setSelectedMaterialGroup('all');
              }}
              className={`flex-1 sm:flex-none justify-center px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 sm:space-x-2 cursor-pointer ${
                mainCategory === 'raw_materials'
                  ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/40 shadow-md'
                  : 'bg-[#191F28] text-[#CBD5E1] hover:text-white border border-[#2A3342]'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span className="truncate">1. Raw Materials</span>
              <span
                className={`text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-bold ${
                  mainCategory === 'raw_materials'
                    ? 'bg-[#0B0E11]/40 text-white'
                    : 'bg-[#14181F] text-[#E8732A]'
                }`}
              >
                {rawCount}
              </span>
            </button>

            <button
              onClick={() => {
                setMainCategory('scrap_materials');
                setSelectedMaterialGroup('all');
              }}
              className={`flex-1 sm:flex-none justify-center px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 sm:space-x-2 cursor-pointer ${
                mainCategory === 'scrap_materials'
                  ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/40 shadow-md'
                  : 'bg-[#191F28] text-[#CBD5E1] hover:text-white border border-[#2A3342]'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span className="truncate">1. Scrap Materials</span>
              <span
                className={`text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-bold ${
                  mainCategory === 'scrap_materials'
                    ? 'bg-[#0B0E11]/40 text-white'
                    : 'bg-[#14181F] text-[#E8732A]'
                }`}
              >
                {scrapCount}
              </span>
            </button>
          </div>

          {/* Search Bar & Trend Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search mandi, material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white placeholder-[#64748B]"
              />
            </div>

            <select
              value={movementFilter}
              onChange={(e) => setMovementFilter(e.target.value as any)}
              className="py-2 px-3 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white font-medium"
            >
              <option value="all">All Movements</option>
              <option value="up">▲ Ups Only</option>
              <option value="down">▼ Downs Only</option>
              <option value="neutral">▬ Neutral</option>
            </select>
          </div>
        </div>

        {/* ========================================================= */}
        {/* LEVEL 2: Material Name Pills (e.g. Ingot, Billet, TMT...) */}
        {/* ========================================================= */}
        <div className="pt-2.5 border-t border-[#222934] flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] shrink-0 flex items-center space-x-1">
            <Filter className="w-3 h-3 text-[#E8732A]" />
            <span>2. Material:</span>
          </span>

          <button
            onClick={() => setSelectedMaterialGroup('all')}
            className={`px-3 py-1 text-xs font-bold rounded-full transition shrink-0 cursor-pointer ${
              selectedMaterialGroup === 'all'
                ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/40 shadow-xs'
                : 'bg-[#191F28] text-[#CBD5E1] hover:bg-[#222936] border border-[#2A3342]'
            }`}
          >
            All ({categoryMaterials.length})
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
                    ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/40 shadow-xs'
                    : 'bg-[#191F28] text-[#CBD5E1] hover:bg-[#222936] border border-[#2A3342]'
                }`}
              >
                <span>{matName}</span>
                <span className="text-[10px] font-mono opacity-80">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Segmented Switcher (< xl screens) */}
      <div className="flex xl:hidden bg-[#14181F] p-1 rounded-xl border border-[#28303E] shadow-xs">
        <button
          onClick={() => setMobileTab('mandis')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
            mobileTab === 'mandis'
              ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white shadow-xs'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Mandi Rates ({filteredMaterials.length})</span>
        </button>
        <button
          onClick={() => setMobileTab('inspector')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
            mobileTab === 'inspector'
              ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white shadow-xs'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>50-Rec Inspector {selectedMaterial ? `(${selectedMaterial.mandiCity})` : ''}</span>
        </button>
      </div>

      {/* Main Trading Desk Workspace: Split 7 / 5 Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Level 2 & 3 Grouped Material & Mandi Tables (7 cols) */}
        <div className={`xl:col-span-7 space-y-5 ${mobileTab === 'mandis' ? 'block' : 'hidden xl:block'}`}>
          {Object.keys(groupedByMaterial).length === 0 ? (
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-8 text-center text-xs text-[#94A3B8] shadow-lg">
              No Mandi rates found matching your filters. Try selecting another material or clearing the search.
            </div>
          ) : (
            Object.entries(groupedByMaterial).map(([materialName, mandis]) => {
              const avgPrice = Math.round(
                mandis.reduce((acc, curr) => acc + curr.currentPrice, 0) / mandis.length
              );
              const upCount = mandis.filter((m) => m.movementDirection === 'up').length;
              const downCount = mandis.filter((m) => m.movementDirection === 'down').length;

              return (
                <div
                  key={materialName}
                  className="bg-[#14181F] border border-[#28303E] rounded-2xl shadow-lg overflow-hidden transition-all"
                >
                  {/* LEVEL 2: Material Name Header */}
                  <div className="bg-[#191F28] px-4 py-3.5 border-b border-[#28303E] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E8732A]" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-black text-sm text-white tracking-tight">
                            {materialName}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono bg-[#251811] text-[#E8732A] border border-[#E06924]/40">
                            {mainCategory === 'raw_materials' ? 'Raw Material' : 'Scrap Material'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5">
                          Tracking <strong className="text-white">{mandis.length} Mandi Hubs</strong> • Avg: <strong className="text-[#E8732A] font-mono">{formatINR(avgPrice)}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] font-mono">
                      {upCount > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40 font-bold">
                          ▲ {upCount} Ups
                        </span>
                      )}
                      {downCount > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-[#2F1619] text-[#F87171] border border-[#EF4444]/40 font-bold">
                          ▼ {downCount} Downs
                        </span>
                      )}
                    </div>
                  </div>

                  {/* LEVEL 3: Mandis & Places Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-[#191F28]/60 text-[#94A3B8] font-bold uppercase text-[10px] border-b border-[#222934]">
                        <tr>
                          <th className="py-3 px-3">Mandi / Place</th>
                          <th className="py-3 px-2.5 text-right">Current Spot ᵃˢᵗ</th>
                          <th className="py-3 px-2.5 text-right">Ups / Downs</th>
                          <th className="py-3 px-2 text-center">Desk Steppers</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222934]">
                        {mandis.map((mat) => {
                          const isUp = mat.movementDirection === 'up';
                          const isDown = mat.movementDirection === 'down';
                          const isSelected = selectedMaterial?.id === mat.id;

                          return (
                            <tr
                              key={mat.id}
                              onClick={() => {
                                setSelectedMaterial(mat);
                                setMobileTab('inspector');
                              }}
                              className={`transition cursor-pointer ${
                                isSelected
                                  ? 'bg-[#251811]/70 font-semibold'
                                  : 'hover:bg-[#191F28]/60'
                              }`}
                            >
                              {/* Mandi / Place Name */}
                              <td className="py-3 px-3">
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                      isSelected ? 'bg-[#E8732A] ring-2 ring-[#E8732A]/40' : 'bg-[#64748B]'
                                    }`}
                                  />
                                  <div>
                                    <p className="font-bold text-white text-xs flex items-center space-x-1">
                                      <span>{mat.mandiCity}</span>
                                    </p>
                                    <p className="text-[10px] text-[#94A3B8] font-mono">
                                      {mat.symbol}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Spot Price */}
                              <td className="py-3 px-2.5 text-right font-mono font-black text-white text-xs sm:text-sm">
                                <div>{formatINR(mat.currentPrice)}</div>
                                <div className="text-[10px] text-[#94A3B8] font-normal">
                                  Prev: {formatINR(mat.previousPrice || mat.currentPrice)}
                                </div>
                              </td>

                              {/* Ups or Downs Indicator */}
                              <td className="py-3 px-2.5 text-right">
                                <span
                                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono ${
                                    isUp
                                      ? 'bg-[#122D21] text-[#4ADE80] border border-[#22C55E]/40'
                                      : isDown
                                      ? 'bg-[#2F1619] text-[#F87171] border border-[#EF4444]/40'
                                      : 'bg-[#191F28] text-[#94A3B8] border border-[#2A3342]'
                                  }`}
                                >
                                  {isUp && <ArrowUpRight className="w-3 h-3" />}
                                  {isDown && <ArrowDownRight className="w-3 h-3" />}
                                  {!isUp && !isDown && <Minus className="w-3 h-3" />}
                                  <span>
                                    {mat.priceChange > 0 ? `+${mat.priceChange}` : mat.priceChange}
                                  </span>
                                </span>
                              </td>

                              {/* Quick Desk Adjust Steppers (-200, -100, +100, +200) */}
                              <td
                                className="py-3 px-2 text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="inline-flex items-center space-x-1 font-mono text-[10px]">
                                  <button
                                    onClick={() => handleQuickAdjust(mat, -200)}
                                    className="px-1.5 py-0.5 rounded bg-[#2F1619] hover:bg-[#3F1D21] text-[#F87171] border border-[#EF4444]/40 font-bold transition cursor-pointer"
                                    title="Decrease price by ₹200"
                                  >
                                    -200
                                  </button>
                                  <button
                                    onClick={() => handleQuickAdjust(mat, -100)}
                                    className="px-1.5 py-0.5 rounded bg-[#2F1619] hover:bg-[#3F1D21] text-[#F87171] border border-[#EF4444]/40 font-bold transition cursor-pointer"
                                    title="Decrease price by ₹100"
                                  >
                                    -100
                                  </button>
                                  <button
                                    onClick={() => handleQuickAdjust(mat, 100)}
                                    className="px-1.5 py-0.5 rounded bg-[#122D21] hover:bg-[#173A2B] text-[#4ADE80] border border-[#22C55E]/40 font-bold transition cursor-pointer"
                                    title="Increase price by ₹100"
                                  >
                                    +100
                                  </button>
                                  <button
                                    onClick={() => handleQuickAdjust(mat, 200)}
                                    className="px-1.5 py-0.5 rounded bg-[#122D21] hover:bg-[#173A2B] text-[#4ADE80] border border-[#22C55E]/40 font-bold transition cursor-pointer"
                                    title="Increase price by ₹200"
                                  >
                                    +200
                                  </button>
                                </div>
                              </td>

                              {/* Actions */}
                              <td
                                className="py-3 px-3 text-right"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-end space-x-1.5">
                                  <button
                                    onClick={() => {
                                      setSelectedMaterial(mat);
                                      setMobileTab('inspector');
                                    }}
                                    className={`px-2 py-1 text-[10px] font-mono font-bold rounded-lg border transition cursor-pointer ${
                                      isSelected
                                        ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border-[#F59352]/40'
                                        : 'bg-[#191F28] hover:bg-[#222936] text-[#CBD5E1] hover:text-white border-[#2A3342]'
                                    }`}
                                    title="Inspect 50 records in right panel"
                                  >
                                    50 Rec
                                  </button>

                                  <button
                                    onClick={() => openPriceUpdateModal(mat)}
                                    className="px-2.5 py-1 text-xs font-bold text-[#E8732A] bg-[#251811] hover:bg-[#312016] rounded-lg border border-[#E06924]/40 transition flex items-center space-x-1 cursor-pointer"
                                    title="Edit price and notes"
                                  >
                                    <Edit className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                </div>
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
        </div>

        {/* RIGHT COLUMN: Dedicated Past 50 Records Live Inspector (5 cols) */}
        <div id="audit-panel" className={`xl:col-span-5 sticky top-20 space-y-5 ${mobileTab === 'inspector' ? 'block' : 'hidden xl:block'}`}>
          {selectedMaterial ? (
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl shadow-lg p-4 sm:p-5 space-y-5">
              {/* Mobile Back Button */}
              <button
                onClick={() => setMobileTab('mandis')}
                className="xl:hidden w-full py-2 px-3 bg-[#191F28] hover:bg-[#222936] text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer border border-[#2A3342]"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#E8732A]" />
                <span>← Back to Mandi Rates List</span>
              </button>
              {/* Material & Mandi Header */}
              <div className="border-b border-[#222934] pb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase bg-[#251811] text-[#E8732A] border border-[#E06924]/40">
                      {selectedMaterial.mainCategory === 'scrap_materials' ? 'Scrap Material' : 'Raw Material'}
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8] font-bold">
                      {selectedMaterial.symbol}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-[#4ADE80] bg-[#122D21] border border-[#22C55E]/40 px-2 py-0.5 rounded-md font-mono">
                    50 Records Active
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <h2 className="text-lg font-black text-white tracking-tight">
                      {selectedMaterial.materialName}
                    </h2>
                    <p className="text-xs text-[#94A3B8] flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E8732A]" />
                      <span>{selectedMaterial.mandiCity} Spot Benchmark ᵃˢᵗ</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-mono font-black text-white">
                      {formatINR(selectedMaterial.currentPrice)}
                    </div>
                    <div className="flex items-center justify-end space-x-1 mt-0.5">
                      <span
                        className={`text-xs font-mono font-bold inline-flex items-center space-x-0.5 ${
                          selectedMaterial.movementDirection === 'up'
                            ? 'text-[#4ADE80]'
                            : selectedMaterial.movementDirection === 'down'
                            ? 'text-[#F87171]'
                            : 'text-[#94A3B8]'
                        }`}
                      >
                        {selectedMaterial.movementDirection === 'up' && '▲ +'}
                        {selectedMaterial.movementDirection === 'down' && '▼ '}
                        ₹{selectedMaterial.priceChange || 0} ({selectedMaterial.percentageChange || 0}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 50-Record Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-[#191F28] p-2.5 rounded-xl border border-[#2A3342]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">50-Rec High</span>
                  <span className="font-mono font-bold text-xs text-[#4ADE80]">
                    {formatINR(selectedMaterial.highPrice || selectedMaterial.currentPrice)}
                  </span>
                </div>
                <div className="bg-[#191F28] p-2.5 rounded-xl border border-[#2A3342]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">50-Rec Low</span>
                  <span className="font-mono font-bold text-xs text-[#F87171]">
                    {formatINR(selectedMaterial.lowPrice || selectedMaterial.currentPrice)}
                  </span>
                </div>
                <div className="bg-[#191F28] p-2.5 rounded-xl border border-[#2A3342]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Prev Session</span>
                  <span className="font-mono font-bold text-xs text-white">
                    {formatINR(selectedMaterial.previousPrice || selectedMaterial.currentPrice)}
                  </span>
                </div>
                <div className="bg-[#191F28] p-2.5 rounded-xl border border-[#2A3342]">
                  <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Volatility</span>
                  <span className="font-mono font-bold text-xs text-[#E8732A]">
                    ±{selectedMaterial.volatility || 1.2}%
                  </span>
                </div>
              </div>

              {/* Chart Controls & Recharts Visualization */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                    <BarChart3 className="w-3.5 h-3.5 text-[#E8732A]" />
                    <span>Price Trend History</span>
                  </div>

                  <div className="flex items-center space-x-1 bg-[#191F28] border border-[#2A3342] p-0.5 rounded-lg text-[11px] font-mono font-bold">
                    {([7, 15, 30, 50] as const).map((limit) => (
                      <button
                        key={limit}
                        onClick={() => setHistoryLimit(limit)}
                        className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                          historyLimit === limit
                            ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white shadow-xs'
                            : 'text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        {limit}R
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-44 w-full bg-[#191F28] rounded-xl p-1.5 border border-[#2A3342]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'area' ? (
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor={selectedMaterial.movementDirection === 'down' ? '#EF4444' : '#E8732A'}
                              stopOpacity={0.35}
                            />
                            <stop
                              offset="95%"
                              stopColor={selectedMaterial.movementDirection === 'down' ? '#EF4444' : '#E8732A'}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222934" />
                        <XAxis
                          dataKey="formattedDate"
                          tick={{ fontSize: 9, fill: '#94A3B8' }}
                          tickLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          domain={['dataMin - 300', 'dataMax + 300']}
                          tick={{ fontSize: 9, fill: '#94A3B8' }}
                          tickLine={false}
                          tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-[#0E1217] border border-[#2A3342] text-white p-2.5 rounded-xl shadow-xl text-[11px] font-mono">
                                  <p className="font-bold text-[#CBD5E1]">{data.date}</p>
                                  <p className="text-[#E8732A] font-extrabold">{formatINR(data.price)}</p>
                                  <p className="text-[#94A3B8] text-[10px]">Change: ₹{data.change}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={selectedMaterial.movementDirection === 'down' ? '#EF4444' : '#E8732A'}
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#adminChartGrad)"
                        />
                      </AreaChart>
                    ) : (
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222934" />
                        <XAxis dataKey="formattedDate" tick={{ fontSize: 9, fill: '#94A3B8' }} />
                        <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} tickFormatter={(val) => `₹${Math.round(val / 1000)}k`} />
                        <Tooltip />
                        <Line type="monotone" dataKey="price" stroke="#E8732A" strokeWidth={2} dot={false} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Session Fixing Recorder (Inserts into 50 Records) */}
              <form
                onSubmit={handleDeskRecordSession}
                className="bg-[#191F28] border border-[#2A3342] rounded-xl p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#E8732A]" />
                    <span>Record New Fixing Session</span>
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono">Appends to 50 Records</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6 relative">
                    <span className="absolute left-3 top-2 font-mono font-bold text-[#94A3B8] text-xs">₹</span>
                    <input
                      type="number"
                      step="50"
                      required
                      value={deskPriceInput}
                      onChange={(e) => setDeskPriceInput(e.target.value)}
                      placeholder="Spot Rate"
                      className="w-full pl-7 pr-2 py-1.5 text-xs font-mono font-bold bg-[#14181F] border border-[#28303E] rounded-lg text-white"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <button
                      type="submit"
                      className="w-full py-1.5 px-3 bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/40 rounded-lg text-xs font-extrabold shadow-xs transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Session Fix</span>
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={deskNotesInput}
                  onChange={(e) => setDeskNotesInput(e.target.value)}
                  placeholder="Session notes (e.g. Afternoon fixing, buyers cautious)"
                  className="w-full px-2.5 py-1.5 text-[11px] bg-[#14181F] border border-[#28303E] rounded-lg text-white placeholder-[#64748B]"
                />
              </form>

              {/* Full 50 Records Audit Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <History className="w-3.5 h-3.5 text-[#E8732A]" />
                    <span>Past 50 Recorded Sessions</span>
                  </span>

                  <button
                    onClick={() => handleExportCSV(selectedMaterial)}
                    className="text-[11px] font-bold text-[#E8732A] hover:text-[#F59352] flex items-center space-x-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export CSV</span>
                  </button>
                </div>

                <div className="border border-[#28303E] rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-[#191F28] text-[#94A3B8] font-bold uppercase text-[9px] border-b border-[#28303E]">
                      <tr>
                        <th className="py-2 px-2.5">#</th>
                        <th className="py-2 px-2">Date</th>
                        <th className="py-2 px-2 text-right">Price / MT</th>
                        <th className="py-2 px-2 text-right">Ups / Downs</th>
                        <th className="py-2 px-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#222934]">
                      {(selectedMaterial.historicalPrices || [])
                        .slice()
                        .reverse()
                        .map((p, idx) => (
                          <tr key={idx} className="hover:bg-[#191F28]/60">
                            <td className="py-1.5 px-2.5 font-mono text-[#64748B] text-[10px]">
                              #{idx + 1}
                            </td>
                            <td className="py-1.5 px-2 text-[#CBD5E1] text-[11px] whitespace-nowrap">
                              {p.date}
                            </td>
                            <td className="py-1.5 px-2 text-right font-mono font-bold text-white text-[11px]">
                              {formatINR(p.price)}
                            </td>
                            <td className="py-1.5 px-2 text-right">
                              <span
                                className={`font-mono font-bold text-[10px] inline-flex items-center ${
                                  p.movementDirection === 'up'
                                    ? 'text-[#4ADE80]'
                                    : p.movementDirection === 'down'
                                    ? 'text-[#F87171]'
                                    : 'text-[#94A3B8]'
                                }`}
                              >
                                {p.movementDirection === 'up' && '▲ +'}
                                {p.movementDirection === 'down' && '▼ '}
                                ₹{p.priceChange || 0}
                              </span>
                            </td>
                            <td className="py-1.5 px-2 text-[#94A3B8] text-[10px] truncate max-w-[120px]">
                              {p.notes || 'Fixing'}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#14181F] border border-[#28303E] rounded-2xl p-6 text-center text-xs text-[#94A3B8] shadow-lg">
              Select any Mandi rate row from the left to inspect its complete 50-session price history and live charts.
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* Modal 1: WhatsApp Daily Bulletin Parser                   */}
      {/* ========================================================= */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B0E11]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14181F] rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#28303E] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#222934] pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#22C55E]" />
                <h3 className="font-extrabold text-base text-white">
                  Update Multi-City Prices via WhatsApp Broadcast
                </h3>
              </div>
              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="text-[#94A3B8] hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Paste the morning or evening WhatsApp broadcast text from the Mandi Gobindgarh Trading Desk.
              The parser automatically normalizes unicode characters, extracts Ingot, Billet, and Scrap rates
              across all mandis, calculates ups/downs against previous rates, and archives previous sessions into the 50-record audit store.
            </p>

            <div className="space-y-2.5">
              <textarea
                rows={10}
                value={rawBroadcastInput}
                onChange={(e) => {
                  setRawBroadcastInput(e.target.value);
                  setParsePreview(null);
                }}
                placeholder="Paste the daily Mandi WhatsApp text here..."
                className="w-full p-3.5 font-mono text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white placeholder-[#64748B] leading-relaxed"
              />

              {parsePreview && (
                <div className="p-3.5 bg-[#122D21] border border-[#22C55E]/40 rounded-xl text-xs text-[#4ADE80] space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span>Parsed Bulletin Summary:</span>
                    <span className="px-2.5 py-0.5 bg-[#22C55E] text-[#0B0E11] rounded-md font-mono text-[10px] font-black">
                      {parsePreview.materials.length} Rates Detected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-white">
                    <div>Date: <strong>{parsePreview.bulletin.dateStr}</strong></div>
                    <div>Time: <strong>{parsePreview.bulletin.timeStr}</strong></div>
                    <div>USD/INR: <strong>₹{parsePreview.bulletin.usdInrRate}</strong></div>
                    <div>Trend: <strong>{parsePreview.bulletin.overallTrend}</strong></div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[#222934] pt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePreviewBroadcast}
                className="px-4 py-2 bg-[#191F28] hover:bg-[#222936] text-white border border-[#2A3342] rounded-xl font-bold text-xs transition cursor-pointer text-center touch-manipulation"
              >
                Validate / Preview
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setBroadcastModalOpen(false)}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-[#191F28] border border-[#2A3342] text-[#CBD5E1] rounded-xl text-xs font-bold hover:text-white cursor-pointer text-center touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyBroadcast}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 rounded-xl text-xs font-extrabold shadow transition flex items-center justify-center space-x-1.5 cursor-pointer touch-manipulation"
                >
                  <Check className="w-4 h-4" />
                  <span>Update All Mandi Rates</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Modal 2: Edit Single Material Price                       */}
      {/* ========================================================= */}
      {editModalOpen && editingMaterial && (
        <div className="fixed inset-0 z-50 bg-[#0B0E11]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#14181F] rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#28303E] space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-base text-white">
              Update Spot Rate: {editingMaterial.materialName} ({editingMaterial.mandiCity}) ᵃˢᵗ
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Previous price was ₹{editingMaterial.currentPrice.toLocaleString('en-IN')}. New price will be
              recorded as the 50th historical session record.
            </p>

            <form onSubmit={handleModalPriceUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  New Spot Price (₹ / Metric Ton):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono font-bold text-[#94A3B8] text-sm">₹</span>
                  <input
                    type="number"
                    step="50"
                    required
                    value={modalNewPrice}
                    onChange={(e) => setModalNewPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-sm font-mono font-bold bg-[#191F28] border border-[#2A3342] rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  Fixing Session Notes:
                </label>
                <textarea
                  rows={2}
                  value={modalUpdateNotes}
                  onChange={(e) => setModalUpdateNotes(e.target.value)}
                  placeholder="e.g. Mandi Gobindgarh noon fixing. Sales Tax extra."
                  className="w-full p-2.5 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white placeholder-[#64748B]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-[#191F28] border border-[#2A3342] text-[#CBD5E1] rounded-xl text-xs font-bold hover:text-white cursor-pointer touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 rounded-xl text-xs font-extrabold cursor-pointer touch-manipulation"
                >
                  Save New Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Modal 3: Add New Mandi Price Rate                         */}
      {/* ========================================================= */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B0E11]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#14181F] rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#28303E] space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-base text-white">
              Add New Mandi Price Rate
            </h3>

            <form onSubmit={handleAddNewMaterial} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  1. Primary Category:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAddMainCategory('raw_materials')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                      addMainCategory === 'raw_materials'
                        ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border-[#F59352]/40'
                        : 'bg-[#191F28] text-[#CBD5E1] border-[#2A3342]'
                    }`}
                  >
                    Raw Material
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddMainCategory('scrap_materials')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border cursor-pointer ${
                      addMainCategory === 'scrap_materials'
                        ? 'bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border-[#F59352]/40'
                        : 'bg-[#191F28] text-[#CBD5E1] border-[#2A3342]'
                    }`}
                  >
                    Scrap Material
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  2. Material Name (e.g. Ingot, Billet, HMS Scrap):
                </label>
                <input
                  type="text"
                  required
                  value={addMaterialName}
                  onChange={(e) => setAddMaterialName(e.target.value)}
                  placeholder="e.g. Ingot, Billet, Melting Scrap"
                  className="w-full p-2.5 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white placeholder-[#64748B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  3. Mandi / Place Name (e.g. Ludhiana, Mandi Gobindgarh):
                </label>
                <input
                  type="text"
                  required
                  value={addMandiCity}
                  onChange={(e) => setAddMandiCity(e.target.value)}
                  placeholder="e.g. Mandi Gobindgarh, Ludhiana (MS)"
                  className="w-full p-2.5 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white placeholder-[#64748B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    Spot Price (₹ / MT):
                  </label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={addInitialPrice}
                    onChange={(e) => setAddInitialPrice(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">Symbol Code:</label>
                  <input
                    type="text"
                    value={addSymbol}
                    onChange={(e) => setAddSymbol(e.target.value)}
                    placeholder="Optional (Auto)"
                    className="w-full p-2.5 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white font-mono placeholder-[#64748B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5">Notes:</label>
                <input
                  type="text"
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  placeholder="e.g. Applicable Sales Tax (ast) extra ex-mandi"
                  className="w-full p-2.5 text-xs bg-[#191F28] border border-[#2A3342] rounded-xl text-white placeholder-[#64748B]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 bg-[#191F28] border border-[#2A3342] text-[#CBD5E1] rounded-xl text-xs font-bold hover:text-white cursor-pointer touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-b from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/50 rounded-xl text-xs font-extrabold cursor-pointer touch-manipulation"
                >
                  Add Mandi Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
