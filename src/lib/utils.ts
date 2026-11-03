import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Indian Rupees with proper grouping (e.g. ₹ 8,50,000)
 */
export function formatINR(amount: number, showDecimals: boolean = false): string {
  if (isNaN(amount)) return '₹0';
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  };
  return new Intl.NumberFormat('en-IN', options).format(amount);
}

/**
 * Format date in Indian readable format: 03 November 2026
 */
export function formatIndianDate(dateInput: string | Date | number): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

/**
 * Format date and time in Indian readable format: 03 November 2026, 11:30 AM
 */
export function formatIndianDateTime(dateInput: string | Date | number): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const datePart = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
  const timePart = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
  return `${datePart}, ${timePart}`;
}

/**
 * Convert number to Indian words for official invoices
 */
export function numberToIndianWords(num: number): string {
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if ((n = Math.floor(n)) === 0) return 'Zero';
    let str = '';
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    const hundred = Math.floor(n / 100);
    n %= 100;

    if (crore > 0) str += inWords(crore) + 'Crore ';
    if (lakh > 0) str += inWords(lakh) + 'Lakh ';
    if (thousand > 0) str += inWords(thousand) + 'Thousand ';
    if (hundred > 0) str += inWords(hundred) + 'Hundred ';
    if (n > 0) {
      if (str !== '') str += 'and ';
      if (n < 20) str += a[n];
      else str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
    }
    return str;
  }

  const rounded = Math.round(num);
  return inWords(rounded).trim() + ' Rupees Only';
}

/**
 * Generate sequential readable IDs:
 * FTI-QT-2026-0001, FTI-ORD-2026-0001, FTI-INV-2026-0001
 */
export function generateRefId(prefix: 'FTI-QT' | 'FTI-ORD' | 'FTI-INV', sequence: number): string {
  const year = 2026;
  const padded = String(sequence).padStart(4, '0');
  return `${prefix}-${year}-${padded}`;
}
