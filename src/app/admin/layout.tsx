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
    <div className="min-h-screen flex bg-slate-100 text-slate-900">
      {/* Sidebar (Desktop fixed + Mobile Drawer) */}
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Status Bar */}
        <header className="bg-slate-900 text-slate-200 border-b border-slate-800 px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs min-w-0">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition cursor-pointer touch-manipulation"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <img src="/fti-logo.png" alt="FTI Logo" className="w-5 h-5 object-contain shrink-0" />
            <span className="font-bold text-white tracking-wide truncate max-w-[125px] sm:max-w-none text-xs sm:text-sm">
              FTI TRADING CONTROL
            </span>

            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400 truncate">
              {currentUser.fullName}
            </span>
            <span className="hidden sm:inline bg-blue-600/30 text-blue-300 font-mono text-[10px] px-1.5 py-0.5 rounded border border-blue-500/40 uppercase shrink-0">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 text-xs shrink-0">
            <div className="hidden lg:flex items-center space-x-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Desk Date: 03 Nov 2026</span>
            </div>

            <Link
              href="/"
              className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded border border-slate-700 transition flex items-center space-x-1 touch-manipulation text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Customer Store</span>
              <span className="sm:hidden text-[11px] font-medium">Store</span>
            </Link>
          </div>
        </header>

        {/* Admin Page Content */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 pb-20 lg:pb-6 overflow-y-auto min-w-0">
          {children}
        </main>

        {/* Mobile Sticky Bottom Quick-Navigation Bar */}
        <nav
          aria-label="Admin mobile navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-1 py-1 flex items-center justify-around shadow-2xl safe-area-bottom"
        >
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-md min-w-[56px] transition touch-manipulation ${
              pathname === '/admin' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Overview</span>
          </Link>

          <Link
            href="/admin/quotations"
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-md min-w-[56px] transition touch-manipulation ${
              pathname.startsWith('/admin/quotations') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <FileSpreadsheet className="w-5 h-5" />
              {pendingQuotations > 0 && (
                <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center leading-none">
                  {pendingQuotations}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-medium">RFQs</span>
          </Link>

          <Link
            href="/admin/orders"
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-md min-w-[56px] transition touch-manipulation ${
              pathname.startsWith('/admin/orders') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <PackageCheck className="w-5 h-5" />
              {pendingOrders > 0 && (
                <span className="absolute -top-1 -right-2 bg-purple-500 text-white text-[9px] font-black px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center leading-none">
                  {pendingOrders}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-medium">Orders</span>
          </Link>

          <Link
            href="/admin/market"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-md min-w-[56px] transition touch-manipulation ${
              pathname.startsWith('/admin/market') ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Market</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-md min-w-[56px] text-slate-400 hover:text-slate-200 transition touch-manipulation cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
