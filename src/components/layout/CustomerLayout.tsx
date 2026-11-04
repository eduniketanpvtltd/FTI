import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#A8ADB1] text-[#252A2E]">
      <Header />
      <main className="flex-1 pb-20 md:pb-12">{children}</main>
      <Footer />
      <BottomNav />
    </div>
  );
}
