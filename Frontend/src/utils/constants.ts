/**
 * Static application constants (validation rules and UI flow labels only).
 * All customer, loan, and transaction data comes from the backend API.
 */

export const MOBILE_REGEX = /^[6-9]\d{9}$/;
export const CARD_REGEX = /^\d{4}$/;

export const PAYMENT_STEPS = [
  { label: 'Identity Verification', shortLabel: 'Verify' },
  { label: 'Payment Details', shortLabel: 'Details' },
  { label: 'Review & Confirm', shortLabel: 'Review' },
  { label: 'Payment Gateway', shortLabel: 'Gateway' },
  { label: 'Payment Status', shortLabel: 'Status' },
] as const;

export const GATEWAY_STEPS = [
  'Preparing payment request...',
  'Encrypting payment information...',
  'Connecting to 1Pay...',
  'Redirecting securely...',
] as const;

export const POSSIBLE_FAILURE_REASONS = [
  'Incorrect UPI PIN',
  'Incorrect OTP',
  'Insufficient Account Balance',
  'Daily Transaction Limit Exceeded',
  'Network Timeout',
  'Bank Server Temporarily Unavailable',
  'Card Blocked or Expired',
  'Technical Error',
] as const;

export const RETRY_STEPS = [
  'Preparing payment request',
  'Encrypting payment details',
  'Connecting to payment gateway',
  'Verifying payment credentials',
  'Contacting issuing bank',
  'Authorizing transaction',
  'Completing secure payment',
] as const;

export const PROCESSING_STEPS = [
  'Payment request received',
  'Customer verification completed',
  'Secure encryption verified',
  'Contacting issuing bank...',
  'Waiting for bank authorization',
  'Finalizing transaction',
] as const;
