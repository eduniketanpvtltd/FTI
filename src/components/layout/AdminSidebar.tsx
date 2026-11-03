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
} from 'lucide-react';

export function AdminSidebar() {
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

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-screen">
      {/* Admin Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
            FTI
          </div>
          <div>
            <h2 className="font-bold text-sm text-white tracking-wide">ADMIN PORTAL</h2>
            <p className="text-[11px] text-blue-400 font-mono">B2B Trading Desk Operations</p>
          </div>
        </div>

        <div className="mt-3 bg-slate-800/80 rounded px-2.5 py-1.5 border border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">Security Clearance:</span>
          <span className="text-emerald-400 font-semibold flex items-center space-x-1">
            <ShieldAlert className="w-3 h-3" />
            <span>Super Admin</span>
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="p-3 flex-1 space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-blue-900' : 'bg-amber-500 text-slate-950'
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
      <div className="p-3 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center justify-center space-x-2 w-full py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Customer Store</span>
        </Link>
      </div>
    </aside>
  );
}
