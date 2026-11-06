'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import {
  LayoutDashboard,
  Boxes,
  TrendingUp,
  FileSpreadsheet,
  PackageCheck,
  Receipt,
  Users,
  Settings,
  ArrowLeft,
  ShieldCheck,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { quotations, orders } = useStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const pendingQuotations = mounted
    ? quotations.filter((q) => q.status === 'pending').length
    : 0;
  const pendingOrders = mounted
    ? orders.filter((o) => o.status === 'order_confirmed' || o.paymentStatus === 'pending').length
    : 0;

  const links = [
    {
      href: '/admin',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/admin/products',
      label: 'Products & Categories',
      icon: Boxes,
    },
    {
      href: '/admin/market',
      label: 'Market Price Control',
      icon: TrendingUp,
    },
    {
      href: '/admin/quotations',
      label: 'Quotation Requests',
      icon: FileSpreadsheet,
      badge: pendingQuotations,
    },
    {
      href: '/admin/orders',
      label: 'Orders & Dispatch',
      icon: PackageCheck,
      badge: pendingOrders,
    },
    {
      href: '/admin/invoices',
      label: 'GST Invoices',
      icon: Receipt,
    },
    {
      href: '/admin/customers',
      label: 'Customer Accounts',
      icon: Users,
    },
    {
      href: '/admin/settings',
      label: 'Settings & Audit Log',
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#11151B]">
      {/* Admin Header - Dark Obsidian & Copper */}
      <div className="p-4 bg-[#14181F] border-b border-[#222934]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl p-1 bg-[#191F28] border border-[#2A3342] flex items-center justify-center shrink-0 shadow-inner">
              <img
                src="/fti-logo.png"
                alt="FTI - FieldFast Tech International"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-wide">
                FTI <span className="text-[#E8732A]">ADMIN DESK</span>
              </h2>
              <p className="text-[10px] text-[#94A3B8] font-medium">
                FieldFast Tech International
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-[#94A3B8] hover:text-white hover:bg-[#191F28] rounded-lg transition cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mt-3.5 bg-[#191F28] rounded-xl px-3 py-2 border border-[#2A3342] flex items-center justify-between text-xs">
          <span className="text-[#94A3B8] text-[11px]">Clearance:</span>
          <span className="text-[#4ADE80] font-bold flex items-center space-x-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Super Admin</span>
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="p-3 flex-1 space-y-1.5 overflow-y-auto">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                isActive
                  ? 'bg-gradient-to-r from-[#E8732A] to-[#C45316] text-white border border-[#F59352]/40 shadow-[0_4px_15px_rgba(224,105,36,0.25)]'
                  : 'text-[#CBD5E1] hover:bg-[#191F28] hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#E8732A]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full font-mono ${
                    isActive
                      ? 'bg-[#0B0E11]/40 text-white border border-white/20'
                      : 'bg-[#251811] text-[#E8732A] border border-[#E06924]/40'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to Customer Website */}
      <div className="p-3 border-t border-[#222934] bg-[#14181F] shrink-0">
        <Link
          href="/"
          onClick={() => onClose?.()}
          className="flex items-center justify-center space-x-2 w-full py-2.5 px-3 rounded-xl bg-[#191F28] hover:bg-[#222936] text-[#CBD5E1] hover:text-white text-xs font-bold border border-[#2A3342] hover:border-[#E06924]/40 transition shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#E8732A]" />
          <span>Exit to Customer Store</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sidebar (lg and up) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#11151B] border-r border-[#222934] text-[#F8FAFC] shrink-0 min-h-screen">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer & Backdrop (under lg) */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        }`}
      >
        {/* Dark Backdrop */}
        <div
          className="fixed inset-0 bg-[#0B0E11]/80 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Slide-over Drawer */}
        <div
          className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#11151B] border-r border-[#222934] text-[#F8FAFC] shadow-2xl transform transition-transform duration-300 ease-in-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
