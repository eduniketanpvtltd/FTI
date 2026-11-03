'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { Home, TrendingUp, ShoppingCart, User } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const { cart } = useStore();

  const isHome = pathname === '/' || pathname.startsWith('/raw-materials');
  const isMarket = pathname.startsWith('/market');
  const isCart = pathname.startsWith('/cart');
  const isProfile = pathname.startsWith('/profile') || pathname.startsWith('/quotations') || pathname.startsWith('/orders');

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 shadow-lg pb-safe">
      <div className="grid grid-cols-4 h-16">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center space-y-1 transition ${
            isHome ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">Home</span>
        </Link>

        {/* 2. Market */}
        <Link
          href="/market"
          className={`flex flex-col items-center justify-center space-y-1 relative transition ${
            isMarket ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <TrendingUp className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <span className="text-[11px]">Market</span>
        </Link>

        {/* 3. Cart */}
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center space-y-1 relative transition ${
            isCart ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-blue-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
          <span className="text-[11px]">Cart</span>
        </Link>

        {/* 4. Profile */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center space-y-1 transition ${
            isProfile ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[11px]">Profile</span>
        </Link>
      </div>
    </div>
  );
}
