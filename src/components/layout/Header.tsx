'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { FTI_ISO_CERTIFICATE } from '@/lib/fti-catalog-data';
import {
  Layers,
  TrendingUp,
  FileText,
  ShieldCheck,
  Bell,
  LayoutDashboard,
  ShoppingCart,
  Menu,
  X,
  Package,
  ChevronRight,
  ExternalLink,
  LogIn,
  LogOut,
  Wrench,
  Cog,
  Award,
  CheckCircle2,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const {
    isAuthenticated,
    isProfileComplete,
    currentUser,
    cart,
    notifications,
    quotations,
    logout,
  } = useStore();
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isoModalOpen, setIsoModalOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isAuth = mounted && isAuthenticated;
  const isAdmin = isAuth && currentUser.role !== 'customer';
  const unreadNotifs = isAuth
    ? notifications.filter((n) => !n.isRead && (!n.userId || n.userId === currentUser.id)).length
    : 0;

  const activeQuotationsCount = isAuth
    ? quotations.filter(
        (q) =>
          q.status === 'quotation_sent' &&
          (isAdmin || q.userId === currentUser.id)
      ).length
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E11]/95 backdrop-blur-md border-b border-[#1E242D] text-[#F8FAFC] shadow-lg">
      {/* Row 1: Top Status Bar - Exact Match to Mockup */}
      <div className="bg-[#080A0D] py-1.5 px-3.5 sm:px-6 text-xs border-b border-[#1A1F27]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Live Metals Desk indicator */}
          <div className="flex items-center space-x-2 min-w-0">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E] shrink-0" />
            <span className="font-bold text-[#F8FAFC] text-xs tracking-tight truncate">
              Live Metals Desk
            </span>
            <span className="hidden md:inline text-[#333C4A]">•</span>
            <span className="hidden md:inline text-[#94A3B8] text-xs">
              Direct Mill Allocation & Live Mandi Spot Index
            </span>
          </div>

          {/* Right: ISO 9001 Pill Badge (Clickable Certificate Modal) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsoModalOpen(true)}
              className="flex items-center space-x-1.5 bg-[#14181F] hover:bg-[#1C222B] px-2.5 py-1 rounded-lg border border-[#2A323E] hover:border-[#E8732A]/60 text-[#F8FAFC] text-[11px] whitespace-nowrap shadow-inner transition cursor-pointer"
              title="View ISO 9001:2015 Certificate (QACS/IND/250321)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#E8732A] shrink-0" />
              <span className="font-bold tracking-wide text-[#E2E8F0]">
                <span className="hidden sm:inline">ISO 9001:2015 • QACS/IND/250321</span>
                <span className="sm:hidden">ISO 9001:2015</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Main Header Bar - Hex FTI Emblem + FIELDFAST Badge + Action Icons */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Left: FTI Hex Emblem + Brand */}
        <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl p-1 bg-gradient-to-br from-[#231915] to-[#12161C] border border-[#E06924]/60 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(224,105,36,0.2)] group-hover:border-[#F28B49] transition">
            <img
              src="/fti-logo-dark.png"
              alt="FTI - FieldFast Tech International"
              className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-black text-lg sm:text-xl tracking-tight text-white whitespace-nowrap">
              FTI
            </span>
            <span className="bg-[#161B22] text-[#CBD5E1] text-[10px] sm:text-[11px] uppercase font-bold px-2 py-0.5 rounded-md border border-[#2E3744] tracking-wider whitespace-nowrap">
              FIELDFAST
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1.5 lg:space-x-2">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              pathname === '/'
                ? 'bg-gradient-to-b from-[#E56B25] to-[#C45316] text-white border border-[#F28B49]/50 shadow-[0_2px_10px_rgba(224,105,36,0.3)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#161B22]'
            }`}
          >
            Home
          </Link>
          <Link
            href="/raw-materials"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              pathname.startsWith('/raw-materials')
                ? 'bg-gradient-to-b from-[#E56B25] to-[#C45316] text-white border border-[#F28B49]/50 shadow-[0_2px_10px_rgba(224,105,36,0.3)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#161B22]'
            }`}
          >
            Raw Materials
          </Link>
          <Link
            href="/fasteners"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              pathname.startsWith('/fasteners')
                ? 'bg-gradient-to-b from-[#E56B25] to-[#C45316] text-white border border-[#F28B49]/50 shadow-[0_2px_10px_rgba(224,105,36,0.3)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#161B22]'
            }`}
          >
            Fasteners
          </Link>
          <Link
            href="/tractor-parts"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              pathname.startsWith('/tractor-parts')
                ? 'bg-gradient-to-b from-[#E56B25] to-[#C45316] text-white border border-[#F28B49]/50 shadow-[0_2px_10px_rgba(224,105,36,0.3)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#161B22]'
            }`}
          >
            Tractor Parts
          </Link>
          <Link
            href="/market"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              pathname === '/market'
                ? 'bg-gradient-to-b from-[#E56B25] to-[#C45316] text-white border border-[#F28B49]/50 shadow-[0_2px_10px_rgba(224,105,36,0.3)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#161B22]'
            }`}
          >
            <TrendingUp className={`w-3.5 h-3.5 ${pathname === '/market' ? 'text-white' : 'text-[#22C55E]'}`} />
            <span>Market Desk</span>
          </Link>
          <Link
            href="/quotations"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold relative transition ${
              pathname.startsWith('/quotations')
                ? 'bg-gradient-to-b from-[#E56B25] to-[#C45316] text-white border border-[#F28B49]/50 shadow-[0_2px_10px_rgba(224,105,36,0.3)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#161B22]'
            }`}
          >
            <span>Quotations</span>
            {activeQuotationsCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 bg-[#E06924] text-white font-bold text-[10px] rounded-full">
                {activeQuotationsCount}
              </span>
            )}
          </Link>
          <Link
            href="/orders"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              pathname.startsWith('/orders')
                ? 'bg-gradient-to-b from-[#E56B25] to-[#C45316] text-white border border-[#F28B49]/50 shadow-[0_2px_10px_rgba(224,105,36,0.3)]'
                : 'text-[#94A3B8] hover:text-white hover:bg-[#161B22]'
            }`}
          >
            Orders
          </Link>
        </nav>

        {/* Right: Action Icons (Cart, Bell / Auth, Menu) */}
        <div className="flex items-center space-x-1 sm:space-x-2.5">
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:flex items-center space-x-1.5 bg-[#181D25] hover:bg-[#E06924] text-[#F8FAFC] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#2C3543] transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#E8732A]" />
              <span>Admin</span>
            </Link>
          )}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2 text-[#E2E8F0] hover:text-white hover:bg-[#161B22] rounded-lg transition"
            title="Quotation Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#E06924] text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#0B0E11]">
                {cart.length}
              </span>
            )}
          </Link>

          {isAuth ? (
            <>
              {/* Notification Bell with Glowing Orange Badge */}
              <Link
                href="/profile?tab=notifications"
                className="relative p-2 text-[#E2E8F0] hover:text-white hover:bg-[#161B22] rounded-lg transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#E8732A] border-2 border-[#0B0E11] animate-pulse" />
                )}
              </Link>

              {/* Desktop User Profile Pill */}
              <Link
                href={isProfileComplete ? '/profile' : '/login?mode=signup'}
                className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 bg-[#14181F] hover:bg-[#1C222B] rounded-xl text-[#F8FAFC] transition border border-[#262E3B]"
                title={isProfileComplete ? 'Customer Profile' : 'Complete Buyer Profile'}
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-6 h-6 rounded-full object-cover border border-[#E8732A]"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E56B25] to-[#B84E14] flex items-center justify-center text-xs font-bold text-white">
                    {(currentUser.fullName || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden lg:inline text-xs font-bold text-[#E2E8F0] max-w-[110px] truncate">
                  {isProfileComplete
                    ? (currentUser.companyName || currentUser.fullName).split(' ')[0]
                    : 'Complete Profile'}
                </span>
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center space-x-1.5 bg-gradient-to-b from-[#E8732A] to-[#C45316] hover:from-[#F2823B] hover:to-[#D45E1C] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl border border-[#F59352]/50 shadow-[0_2px_12px_rgba(224,105,36,0.3)] transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#E2E8F0] hover:text-white hover:bg-[#161B22] rounded-lg transition cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#E8732A]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Slide-Down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="bg-[#11151B]/98 backdrop-blur-xl border-t border-[#242B35] px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* User Account / Guest Auth Card */}
            {isAuth ? (
              <div className="p-3.5 bg-[#161B22] rounded-xl border border-[#262E3B] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-3">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-[#E8732A] shadow"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E56B25] to-[#B84E14] flex items-center justify-center text-sm font-black text-white shadow">
                      {(currentUser.fullName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                    <p className="text-[11px] text-[#94A3B8]">
                      {isProfileComplete
                        ? currentUser.companyName
                        : `${currentUser.email} • Profile Incomplete`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={isProfileComplete ? '/profile' : '/login?mode=signup'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-white font-bold px-3 py-1.5 bg-gradient-to-b from-[#E56B25] to-[#C45316] rounded-lg border border-[#F28B49]/50 transition"
                  >
                    {isProfileComplete ? 'Account' : 'Complete Profile'}
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-[#F87171] hover:text-white font-bold px-3 py-1.5 bg-[#1C222B] hover:bg-[#2F1619] rounded-lg border border-[#2C3543] transition cursor-pointer flex items-center space-x-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gradient-to-r from-[#251811] to-[#161B22] rounded-xl border border-[#E06924]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8732A] font-bold block">
                    Exploring as Guest
                  </span>
                  <p className="text-xs font-bold text-white mt-0.5">
                    Sign in with Google to Request Quotations (RFQs) & Track Orders
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-[#0F172A] bg-white hover:bg-slate-100 font-extrabold px-3.5 py-2 rounded-lg shadow transition"
                  >
                    Sign In with Google
                  </Link>
                  <Link
                    href="/login?mode=signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-white font-bold px-3.5 py-2 bg-gradient-to-b from-[#E56B25] to-[#C45316] rounded-lg border border-[#F28B49]/50 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            {/* Menu Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  pathname === '/'
                    ? 'bg-gradient-to-r from-[#E56B25] to-[#C45316] text-white'
                    : 'text-[#E2E8F0] hover:bg-[#181D25]'
                }`}
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </Link>

              <Link
                href="/raw-materials"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  pathname.startsWith('/raw-materials')
                    ? 'bg-gradient-to-r from-[#E56B25] to-[#C45316] text-white'
                    : 'text-[#E2E8F0] hover:bg-[#181D25]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Package className="w-4 h-4 text-[#E8732A]" />
                  <span>Raw Materials Catalog</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </Link>

              <Link
                href="/fasteners"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  pathname.startsWith('/fasteners')
                    ? 'bg-gradient-to-r from-[#E56B25] to-[#C45316] text-white'
                    : 'text-[#E2E8F0] hover:bg-[#181D25]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Wrench className="w-4 h-4 text-[#E8732A]" />
                  <span>Industrial Fasteners (17 Types)</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </Link>

              <Link
                href="/tractor-parts"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  pathname.startsWith('/tractor-parts')
                    ? 'bg-gradient-to-r from-[#E56B25] to-[#C45316] text-white'
                    : 'text-[#E2E8F0] hover:bg-[#181D25]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Cog className="w-4 h-4 text-[#E8732A]" />
                  <span>Tractor Spare Parts (50 SKUs)</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </Link>

              <Link
                href="/market"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  pathname === '/market'
                    ? 'bg-gradient-to-r from-[#E56B25] to-[#C45316] text-white'
                    : 'text-[#E2E8F0] hover:bg-[#181D25]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <TrendingUp className="w-4 h-4 text-[#22C55E]" />
                  <span>Live Mandi Price Desk</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#122D21] text-[#34D399] font-bold border border-[#22C55E]/40">
                  LIVE
                </span>
              </Link>

              <Link
                href="/quotations"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  pathname.startsWith('/quotations')
                    ? 'bg-gradient-to-r from-[#E56B25] to-[#C45316] text-white'
                    : 'text-[#E2E8F0] hover:bg-[#181D25]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <FileText className="w-4 h-4 text-[#E8732A]" />
                  <span>My Quotations</span>
                </div>
                {activeQuotationsCount > 0 ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E06924] text-white font-bold">
                    {activeQuotationsCount} active
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 opacity-70" />
                )}
              </Link>

              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  pathname.startsWith('/orders')
                    ? 'bg-gradient-to-r from-[#E56B25] to-[#C45316] text-white'
                    : 'text-[#E2E8F0] hover:bg-[#181D25]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Layers className="w-4 h-4 text-[#E8732A]" />
                  <span>Orders & Dispatches</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold bg-[#1C222B] border border-[#E06924]/50 text-white hover:bg-[#E06924] transition"
                >
                  <div className="flex items-center space-x-2.5">
                    <LayoutDashboard className="w-4 h-4 text-[#E8732A]" />
                    <span>Admin Control Portal</span>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ISO 9001:2015 Certificate Verification Modal */}
      {isoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsoModalOpen(false)}
        >
          <div
            className="bg-[#12161D] border border-[#2A3342] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#222936] flex items-center justify-between bg-[#0E1217]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-[#241811] border border-[#E06924]/50 text-[#E8732A]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {FTI_ISO_CERTIFICATE.standard} — Quality Management System
                  </h3>
                  <p className="text-[11px] text-[#94A3B8]">
                    Certificate No. <span className="text-[#E8732A] font-mono font-bold">{FTI_ISO_CERTIFICATE.certificateNumber}</span> • {FTI_ISO_CERTIFICATE.accreditation}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsoModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#1A2029] text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-5 bg-[#0A0D12] rounded-xl border border-[#222936] p-2.5 flex items-center justify-center">
                <img
                  src={FTI_ISO_CERTIFICATE.cdnUrl}
                  alt="FieldFast Tech International ISO 9001:2015 Certificate"
                  className="w-full h-auto rounded-lg object-contain max-h-[380px]"
                />
              </div>

              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#112A1F] border border-[#22C55E]/40 text-[#34D399] text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{FTI_ISO_CERTIFICATE.qmsLabel} — Verified Active</span>
                  </div>

                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    {FTI_ISO_CERTIFICATE.scope}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-[#161B23] p-3 rounded-xl border border-[#232B38]">
                      <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold block">
                        Certified Organization
                      </span>
                      <span className="font-bold text-white mt-0.5 block">
                        {FTI_ISO_CERTIFICATE.organization}
                      </span>
                    </div>
                    <div className="bg-[#161B23] p-3 rounded-xl border border-[#232B38]">
                      <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold block">
                        Certificate Number
                      </span>
                      <span className="font-mono font-bold text-[#E8732A] mt-0.5 block">
                        {FTI_ISO_CERTIFICATE.certificateNumber}
                      </span>
                    </div>
                    <div className="bg-[#161B23] p-3 rounded-xl border border-[#232B38]">
                      <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold block">
                        Validity Period
                      </span>
                      <span className="font-bold text-white mt-0.5 block">
                        {FTI_ISO_CERTIFICATE.registrationPeriod}
                      </span>
                    </div>
                    <div className="bg-[#161B23] p-3 rounded-xl border border-[#232B38]">
                      <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold block">
                        Issuing Registrar
                      </span>
                      <span className="font-bold text-white mt-0.5 block">
                        {FTI_ISO_CERTIFICATE.issuer}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#161B23] p-3 rounded-xl border border-[#232B38] text-xs">
                    <span className="text-[10px] uppercase tracking-wider text-[#64748B] font-bold block">
                      Registered Works Address
                    </span>
                    <span className="text-[#E2E8F0] font-medium mt-0.5 block">
                      St.No.1, New Ram Nagar, Industrial Area-C, Sua Road, Ludhiana 141014, Punjab, India
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#222936]">
                  <a
                    href={FTI_ISO_CERTIFICATE.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#E8732A] hover:text-[#F59352] transition"
                  >
                    <span>Verify at QACS International (www.qacscert.com)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsoModalOpen(false)}
                    className="px-4 py-1.5 rounded-lg bg-[#1E2530] hover:bg-[#283140] text-white text-xs font-bold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
