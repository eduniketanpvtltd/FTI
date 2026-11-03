'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDateTime } from '@/lib/utils';
import { MarketMaterial } from '@/types';
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

  const [activeTab, setActiveTab] = useState<'all' | 'ingot' | 'scrap' | 'billet' | 'benchmark'>('all');
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

  // Add Material Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addSymbol, setAddSymbol] = useState('');
  const [addCategory, setAddCategory] = useState<'ingot' | 'scrap' | 'billet' | 'benchmark'>('ingot');
  const [addInitialPrice, setAddInitialPrice] = useState<number>(45000);
  const [addNotes, setAddNotes] = useState('');

  const filtered = marketMaterials.filter((m) => {
    const matchesTab = activeTab === 'all' || m.categorySlug === activeTab;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.hubCity && m.hubCity.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const openPriceUpdateModal = (mat: MarketMaterial) => {
    setEditingMaterial(mat);
    setNewPrice(mat.currentPrice);
    setUpdateNotes(mat.notes || '');
    setEditModalOpen(true);
  };

  const handlePriceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;

    updateMarketPrice(editingMaterial.id, newPrice, updateNotes);
    setUpdateSuccess(`Spot rate for ${editingMaterial.name} updated to ₹${newPrice.toLocaleString('en-IN')}`);
    setEditModalOpen(false);

    setTimeout(() => {
      setUpdateSuccess(null);
    }, 4000);
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
    const catNameMap: Record<string, string> = {
      ingot: 'Ingot',
      scrap: 'Scrap',
      billet: 'Billet',
      benchmark: 'Mandi Benchmark',
    };

    addMarketMaterial({
      categorySlug: addCategory,
      categoryName: catNameMap[addCategory] || 'Steel Hub',
      name: addName,
      symbol: addSymbol.toUpperCase() || `${addCategory.toUpperCase()}-${addName.substring(0, 3).toUpperCase()}`,
      hubCity: addName,
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
      notes: addNotes || `${catNameMap[addCategory]} spot benchmark ex-${addName}. Applicable Sales Tax (ast) extra.`,
    });

    setAddModalOpen(false);
    setAddName('');
    setAddSymbol('');
    setAddNotes('');
    setUpdateSuccess(`New hub rate ${addName} added to live price desk.`);
    setTimeout(() => setUpdateSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Mandi Gobindgarh Live Price Desk & Bulletin Manager
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin controls for primary & secondary steel fixings, Mandi Gobindgarh benchmarks, and WhatsApp broadcast parsing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick link to view user's live view */}
          <Link
            href="/market"
            target="_blank"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded shadow-xs flex items-center space-x-1.5 transition"
          >
            <span>Preview Live Customer View</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          {/* Quick Paste WhatsApp Broadcast Button */}
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
            <span>Add Single Hub</span>
          </button>
        </div>
      </div>

      {updateSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-md flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{updateSuccess}</span>
        </div>
      )}

      {/* Live Bulletin Summary Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Current Fixing</span>
            <span className="font-bold text-white">
              🗓️ {mandiBulletin?.dateStr || '28-OCTOBER-2026'} ({mandiBulletin?.timeStr || '12:00'})
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Forex Spot</span>
            <span className="font-bold text-amber-400">
              🇺🇸 1($) = {mandiBulletin?.usdInrRate || 95.04} (₹) 🇮🇳
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
            <span className="text-[10px] text-slate-400 block uppercase">Total Active Rates</span>
            <span className="font-bold text-blue-400">{marketMaterials.length} Market Hubs</span>
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

      {/* Tabs & Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Rates ({marketMaterials.length})
          </button>

          <button
            onClick={() => setActiveTab('ingot')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition whitespace-nowrap ${
              activeTab === 'ingot'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Ingot ({marketMaterials.filter((m) => m.categorySlug === 'ingot').length})
          </button>

          <button
            onClick={() => setActiveTab('scrap')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition whitespace-nowrap ${
              activeTab === 'scrap'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Scrap ({marketMaterials.filter((m) => m.categorySlug === 'scrap').length})
          </button>

          <button
            onClick={() => setActiveTab('billet')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition whitespace-nowrap ${
              activeTab === 'billet'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Billet ({marketMaterials.filter((m) => m.categorySlug === 'billet').length})
          </button>

          <button
            onClick={() => setActiveTab('benchmark')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition whitespace-nowrap ${
              activeTab === 'benchmark'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Mandi Benchmark ({marketMaterials.filter((m) => m.categorySlug === 'benchmark').length})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search hub or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
          />
        </div>
      </div>

      {/* Materials Price Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200 z-10">
              <tr>
                <th className="py-3 px-4">Market Hub / Material</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Symbol</th>
                <th className="py-3 px-4 text-right">Current Price ᵃˢᵗ</th>
                <th className="py-3 px-4 text-right">Previous Price</th>
                <th className="py-3 px-4 text-right">Day's Change (₹)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((mat) => {
                const isUp = mat.movementDirection === 'up';
                const isDown = mat.movementDirection === 'down';

                return (
                  <tr key={mat.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{mat.name} ᵃˢᵗ</p>
                      <p className="text-[10px] text-slate-400">{mat.notes}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase font-mono">
                        {mat.categoryName}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {mat.symbol}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      {formatINR(mat.currentPrice)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {formatINR(mat.previousPrice)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center space-x-0.5 px-2 py-0.5 rounded text-xs font-bold font-mono ${
                          isUp
                            ? 'bg-emerald-100 text-emerald-800'
                            : isDown
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isUp ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : isDown ? (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        ) : (
                          <Minus className="w-3.5 h-3.5" />
                        )}
                        <span>{mat.priceChange > 0 ? `+${mat.priceChange}` : mat.priceChange}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openPriceUpdateModal(mat)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center space-x-1 transition cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Price</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. Modal: Paste & Parse WhatsApp / SMS Live Broadcast      */}
      {/* ========================================================= */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <span>Paste & Parse Live WhatsApp Broadcast</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Paste the daily Mandi Gobindgarh WhatsApp message. The engine will parse all 38 spot rates, forex rates, and market sentiment.
                </p>
              </div>

              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Paste Message Text:</span>
                <button
                  type="button"
                  onClick={() => setRawBroadcastInput(DEFAULT_MANDI_BULLETIN_TEXT)}
                  className="text-blue-600 hover:text-blue-700 font-semibold underline text-[11px]"
                >
                  Load Sample Oct-28 Message
                </button>
              </div>

              <textarea
                rows={12}
                value={rawBroadcastInput}
                onChange={(e) => {
                  setRawBroadcastInput(e.target.value);
                  setParsePreview(null);
                }}
                placeholder="Paste the daily Mandi WhatsApp text here..."
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />

              {/* Preview Box if parsed */}
              {parsePreview && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-950 space-y-2">
                  <div className="flex items-center justify-between font-bold">
                    <span>Parsed Summary:</span>
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
                  <div className="text-[11px] text-emerald-800">
                    Includes: {parsePreview.materials.filter((m) => m.categorySlug === 'benchmark').length} Benchmarks,{' '}
                    {parsePreview.materials.filter((m) => m.categorySlug === 'ingot').length} Ingot hubs,{' '}
                    {parsePreview.materials.filter((m) => m.categorySlug === 'scrap').length} Scrap hubs,{' '}
                    {parsePreview.materials.filter((m) => m.categorySlug === 'billet').length} Billet hubs.
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
                  <span>Update All Live Prices</span>
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
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-slate-300 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Update Spot Rate: {editingMaterial.name} ᵃˢᵗ
            </h3>
            <p className="text-xs text-slate-500">
              Editing hub {editingMaterial.symbol} ({editingMaterial.categoryName}). Previous price was ₹{editingMaterial.currentPrice.toLocaleString('en-IN')}.
            </p>

            <form onSubmit={handlePriceUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Spot Price (₹ / Metric Ton):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-mono font-bold text-slate-500 text-sm">₹</span>
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
                  Fixing Notes:
                </label>
                <textarea
                  rows={2}
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="e.g. Applicable Sales Tax extra ex-mandi"
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
      {/* 3. Modal: Add New Material / Hub                          */}
      {/* ========================================================= */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-slate-300 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Add New Mandi Trading Hub
            </h3>

            <form onSubmit={handleAddNewMaterial} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hub / City Name (e.g. Ludhiana (EN8D)):
                </label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="e.g. Ludhiana (EN8D)"
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category:</label>
                  <select
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value as any)}
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
                  >
                    <option value="ingot">Ingot</option>
                    <option value="scrap">Scrap</option>
                    <option value="billet">Billet</option>
                    <option value="benchmark">Mandi Benchmark</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Symbol Code:</label>
                  <input
                    type="text"
                    value={addSymbol}
                    onChange={(e) => setAddSymbol(e.target.value)}
                    placeholder="e.g. INGOT-LDH"
                    className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Spot Price (₹ / Metric Ton):
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
                  Add Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
