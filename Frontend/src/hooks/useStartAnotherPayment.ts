/**
 * Hook — refresh loan balances and start a new payment session.
 */

import { useCallback, useState } from 'react';
import { useRepayment } from '@/hooks/useRepayment';
import { loanService } from '@/services/loanService';
import { ApiError } from '@/services/api';
import type { PaymentSelection } from '@/types';

export function useStartAnotherPayment() {
  const {
    authToken,
    setAuthToken,
    setLoanDetails,
    setSession,
    setTransaction,
    setPaymentMethod,
    setSelection,
    setLoanLoading,
    setLoanError,
  } = useRepayment();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const startAnotherPayment = useCallback(async (): Promise<boolean> => {
    if (!authToken) {
      setLoanError('Please verify your identity first.');
      return false;
    }

    setIsRefreshing(true);
    setLoanLoading(true);
    setLoanError(null);
    setTransaction(null);
    setPaymentMethod(null);

    try {
      const { token, loanDetails, session } = await loanService.refreshSession(authToken);
      setAuthToken(token);
      setLoanDetails(loanDetails);
      setSession(session);

      const defaultSelection: PaymentSelection = {
        option: loanDetails.totalDue > 0 ? 'total' : 'minimum',
        amount: loanDetails.totalDue > 0 ? loanDetails.totalDue : loanDetails.minimumDue,
        label: loanDetails.totalDue > 0 ? 'Pay Total Due' : 'Pay Minimum Due',
      };
      setSelection(defaultSelection);
      return true;
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Unable to refresh your account. Please verify again.';
      setLoanError(message);
      setLoanDetails(null);
      setSession(null);
      return false;
    } finally {
      setIsRefreshing(false);
      setLoanLoading(false);
    }
  }, [
    authToken,
    setAuthToken,
    setLoanDetails,
    setSession,
    setTransaction,
    setPaymentMethod,
    setSelection,
    setLoanLoading,
    setLoanError,
  ]);

  return { startAnotherPayment, isRefreshing };
}
