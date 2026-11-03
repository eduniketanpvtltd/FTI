'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { useStore } from '@/lib/store-context';
import { formatINR, formatIndianDate, formatIndianDateTime } from '@/lib/utils';
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
  RefreshCw,
  Search,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Download,
  X,
  ShieldCheck,
  Activity,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

export default function MarketPage() {
  const { marketMaterials, lastMarketSyncTime, refreshMarketPrices } = useStore();

  const [activeTab, setActiveTab] = useState<'raw_materials' | 'scrap_materials'>('raw_materials');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<MarketMaterial | null>(null);
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'>('1M');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Manual refresh animation
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshMarketPrices();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Filter materials based on tab and search
  const filteredMaterials = useMemo(() => {
    return marketMaterials.filter((m) => {
      const matchesTab = m.categorySlug === activeTab;
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [marketMaterials, activeTab, searchTerm]);

  // Set default selected material if none chosen
  React.useEffect(() => {
    if (!selectedMaterial && filteredMaterials.length > 0) {
      setSelectedMaterial(filteredMaterials[0]);
    }
  }, [selectedMaterial, filteredMaterials]);

  // Filter historical data points based on chosen time range
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

  // Export CSV of historical prices
  const handleExportCSV = (mat: MarketMaterial) => {
    const headers = ['Date', 'Price (INR)', 'Unit', 'Material Name', 'Symbol'];
    const rows = mat.historicalPrices.map((p) => [
      p.date,
      p.price,
      mat.unit,
      `"${mat.name}"`,
      mat.symbol,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${mat.symbol}_price_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CustomerLayout>
      {/* 1. Market Dashboard Header adhering to Section 9.1 */}
      <div className="bg-slate-900 text-white py-6 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-200">Home</Link>
            <span>/</span>
            <span className="text-blue-400 font-semibold">Industrial Metal & Scrap Market</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Industrial Market Price Tracking Desk
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LIVE DESK</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Admin-controlled spot benchmarks across Mandi Gobindgarh, Raipur, Mumbai & Alang ship-breaking yards.
              </p>
            </div>

            {/* Timestamps & 5-minute Auto-sync indicator (Indian format) */}
            <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-lg text-xs">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">
                  Last Updated: {formatIndianDate(lastMarketSyncTime)}
                </span>
                <span className="font-bold text-slate-200">
                  Time: {new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).format(lastMarketSyncTime)}
                </span>
              </div>

              <button
                onClick={handleManualRefresh}
                className={`p-2 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition ${
                  isRefreshing ? 'animate-spin text-blue-400' : ''
                }`}
                title="Refresh Market Prices"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs (Raw Materials vs Scrap Materials) */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setActiveTab('raw_materials');
                setSelectedMaterial(null);
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-md transition flex items-center space-x-2 ${
                activeTab === 'raw_materials'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>1. Raw Material Prices</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('scrap_materials');
                setSelectedMaterial(null);
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-md transition flex items-center space-x-2 ${
                activeTab === 'scrap_materials'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>2. Scrap Material Prices</span>
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter materials (e.g. Billet, HMS, Copper)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-500 text-slate-900"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Market Price Listing Table (Section 9.2) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {activeTab === 'raw_materials' ? 'Raw Materials Spot Benchmark' : 'Industrial Scrap Metal Rates'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Click any row to open stock-market-style analytics and historical charts.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  Unit: ₹ / MT
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                      <th className="py-2.5 px-3">Material</th>
                      <th className="py-2.5 px-3 text-right">Price / MT</th>
                      <th className="py-2.5 px-3 text-right">Movement</th>
                      <th className="py-2.5 px-3 text-right">Change (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
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
                              ? 'bg-blue-50/80 font-semibold'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center space-x-2">
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                              <div>
                                <p className="font-bold text-slate-900">{mat.name}</p>
                                <p className="text-[10px] text-slate-500 font-mono">{mat.symbol}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                            {formatINR(mat.currentPrice)}
                          </td>

                          <td className="py-3 px-3 text-right">
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
                              <span>{Math.abs(mat.percentageChange)}%</span>
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right font-mono text-xs">
                            <span
                              className={
                                isUp
                                  ? 'text-emerald-700 font-semibold'
                                  : isDown
                                  ? 'text-rose-700 font-semibold'
                                  : 'text-slate-500'
                              }
                            >
                              {mat.priceChange > 0 ? '+' : ''}
                              {formatINR(mat.priceChange)}
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
                  No materials found matching your query.
                </div>
              )}
            </div>

            {/* Helpful Market Disclaimer Box */}
            <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600">
              <span className="font-bold text-slate-900 block mb-1">
                About FTI Price Indexing:
              </span>
              <p className="leading-relaxed">
                All prices reflect indicative spot trade averages updated directly by our trading desk.
                Historical prices are captured on each update with an audit trail. To lock physical quantities,
                please configure specifications and submit an official Quotation Request.
              </p>
            </div>
          </div>

          {/* Right Column: Stock-Market-Style Analytics & Interactive Charts (Section 9.3) */}
          <div className="lg:col-span-6 space-y-4">
            {selectedMaterial ? (
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-5">
                {/* Header of Selected Material */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">
                      {selectedMaterial.symbol} • {selectedMaterial.categoryName}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                      {selectedMaterial.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {selectedMaterial.notes || 'Secondary & Primary Indian Mill Benchmark'}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono block">
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
                        {selectedMaterial.percentageChange > 0 ? '+' : ''}
                        {selectedMaterial.percentageChange}% ({formatINR(selectedMaterial.priceChange)})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Time Range Filters & Chart Type Selector */}
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
                          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
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
                          formatter={(value: any) => [formatINR(Number(value)), 'Price / MT']}
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
                          stroke="#0284c7"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#priceGradient)"
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
                          formatter={(value: any) => [formatINR(Number(value)), 'Price / MT']}
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
                          stroke="#0284c7"
                          strokeWidth={2.5}
                          dot={{ r: 2 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>

                {/* Stock-Market Key Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase">Previous Close</span>
                    <span className="font-mono font-bold text-slate-800">
                      {formatINR(selectedMaterial.previousPrice)}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase">Period High</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {formatINR(selectedMaterial.highPrice)}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase">Period Low</span>
                    <span className="font-mono font-bold text-rose-700">
                      {formatINR(selectedMaterial.lowPrice)}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block uppercase">Volatility Index</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedMaterial.volatility}%
                    </span>
                  </div>
                </div>

                {/* Detailed Historical Prices Table (Recent 5 records) */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Recent Historical Fixings
                  </h4>
                  <div className="border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 font-semibold text-[10px] uppercase border-b border-slate-200">
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3 text-right">Fixed Price / MT</th>
                          <th className="py-2 px-3 text-right">Unit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedMaterial.historicalPrices
                          .slice(-5)
                          .reverse()
                          .map((hist, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-mono text-slate-700">
                                {formatIndianDate(hist.date)}
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                                {formatINR(hist.price)}
                              </td>
                              <td className="py-2 px-3 text-right text-slate-400 font-mono text-[10px]">
                                {selectedMaterial.unit}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400">
                <Activity className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">
                  Select a material from the list to display stock-market-style charts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
