/**
 * Builds encrypted loan + session payload for API responses.
 */

import {
  getCustomerById,
  getLoanAccountByCustomerId,
  getPaymentSession,
} from './customer.service.js';
import {
  formatLastUpdated,
  formatSessionDate,
  maskCard,
  maskMobile,
} from '../utils/format.js';
import { encryptPayload } from '../utils/crypto.js';
import type { DecryptedLoanPayload } from '../types/api.js';
import type { PaymentSession } from '../types/database.js';

export async function buildEncryptedLoanResponse(
  customerId: string,
  session: PaymentSession,
): Promise<{ encryptedPayload: string; algorithm: 'AES-256-GCM' }> {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  const loan = await getLoanAccountByCustomerId(customer.id);
  if (!loan) {
    throw new Error('Loan account not found');
  }

  const payload: DecryptedLoanPayload = {
    loanDetails: {
      customerName: customer.full_name,
      customerId: customer.customer_id,
      mobileMasked: maskMobile(customer.mobile),
      cardMasked: maskCard(customer.card_last4),
      paymentDueDate: loan.due_date,
      totalDue: Number(loan.total_due),
      minimumDue: Number(loan.minimum_due),
      processingFee: Number(loan.processing_fee),
      convenienceFee: Number(loan.convenience_fee),
      paymentStatus: loan.payment_status,
      lastUpdated: formatLastUpdated(new Date(loan.last_updated)),
    },
    session: {
      referenceNumber: session.reference_number,
      sessionDate: formatSessionDate(new Date(session.created_at)),
      expiresAt: session.expires_at,
    },
  };

  return {
    encryptedPayload: encryptPayload(payload),
    algorithm: 'AES-256-GCM',
  };
}

/** Validates session is active and not expired. */
export function isSessionActive(session: PaymentSession | null): boolean {
  if (!session) return false;
  if (session.status !== 'active') return false;
  return new Date(session.expires_at) >= new Date();
}

export async function getActivePaymentSession(sessionId: string): Promise<PaymentSession | null> {
  const session = await getPaymentSession(sessionId);
  return isSessionActive(session) ? session : null;
}
