import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store-context';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://fieldfast.in');

const DEFAULT_TITLE =
  'FTI – FieldFast Tech International | Direct Mill Raw Materials & Live Mandi Price Desk';
const DEFAULT_DESCRIPTION =
  'ISO 9001:2015 Certified B2B metal trading platform for industrial steel Round Bars, Bright Bars, Flats, Sheets, Square Bars, TMT Rebars, and real-time Mandi Gobindgarh & Ludhiana live scrap & billet spot rates.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s | FTI – FieldFast Tech International',
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: 'FTI – FieldFast Tech International',
  authors: [{ name: 'FieldFast Tech International (FTI)', url: SITE_URL }],
  creator: 'FieldFast Tech International',
  publisher: 'FieldFast Tech International',
  category: 'Industrial B2B Metal Trading & Steel Marketplace',
  keywords: [
    'FTI',
    'FieldFast Tech International',
    'Mandi Gobindgarh Steel Rates',
    'Ludhiana EN8D Rate Today',
    'Ludhiana MS Scrap Rate',
    'Live Mandi Steel Price Index',
    'Industrial Raw Materials',
    'Steel Round Bar Supplier',
    'Precision Bright Bar',
    'Steel Flat Bar IS 2062',
    'TMT Rebar Fe550D',
    'HMS Scrap Price India',
    'Melting Scrap Rate Today',
    'Billet & Ingot Spot Price',
    'B2B Metal Quotations India',
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'FTI – FieldFast Tech International',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'FTI – FieldFast Tech International | Direct Mill Raw Materials & Live Mandi Steel Scrap Price Index',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/images/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0B0E11',
  colorScheme: 'dark',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'FieldFast Tech International (FTI)',
  alternateName: 'FTI Metal Trading Desk',
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  description: DEFAULT_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ludhiana / Mandi Gobindgarh',
    addressRegion: 'Punjab',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi', 'Punjabi'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0B0E11] text-[#F8FAFC] antialiased selection:bg-[#E8732A] selection:text-white">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
