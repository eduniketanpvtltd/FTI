import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FTI – FieldFast Tech International | B2B Metal Trading Desk',
    short_name: 'FTI Metals',
    description:
      'Direct Mill Raw Materials Catalog & Live Mandi Gobindgarh / Ludhiana Steel & Scrap Price Index.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0E11',
    theme_color: '#0B0E11',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

