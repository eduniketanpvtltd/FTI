import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store-context';

export const metadata: Metadata = {
  title: 'FTI – Industrial Raw Materials & Scrap Trading Platform',
  description:
    'B2B marketplace for industrial steel round bars, bright bars, flats, sheets, square bars, TMT rebars, and real-time live scrap market prices.',
  keywords: [
    'FTI',
    'Industrial Raw Materials',
    'Steel Trading',
    'Round Bar',
    'Bright Bar',
    'TMT Bar',
    'Scrap Prices',
    'Mandi Gobindgarh Rates',
    'B2B Metal Quotations',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
