import type { Metadata } from 'next';

const TITLE = 'High-Tensile Industrial Fasteners – Hex Bolts, Nuts & Studs (Grades 8.8, 10.9, 12.9)';
const DESCRIPTION =
  'IS / DIN / ISO certified high-tensile industrial hex bolts, heavy hex nuts, structural washers, and threaded studs manufactured by FieldFast Tech International (FTI).';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/fasteners' },
  openGraph: {
    title: `${TITLE} | FTI`,
    description: DESCRIPTION,
    url: '/fasteners',
    type: 'website',
    images: [{ url: '/images/fasteners-fg.jpg', width: 1024, height: 1024, alt: 'FTI Industrial Fasteners' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | FTI`,
    description: DESCRIPTION,
    images: ['/images/fasteners-fg.jpg'],
  },
};

export default function FastenersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

