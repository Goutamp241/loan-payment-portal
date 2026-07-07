/**
 * Payment API — encrypts payment requests and verifies simulated 1Pay OTP.
 */

import { apiRequest } from './api';
import { encryptPayload, getEncryptionSecret } from '@/utils/crypto';
import type { PaymentSelection, PaymentHistoryItem, TransactionResult } from '@/types';

export interface InitiatePaymentPayload {
  selection: PaymentSelection;
  acceptedPrivacyPolicy: boolean;
  acceptedTerms: boolean;
}

export interface InitiatePaymentResponse {
  id: string;
  transactionId: string;
  amount: number;
  status: 'pending';
  paymentMode: 'simulated' | 'live';
  gatewayPath: string;
}

export interface VerifyOtpPayload {
  transactionId: string;
  otp: string;
  paymentMethod: string;
  paymentMethodLabel: string;
}

export interface VerifyOtpResponse {
  transaction: TransactionResult;
}

export const paymentService = {
  async initiate(token: string, payload: InitiatePaymentPayload): Promise<InitiatePaymentResponse> {
    const encryptedPayload = await encryptPayload(payload, getEncryptionSecret());

    return apiRequest<InitiatePaymentResponse>('/api/payment/initiate', {
      method: 'POST',
      token,
      body: JSON.stringify({ encryptedPayload, algorithm: 'AES-256-GCM' }),
    });
  },

  async verifyOtp(token: string, payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
    return apiRequest<VerifyOtpResponse>('/api/payment/verify-otp', {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    });
  },

  async retry(token: string, amount: number, paymentOption: string): Promise<InitiatePaymentResponse> {
    return apiRequest<InitiatePaymentResponse>('/api/payment/retry', {
      method: 'POST',
      token,
      body: JSON.stringify({ amount, paymentOption }),
    });
  },

  async getStatus(token: string, transactionId: string) {
    return apiRequest<{ transaction: TransactionResult }>(`/api/payment/status/${transactionId}`, {
      method: 'GET',
      token,
    });
  },

  async getHistory(token: string) {
    return apiRequest<{ transactions: PaymentHistoryItem[] }>('/api/payment/history', {
      method: 'GET',
      token,
    });
  },
};
