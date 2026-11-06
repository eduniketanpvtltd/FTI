import type { Metadata } from 'next';

const TITLE = 'Live Mandi Steel & Scrap Price Desk – Mandi Gobindgarh & Ludhiana Rates';
const DESCRIPTION =
  'Real-time daily Mandi spot benchmark prices for Billet, Ingot, TMT Rebar, Wire Rod, Melting Scrap, Old Scrap, HMS 80:20, Turning Scrap & End Cuttings across Mandi Gobindgarh, Ludhiana EN8D, Ludhiana MS, Raipur & 15+ Indian steel hubs.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/market',
  },
  openGraph: {
    title: `${TITLE} | FTI`,
    description: DESCRIPTION,
    url: '/market',
    type: 'website',
    images: [
      {
        url: '/images/og-market.jpg',
        width: 1200,
        height: 630,
        alt: 'FTI Live Mandi Steel & Scrap Price Desk – Mandi Gobindgarh & Ludhiana Spot Rates',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | FTI`,
    description: DESCRIPTION,
    images: ['/images/og-market.jpg'],
  },
};

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

