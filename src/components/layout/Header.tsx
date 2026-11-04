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
  const { currentUser, cart, notifications, quotations } = useStore();
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
    <header className="sticky top-0 z-40 bg-[#604333] border-b border-[#49352D] text-[#F1EAE1] shadow-md">
      {/* Top Industrial Banner - Dark Chocolate Brown */}
      <div className="bg-[#49352D] py-1.5 px-3 sm:px-4 text-xs border-b border-[#343A3F]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Desk status */}
          <div className="flex items-center space-x-2 text-[#F1EAE1] min-w-0">
            <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-pulse shrink-0" />
            <span className="font-medium text-[#F1EAE1] text-[11px] sm:text-xs truncate">
              <span className="sm:hidden">Live Metals Desk</span>
              <span className="hidden sm:inline">Live Industrial Metals Trading Desk</span>
            </span>
            <span className="hidden md:inline text-[#737A7F]">|</span>
            <span className="hidden md:inline text-[#A8ADB1] text-xs">Direct Mill Allocation & Verified Scrap</span>
          </div>

          {/* Right: Badges & Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* ISO 9001:2015 Certification Badge */}
            <div className="flex items-center space-x-1.5 bg-[#343A3F] px-2.5 py-0.5 rounded border border-[#737A7F] text-[#F1EAE1] text-[10px] sm:text-[11px] whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B18A70] shrink-0" />
              <span className="font-semibold tracking-wide text-[#F1EAE1]">
                <span className="hidden sm:inline">ISO 9001:2015 CERTIFIED</span>
                <span className="sm:hidden">ISO 9001</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Bar - Deep Copper */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* FTI Logo on Left */}
        <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg p-0.5 bg-[#49352D] border border-[#737A7F] flex items-center justify-center overflow-hidden shadow-inner group-hover:border-[#B18A70] transition">
            <img
              src="/fti-logo.png"
              alt="FTI - FieldFast Tech International"
              className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-[#F1EAE1] whitespace-nowrap">FTI</span>
              <span className="bg-[#49352D] text-[#F1EAE1] text-[9px] sm:text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-[#B18A70] whitespace-nowrap">
                FIELDFAST
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-[#A8ADB1] leading-none mt-0.5 font-medium">
              FieldFast Tech International • Raw Materials Desk
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
              pathname === '/'
                ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70]/60 shadow-xs'
                : 'text-[#F1EAE1]/90 hover:text-[#F1EAE1] hover:bg-[#76513F]/50'
            }`}
          >
            Home
          </Link>
          <Link
            href="/raw-materials"
            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
              pathname.startsWith('/raw-materials')
                ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70]/60 shadow-xs'
                : 'text-[#F1EAE1]/90 hover:text-[#F1EAE1] hover:bg-[#76513F]/50'
            }`}
          >
            Raw Materials
          </Link>
          <Link
            href="/market"
            className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center space-x-1.5 transition ${
              pathname === '/market'
                ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70]/60 shadow-xs'
                : 'text-[#F1EAE1]/90 hover:text-[#F1EAE1] hover:bg-[#76513F]/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
            <span>Market Prices</span>
          </Link>
          <Link
            href="/quotations"
            className={`px-3 py-1.5 rounded-md text-sm font-semibold relative transition ${
              pathname.startsWith('/quotations')
                ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70]/60 shadow-xs'
                : 'text-[#F1EAE1]/90 hover:text-[#F1EAE1] hover:bg-[#76513F]/50'
            }`}
          >
            <span>My Quotations</span>
            {activeQuotationsCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-[#E5A34B] text-[#252A2E] font-bold text-[10px] rounded-full">
                {activeQuotationsCount}
              </span>
            )}
          </Link>
          <Link
            href="/orders"
            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
              pathname.startsWith('/orders')
                ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70]/60 shadow-xs'
                : 'text-[#F1EAE1]/90 hover:text-[#F1EAE1] hover:bg-[#76513F]/50'
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
              className="hidden sm:flex items-center space-x-1.5 bg-[#76513F] hover:bg-[#B18A70] text-[#F1EAE1] text-xs font-bold px-3 py-1.5 rounded border border-[#B18A70]/50 transition shadow-xs"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
          )}

          {/* Quotation Cart Button */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center p-2 sm:px-3 sm:py-1.5 bg-[#49352D] hover:bg-[#76513F] text-[#F1EAE1] border border-[#737A7F] rounded-md text-sm transition"
            title="Quotation Cart"
          >
            <ShoppingCart className="w-4 h-4 text-[#B18A70]" />
            <span className="hidden sm:inline font-semibold ml-1.5">Quotation Cart</span>
            {cart.length > 0 && (
              <span className="sm:ml-1.5 absolute -top-1.5 -right-1.5 sm:static bg-[#76513F] text-[#F1EAE1] font-bold text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full min-w-[18px] text-center border border-[#B18A70]">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Notifications Link */}
          <Link
            href="/profile?tab=notifications"
            className="relative p-2 text-[#F1EAE1] hover:bg-[#76513F] rounded-md transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#E5A34B] rounded-full border-2 border-[#604333]" />
            )}
          </Link>

          {/* User Profile (Desktop) */}
          <Link
            href="/profile"
            className="hidden sm:flex items-center space-x-2 p-1.5 hover:bg-[#76513F] rounded-md text-[#F1EAE1] transition border border-transparent hover:border-[#737A7F]"
            title="Customer Profile"
          >
            <div className="w-7 h-7 rounded-full bg-[#76513F] border border-[#B18A70] flex items-center justify-center text-xs font-bold text-[#F1EAE1]">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-[#F1EAE1] leading-tight">
                {currentUser.companyName.split(' ')[0]}
              </p>
              <p className="text-[10px] text-[#A8ADB1] capitalize font-medium">{currentUser.role.replace('_', ' ')}</p>
            </div>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F1EAE1] hover:bg-[#76513F] rounded-md transition cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#B18A70]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#49352D]/98 backdrop-blur-md border-t border-[#737A7F] px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          {/* Brand Card in Drawer */}
          <div className="flex items-center space-x-2.5 pb-2 border-b border-[#737A7F]/60">
            <div className="w-8 h-8 rounded-lg p-0.5 bg-[#343A3F] border border-[#737A7F] flex items-center justify-center shrink-0">
              <img src="/fti-logo.png" alt="FTI Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-bold text-[#F1EAE1] text-xs tracking-wide">FIELDFAST TECH INTERNATIONAL</p>
              <p className="text-[10px] text-[#A8ADB1]">Industrial Raw Materials & Live Scrap Platform</p>
            </div>
          </div>

          {/* User Info Card in Drawer */}
          <div className="p-3 bg-[#343A3F] rounded-lg border border-[#737A7F] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#76513F] border border-[#B18A70] flex items-center justify-center text-sm font-bold text-[#F1EAE1]">
                {currentUser.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-[#F1EAE1]">{currentUser.fullName}</p>
                <p className="text-[11px] text-[#A8ADB1]">{currentUser.companyName}</p>
              </div>
            </div>
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[11px] text-[#F1EAE1] font-semibold px-2.5 py-1 bg-[#76513F] hover:bg-[#B18A70] rounded border border-[#B18A70] transition"
            >
              Account
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                pathname === '/'
                  ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70]'
                  : 'text-[#F1EAE1] hover:bg-[#604333]'
              }`}
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-[#A8ADB1]" />
            </Link>

            <Link
              href="/raw-materials"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                pathname.startsWith('/raw-materials')
                  ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70]'
                  : 'text-[#F1EAE1] hover:bg-[#604333]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-[#B18A70]" />
                <span>Raw Materials Catalog</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A8ADB1]" />
            </Link>

            <Link
              href="/market"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                pathname === '/market'
                  ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70]'
                  : 'text-[#F1EAE1] hover:bg-[#604333]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                <span>Live Scrap & Steel Prices</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold border border-[#10B981]/40">
                LIVE
              </span>
            </Link>

            <Link
              href="/quotations"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                pathname.startsWith('/quotations')
                  ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70]'
                  : 'text-[#F1EAE1] hover:bg-[#604333]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#B18A70]" />
                <span>My Quotations</span>
              </div>
              {activeQuotationsCount > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E5A34B] text-[#252A2E] font-bold">
                  {activeQuotationsCount} active
                </span>
              ) : (
                <ChevronRight className="w-4 h-4 text-[#A8ADB1]" />
              )}
            </Link>

            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                pathname.startsWith('/orders')
                  ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70]'
                  : 'text-[#F1EAE1] hover:bg-[#604333]'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#B18A70]" />
                <span>Orders & Dispatches</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A8ADB1]" />
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold bg-[#76513F] border border-[#B18A70] text-[#F1EAE1] hover:bg-[#B18A70] transition mt-2 shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  <LayoutDashboard className="w-4 h-4 text-[#F1EAE1]" />
                  <span>Admin Control Portal</span>
                </div>
                <ExternalLink className="w-4 h-4 text-[#F1EAE1]" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
