/**
 * PaymentSuccess page — part of the loan repayment flow.
 * UI preserved from Figma Make export; API integration pending.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  CheckCircle2, IndianRupee, Receipt, FileText,
  Shield, Lock, Phone, Mail,
  CreditCard, Building2, Loader2,
} from 'lucide-react';
import { PageShell } from '@/layouts/PageShell';
import { PaymentStepper } from '@/components/payment/PaymentStepper';
import { SuccessCheckmark } from '@/components/feedback/SuccessCheckmark';
import { ConfettiOverlay } from '@/components/feedback/ConfettiOverlay';
import { ReceiptActions } from '@/components/support/ReceiptActions';
import { SupportSection } from '@/components/support/SupportSection';
import { useRepayment } from '@/hooks/useRepayment';
import { useStartAnotherPayment } from '@/hooks/useStartAnotherPayment';
import { formatCurrency, displayValue } from '@/utils/format';
import { buildReceiptFromContext, downloadReceipt } from '@/utils/receipt';
import { ROUTES } from '@/routes/paths';
import type { PaymentSelection } from '@/types';

export function PaymentSuccessPage({ selection }: { selection: PaymentSelection }) {
  const navigate = useNavigate();
  const { loanDetails, session, transaction, resetFlow } = useRepayment();
  const { startAnotherPayment, isRefreshing } = useStartAnotherPayment();
  const paymentMethod = transaction?.paymentMethod ?? 'UPI';
  const W = "w-[90%] max-w-[1400px] mx-auto";
  const [confettiVisible, setConfettiVisible] = useState(true);

  const goToLoanDetails = useCallback(async () => {
    const ok = await startAnotherPayment();
    if (ok) navigate(ROUTES.LOAN_DETAILS);
  }, [startAnotherPayment, navigate]);

  const receipt = useMemo(
    () =>
      buildReceiptFromContext({
        type: 'success',
        customerName: loanDetails?.customerName,
        customerId: loanDetails?.customerId,
        referenceNumber: session?.referenceNumber,
        transactionId: transaction?.transactionId,
        amount: selection.amount,
        paymentMethod,
        sessionDate: session?.sessionDate,
        transactionTime: transaction?.transactionTime,
      }),
    [loanDetails, session, transaction, selection.amount, paymentMethod],
  );

  useEffect(() => {
    const t = setTimeout(() => setConfettiVisible(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <PageShell>
      {/* Confetti overlay */}
      {confettiVisible && <ConfettiOverlay />}

      {/* ── Stepper — all completed ── */}
      <div className="bg-white border-b border-border">
        <div className={`${W} py-5`}>
          <PaymentStepper currentStep={6} />
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span className="text-[11px] text-emerald-600 font-semibold">All steps completed successfully</span>
          </div>
        </div>
      </div>

      <div className={`${W} py-10 md:py-14 space-y-8`}>

        {/* ── Success Hero ── */}
        <div className="flex flex-col items-center text-center space-y-5">
          <SuccessCheckmark />
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Payment Successful!</h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Your loan repayment has been completed successfully.
            </p>
          </div>
          {/* Success card */}
          <div className="w-full max-w-lg bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-5 text-center space-y-1.5 shadow-sm shadow-emerald-100">
            <p className="text-[15px] font-bold text-emerald-700">Thank you, {displayValue(loanDetails?.customerName, 'Customer')}!</p>
            <p className="text-[13px] text-emerald-600 leading-relaxed">
              Your payment has been received and processed successfully.<br />
              A confirmation receipt has been generated.
            </p>
          </div>
        </div>

        {/* ── Main two-column grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[65fr_35fr] gap-6 items-start">

          {/* ── LEFT: Summary + Receipt + Actions ── */}
          <div className="space-y-5">

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-[14px] font-bold text-foreground">Payment Summary</p>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold text-emerald-700">SUCCESS</span>
                </span>
              </div>
              <div className="px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                {[
                  { label: "Customer Name", value: displayValue(loanDetails?.customerName) },
                  { label: "Customer ID", value: displayValue(loanDetails?.customerId) },
                  { label: "Reference Number", value: displayValue(session?.referenceNumber) },
                  { label: "Transaction ID", value: displayValue(transaction?.transactionId) },
                  { label: "Card Number", value: displayValue(loanDetails?.cardMasked) },
                  { label: "Payment Method", value: paymentMethod },
                  { label: "Paid Amount", value: formatCurrency(selection.amount), highlight: true },
                  { label: "Processing Fee", value: loanDetails?.processingFee ? formatCurrency(loanDetails.processingFee) : "₹0", green: true },
                  { label: "Transaction Date", value: displayValue(session?.sessionDate) },
                  { label: "Transaction Time", value: displayValue(transaction?.transactionTime) },
                  { label: "Merchant", value: "ABC Bank Credit Cards" },
                  { label: "Payment Status", value: "SUCCESS", status: true },
                ].map(({ label, value, highlight, green, status }) => (
                  <div key={label} className="space-y-1.5 min-w-0">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                    {status ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[12px] font-bold text-emerald-600">SUCCESS</span>
                      </span>
                    ) : (
                      <p className={`text-[13px] font-semibold truncate ${highlight ? "text-primary text-[15px] font-bold" : green ? "text-emerald-600" : "text-foreground"}`}>
                        {value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Receipt */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-emerald-200 overflow-hidden shadow-sm shadow-emerald-50">
              {/* Receipt header */}
              <div className="bg-gradient-to-r from-primary to-accent px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Building2 size={18} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-white leading-none">ABC Bank</p>
                    <p className="text-[10px] text-white/70 mt-0.5">Official Payment Receipt</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3 py-1.5 self-start sm:self-auto">
                  <CheckCircle2 size={11} className="text-white" />
                  <span className="text-[11px] font-bold text-white">Payment Successful</span>
                </div>
              </div>
              {/* Decorative divider */}
              <div className="flex items-center px-6 py-0">
                <div className="w-5 h-5 rounded-full bg-background border-2 border-dashed border-emerald-200 -ml-8 flex-shrink-0" />
                <div className="flex-1 border-t-2 border-dashed border-emerald-100" />
                <div className="w-5 h-5 rounded-full bg-background border-2 border-dashed border-emerald-200 -mr-8 flex-shrink-0" />
              </div>
              <div className="px-4 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-4">
                {[
                  { label: "Reference Number", value: displayValue(session?.referenceNumber) },
                  { label: "Transaction ID", value: displayValue(transaction?.transactionId) },
                  { label: "Amount Paid", value: `₹${selection.amount.toLocaleString("en-IN")}`, bold: true },
                  { label: "Payment Method", value: paymentMethod },
                  { label: "Date & Time", value: `${displayValue(session?.sessionDate)}${transaction?.transactionTime ? `, ${transaction.transactionTime}` : ''}` },
                  { label: "Authorized By", value: "ABC Bank" },
                ].map(({ label, value, bold }) => (
                  <div key={label} className="space-y-0.5 min-w-0">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className={`text-[13px] break-words ${bold ? "font-bold text-primary" : "font-semibold text-foreground"}`}>{value}</p>
                  </div>
                ))}
              </div>
              {/* Receipt footer */}
              <div className="bg-slate-50 border-t border-dashed border-emerald-100 px-6 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Lock size={11} className="text-emerald-600" />
                  <p className="text-[11px] text-emerald-600 font-medium">Digitally secured receipt</p>
                </div>
                <p className="text-[10px] text-muted-foreground">Powered by 1Pay</p>
              </div>
            </div>

            <ReceiptActions receipt={receipt} variant="success" />

            {/* Next Actions */}
            <div>
              <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-3">What would you like to do next?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { label: "View Loan Account", icon: CreditCard, desc: "Check balance & history", action: () => void goToLoanDetails() },
                  { label: "Payment History", icon: Receipt, desc: "View all transactions", action: () => navigate(ROUTES.PAYMENT_HISTORY) },
                  { label: "Make Another Payment", icon: IndianRupee, desc: "Pay another amount", action: () => void goToLoanDetails() },
                  { label: "Return to Dashboard", icon: Building2, desc: "Go to main portal", action: () => { resetFlow(); navigate(ROUTES.VERIFICATION); } },
                  { label: "Download Statement", icon: FileText, desc: "Get account statement", action: () => { downloadReceipt(receipt); } },
                ].map(({ label, icon: Icon, desc, action }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={action}
                    disabled={isRefreshing && (label === "View Loan Account" || label === "Make Another Payment")}
                    className="flex items-start gap-3 bg-white border border-border rounded-2xl p-4 hover:border-primary/30 hover:shadow-md transition-all duration-200 group focus:ring-2 focus:ring-primary/20 outline-none text-left disabled:opacity-60 disabled:pointer-events-none"
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors mt-0.5">
                      {isRefreshing && (label === "View Loan Account" || label === "Make Another Payment") ? (
                        <Loader2 size={16} className="text-primary animate-spin" />
                      ) : (
                        <Icon size={16} className="text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-foreground leading-tight">{label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sticky sidebar ── */}
          <aside className="xl:sticky xl:top-24 space-y-4">

            {/* Email confirmation */}
            <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 p-5 space-y-3">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
                  <Mail size={14} className="text-primary" />
                </div>
                <p className="text-[13px] font-bold text-foreground">Confirmation Sent</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
                <p className="text-[12px] text-slate-600 leading-relaxed">
                  A payment confirmation has been sent to your registered email address on file.
                </p>
                <p className="text-[13px] font-bold text-primary">{displayValue(loanDetails?.customerName)}</p>
              </div>
              <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                <Phone size={12} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-700 leading-snug">
                  SMS confirmation also sent to <span className="font-bold">{displayValue(loanDetails?.mobileMasked)}</span>.
                </p>
              </div>
            </div>

            {/* Quick summary */}
            <div className="bg-gradient-to-br from-primary/6 to-accent/8 rounded-2xl border border-primary/15 p-5 shadow-sm">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3">Transaction Complete</p>
              <p className="text-3xl font-bold text-primary tracking-tight">₹{selection.amount.toLocaleString("en-IN")}</p>
              <p className="text-[12px] text-muted-foreground mt-1 mb-4">{selection.label} · {displayValue(session?.sessionDate)}</p>
              <div className="space-y-1.5">
                {[
                  { label: "Ref", value: displayValue(session?.referenceNumber) },
                  { label: "TXN", value: displayValue(transaction?.transactionId) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                    <span className="text-[11px] font-bold text-foreground font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security information */}
            <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={13} className="text-primary" />
                <p className="text-[12px] font-bold text-foreground">Transaction Security</p>
              </div>
              <div className="space-y-2">
                {[
                  "256-bit SSL Encryption",
                  "PCI-DSS Certified",
                  "RBI Compliant",
                  "Fraud Detection Verified",
                  "End-to-End Encryption",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-[12px] font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
            <SupportSection chatPrefill="Payment successful — need help" />
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

// ─── Success Checkmark animation ──────────────────────────────────────────────
