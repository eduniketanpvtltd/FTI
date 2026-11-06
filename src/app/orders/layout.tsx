import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'B2B Steel Dispatch Orders & Tax Invoices',
  description:
    'Monitor live mill dispatch schedules, weighbridge slips, lorry receipts, and GST tax invoices for your FieldFast Tech International orders.',
  alternates: { canonical: '/orders' },
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

