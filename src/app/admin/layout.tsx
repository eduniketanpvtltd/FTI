'use client';

import React from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useStore } from '@/lib/store-context';
import { ShieldAlert, ArrowLeft, Clock } from 'lucide-react';
import { formatIndianDate } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useStore();

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Status Bar */}
        <header className="bg-slate-900 text-slate-200 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs">
            <span className="font-bold text-white tracking-wide">FTI TRADING CONTROL DESK</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Authenticated: {currentUser.fullName}</span>
            <span className="bg-blue-600/30 text-blue-300 font-mono text-[10px] px-1.5 py-0.2 rounded border border-blue-500/40 uppercase">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Desk Date: 03 November 2026</span>
            </div>

            <Link
              href="/"
              className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 transition flex items-center space-x-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Customer Store</span>
            </Link>
          </div>
        </header>

        {/* Admin Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
