'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store-context';
import { Home, TrendingUp, ShoppingCart, User, LogIn } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const { cart, isAuthenticated } = useStore();

  const isHome = pathname === '/' || pathname.startsWith('/raw-materials');
  const isMarket = pathname.startsWith('/market');
  const isCart = pathname.startsWith('/cart');
  const isProfile =
    pathname.startsWith('/profile') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/quotations') ||
    pathname.startsWith('/orders');

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0E11]/95 backdrop-blur-xl border-t border-[#1F2631] shadow-[0_-8px_30px_rgba(0,0,0,0.7)] pb-safe">
      <div className="grid grid-cols-4 h-16 px-2 py-1.5 gap-1.5">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center rounded-xl transition ${
            isHome
              ? 'bg-[#251811] border border-[#E06924]/40 text-[#E8732A] font-bold shadow-[inset_0_1px_8px_rgba(224,105,36,0.2)]'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'text-[#E8732A]' : 'text-[#CBD5E1]'}`} />
          <span className="text-[11px] mt-0.5">Home</span>
        </Link>

        {/* 2. Market */}
        <Link
          href="/market"
          className={`flex flex-col items-center justify-center rounded-xl relative transition ${
            isMarket
              ? 'bg-[#251811] border border-[#E06924]/40 text-[#E8732A] font-bold shadow-[inset_0_1px_8px_rgba(224,105,36,0.2)]'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <div className="relative">
            <TrendingUp className={`w-5 h-5 ${isMarket ? 'text-[#E8732A]' : 'text-[#CBD5E1]'}`} />
          </div>
          <span className="text-[11px] mt-0.5">Market</span>
        </Link>

        {/* 3. Cart */}
        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center rounded-xl relative transition ${
            isCart
              ? 'bg-[#251811] border border-[#E06924]/40 text-[#E8732A] font-bold shadow-[inset_0_1px_8px_rgba(224,105,36,0.2)]'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          <div className="relative">
            <ShoppingCart className={`w-5 h-5 ${isCart ? 'text-[#E8732A]' : 'text-[#CBD5E1]'}`} />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#E06924] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-[#0B0E11]">
                {cart.length}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5">Cart</span>
        </Link>

        {/* 4. Profile or Sign In */}
        <Link
          href={isAuthenticated ? '/profile' : '/login'}
          className={`flex flex-col items-center justify-center rounded-xl transition ${
            isProfile
              ? 'bg-[#251811] border border-[#E06924]/40 text-[#E8732A] font-bold shadow-[inset_0_1px_8px_rgba(224,105,36,0.2)]'
              : 'text-[#94A3B8] hover:text-white'
          }`}
        >
          {isAuthenticated ? (
            <User className={`w-5 h-5 ${isProfile ? 'text-[#E8732A]' : 'text-[#CBD5E1]'}`} />
          ) : (
            <LogIn className={`w-5 h-5 ${isProfile ? 'text-[#E8732A]' : 'text-[#CBD5E1]'}`} />
          )}
          <span className="text-[11px] mt-0.5">{isAuthenticated ? 'Profile' : 'Sign In'}</span>
        </Link>
      </div>
    </div>
  );
}
