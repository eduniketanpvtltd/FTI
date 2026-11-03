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
  Menu,
  X,
  Package,
  Building2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { currentUser, switchUserRole, cart, notifications, quotations } = useStore();
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isAdmin = mounted && currentUser.role !== 'customer';
  const unreadNotifs = mounted ? notifications.filter((n) => !n.isRead).length : 0;

  // Count pending or active quotations for notification badge
  const activeQuotationsCount = mounted
    ? quotations.filter((q) => q.status === 'quotation_sent').length
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-sm">
      {/* Top Industrial Banner - Responsive & Single-line on all screens */}
      <div className="bg-slate-950 py-1.5 px-3 sm:px-4 text-xs border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Desk status */}
          <div className="flex items-center space-x-2 text-slate-300 min-w-0">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-medium text-slate-200 text-[11px] sm:text-xs truncate">
              <span className="sm:hidden">Live Metals Desk</span>
              <span className="hidden sm:inline">Live Industrial Metals Trading Desk</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400 text-xs">Direct Mill Allocation & Verified Scrap</span>
          </div>

          {/* Right: Badges & Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* ISO 9001:2015 Certification Badge */}
            <div className="flex items-center space-x-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 text-slate-300 text-[10px] sm:text-[11px] whitespace-nowrap">
              <ShieldCheck className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="font-semibold tracking-wide">
                <span className="hidden sm:inline">ISO 9001:2015 CERTIFIED</span>
                <span className="sm:hidden">ISO 9001</span>
              </span>
            </div>

            {/* Quick Role Switcher */}
            <button
              onClick={() => switchUserRole(isAdmin ? 'customer' : 'admin')}
              className="flex items-center space-x-1 text-[10px] sm:text-[11px] bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 px-2 sm:px-2.5 py-0.5 rounded transition whitespace-nowrap font-medium cursor-pointer"
              title="Click to toggle between Customer View and Admin View"
            >
              <ArrowRightLeft className="w-3 h-3 shrink-0" />
              <span>
                <span className="sm:hidden">{isAdmin ? 'Customer' : 'Admin'}</span>
                <span className="hidden sm:inline">{isAdmin ? 'View as Customer' : 'Switch to Admin View'}</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* FTI Logo on Left */}
        <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg p-0.5 bg-slate-950 border border-slate-700/80 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-red-500/50 transition">
            <img
              src="/fti-logo.png"
              alt="FTI - FieldFast Tech International"
              className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white whitespace-nowrap">FTI</span>
              <span className="bg-red-950/70 text-red-400 text-[9px] sm:text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-red-500/40 whitespace-nowrap">
                FIELDFAST
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400 leading-none mt-0.5">
              FieldFast Tech International • Raw Materials Desk
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

        {/* Right Action Icons */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Admin Dashboard Quick Link if admin (desktop) */}
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
            className="relative flex items-center justify-center p-2 sm:px-3 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-sm transition"
            title="Quotation Cart"
          >
            <ShoppingCart className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline font-medium ml-1.5">Quotation Cart</span>
            {cart.length > 0 && (
              <span className="sm:ml-1.5 absolute -top-1.5 -right-1.5 sm:static bg-blue-500 text-white font-bold text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
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

          {/* User Profile (Desktop) */}
          <Link
            href="/profile"
            className="hidden sm:flex items-center space-x-2 p-1.5 hover:bg-slate-800 rounded-md text-slate-200 transition"
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

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-blue-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* User Info Card in Drawer */}
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-sm font-bold text-blue-300">
                {currentUser.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                <p className="text-[11px] text-slate-400">{currentUser.companyName}</p>
              </div>
            </div>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold px-2 py-1 bg-slate-800 rounded border border-slate-700"
            >
              Account
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                pathname === '/' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/raw-materials"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                pathname.startsWith('/raw-materials') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-blue-400" />
                <span>Raw Materials Catalog</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/market"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                pathname === '/market' ? 'bg-blue-600/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Live Scrap & Steel Prices</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                LIVE
              </span>
            </Link>

            <Link
              href="/quotations"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                pathname.startsWith('/quotations') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>My Quotations</span>
              </div>
              {activeQuotationsCount > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold">
                  {activeQuotationsCount} active
                </span>
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-500" />
              )}
            </Link>

            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                pathname.startsWith('/orders') ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Orders & Dispatches</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold bg-blue-600/30 border border-blue-500/50 text-blue-200 hover:bg-blue-600/40 transition mt-2"
              >
                <div className="flex items-center space-x-2">
                  <LayoutDashboard className="w-4 h-4 text-blue-400" />
                  <span>Admin Control Portal</span>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-400" />
              </Link>
            )}
          </div>

          {/* Quick role toggle in mobile drawer */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Trading view: <strong className="text-slate-200 capitalize">{currentUser.role.replace('_', ' ')}</strong></span>
            <button
              onClick={() => {
                switchUserRole(isAdmin ? 'customer' : 'admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium underline cursor-pointer"
            >
              {isAdmin ? 'Switch to Customer View' : 'Switch to Admin View'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
