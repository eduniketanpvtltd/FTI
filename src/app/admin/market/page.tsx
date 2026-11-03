'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
import { MarketMaterial } from '@/types';
import {
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Clock,
  Layers,
  History,
} from 'lucide-react';

export default function AdminMarketManagementPage() {
  const { marketMaterials, updateMarketPrice, addMarketMaterial, lastMarketSyncTime } = useStore();

  const [activeTab, setActiveTab] = useState<'raw_materials' | 'scrap_materials'>('raw_materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<MarketMaterial | null>(null);

  // Edit Price Modal / Drawer State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MarketMaterial | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [updateNotes, setUpdateNotes] = useState<string>('');
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // Add Material Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addSymbol, setAddSymbol] = useState('');
  const [addCategory, setAddCategory] = useState<'raw_materials' | 'scrap_materials'>('raw_materials');
  const [addInitialPrice, setAddInitialPrice] = useState<number>(50000);
  const [addNotes, setAddNotes] = useState('');

  const filtered = marketMaterials.filter((m) => {
    const matchesTab = m.categorySlug === activeTab;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const openPriceUpdateModal = (mat: MarketMaterial) => {
    setEditingMaterial(mat);
    setNewPrice(mat.currentPrice);
    setUpdateNotes('');
    setEditModalOpen(true);
  };

  const handlePriceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;

    updateMarketPrice(editingMaterial.id, newPrice, updateNotes);
    setUpdateSuccess(`Price for ${editingMaterial.name} updated to ₹${newPrice.toLocaleString('en-IN')}`);
    setEditModalOpen(false);

    setTimeout(() => {
      setUpdateSuccess(null);
    }, 4000);
  };

  const handleAddNewMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    addMarketMaterial({
      categorySlug: addCategory,
      categoryName: addCategory === 'raw_materials' ? 'Raw Materials' : 'Scrap Materials',
      name: addName,
      symbol: addSymbol.toUpperCase(),
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
      notes: addNotes,
    });

    setAddModalOpen(false);
    setAddName('');
    setAddSymbol('');
    setAddNotes('');
    setUpdateSuccess(`New material ${addName} added to live price desk.`);
    setTimeout(() => setUpdateSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Market Price Index & Fixing Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin controls for primary steel benchmarks, Mandi Gobindgarh scrap fixings, and historical movements.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded shadow transition flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Material</span>
        </button>
      </div>

      {updateSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-md flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{updateSuccess}</span>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('raw_materials')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition ${
              activeTab === 'raw_materials'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Raw Materials Desk ({marketMaterials.filter((m) => m.categorySlug === 'raw_materials').length})
          </button>
          <button
            onClick={() => setActiveTab('scrap_materials')}
            className={`px-3 py-1.5 text-xs font-bold rounded transition ${
              activeTab === 'scrap_materials'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Scrap Metal Desk ({marketMaterials.filter((m) => m.categorySlug === 'scrap_materials').length})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900"
          />
        </div>
      </div>

      {/* Materials Price Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                <th className="py-3 px-4">Material</th>
                <th className="py-3 px-4">Symbol</th>
                <th className="py-3 px-4 text-right">Current Price</th>
                <th className="py-3 px-4 text-right">Previous Price</th>
                <th className="py-3 px-4 text-right">Movement</th>
                <th className="py-3 px-4">Last Updated</th>
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
                      <p className="font-bold text-slate-900">{mat.name}</p>
                      <p className="text-[10px] text-slate-400">{mat.notes}</p>
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
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : isDown ? <ArrowDownRight className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                        <span>{Math.abs(mat.percentageChange)}%</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {formatIndianDateTime(mat.lastUpdatedAt)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openPriceUpdateModal(mat)}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded text-xs font-semibold inline-flex items-center space-x-1 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Update Price</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Price Modal */}
      {editModalOpen && editingMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              Update Spot Rate: {editingMaterial.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Current benchmark: <span className="font-bold font-mono text-slate-800">{formatINR(editingMaterial.currentPrice)} / MT</span>
            </p>

            <form onSubmit={handlePriceUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  New Price per Metric Ton (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="100"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-sm font-mono font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Market Remarks / Mandi Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="e.g. Mandi Gobindgarh secondary billet rate adjustment..."
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-slate-700 leading-tight">
                <span className="font-bold text-blue-900 block mb-0.5">Audit Trail Notice:</span>
                This update will record the previous price ({formatINR(editingMaterial.currentPrice)}),
                append a new historical data point for stock charts, and automatically notify customer dashboards within 5 minutes.
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded shadow"
                >
                  Commit Price Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Material Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              Add Material to Market Index
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Create a new raw material or scrap listing for live tracking.
            </p>

            <form onSubmit={handleAddNewMaterial} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Category Desk</label>
                <select
                  value={addCategory}
                  onChange={(e) => setAddCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                >
                  <option value="raw_materials">Raw Materials</option>
                  <option value="scrap_materials">Scrap Materials</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Material Name</label>
                <input
                  type="text"
                  placeholder="e.g. Stainless Steel 316 Scrap"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Trading Symbol / Code</label>
                <input
                  type="text"
                  placeholder="e.g. SS316-SCRAP"
                  value={addSymbol}
                  onChange={(e) => setAddSymbol(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Initial Price per Metric Ton (₹)</label>
                <input
                  type="number"
                  step="500"
                  value={addInitialPrice}
                  onChange={(e) => setAddInitialPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Desk Notes / Source Hub</label>
                <input
                  type="text"
                  placeholder="e.g. Indicative secondary hub rates ex-Jalna"
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="bg-slate-100 text-slate-700 font-semibold px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded shadow"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
