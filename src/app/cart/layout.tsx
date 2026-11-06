import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Multi-Combination Quotation Cart – Request Direct Mill Pricing',
  description:
    'Review configured steel sizes, diameters, thicknesses, and grades in your B2B Quotation Cart and submit for official FTI ex-works pricing.',
  alternates: { canonical: '/cart' },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

