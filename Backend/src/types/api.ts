/**
 * API response shapes shared with the React frontend.
 */

export interface LoanDetailsDto {
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

export interface SessionDto {
  referenceNumber: string;
  sessionDate: string;
  expiresAt?: string;
}

export interface VerifyResponseDto {
  token: string;
  verification: {
    mobile: string;
    cardLast4: string;
    verifiedAt: string;
  };
  /** Placeholder for Step 5 — encrypted loan payload */
  encryptedLoanDetails: string | null;
}

export interface LoanDetailsResponseDto {
  encryptedPayload: string;
  algorithm: 'AES-256-GCM';
}

export interface DecryptedLoanPayload {
  loanDetails: LoanDetailsDto;
  session: SessionDto;
}

export interface EncryptedPaymentRequestDto {
  encryptedPayload: string;
  algorithm: 'AES-256-GCM';
}

export interface DecryptedPaymentRequest {
  selection: {
    option: string;
    amount: number;
    label: string;
  };
  acceptedPrivacyPolicy: boolean;
  acceptedTerms: boolean;
}

export interface InitiatePaymentResponseDto {
  id: string;
  transactionId: string;
  amount: number;
  status: 'pending';
  paymentMode: 'simulated' | 'live';
  gatewayPath: string;
}

export interface VerifyOtpRequestDto {
  transactionId: string;
  otp: string;
  paymentMethod: string;
  paymentMethodLabel: string;
}

export interface TransactionResultDto {
  id: string;
  transactionId: string;
  transactionTime: string;
  status: 'success' | 'failed' | 'pending';
  failureReason?: string;
  amount: number;
  paymentMethod?: string;
}
