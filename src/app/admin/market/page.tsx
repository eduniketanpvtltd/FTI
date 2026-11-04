'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import { MarketMaterial, MarketMainCategory } from '@/types';
import { DEFAULT_MANDI_BULLETIN_TEXT, parseMandiBroadcast } from '@/lib/mandi-parser';
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
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              ADMIN LIVE TRADING DESK
            </span>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded border border-indigo-200 flex items-center space-x-1">
              <History className="w-3.5 h-3.5" />
              <span>Past 50 Records Live Audit</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mandi Gobindgarh Spot Rate Desk & Multi-City Manager
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict 3-Level Architecture: <strong>1. Raw / Scrap Category</strong> → <strong>2. Material Name</strong> → <strong>3. Mandis & Places</strong> with live Ups/Downs and 50 past session records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Link
            href="/market"
            target="_blank"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded shadow-xs flex items-center justify-center space-x-1.5 transition"
          >
            <span>Customer View</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          <button
            onClick={() => {
              setRawBroadcastInput(mandiBulletin?.rawMessageText || DEFAULT_MANDI_BULLETIN_TEXT);
              setParsePreview(null);
              setBroadcastModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded shadow transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Paste WhatsApp Broadcast</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded shadow transition flex items-center justify-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Mandi</span>
          </button>
        </div>
      </div>

      {updateSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-md flex items-center space-x-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-semibold">{updateSuccess}</span>
        </div>
      )}

      {/* Live Bulletin Summary Banner */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Fixing Session</span>
            <span className="font-bold text-white text-[11px] sm:text-xs">
              🗓️ {mandiBulletin?.dateStr || '28-OCTOBER-2026'} ({mandiBulletin?.timeStr || '12:00'})
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase">USD / INR</span>
            <span className="font-bold text-amber-400 text-[11px] sm:text-xs">
              🇺🇸 1($) = {mandiBulletin?.usdInrRate || 95.04} (₹)
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Sentiment</span>
            <span
              className={`font-bold text-[11px] sm:text-xs ${
                mandiBulletin?.overallTrend === 'up' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {mandiBulletin?.trendText || 'Mandi Trend downwards'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Total Mandi Fixings</span>
            <span className="font-bold text-blue-400 text-[11px] sm:text-xs">{marketMaterials.length} Hubs Tracked</span>
          </div>
        </div>

        <button
          onClick={() => {
            setRawBroadcastInput(mandiBulletin?.rawMessageText || DEFAULT_MANDI_BULLETIN_TEXT);
            setParsePreview(null);
            setBroadcastModalOpen(true);
          }}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-bold transition flex items-center justify-center space-x-1.5 self-stretch sm:self-start md:self-auto cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5 text-blue-400" />
          <span>Update via Daily Broadcast</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* LEVEL 1: Primary Category Tabs (Raw vs Scrap)             */}
      {/* ========================================================= */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Level 1 Tabs */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setMainCategory('raw_materials');
                setSelectedMaterialGroup('all');
              }}
              className={`flex-1 sm:flex-none justify-center px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 sm:space-x-2 cursor-pointer ${
                mainCategory === 'raw_materials'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span className="truncate">1. Raw Materials</span>
              <span
                className={`text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-bold ${
                  mainCategory === 'raw_materials'
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-200 text-blue-900'
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
              className={`flex-1 sm:flex-none justify-center px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 sm:space-x-2 cursor-pointer ${
                mainCategory === 'scrap_materials'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span className="truncate">1. Scrap Materials</span>
              <span
                className={`text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-mono font-bold ${
                  mainCategory === 'scrap_materials'
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-200 text-amber-900'
                }`}
              >
                {scrapCount}
              </span>
            </button>
          </div>

          {/* Search Bar & Trend Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search mandi, material..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={movementFilter}
              onChange={(e) => setMovementFilter(e.target.value as any)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-700 font-medium"
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
        <div className="pt-2 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center space-x-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>2. Material:</span>
          </span>

          <button
            onClick={() => setSelectedMaterialGroup('all')}
            className={`px-3 py-1 text-xs font-bold rounded-full transition shrink-0 cursor-pointer ${
              selectedMaterialGroup === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
                    ? mainCategory === 'raw_materials'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
      <div className="flex xl:hidden bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
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
          onClick={() => setMobileTab('inspector')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
            mobileTab === 'inspector'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
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
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500 shadow-xs">
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
                  className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all"
                >
                  {/* LEVEL 2: Material Name Header */}
                  <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          mainCategory === 'raw_materials' ? 'bg-blue-600' : 'bg-amber-600'
                        }`}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-black text-sm text-slate-900 tracking-tight">
                            {materialName}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                              mainCategory === 'raw_materials'
                                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                : 'bg-amber-100 text-amber-900 border border-amber-200'
                            }`}
                          >
                            {mainCategory === 'raw_materials' ? 'Raw Material' : 'Scrap Material'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Tracking <strong>{mandis.length} Mandi Hubs</strong> • Avg: <strong className="text-slate-800 font-mono">{formatINR(avgPrice)}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] font-mono">
                      {upCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                          ▲ {upCount} Ups
                        </span>
                      )}
                      {downCount > 0 && (
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-bold">
                          ▼ {downCount} Downs
                        </span>
                      )}
                    </div>
                  </div>

                  {/* LEVEL 3: Mandis & Places Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Mandi / Place</th>
                          <th className="py-2.5 px-2.5 text-right">Current Spot ᵃˢᵗ</th>
                          <th className="py-2.5 px-2.5 text-right">Ups / Downs</th>
                          <th className="py-2.5 px-2 text-center">Desk Steppers</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
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
                                  ? 'bg-blue-50/70 font-semibold'
                                  : 'hover:bg-slate-50'
                              }`}
                            >
                              {/* Mandi / Place Name */}
                              <td className="py-2.5 px-3">
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                      isSelected ? 'bg-blue-600 ring-2 ring-blue-300' : 'bg-slate-300'
                                    }`}
                                  />
                                  <div>
                                    <p className="font-bold text-slate-900 text-xs flex items-center space-x-1">
                                      <span>{mat.mandiCity}</span>
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-mono">
                                      {mat.symbol}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Spot Price */}
                              <td className="py-2.5 px-2.5 text-right font-mono font-black text-slate-900 text-xs sm:text-sm">
                                <div>{formatINR(mat.currentPrice)}</div>
                                <div className="text-[10px] text-slate-400 font-normal">
                                  Prev: {formatINR(mat.previousPrice || mat.currentPrice)}
                                </div>
                              </td>

                              {/* Ups or Downs Indicator */}
                              <td className="py-2.5 px-2.5 text-right">
                                <span
                                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                                    isUp
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : isDown
                                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                      : 'bg-slate-100 text-slate-600 border border-slate-200'
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
                                className="py-2.5 px-2 text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="inline-flex items-center space-x-1 font-mono text-[10px]">
                                  <button
                                    onClick={() => handleQuickAdjust(mat, -200)}
                                    className="px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold transition cursor-pointer"
                                    title="Decrease price by ₹200"
                                  >
                                    -200
                                  </button>
                                  <button
                                    onClick={() => handleQuickAdjust(mat, -100)}
                                    className="px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold transition cursor-pointer"
                                    title="Decrease price by ₹100"
                                  >
                                    -100
                                  </button>
                                  <button
                                    onClick={() => handleQuickAdjust(mat, 100)}
                                    className="px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold transition cursor-pointer"
                                    title="Increase price by ₹100"
                                  >
                                    +100
                                  </button>
                                  <button
                                    onClick={() => handleQuickAdjust(mat, 200)}
                                    className="px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold transition cursor-pointer"
                                    title="Increase price by ₹200"
                                  >
                                    +200
                                  </button>
                                </div>
                              </td>

                              {/* Actions */}
                              <td
                                className="py-2.5 px-3 text-right"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-end space-x-1.5">
                                  <button
                                    onClick={() => {
                                      setSelectedMaterial(mat);
                                      setMobileTab('inspector');
                                    }}
                                    className={`px-2 py-1 text-[10px] font-mono font-bold rounded border transition cursor-pointer ${
                                      isSelected
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200'
                                    }`}
                                    title="Inspect 50 records in right panel"
                                  >
                                    50 Rec
                                  </button>

                                  <button
                                    onClick={() => openPriceUpdateModal(mat)}
                                    className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition flex items-center space-x-1 cursor-pointer"
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
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-3.5 sm:p-5 space-y-5">
              {/* Mobile Back Button */}
              <button
                onClick={() => setMobileTab('mandis')}
                className="xl:hidden w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Mandi Rates List</span>
              </button>
              {/* Material & Mandi Header */}
              <div className="border-b border-slate-200 pb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        selectedMaterial.mainCategory === 'scrap_materials'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}
                    >
                      {selectedMaterial.mainCategory === 'scrap_materials' ? 'Scrap Material' : 'Raw Material'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      {selectedMaterial.symbol}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-mono">
                    50 Records Active
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      {selectedMaterial.materialName}
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedMaterial.mandiCity} Spot Benchmark ᵃˢᵗ</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-mono font-black text-slate-900">
                      {formatINR(selectedMaterial.currentPrice)}
                    </div>
                    <div className="flex items-center justify-end space-x-1 mt-0.5">
                      <span
                        className={`text-xs font-mono font-bold inline-flex items-center space-x-0.5 ${
                          selectedMaterial.movementDirection === 'up'
                            ? 'text-emerald-700'
                            : selectedMaterial.movementDirection === 'down'
                            ? 'text-rose-700'
                            : 'text-slate-500'
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
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">50-Rec High</span>
                  <span className="font-mono font-bold text-xs text-emerald-700">
                    {formatINR(selectedMaterial.highPrice || selectedMaterial.currentPrice)}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">50-Rec Low</span>
                  <span className="font-mono font-bold text-xs text-rose-700">
                    {formatINR(selectedMaterial.lowPrice || selectedMaterial.currentPrice)}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Prev Session</span>
                  <span className="font-mono font-bold text-xs text-slate-800">
                    {formatINR(selectedMaterial.previousPrice || selectedMaterial.currentPrice)}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Volatility</span>
                  <span className="font-mono font-bold text-xs text-blue-700">
                    ±{selectedMaterial.volatility || 1.2}%
                  </span>
                </div>
              </div>

              {/* Chart Controls & Recharts Visualization */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                    <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Price Trend History</span>
                  </div>

                  <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded text-[11px] font-mono font-bold">
                    {([7, 15, 30, 50] as const).map((limit) => (
                      <button
                        key={limit}
                        onClick={() => setHistoryLimit(limit)}
                        className={`px-2 py-0.5 rounded transition cursor-pointer ${
                          historyLimit === limit
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {limit}R
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-44 w-full bg-slate-50/50 rounded-lg p-1 border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'area' ? (
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor={selectedMaterial.movementDirection === 'down' ? '#e11d48' : '#2563eb'}
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor={selectedMaterial.movementDirection === 'down' ? '#e11d48' : '#2563eb'}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                          dataKey="formattedDate"
                          tick={{ fontSize: 9, fill: '#64748b' }}
                          tickLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          domain={['dataMin - 300', 'dataMax + 300']}
                          tick={{ fontSize: 9, fill: '#64748b' }}
                          tickLine={false}
                          tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-slate-900 text-white p-2 rounded shadow text-[11px] font-mono">
                                  <p className="font-bold">{data.date}</p>
                                  <p className="text-emerald-400 font-bold">{formatINR(data.price)}</p>
                                  <p className="text-slate-400 text-[10px]">Change: ₹{data.change}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={selectedMaterial.movementDirection === 'down' ? '#e11d48' : '#2563eb'}
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#adminChartGrad)"
                        />
                      </AreaChart>
                    ) : (
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="formattedDate" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} tickFormatter={(val) => `₹${Math.round(val / 1000)}k`} />
                        <Tooltip />
                        <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} dot={false} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Session Fixing Recorder (Inserts into 50 Records) */}
              <form
                onSubmit={handleDeskRecordSession}
                className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                    <span>Record New Fixing Session</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Appends to 50 Records</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6 relative">
                    <span className="absolute left-2.5 top-2 font-mono font-bold text-slate-400 text-xs">₹</span>
                    <input
                      type="number"
                      step="50"
                      required
                      value={deskPriceInput}
                      onChange={(e) => setDeskPriceInput(e.target.value)}
                      placeholder="Spot Rate"
                      className="w-full pl-6 pr-2 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <button
                      type="submit"
                      className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1 cursor-pointer"
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
                  className="w-full px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded text-slate-800"
                />
              </form>

              {/* Full 50 Records Audit Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                    <History className="w-3.5 h-3.5 text-slate-500" />
                    <span>Past 50 Recorded Sessions</span>
                  </span>

                  <button
                    onClick={() => handleExportCSV(selectedMaterial)}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export CSV</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold uppercase text-[9px] border-b border-slate-200">
                      <tr>
                        <th className="py-1.5 px-2.5">#</th>
                        <th className="py-1.5 px-2">Date</th>
                        <th className="py-1.5 px-2 text-right">Price / MT</th>
                        <th className="py-1.5 px-2 text-right">Ups / Downs</th>
                        <th className="py-1.5 px-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(selectedMaterial.historicalPrices || [])
                        .slice()
                        .reverse()
                        .map((p, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1 px-2.5 font-mono text-slate-400 text-[10px]">
                              #{idx + 1}
                            </td>
                            <td className="py-1 px-2 text-slate-700 text-[11px] whitespace-nowrap">
                              {p.date}
                            </td>
                            <td className="py-1 px-2 text-right font-mono font-bold text-slate-900 text-[11px]">
                              {formatINR(p.price)}
                            </td>
                            <td className="py-1 px-2 text-right">
                              <span
                                className={`font-mono font-bold text-[10px] inline-flex items-center ${
                                  p.movementDirection === 'up'
                                    ? 'text-emerald-700'
                                    : p.movementDirection === 'down'
                                    ? 'text-rose-700'
                                    : 'text-slate-500'
                                }`}
                              >
                                {p.movementDirection === 'up' && '▲ +'}
                                {p.movementDirection === 'down' && '▼ '}
                                ₹{p.priceChange || 0}
                              </span>
                            </td>
                            <td className="py-1 px-2 text-slate-500 text-[10px] truncate max-w-[120px]">
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
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500 shadow-xs">
              Select any Mandi rate row from the left to inspect its complete 50-session price history and live charts.
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* Modal 1: WhatsApp Daily Bulletin Parser                   */}
      {/* ========================================================= */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Update Multi-City Prices via WhatsApp Broadcast
                </h3>
              </div>
              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Paste the morning or evening WhatsApp broadcast text from the Mandi Gobindgarh Trading Desk.
              The parser automatically normalizes unicode characters, extracts Ingot, Billet, and Scrap rates
              across all mandis, calculates ups/downs against previous rates, and archives previous sessions into the 50-record audit store.
            </p>

            <div className="space-y-2">
              <textarea
                rows={10}
                value={rawBroadcastInput}
                onChange={(e) => {
                  setRawBroadcastInput(e.target.value);
                  setParsePreview(null);
                }}
                placeholder="Paste the daily Mandi WhatsApp text here..."
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />

              {parsePreview && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-950 space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span>Parsed Bulletin Summary:</span>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white rounded font-mono text-[10px]">
                      {parsePreview.materials.length} Rates Detected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                    <div>Date: <strong>{parsePreview.bulletin.dateStr}</strong></div>
                    <div>Time: <strong>{parsePreview.bulletin.timeStr}</strong></div>
                    <div>USD/INR: <strong>₹{parsePreview.bulletin.usdInrRate}</strong></div>
                    <div>Trend: <strong>{parsePreview.bulletin.overallTrend}</strong></div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePreviewBroadcast}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-bold text-xs transition cursor-pointer text-center touch-manipulation"
              >
                Validate / Preview
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setBroadcastModalOpen(false)}
                  className="flex-1 sm:flex-initial px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-xs font-medium hover:bg-slate-50 cursor-pointer text-center touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyBroadcast}
                  className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold shadow transition flex items-center justify-center space-x-1.5 cursor-pointer touch-manipulation"
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-slate-300 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900">
              Update Spot Rate: {editingMaterial.materialName} ({editingMaterial.mandiCity}) ᵃˢᵗ
            </h3>
            <p className="text-xs text-slate-500">
              Previous price was ₹{editingMaterial.currentPrice.toLocaleString('en-IN')}. New price will be
              recorded as the 50th historical session record.
            </p>

            <form onSubmit={handleModalPriceUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Spot Price (₹ / Metric Ton):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono font-bold text-slate-500 text-sm">₹</span>
                  <input
                    type="number"
                    step="50"
                    required
                    value={modalNewPrice}
                    onChange={(e) => setModalNewPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fixing Session Notes:
                </label>
                <textarea
                  rows={2}
                  value={modalUpdateNotes}
                  onChange={(e) => setModalUpdateNotes(e.target.value)}
                  placeholder="e.g. Mandi Gobindgarh noon fixing. Sales Tax extra."
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-50 cursor-pointer touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold cursor-pointer touch-manipulation"
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
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-slate-300 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900">
              Add New Mandi Price Rate
            </h3>

            <form onSubmit={handleAddNewMaterial} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Primary Category:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAddMainCategory('raw_materials')}
                    className={`py-1.5 px-3 rounded text-xs font-bold border cursor-pointer ${
                      addMainCategory === 'raw_materials'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    Raw Material
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddMainCategory('scrap_materials')}
                    className={`py-1.5 px-3 rounded text-xs font-bold border cursor-pointer ${
                      addMainCategory === 'scrap_materials'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    Scrap Material
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Material Name (e.g. Ingot, Billet, HMS Scrap):
                </label>
                <input
                  type="text"
                  required
                  value={addMaterialName}
                  onChange={(e) => setAddMaterialName(e.target.value)}
                  placeholder="e.g. Ingot, Billet, Melting Scrap"
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Mandi / Place Name (e.g. Ludhiana, Mandi Gobindgarh):
                </label>
                <input
                  type="text"
                  required
                  value={addMandiCity}
                  onChange={(e) => setAddMandiCity(e.target.value)}
                  placeholder="e.g. Mandi Gobindgarh, Ludhiana (MS)"
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Spot Price (₹ / MT):
                  </label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={addInitialPrice}
                    onChange={(e) => setAddInitialPrice(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Symbol Code:</label>
                  <input
                    type="text"
                    value={addSymbol}
                    onChange={(e) => setAddSymbol(e.target.value)}
                    placeholder="Optional (Auto)"
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes:</label>
                <input
                  type="text"
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  placeholder="e.g. Applicable Sales Tax (ast) extra ex-mandi"
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3.5 py-2 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-50 cursor-pointer touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold cursor-pointer touch-manipulation"
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
