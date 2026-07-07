/**
 * Mask sensitive fields for API responses.
 */

export function maskMobile(mobile: string): string {
  if (mobile.length < 4) return mobile;
  return `+91 ${mobile.slice(0, 2)}XXXXXX${mobile.slice(-2)}`;
}

export function maskCard(cardLast4: string): string {
  return `XXXX XXXX XXXX ${cardLast4}`;
}

export function generateReferenceNumber(): string {
  const suffix = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `REF-${suffix}`;
}

export function generateTransactionId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TXN-${date}-${suffix}`;
}

export function formatTransactionTime(date: Date): string {
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function formatSessionDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatLastUpdated(date: Date): string {
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
