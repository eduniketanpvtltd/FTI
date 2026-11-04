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
    <div className="min-h-screen flex bg-[#A8ADB1] text-[#252A2E]">
      {/* Sidebar (Desktop fixed + Mobile Drawer) */}
      <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Status Bar - Dark Chocolate Brown */}
        <header className="bg-[#49352D] text-[#F1EAE1] border-b border-[#343A3F] px-3 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs min-w-0">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 text-[#F1EAE1] hover:bg-[#604333] rounded-md transition cursor-pointer touch-manipulation"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 text-[#B18A70]" />
            </button>

            <img src="/fti-logo.png" alt="FTI Logo" className="w-5 h-5 object-contain shrink-0" />
            <span className="font-extrabold text-[#F1EAE1] tracking-wide truncate max-w-[125px] sm:max-w-none text-xs sm:text-sm">
              FTI TRADING CONTROL
            </span>

            <span className="hidden md:inline text-[#737A7F]">|</span>
            <span className="hidden md:inline text-[#A8ADB1] truncate font-medium">
              {currentUser.fullName}
            </span>
            <span className="hidden sm:inline bg-[#76513F] text-[#F1EAE1] font-mono text-[10px] px-1.5 py-0.5 rounded border border-[#B18A70] uppercase shrink-0 font-bold">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 text-xs shrink-0">
            <div className="hidden lg:flex items-center space-x-1.5 text-[#F1EAE1]">
              <Clock className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Desk Date: 03 Nov 2026</span>
            </div>

            <Link
              href="/"
              className="text-[#F1EAE1] hover:text-white bg-[#343A3F] hover:bg-[#604333] px-2.5 py-1.5 rounded border border-[#737A7F] transition flex items-center space-x-1.5 touch-manipulation text-xs font-semibold shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#B18A70]" />
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
          className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#343A3F]/98 backdrop-blur-md border-t border-[#49352D] px-1 py-1 flex items-center justify-around shadow-2xl safe-area-bottom"
        >
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-md min-w-[56px] transition touch-manipulation ${
              pathname === '/admin' ? 'text-[#F1EAE1] font-bold bg-[#76513F]' : 'text-[#A8ADB1] hover:text-[#F1EAE1]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Overview</span>
          </Link>

          <Link
            href="/admin/quotations"
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-md min-w-[56px] transition touch-manipulation ${
              pathname.startsWith('/admin/quotations') ? 'text-[#F1EAE1] font-bold bg-[#76513F]' : 'text-[#A8ADB1] hover:text-[#F1EAE1]'
            }`}
          >
            <div className="relative">
              <FileSpreadsheet className="w-5 h-5" />
              {pendingQuotations > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#E5A34B] text-[#252A2E] text-[9px] font-black px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center leading-none">
                  {pendingQuotations}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-medium">RFQs</span>
          </Link>

          <Link
            href="/admin/orders"
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-md min-w-[56px] transition touch-manipulation ${
              pathname.startsWith('/admin/orders') ? 'text-[#F1EAE1] font-bold bg-[#76513F]' : 'text-[#A8ADB1] hover:text-[#F1EAE1]'
            }`}
          >
            <div className="relative">
              <PackageCheck className="w-5 h-5" />
              {pendingOrders > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#76513F] text-[#F1EAE1] border border-[#B18A70] text-[9px] font-black px-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center leading-none">
                  {pendingOrders}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 font-medium">Orders</span>
          </Link>

          <Link
            href="/admin/market"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-md min-w-[56px] transition touch-manipulation ${
              pathname.startsWith('/admin/market') ? 'text-[#F1EAE1] font-bold bg-[#76513F]' : 'text-[#A8ADB1] hover:text-[#F1EAE1]'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Market</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-md min-w-[56px] text-[#A8ADB1] hover:text-[#F1EAE1] transition touch-manipulation cursor-pointer"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Menu</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
