/**
 * Identity verification API — mobile + card last 4 + reCAPTCHA.
 */

import { apiRequest } from './api';
import type { LoanDetails, VerificationState } from '@/types';

interface VerifyPayload {
  mobile: string;
  cardLast4: string;
  captchaToken: string;
}

interface VerifyResponse {
  token: string;
  verification: VerificationState;
  /** Encrypted payload — decrypted client-side in a later step. */
  encryptedLoanDetails: string | null;
}

export const verificationService = {
  async verify(payload: VerifyPayload): Promise<VerifyResponse> {
    return apiRequest<VerifyResponse>('/api/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export type { VerifyResponse };
