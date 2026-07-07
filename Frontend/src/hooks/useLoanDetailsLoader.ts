/**
 * Hook to load loan details from the backend after verification.
 */

import { useCallback, useEffect } from 'react';
import { useRepayment } from '@/hooks/useRepayment';
import { loanService } from '@/services/loanService';
import { ApiError } from '@/services/api';
import type { PaymentSelection } from '@/types';

export function useLoanDetailsLoader() {
  const {
    authToken,
    verification,
    loanDetails,
    loanLoading,
    loanError,
    setLoanDetails,
    setSession,
    setAuthToken,
    setLoanLoading,
    setLoanError,
    setSelection,
  } = useRepayment();

  const loadLoanDetails = useCallback(async () => {
    if (!authToken || !verification) {
      setLoanError('Please verify your identity first.');
      return;
    }

    setLoanLoading(true);
    setLoanError(null);

    try {
      let details;
      let session;
      let newToken: string | undefined;

      try {
        const result = await loanService.getDetails(authToken);
        details = result.loanDetails;
        session = result.session;
      } catch (err) {
        if (err instanceof ApiError && err.code === 'SESSION_EXPIRED') {
          const refreshed = await loanService.refreshSession(authToken);
          newToken = refreshed.token;
          details = refreshed.loanDetails;
          session = refreshed.session;
        } else {
          throw err;
        }
      }

      if (newToken) {
        setAuthToken(newToken);
      }
      setLoanDetails(details);
      setSession(session);

      const defaultSelection: PaymentSelection = {
        option: details.totalDue > 0 ? 'total' : 'minimum',
        amount: details.totalDue > 0 ? details.totalDue : details.minimumDue,
        label: details.totalDue > 0 ? 'Pay Total Due' : 'Pay Minimum Due',
      };
      setSelection(defaultSelection);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Unable to load payment details. Please try again.';
      setLoanError(message);
      setLoanDetails(null);
      setSession(null);
    } finally {
      setLoanLoading(false);
    }
  }, [
    authToken,
    verification,
    setLoanDetails,
    setSession,
    setAuthToken,
    setLoanLoading,
    setLoanError,
    setSelection,
  ]);

  useEffect(() => {
    if (verification && authToken && !loanDetails && !loanLoading && !loanError) {
      void loadLoanDetails();
    }
  }, [verification, authToken, loanDetails, loanLoading, loanError, loadLoanDetails]);

  return { loanDetails, loanLoading, loanError, reload: loadLoanDetails };
}
