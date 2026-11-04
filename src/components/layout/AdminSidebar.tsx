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
  ShieldAlert,
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
    <div className="flex flex-col h-full bg-[#343A3F]">
      {/* Admin Header - Dark Chocolate Brown */}
      <div className="p-4 bg-[#49352D] border-b border-[#343A3F]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg p-0.5 bg-[#343A3F] border border-[#737A7F] flex items-center justify-center shrink-0">
              <img
                src="/fti-logo.png"
                alt="FTI - FieldFast Tech International"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-[#F1EAE1] tracking-wide">FTI ADMIN DESK</h2>
              <p className="text-[10px] text-[#B18A70] font-semibold">FieldFast Tech International</p>
            </div>
          </div>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-[#A8ADB1] hover:text-[#F1EAE1] hover:bg-[#604333] rounded-md transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mt-3 bg-[#343A3F] rounded px-2.5 py-1.5 border border-[#737A7F] flex items-center justify-between text-xs">
          <span className="text-[#A8ADB1]">Security Clearance:</span>
          <span className="text-[#10B981] font-bold flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Super Admin</span>
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="p-3 flex-1 space-y-1 overflow-y-auto">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-semibold transition ${
                isActive
                  ? 'bg-[#76513F] text-[#F1EAE1] border border-[#B18A70] shadow-sm'
                  : 'text-[#A8ADB1] hover:bg-[#49352D] hover:text-[#F1EAE1]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F1EAE1]' : 'text-[#B18A70]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-[#F1EAE1] text-[#49352D]' : 'bg-[#E5A34B] text-[#252A2E]'
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
      <div className="p-3 border-t border-[#49352D] bg-[#343A3F] shrink-0">
        <Link
          href="/"
          onClick={() => onClose?.()}
          className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded bg-[#49352D] hover:bg-[#604333] text-[#F1EAE1] text-xs font-semibold border border-[#737A7F] transition shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#B18A70]" />
          <span>Exit to Customer Store</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sidebar (lg and up) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#343A3F] border-r border-[#49352D] text-[#F1EAE1] shrink-0 min-h-screen">
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
          className="fixed inset-0 bg-[#252A2E]/80 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Slide-over Drawer */}
        <div
          className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#343A3F] border-r border-[#49352D] text-[#F1EAE1] shadow-2xl transform transition-transform duration-300 ease-in-out ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
