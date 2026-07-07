/**
 * Custom hooks for shared application logic.
 */

import { useContext } from 'react';
import { RepaymentContext } from '@/context/RepaymentContext';

/** Access repayment flow state (verification, loan details, session, transaction). */
export function useRepayment() {
  const context = useContext(RepaymentContext);
  if (!context) {
    throw new Error('useRepayment must be used within a RepaymentProvider');
  }
  return context;
}

/** @deprecated Use useRepayment instead */
export const usePayment = useRepayment;
