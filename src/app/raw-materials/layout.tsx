import type { Metadata } from 'next';

const TITLE = 'Industrial Raw Materials Catalog – Round Bar, Bright Bar, Flat, Sheet & TMT';
const DESCRIPTION =
  'Source direct-mill certified steel Round Bars, Precision Bright Bars, Flat Bars, Steel Sheets & Plates, Square Bars, and TMT Rebars (IS: 2062, IS: 2073, EN8D, EN19, EN24). Configure custom dimensions & request instant B2B quotations.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/raw-materials',
  },
  openGraph: {
    title: `${TITLE} | FTI`,
    description: DESCRIPTION,
    url: '/raw-materials',
    type: 'website',
    images: [
      {
        url: '/images/og-catalog.jpg',
        width: 1200,
        height: 630,
        alt: 'FTI Industrial Steel & Alloy Raw Materials B2B Quotation Catalog',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | FTI`,
    description: DESCRIPTION,
    images: ['/images/og-catalog.jpg'],
  },
};

export default function RawMaterialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

