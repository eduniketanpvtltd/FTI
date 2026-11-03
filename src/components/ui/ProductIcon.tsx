import React from 'react';

interface ProductIconProps {
  slug: string;
  className?: string;
}

export function ProductIcon({ slug, className = 'w-12 h-12' }: ProductIconProps) {
  switch (slug) {
    case 'round-bar':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="64" height="64" rx="8" fill="#1e293b" />
          {/* 3D Round Bar representation */}
          <ellipse cx="20" cy="32" rx="8" ry="16" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
          <path d="M20 16 L48 16 C52.4 16 56 23.2 56 32 C56 40.8 52.4 48 48 48 L20 48 Z" fill="#334155" />
          <line x1="20" y1="16" x2="48" y2="16" stroke="#94a3b8" strokeWidth="2" />
          <line x1="20" y1="48" x2="48" y2="48" stroke="#94a3b8" strokeWidth="2" />
          <ellipse cx="48" cy="32" rx="8" ry="16" fill="#475569" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="20" y1="24" x2="48" y2="24" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );

    case 'bright-bar':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="64" height="64" rx="8" fill="#0f172a" />
          <ellipse cx="18" cy="32" rx="7" ry="15" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M18 17 L48 17 C51.8 17 55 23.7 55 32 C55 40.3 51.8 47 48 47 L18 47 Z" fill="#64748b" />
          <ellipse cx="48" cy="32" rx="7" ry="15" fill="#cbd5e1" stroke="#f8fafc" strokeWidth="2" />
          {/* High gloss specular bright reflection lines */}
          <line x1="18" y1="22" x2="48" y2="22" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="26" x2="48" y2="26" stroke="#e2e8f0" strokeWidth="1.5" />
        </svg>
      );

    case 'flat':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="64" height="64" rx="8" fill="#1e293b" />
          {/* Industrial Flat bar perspective */}
          <polygon points="12,38 32,46 54,34 34,26" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
          <polygon points="12,38 32,46 32,52 12,44" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
          <polygon points="32,46 54,34 54,40 32,52" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
          <polygon points="18,22 40,30 56,22 34,14" fill="#64748b" opacity="0.5" />
        </svg>
      );

    case 'sheet':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="64" height="64" rx="8" fill="#1e293b" />
          {/* Layered sheet plates */}
          <polygon points="14,30 32,20 52,28 34,38" fill="#64748b" stroke="#cbd5e1" strokeWidth="1.5" />
          <polygon points="14,36 32,26 52,34 34,44" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="14,42 32,32 52,40 34,50" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
        </svg>
      );

    case 'square':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="64" height="64" rx="8" fill="#1e293b" />
          {/* 3D solid square bar */}
          <polygon points="20,18 44,18 44,42 20,42" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
          <polygon points="44,18 54,26 54,50 44,42" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
          <polygon points="20,42 44,42 54,50 30,50" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
        </svg>
      );

    case 'tmt-bar':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="64" height="64" rx="8" fill="#1e293b" />
          {/* TMT Bar with distinctive ribs */}
          <rect x="14" y="26" width="36" height="12" rx="2" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
          <line x1="20" y1="26" x2="24" y2="38" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <line x1="27" y1="26" x2="31" y2="38" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <line x1="34" y1="26" x2="38" y2="38" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
          <line x1="41" y1="26" x2="45" y2="38" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'square-bright-bar':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="64" height="64" rx="8" fill="#0f172a" />
          <polygon points="18,16 42,16 42,40 18,40" fill="#94a3b8" stroke="#ffffff" strokeWidth="2" />
          <polygon points="42,16 54,24 54,48 42,40" fill="#64748b" stroke="#e2e8f0" strokeWidth="1.5" />
          <polygon points="18,40 42,40 54,48 30,48" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1="22" y1="20" x2="38" y2="20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'fasteners':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="64" height="64" rx="8" fill="#1e293b" />
          {/* Hex bolt and nut */}
          <polygon points="26,16 38,16 44,26 38,36 26,36 20,26" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
          <rect x="29" y="36" width="6" height="18" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="28" y1="42" x2="36" y2="42" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="28" y1="46" x2="36" y2="46" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="28" y1="50" x2="36" y2="50" stroke="#cbd5e1" strokeWidth="1" />
        </svg>
      );

    case 'tractor-parts':
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="64" height="64" rx="8" fill="#1e293b" />
          {/* Forged mechanical gear & linkage */}
          <circle cx="32" cy="32" r="14" fill="#475569" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" />
          <circle cx="32" cy="32" r="6" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
          <line x1="16" y1="16" x2="24" y2="24" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <line x1="48" y1="48" x2="40" y2="40" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <rect width="64" height="64" rx="8" fill="#1e293b" />
          <rect x="18" y="18" width="28" height="28" rx="4" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
        </svg>
      );
  }
}
