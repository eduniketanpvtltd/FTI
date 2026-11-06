'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useStore } from '@/lib/store-context';
import {
  ArrowLeft,
  Clock,
  Menu,
  LayoutDashboard,
  FileSpreadsheet,
  PackageCheck,
  TrendingUp,
  MoreHorizontal,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, quotations, orders } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pendingQuotations = mounted
    ? quotations.filter((q) => q.status === 'pending').length
    : 0;
  const pendingOrders = mounted
    ? orders.filter((o) => o.status === 'order_confirmed' || o.paymentStatus === 'pending').length
    : 0;

  return (
    <div className="min-h-screen flex bg-[#0B0E11] text-[#F8FAFC]">
      {/* Sidebar (Desktop fixed + Mobile Drawer) */}
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Status Bar - Dark Obsidian Steel & Molten Copper */}
        <header className="bg-[#0E1217]/95 backdrop-blur-md text-[#F8FAFC] border-b border-[#222934] px-3.5 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-lg">
          <div className="flex items-center space-x-2.5 sm:space-x-3 text-xs min-w-0">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 text-[#CBD5E1] hover:text-white hover:bg-[#191F28] rounded-xl border border-transparent hover:border-[#2A3342] transition cursor-pointer touch-manipulation"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-[#E8732A]" />
            </button>

            <div className="w-7 h-7 rounded-lg bg-[#191F28] border border-[#2A3342] p-1 flex items-center justify-center shrink-0">
              <img src="/fti-logo.png" alt="FTI Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-extrabold text-white tracking-wide truncate max-w-[140px] sm:max-w-none text-xs sm:text-sm">
              FTI TRADING <span className="text-[#E8732A]">CONTROL</span>
            </span>

            <span className="hidden md:inline text-[#2A3342]">|</span>
            <span className="hidden md:inline text-[#CBD5E1] truncate font-medium">
              {currentUser.fullName}
            </span>
            <span className="hidden sm:inline bg-[#251811] text-[#E8732A] font-mono text-[10px] px-2 py-0.5 rounded-md border border-[#E06924]/40 uppercase shrink-0 font-bold">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-2.5 sm:space-x-4 text-xs shrink-0">
            <div className="hidden lg:flex items-center space-x-1.5 bg-[#14181F] border border-[#28303E] px-3 py-1.5 rounded-xl text-[#CBD5E1]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <Clock className="w-3.5 h-3.5 text-[#E8732A]" />
              <span className="font-mono text-[11px]">Desk Active • Ludhiana HQ</span>
            </div>

            <Link
              href="/"
              className="text-[#CBD5E1] hover:text-white bg-[#191F28] hover:bg-[#222936] px-3 py-1.5 rounded-xl border border-[#2A3342] hover:border-[#E06924]/50 transition flex items-center space-x-1.5 touch-manipulation text-xs font-bold shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#E8732A]" />
              <span className="hidden sm:inline">Customer Store</span>
              <span className="sm:hidden text-[11px]">Store</span>
            </Link>
          </div>
        </header>

        {/* Admin Page Content */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-7 pb-24 lg:pb-8 overflow-y-auto min-w-0">
          {children}
        </main>

        {/* Mobile Sticky Bottom Quick-Navigation Bar */}
        <nav
          aria-label="Admin mobile navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0E1217]/95 backdrop-blur-xl border-t border-[#222934] px-1.5 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom"
        >
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl min-w-[56px] transition touch-manipulation ${
              pathname === '/admin'
                ? 'text-white font-bold bg-gradient-to-b from-[#E8732A] to-[#C45316] shadow-md'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-semibold">Overview</span>
          </Link>

          <Link
            href="/admin/quotations"
            className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl min-w-[56px] transition touch-manipulation ${
              pathname.startsWith('/admin/quotations')
                ? 'text-white font-bold bg-gradient-to-b from-[#E8732A] to-[#C45316] shadow-md'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <div className="relative">
              <FileSpreadsheet className="w-4 h-4" />
              {pendingQuotations > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#E8732A] text-white border border-[#0E1217] text-[9px] font-black px-1 min-w-[15px] h-[15px] rounded-full flex items-center justify-center leading-none">
                  {pendingQuotations}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-semibold">RFQs</span>
          </Link>

          <Link
            href="/admin/orders"
            className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl min-w-[56px] transition touch-manipulation ${
              pathname.startsWith('/admin/orders')
                ? 'text-white font-bold bg-gradient-to-b from-[#E8732A] to-[#C45316] shadow-md'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <div className="relative">
              <PackageCheck className="w-4 h-4" />
              {pendingOrders > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#E8732A] text-white border border-[#0E1217] text-[9px] font-black px-1 min-w-[15px] h-[15px] rounded-full flex items-center justify-center leading-none">
                  {pendingOrders}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-semibold">Orders</span>
          </Link>

          <Link
            href="/admin/market"
            className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl min-w-[56px] transition touch-manipulation ${
              pathname.startsWith('/admin/market')
                ? 'text-white font-bold bg-gradient-to-b from-[#E8732A] to-[#C45316] shadow-md'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-semibold">Market</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl min-w-[56px] text-[#94A3B8] hover:text-white transition touch-manipulation cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
            <span className="text-[10px] mt-0.5 font-semibold">Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
