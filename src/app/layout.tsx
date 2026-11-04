import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store-context';

export const metadata: Metadata = {
  title: 'FTI – FieldFast Tech International | Raw Materials & Scrap Trading',
  description:
    'FieldFast Tech International (FTI) B2B marketplace for industrial steel round bars, bright bars, flats, sheets, square bars, TMT rebars, and real-time live scrap market prices.',
  icons: {
    icon: '/fti-logo.png',
    shortcut: '/fti-logo.png',
    apple: '/fti-logo.png',
  },
  keywords: [
    'FTI',
    'FieldFast Tech International',
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
      <body className="min-h-full flex flex-col bg-[#A8ADB1] text-[#252A2E] antialiased selection:bg-[#76513F] selection:text-[#F1EAE1]">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
