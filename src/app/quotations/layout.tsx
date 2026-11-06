import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'B2B Quotations & Official Proforma Offers',
  description:
    'Track and review official B2B steel raw material quotations, unit prices, GST breakdowns, and validity schedules from FieldFast Tech International.',
  alternates: { canonical: '/quotations' },
};

export default function QuotationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

