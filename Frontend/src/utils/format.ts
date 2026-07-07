/**
 * Display formatting helpers for currency, dates, and masked fields.
 */

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function maskMobile(mobile: string): string {
  if (mobile.length < 4) return mobile;
  return `+91 ${mobile.slice(0, 2)}XXXXXX${mobile.slice(-2)}`;
}

export function maskCardLast4(last4: string): string {
  return `XXXX XXXX XXXX ${last4}`;
}

export function formatDisplayDate(isoOrDate: string): string {
  const date = new Date(isoOrDate);
  if (Number.isNaN(date.getTime())) return isoOrDate;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function displayValue(value: string | number | null | undefined, fallback = '—'): string {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
}
