'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDateTime, formatIndianDate } from '@/lib/utils';
import { MarketMaterial, MarketMainCategory } from '@/types';
import { DEFAULT_MANDI_BULLETIN_TEXT, parseMandiBroadcast } from '@/lib/mandi-parser';
import {
  TrendingUp,
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
} from 'lucide-react';

export default function AdminMarketManagementPage() {
  const {
    marketMaterials,
    mandiBulletin,
    updateMarketPrice,
    updateMandiBulletin,
    addMarketMaterial,
    lastMarketSyncTime,
  } = useStore();

  // Level 1: Primary Category ('raw_materials' vs 'scrap_materials' vs 'all')
  const [mainCategory, setMainCategory] = useState<'all' | 'raw_materials' | 'scrap_materials'>('all');

  // Level 2: Specific Material Group filter ('all', 'Ingot', 'Billet', etc.)
  const [selectedMaterialGroup, setSelectedMaterialGroup] = useState<string>('all');

  const [searchTerm, setSearchTerm] = useState('');

  // WhatsApp Broadcast Parser State
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [rawBroadcastInput, setRawBroadcastInput] = useState(
    mandiBulletin?.rawMessageText || DEFAULT_MANDI_BULLETIN_TEXT
  );
  const [parsePreview, setParsePreview] = useState<{
    bulletin: any;
    materials: MarketMaterial[];
  } | null>(null);

  // Edit Price Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MarketMaterial | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [updateNotes, setUpdateNotes] = useState<string>('');
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // View Past 50 Records Modal State
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyMaterial, setHistoryMaterial] = useState<MarketMaterial | null>(null);

  // Add Material Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addMandiCity, setAddMandiCity] = useState('');
  const [addMaterialName, setAddMaterialName] = useState('Ingot');
  const [addMainCategory, setAddMainCategory] = useState<MarketMainCategory>('raw_materials');
  const [addSymbol, setAddSymbol] = useState('');
  const [addInitialPrice, setAddInitialPrice] = useState<number>(45000);
  const [addNotes, setAddNotes] = useState('');

  // Filter materials by primary category
  const categoryMaterials = useMemo(() => {
    if (mainCategory === 'all') return marketMaterials;
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

  // Distinct Material Names for Level 2 selector
  const availableMaterialNames = useMemo(() => {
    const set = new Set<string>();
    categoryMaterials.forEach((m) => {
      if (m.materialName) set.add(m.materialName);
      else if (m.categoryName) set.add(m.categoryName);
    });
    return Array.from(set);
  }, [categoryMaterials]);

  // Filtered by Level 2 and Search
  const filtered = useMemo(() => {
    return categoryMaterials.filter((m) => {
      const matchesGroup =
        selectedMaterialGroup === 'all' ||
        m.materialName === selectedMaterialGroup ||
        m.categoryName === selectedMaterialGroup;

      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.mandiCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.hubCity && m.hubCity.toLowerCase().includes(searchTerm.toLowerCase())) ||
        m.symbol.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesGroup && matchesSearch;
    });
  }, [categoryMaterials, selectedMaterialGroup, searchTerm]);

  // Open edit price modal
  const openPriceUpdateModal = (mat: MarketMaterial) => {
    setEditingMaterial(mat);
    setNewPrice(mat.currentPrice);
    setUpdateNotes(mat.notes || '');
    setEditModalOpen(true);
  };

  // Open past 50 records history modal
  const openHistoryModal = (mat: MarketMaterial) => {
    setHistoryMaterial(mat);
    setHistoryModalOpen(true);
  };

  // Save updated price
  const handlePriceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;

    updateMarketPrice(editingMaterial.id, newPrice, updateNotes);
    setUpdateSuccess(
      `Spot rate for ${editingMaterial.materialName} (${editingMaterial.mandiCity}) updated to ₹${newPrice.toLocaleString('en-IN')}`
    );
    setEditModalOpen(false);

    setTimeout(() => {
      setUpdateSuccess(null);
    }, 4000);
  };

  // Quick adjust price (+100, +200, -100, -200)
  const handleQuickAdjust = (mat: MarketMaterial, delta: number) => {
    const updated = mat.currentPrice + delta;
    updateMarketPrice(
      mat.id,
      updated,
      `Quick Desk Adjustment: ${delta > 0 ? '+' : ''}₹${delta} (${new Date().toLocaleTimeString()})`
    );
    setUpdateSuccess(
      `${mat.materialName} (${mat.mandiCity}): Adjusted ${delta > 0 ? '+' : ''}₹${delta} -> ₹${updated.toLocaleString('en-IN')}`
    );
    setTimeout(() => setUpdateSuccess(null), 3000);
  };

  // Preview or parse broadcast
  const handlePreviewBroadcast = () => {
    try {
      const res = parseMandiBroadcast(rawBroadcastInput);
      setParsePreview(res);
    } catch (err: any) {
      alert('Error parsing broadcast: ' + err.message);
    }
  };

  // Apply parsed broadcast
  const handleApplyBroadcast = () => {
    try {
      updateMandiBulletin(rawBroadcastInput);
      setUpdateSuccess(
        `Successfully updated live market rates from WhatsApp bulletin (${parsePreview?.materials.length || 38} rates updated)!`
      );
      setBroadcastModalOpen(false);
      setParsePreview(null);
      setTimeout(() => setUpdateSuccess(null), 5000);
    } catch (err: any) {
      alert('Error applying broadcast: ' + err.message);
    }
  };

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              ADMIN TRADING DESK
            </span>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded border border-indigo-200 flex items-center space-x-1">
              <History className="w-3.5 h-3.5" />
              <span>Past 50 Records Auto-Saved</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Mandi Gobindgarh Spot Rate Desk & Multi-City Manager
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organized by <strong>Raw Materials</strong> and <strong>Scrap Materials</strong>. Update spot prices,
            adjust rapid steppers (+/- 100/200), and inspect past 50 historical records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/market"
            target="_blank"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded shadow-xs flex items-center space-x-1.5 transition"
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
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded shadow transition flex items-center space-x-1.5 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Paste WhatsApp Broadcast</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded shadow transition flex items-center space-x-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Mandi</span>
          </button>
        </div>
      </div>

      {updateSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-md flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-semibold">{updateSuccess}</span>
        </div>
      )}

      {/* Live Bulletin Summary Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Fixing Session</span>
            <span className="font-bold text-white">
              🗓️ {mandiBulletin?.dateStr || '28-OCTOBER-2026'} ({mandiBulletin?.timeStr || '12:00'})
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase">USD / INR</span>
            <span className="font-bold text-amber-400">
              🇺🇸 1($) = {mandiBulletin?.usdInrRate || 95.04} (₹)
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Sentiment</span>
            <span
              className={`font-bold ${
                mandiBulletin?.overallTrend === 'up' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {mandiBulletin?.trendText || 'Mandi Trend downwards'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Active Hubs</span>
            <span className="font-bold text-blue-400">{marketMaterials.length} Mandis</span>
          </div>
        </div>

        <button
          onClick={() => {
            setRawBroadcastInput(mandiBulletin?.rawMessageText || DEFAULT_MANDI_BULLETIN_TEXT);
            setParsePreview(null);
            setBroadcastModalOpen(true);
          }}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-bold transition flex items-center space-x-1.5 self-start md:self-auto cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5 text-blue-400" />
          <span>Update via Daily Broadcast</span>
        </button>
      </div>

      {/* LEVEL 1: Primary Category Tabs & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Level 1: Raw Materials vs Scrap Materials */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setMainCategory('all');
                setSelectedMaterialGroup('all');
              }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                mainCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Categories ({marketMaterials.length})
            </button>

            <button
              onClick={() => {
                setMainCategory('raw_materials');
                setSelectedMaterialGroup('all');
              }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 ${
                mainCategory === 'raw_materials'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Raw Materials ({rawCount})</span>
            </button>

            <button
              onClick={() => {
                setMainCategory('scrap_materials');
                setSelectedMaterialGroup('all');
              }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center space-x-1.5 ${
                mainCategory === 'scrap_materials'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Scrap Materials ({scrapCount})</span>
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search mandi, material, or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
            />
          </div>
        </div>

        {/* LEVEL 2: Material Name Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center space-x-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Materials:</span>
          </span>

          <button
            onClick={() => setSelectedMaterialGroup('all')}
            className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition shrink-0 ${
              selectedMaterialGroup === 'all'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Materials ({categoryMaterials.length})
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
                className={`px-2.5 py-0.5 text-xs font-bold rounded-full transition shrink-0 flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
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

      {/* LEVEL 3: Mandis & Places Price Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200 z-10">
              <tr>
                <th className="py-3 px-3.5">Category</th>
                <th className="py-3 px-3.5">Material Name</th>
                <th className="py-3 px-3.5">Mandi / Place</th>
                <th className="py-3 px-3 text-right">Current Spot ᵃˢᵗ</th>
                <th className="py-3 px-3 text-right">Ups / Downs</th>
                <th className="py-3 px-3 text-center">Quick Adjust</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((mat) => {
                const isUp = mat.movementDirection === 'up';
                const isDown = mat.movementDirection === 'down';

                return (
                  <tr key={mat.id} className="hover:bg-slate-50 transition">
                    {/* Category */}
                    <td className="py-2.5 px-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                          mat.mainCategory === 'scrap_materials'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}
                      >
                        {mat.mainCategory === 'scrap_materials' ? 'Scrap' : 'Raw'}
                      </span>
                    </td>

                    {/* Material Name */}
                    <td className="py-2.5 px-3.5">
                      <span className="font-bold text-slate-900 text-xs">{mat.materialName}</span>
                    </td>

                    {/* Mandi / Place */}
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 text-xs">{mat.mandiCity}</p>
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

                    {/* Ups or Downs */}
                    <td className="py-2.5 px-3 text-right">
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

                    {/* Quick Adjust Steppers */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center space-x-1 font-mono text-[10px]">
                        <button
                          onClick={() => handleQuickAdjust(mat, -200)}
                          className="px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold"
                          title="Decrease price by ₹200"
                        >
                          -200
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(mat, -100)}
                          className="px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold"
                          title="Decrease price by ₹100"
                        >
                          -100
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(mat, 100)}
                          className="px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold"
                          title="Increase price by ₹100"
                        >
                          +100
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(mat, 200)}
                          className="px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold"
                          title="Increase price by ₹200"
                        >
                          +200
                        </button>
                      </div>
                    </td>

                    {/* Actions: Edit & 50 Records */}
                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openHistoryModal(mat)}
                          className="px-2 py-1 text-[10px] font-mono font-bold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded border border-slate-200 transition"
                          title="View complete 50 records audit history"
                        >
                          50 Rec
                        </button>

                        <button
                          onClick={() => openPriceUpdateModal(mat)}
                          className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition flex items-center space-x-1"
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

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500">
            No mandi rates found. Try adjusting your search term or category.
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. Modal: Paste WhatsApp Daily Bulletin                   */}
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
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Paste the morning or evening WhatsApp broadcast text from the Mandi Gobindgarh Trading Desk.
              The parser automatically normalizes unicode characters, extracts Ingot, Billet, and Scrap rates
              across all mandis, and archives previous sessions into the 50-record audit store.
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

            <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePreviewBroadcast}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-bold text-xs transition"
              >
                Validate / Preview
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setBroadcastModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-xs font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyBroadcast}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold shadow transition flex items-center space-x-1.5"
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
      {/* 2. Modal: Edit Single Material Price                      */}
      {/* ========================================================= */}
      {editModalOpen && editingMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-300 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Update Spot Rate: {editingMaterial.materialName} ({editingMaterial.mandiCity}) ᵃˢᵗ
            </h3>
            <p className="text-xs text-slate-500">
              Previous price was ₹{editingMaterial.currentPrice.toLocaleString('en-IN')}. New price will be
              recorded as the 50th historical session record.
            </p>

            <form onSubmit={handlePriceUpdate} className="space-y-4">
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
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
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
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="e.g. Mandi Gobindgarh noon fixing. Sales Tax extra."
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold"
                >
                  Save New Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. Modal: View Past 50 Records for Mandi                  */}
      {/* ========================================================= */}
      {historyModalOpen && historyMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {historyMaterial.symbol}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {historyMaterial.mainCategory === 'raw_materials' ? 'Raw Material' : 'Scrap Material'}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mt-1">
                  {historyMaterial.materialName} ({historyMaterial.mandiCity}) - Past 50 Records
                </h3>
              </div>

              <button
                onClick={() => setHistoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Current Spot: <strong className="text-slate-900 font-mono">{formatINR(historyMaterial.currentPrice)}</strong>
              </span>
              <span className="text-slate-500">
                50-Rec High: <strong className="text-emerald-700 font-mono">{formatINR(historyMaterial.highPrice)}</strong> |{' '}
                Low: <strong className="text-rose-700 font-mono">{formatINR(historyMaterial.lowPrice)}</strong>
              </span>
            </div>

            {/* Audit Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3"># Session</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3 text-right">Price / MT</th>
                    <th className="py-2 px-3 text-right">Ups / Downs</th>
                    <th className="py-2 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(historyMaterial.historicalPrices || [])
                    .slice()
                    .reverse()
                    .map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-slate-400 text-[11px]">
                          #{idx + 1}
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-800">{p.date}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          {formatINR(p.price)}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span
                            className={`font-mono font-bold text-[11px] inline-flex items-center ${
                              p.movementDirection === 'up'
                                ? 'text-emerald-700'
                                : p.movementDirection === 'down'
                                ? 'text-rose-700'
                                : 'text-slate-500'
                            }`}
                          >
                            {p.movementDirection === 'up' && '▲ +'}
                            {p.movementDirection === 'down' && '▼ -'}
                            ₹{Math.abs(p.priceChange || 0)}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-500 text-[11px] truncate max-w-[180px]">
                          {p.notes || 'Session fixing'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-200 pt-3 flex items-center justify-end">
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. Modal: Add New Material / Mandi Hub                    */}
      {/* ========================================================= */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-300 space-y-4">
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
                    className={`py-1.5 px-3 rounded text-xs font-bold border ${
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
                    className={`py-1.5 px-3 rounded text-xs font-bold border ${
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
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold"
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
