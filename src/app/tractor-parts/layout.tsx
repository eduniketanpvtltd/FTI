import type { Metadata } from 'next';

const TITLE = 'OEM Forged Tractor Parts & Agricultural Linkage Components';
const DESCRIPTION =
  'Heavy-duty closed-die forged EN8D / 20MnCr5 tractor three-point linkage parts, top links, hitch pins, PTO shafts, and agricultural forgings by FieldFast Tech International (FTI).';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/tractor-parts' },
  openGraph: {
    title: `${TITLE} | FTI`,
    description: DESCRIPTION,
    url: '/tractor-parts',
    type: 'website',
    images: [{ url: '/images/tractor-parts-fg.jpg', width: 1024, height: 1024, alt: 'FTI Forged Tractor Parts' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | FTI`,
    description: DESCRIPTION,
    images: ['/images/tractor-parts-fg.jpg'],
  },
};

export default function TractorPartsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

