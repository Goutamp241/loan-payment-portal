/**
 * Global repayment flow state — single source of truth for API-driven data.
 * Replaces scattered hardcoded mock values across pages.
 */

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type {
  LoanDetails,
  PaymentMethodSelection,
  PaymentSelection,
  PaymentSession,
  TransactionResult,
  VerificationState,
} from '@/types';

const emptySelection: PaymentSelection = {
  option: 'total',
  amount: 0,
  label: 'Pay Total Due',
};

export interface RepaymentContextValue {
  authToken: string | null;
  verification: VerificationState | null;
  loanDetails: LoanDetails | null;
  session: PaymentSession | null;
  transaction: TransactionResult | null;
  paymentMethod: PaymentMethodSelection | null;
  selection: PaymentSelection;
  loanLoading: boolean;
  loanError: string | null;
  setAuthToken: (token: string | null) => void;
  setVerification: (verification: VerificationState | null) => void;
  setLoanDetails: (details: LoanDetails | null) => void;
  setSession: (session: PaymentSession | null) => void;
  setTransaction: (transaction: TransactionResult | null) => void;
  setPaymentMethod: (method: PaymentMethodSelection | null) => void;
  setSelection: (selection: PaymentSelection) => void;
  setLoanLoading: (loading: boolean) => void;
  setLoanError: (error: string | null) => void;
  resetFlow: () => void;
}

export const RepaymentContext = createContext<RepaymentContextValue | null>(null);

interface RepaymentProviderProps {
  children: ReactNode;
}

export function RepaymentProvider({ children }: RepaymentProviderProps) {
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const [verification, setVerificationState] = useState<VerificationState | null>(null);
  const [loanDetails, setLoanDetailsState] = useState<LoanDetails | null>(null);
  const [session, setSessionState] = useState<PaymentSession | null>(null);
  const [transaction, setTransactionState] = useState<TransactionResult | null>(null);
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethodSelection | null>(null);
  const [selection, setSelectionState] = useState<PaymentSelection>(emptySelection);
  const [loanLoading, setLoanLoadingState] = useState(false);
  const [loanError, setLoanErrorState] = useState<string | null>(null);

  const setAuthToken = useCallback((token: string | null) => setAuthTokenState(token), []);
  const setVerification = useCallback((v: VerificationState | null) => setVerificationState(v), []);
  const setLoanDetails = useCallback((d: LoanDetails | null) => setLoanDetailsState(d), []);
  const setSession = useCallback((s: PaymentSession | null) => setSessionState(s), []);
  const setTransaction = useCallback((t: TransactionResult | null) => setTransactionState(t), []);
  const setPaymentMethod = useCallback((m: PaymentMethodSelection | null) => setPaymentMethodState(m), []);
  const setLoanLoading = useCallback((l: boolean) => setLoanLoadingState(l), []);
  const setLoanError = useCallback((e: string | null) => setLoanErrorState(e), []);

  const setSelection = useCallback((next: PaymentSelection) => {
    setSelectionState(next);
  }, []);

  const resetFlow = useCallback(() => {
    setAuthTokenState(null);
    setVerificationState(null);
    setLoanDetailsState(null);
    setSessionState(null);
    setTransactionState(null);
    setPaymentMethodState(null);
    setSelectionState(emptySelection);
    setLoanLoadingState(false);
    setLoanErrorState(null);
  }, []);

  useEffect(() => {
    const onSessionExpired = () => resetFlow();
    window.addEventListener('repayment:session-expired', onSessionExpired);
    return () => window.removeEventListener('repayment:session-expired', onSessionExpired);
  }, [resetFlow]);

  const value = useMemo(
    () => ({
      authToken,
      verification,
      loanDetails,
      session,
      transaction,
      paymentMethod,
      selection,
      loanLoading,
      loanError,
      setAuthToken,
      setVerification,
      setLoanDetails,
      setSession,
      setTransaction,
      setPaymentMethod,
      setSelection,
      setLoanLoading,
      setLoanError,
      resetFlow,
    }),
    [
      authToken,
      verification,
      loanDetails,
      session,
      transaction,
      paymentMethod,
      selection,
      loanLoading,
      loanError,
      setAuthToken,
      setVerification,
      setLoanDetails,
      setSession,
      setTransaction,
      setPaymentMethod,
      setSelection,
      setLoanLoading,
      setLoanError,
      resetFlow,
    ],
  );

  return <RepaymentContext.Provider value={value}>{children}</RepaymentContext.Provider>;
}
