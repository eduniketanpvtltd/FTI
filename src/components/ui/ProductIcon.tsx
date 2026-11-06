import React from 'react';

interface ProductIconProps {
  slug: string;
  className?: string;
}

const PRODUCT_IMAGE_MAP: Record<string, { src: string; alt: string }> = {
  'round-bar': {
    src: '/images/round-bar-fg.jpg',
    alt: 'Round Bar',
  },
  'bright-bar': {
    src: '/images/bright-bar-fg.jpg',
    alt: 'Bright Bar',
  },
  flat: {
    src: '/images/flat-bar-fg.jpg',
    alt: 'Flat Bar',
  },
  sheet: {
    src: '/images/sheet-plate-fg.jpg',
    alt: 'Steel Sheet & Plate',
  },
  square: {
    src: '/images/square-bar-fg.jpg',
    alt: 'Square Bar',
  },
  'tmt-bar': {
    src: '/images/tmt-rebar-fg.jpg',
    alt: 'TMT Rebar',
  },
  'square-bright-bar': {
    src: '/images/square-bright-bar-fg.jpg',
    alt: 'Square Bright Bar',
  },
  fasteners: {
    src: '/images/fasteners-fg.jpg',
    alt: 'Industrial Fasteners',
  },
  'tractor-parts': {
    src: '/images/tractor-parts-fg.jpg',
    alt: 'Forged Tractor Parts',
  },
};

export function ProductIcon({ slug, className = 'w-12 h-12' }: ProductIconProps) {
  const imageInfo = PRODUCT_IMAGE_MAP[slug] || {
    src: '/images/billet-fg.jpg',
    alt: slug,
  };

  return (
    <div
      className={`${className} rounded-xl overflow-hidden border border-[#2C3545] bg-[#181D25] shadow-[0_2px_10px_rgba(0,0,0,0.45)] relative shrink-0`}
    >
      <img
        src={imageInfo.src}
        alt={imageInfo.alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
    </div>
  );
}
