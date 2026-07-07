/**
 * Loan details API — fetches encrypted payload and decrypts client-side.
 */

import { apiRequest } from './api';
import { decryptPayload, getEncryptionSecret } from '@/utils/crypto';
import type { LoanDetails, PaymentSession } from '@/types';

interface EncryptedLoanResponse {
  encryptedPayload: string;
  algorithm: 'AES-256-GCM';
}

interface DecryptedLoanPayload {
  loanDetails: LoanDetails;
  session: PaymentSession;
}

export const loanService = {
  async getDetails(token: string): Promise<DecryptedLoanPayload> {
    const encrypted = await apiRequest<EncryptedLoanResponse>('/api/loan/details', {
      method: 'GET',
      token,
    });

    return decryptPayload<DecryptedLoanPayload>(encrypted.encryptedPayload, getEncryptionSecret());
  },

  /** New session + fresh balances after a completed payment. */
  async refreshSession(token: string): Promise<DecryptedLoanPayload & { token: string }> {
    const encrypted = await apiRequest<EncryptedLoanResponse & { token: string }>(
      '/api/loan/refresh-session',
      { method: 'POST', token },
    );

    const { token: newToken, encryptedPayload } = encrypted;
    const payload = await decryptPayload<DecryptedLoanPayload>(encryptedPayload, getEncryptionSecret());
    return { token: newToken, ...payload };
  },
};

export type { DecryptedLoanPayload };
