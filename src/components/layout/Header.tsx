'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import {
  Layers,
  TrendingUp,
  FileText,
  User,
  ShieldCheck,
  Bell,
  ArrowRightLeft,
  LayoutDashboard,
  ShoppingCart,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { currentUser, switchUserRole, cart, notifications, quotations } = useStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = mounted && currentUser.role !== 'customer';
  const unreadNotifs = mounted ? notifications.filter((n) => !n.isRead).length : 0;

  // Count pending or active quotations for notification badge
  const activeQuotationsCount = mounted
    ? quotations.filter((q) => q.status === 'quotation_sent').length
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-sm">
      {/* Top Industrial Banner */}
      <div className="bg-slate-950 py-1.5 px-4 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-300">Live Industrial Metals Trading Desk</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline">Direct Mill Allocation & Verified Scrap Lots</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* ISO 9001:2015 Certification Badge on Top Right */}
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-0.5 rounded border border-slate-700 text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-semibold tracking-wide text-[11px]">ISO 9001:2015 CERTIFIED</span>
            </div>

            {/* Quick Role Switcher for seamless pair-testing */}
            <button
              onClick={() => switchUserRole(isAdmin ? 'customer' : 'admin')}
              className="flex items-center space-x-1 text-[11px] bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 px-2.5 py-0.5 rounded transition"
              title="Click to toggle between Customer View and Admin View"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span>{isAdmin ? 'View as Customer' : 'Switch to Admin View'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* FTI Logo on Left */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-700 to-slate-900 border border-blue-500/30 flex items-center justify-center text-white font-extrabold text-xl tracking-tight shadow-inner">
            FTI
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-wider text-white">FTI METALS</span>
              <span className="bg-slate-800 text-blue-400 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-slate-700">
                B2B TRADING
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none">
              Raw Materials & Scrap Trading Platform
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              pathname === '/' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Home
          </Link>
          <Link
            href="/raw-materials"
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              pathname.startsWith('/raw-materials') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Raw Materials
          </Link>
          <Link
            href="/market"
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1.5 transition ${
              pathname === '/market' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Market Prices</span>
          </Link>
          <Link
            href="/quotations"
            className={`px-3 py-1.5 rounded-md text-sm font-medium relative transition ${
              pathname.startsWith('/quotations') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>My Quotations</span>
            {activeQuotationsCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full">
                {activeQuotationsCount}
              </span>
            )}
          </Link>
          <Link
            href="/orders"
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              pathname.startsWith('/orders') ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Orders
          </Link>
        </nav>

        {/* Right Action Icons & Admin Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Admin Dashboard Quick Link if admin */}
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          )}

          {/* Quotation Cart Button */}
          <Link
            href="/cart"
            className="relative flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-md text-sm transition"
            title="Quotation Cart"
          >
            <ShoppingCart className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline font-medium">Quotation Cart</span>
            {cart.length > 0 && (
              <span className="bg-blue-500 text-white font-bold text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Notifications Link */}
          <Link
            href="/profile?tab=notifications"
            className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-slate-900" />
            )}
          </Link>

          {/* User Profile */}
          <Link
            href="/profile"
            className="flex items-center space-x-2 p-1.5 hover:bg-slate-800 rounded-md text-slate-200 transition"
            title="Customer Profile"
          >
            <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs font-bold text-blue-300">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {currentUser.companyName.split(' ')[0]}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">{currentUser.role.replace('_', ' ')}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
