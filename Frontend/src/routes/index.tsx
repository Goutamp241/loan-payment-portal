/**
 * Application routing configuration.
 */

import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { ROUTES } from '@/routes/paths';
import { useRepayment } from '@/hooks/useRepayment';
import { paymentService } from '@/services/paymentService';
import { VerificationPage } from '@/pages/VerificationPage';
import { LoanDetailsPage } from '@/pages/LoanDetailsPage';
import { ReviewConfirmPage } from '@/pages/ReviewConfirmPage';
import { GatewayRedirectPage } from '@/pages/GatewayRedirectPage';
import { PaymentPage } from '@/pages/PaymentPage';
import { PaymentProcessingPage } from '@/pages/PaymentProcessingPage';
import { PaymentSuccessPage } from '@/pages/PaymentSuccessPage';
import { PaymentFailurePage } from '@/pages/PaymentFailurePage';
import { RetryingPaymentPage } from '@/pages/RetryingPaymentPage';
import { PaymentFailureReceiptPage } from '@/pages/PaymentFailureReceiptPage';
import { PaymentHistoryPage } from '@/pages/PaymentHistoryPage';
import { OnePaySandboxPage } from '@/pages/OnePaySandboxPage';
import type { PaymentMethodSelection } from '@/types';

function VerificationRoute() {
  const navigate = useNavigate();
  return <VerificationPage onSuccess={() => navigate(ROUTES.LOAN_DETAILS)} />;
}

function LoanDetailsRoute() {
  const navigate = useNavigate();
  const { verification, setSelection } = useRepayment();

  if (!verification) {
    return <Navigate to={ROUTES.VERIFICATION} replace />;
  }

  return (
    <LoanDetailsPage
      onBack={() => navigate(ROUTES.VERIFICATION)}
      onProceed={(sel) => {
        setSelection(sel);
        navigate(ROUTES.REVIEW);
      }}
    />
  );
}

function ReviewRoute() {
  const navigate = useNavigate();
  const { selection, loanDetails } = useRepayment();

  if (!loanDetails) {
    return <Navigate to={ROUTES.LOAN_DETAILS} replace />;
  }

  return (
    <ReviewConfirmPage
      selection={selection}
      onBack={() => navigate(ROUTES.LOAN_DETAILS)}
      onProceed={() => navigate(ROUTES.GATEWAY)}
    />
  );
}

function GatewayRoute() {
  const navigate = useNavigate();
  const { selection, loanDetails } = useRepayment();

  if (!loanDetails) {
    return <Navigate to={ROUTES.LOAN_DETAILS} replace />;
  }

  return (
    <GatewayRedirectPage
      selection={selection}
      onProceed={() => navigate(ROUTES.PAYMENT)}
    />
  );
}

function PaymentRoute() {
  const navigate = useNavigate();
  const { selection, loanDetails, setPaymentMethod } = useRepayment();

  if (!loanDetails) {
    return <Navigate to={ROUTES.LOAN_DETAILS} replace />;
  }

  return (
    <PaymentPage
      selection={selection}
      onBack={() => navigate(ROUTES.REVIEW)}
      onPay={(method: PaymentMethodSelection) => {
        setPaymentMethod(method);
        navigate(ROUTES.ONEPAY);
      }}
    />
  );
}

function OnePayRoute() {
  const navigate = useNavigate();
  const { selection, loanDetails, transaction, paymentMethod } = useRepayment();

  if (!loanDetails || !transaction || !paymentMethod) {
    return <Navigate to={ROUTES.PAYMENT} replace />;
  }

  return (
    <OnePaySandboxPage
      selection={selection}
      onSuccess={() => navigate(ROUTES.PROCESSING)}
      onFailure={() => navigate(ROUTES.PAYMENT_FAILURE)}
    />
  );
}

function ProcessingRoute() {
  const navigate = useNavigate();
  const { selection, loanDetails, transaction } = useRepayment();

  if (!loanDetails || !transaction) {
    return <Navigate to={ROUTES.LOAN_DETAILS} replace />;
  }

  if (transaction.status === 'failed') {
    return <Navigate to={ROUTES.PAYMENT_FAILURE} replace />;
  }

  return (
    <PaymentProcessingPage
      selection={selection}
      onComplete={() => navigate(ROUTES.PAYMENT_SUCCESS)}
      onFail={() => navigate(ROUTES.PAYMENT_FAILURE)}
    />
  );
}

function PaymentSuccessRoute() {
  const { selection, loanDetails, transaction } = useRepayment();

  if (!loanDetails) {
    return <Navigate to={ROUTES.VERIFICATION} replace />;
  }

  if (!transaction || transaction.status !== 'success') {
    return <Navigate to={ROUTES.LOAN_DETAILS} replace />;
  }

  return <PaymentSuccessPage selection={selection} />;
}

function PaymentHistoryRoute() {
  const navigate = useNavigate();
  const { verification, authToken } = useRepayment();

  if (!verification || !authToken) {
    return <Navigate to={ROUTES.VERIFICATION} replace />;
  }

  return (
    <PaymentHistoryPage
      onBack={() => navigate(-1)}
    />
  );
}

function PaymentFailureRoute() {
  const navigate = useNavigate();
  const { selection, loanDetails, authToken, setTransaction } = useRepayment();

  if (!loanDetails) {
    return <Navigate to={ROUTES.VERIFICATION} replace />;
  }

  async function handleRetry() {
    if (!authToken) return;
    try {
      const result = await paymentService.retry(authToken, selection.amount, selection.option);
      setTransaction({
        id: result.id,
        transactionId: result.transactionId,
        transactionTime: '',
        status: 'pending',
        amount: result.amount,
      });
      navigate(ROUTES.ONEPAY);
    } catch {
      navigate(ROUTES.PAYMENT);
    }
  }

  return (
    <PaymentFailurePage
      selection={selection}
      onRetry={handleRetry}
      onChangeMethod={() => navigate(ROUTES.PAYMENT)}
      onReceipt={() => navigate(ROUTES.FAILURE_RECEIPT)}
    />
  );
}

function RetryingRoute() {
  const navigate = useNavigate();
  const { selection, loanDetails } = useRepayment();

  if (!loanDetails) {
    return <Navigate to={ROUTES.VERIFICATION} replace />;
  }

  return (
    <RetryingPaymentPage
      selection={selection}
      onComplete={() => navigate(ROUTES.PAYMENT_SUCCESS)}
      onFail={() => navigate(ROUTES.PAYMENT_FAILURE)}
    />
  );
}

function FailureReceiptRoute() {
  const navigate = useNavigate();
  const { selection, loanDetails, authToken, setTransaction } = useRepayment();

  if (!loanDetails) {
    return <Navigate to={ROUTES.VERIFICATION} replace />;
  }

  async function handleRetry() {
    if (!authToken) return;
    try {
      const result = await paymentService.retry(authToken, selection.amount, selection.option);
      setTransaction({
        id: result.id,
        transactionId: result.transactionId,
        transactionTime: '',
        status: 'pending',
        amount: result.amount,
      });
      navigate(ROUTES.ONEPAY);
    } catch {
      navigate(ROUTES.PAYMENT);
    }
  }

  return (
    <PaymentFailureReceiptPage
      selection={selection}
      onRetry={handleRetry}
      onChangeMethod={() => navigate(ROUTES.PAYMENT)}
    />
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.VERIFICATION} replace />} />
      <Route path={ROUTES.VERIFICATION} element={<VerificationRoute />} />
      <Route path={ROUTES.LOAN_DETAILS} element={<LoanDetailsRoute />} />
      <Route path={ROUTES.REVIEW} element={<ReviewRoute />} />
      <Route path={ROUTES.GATEWAY} element={<GatewayRoute />} />
      <Route path={ROUTES.PAYMENT} element={<PaymentRoute />} />
      <Route path={ROUTES.ONEPAY} element={<OnePayRoute />} />
      <Route path={ROUTES.PROCESSING} element={<ProcessingRoute />} />
      <Route path={ROUTES.PAYMENT_SUCCESS} element={<PaymentSuccessRoute />} />
      <Route path={ROUTES.PAYMENT_HISTORY} element={<PaymentHistoryRoute />} />
      <Route path={ROUTES.PAYMENT_FAILURE} element={<PaymentFailureRoute />} />
      <Route path={ROUTES.RETRYING} element={<RetryingRoute />} />
      <Route path={ROUTES.FAILURE_RECEIPT} element={<FailureReceiptRoute />} />
      <Route path="*" element={<Navigate to={ROUTES.VERIFICATION} replace />} />
    </Routes>
  );
}
