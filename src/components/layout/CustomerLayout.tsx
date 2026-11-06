import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E11] text-[#F8FAFC]">
      <Header />
      <main className="flex-1 pb-24 md:pb-12">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
