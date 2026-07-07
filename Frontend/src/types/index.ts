/**
 * Shared TypeScript types for the Loan Repayment Portal.
 */

export type InputState = 'default' | 'focus' | 'success' | 'error';

export type PaymentOption = 'total' | 'minimum' | 'custom';

export interface PaymentSelection {
  option: PaymentOption;
  amount: number;
  label: string;
}

export interface InputField {
  value: string;
  state: InputState;
  error: string;
}

export type PayMethodTab = 'upi' | 'card' | 'netbanking' | 'wallet';

export type WalletOption = 'amazonpay' | 'mobikwik' | 'paytm' | 'freecharge' | null;

/** Stored after successful identity verification (step 1). */
export interface VerificationState {
  mobile: string;
  cardLast4: string;
  verifiedAt: string;
  captchaToken?: string;
}

/** Decrypted loan/payment details from the backend API (step 2). */
export interface LoanDetails {
  customerName: string;
  customerId: string;
  mobileMasked: string;
  cardMasked: string;
  paymentDueDate: string;
  totalDue: number;
  minimumDue: number;
  processingFee: number;
  convenienceFee: number;
  paymentStatus: 'pending' | 'paid' | 'none';
  lastUpdated: string;
}

/** Active repayment session created by the backend. */
export interface PaymentSession {
  referenceNumber: string;
  sessionDate: string;
  expiresAt?: string;
}

/** Final transaction result from 1Pay callback / status API. */
export interface TransactionResult {
  id: string;
  transactionId: string;
  transactionTime: string;
  status: 'success' | 'failed' | 'pending';
  failureReason?: string;
  amount: number;
  paymentMethod?: string;
}

/** Row in the payment history list (all session transactions). */
export interface PaymentHistoryItem {
  id: string;
  transactionId: string;
  amount: number;
  status: 'success' | 'failed' | 'pending' | 'processing';
  paymentOption: string;
  transactionTime: string;
  failureReason?: string;
}

/** Payment method chosen on the merchant payment page before 1Pay OTP. */
export interface PaymentMethodSelection {
  tab: PayMethodTab;
  label: string;
}
