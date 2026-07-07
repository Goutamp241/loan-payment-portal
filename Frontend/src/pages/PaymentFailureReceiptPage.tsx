/**
 * PaymentFailureReceipt page — part of the loan repayment flow.
 * UI preserved from Figma Make export; API integration pending.
 */

import { useMemo } from 'react';
import {
  AlertCircle, AlertTriangle, IndianRupee, ChevronRight,
  MessageCircle, Mail, PhoneCall, Shield, Lock, RefreshCw, CreditCard, Info,
  CheckCircle2, Building2,
} from 'lucide-react';
import { PageShell } from '@/layouts/PageShell';
import { PaymentStepper } from '@/components/payment/PaymentStepper';
import { FailureIcon } from '@/components/feedback/FailureIcon';
import { ReceiptActions } from '@/components/support/ReceiptActions';
import { SupportSection } from '@/components/support/SupportSection';
import { useRepayment } from '@/hooks/useRepayment';
import { displayValue } from '@/utils/format';
import { buildReceiptFromContext } from '@/utils/receipt';
import type { PaymentSelection } from '@/types';

export function PaymentFailureReceiptPage({
  selection, onRetry, onChangeMethod,
}: { selection: PaymentSelection; onRetry: () => void; onChangeMethod: () => void; }) {
  const { loanDetails, session, transaction } = useRepayment();
  const paymentMethod = transaction?.paymentMethod ?? 'UPI';
  const receipt = useMemo(
    () =>
      buildReceiptFromContext({
        type: 'failure',
        customerName: loanDetails?.customerName,
        customerId: loanDetails?.customerId,
        referenceNumber: session?.referenceNumber,
        transactionId: transaction?.transactionId,
        amount: selection.amount,
        paymentMethod,
        sessionDate: session?.sessionDate,
        transactionTime: transaction?.transactionTime,
        failureReason: transaction?.failureReason,
      }),
    [loanDetails, session, transaction, selection.amount, paymentMethod],
  );
  const W = "w-[90%] max-w-[1400px] mx-auto";
  return (
    <PageShell>
      <div className="bg-white border-b border-border">
        <div className={`${W} py-5`}>
          <PaymentStepper currentStep={5} failedStep={5} />
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <AlertCircle size={12} className="text-destructive" />
            <span className="text-[11px] text-destructive font-semibold">Payment failure receipt generated</span>
          </div>
        </div>
      </div>
      <div className={`${W} py-10 md:py-12 space-y-8`}>
        <div className="flex flex-col items-center text-center space-y-4">
          <FailureIcon />
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Payment Failed</h1>
            <p className="text-[13px] text-muted-foreground">Official failure receipt for your records.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[65fr_35fr] gap-6 items-start">
          <div className="space-y-5">
            {/* Failure summary card */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center"><AlertCircle size={14} className="text-destructive" /></div>
                  <p className="text-[14px] font-bold text-foreground">Failure Summary</p>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span className="text-[11px] font-bold text-destructive">FAILED</span>
                </span>
              </div>
              <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5">
                {[
                  { label: "Customer Name", value: displayValue(loanDetails?.customerName), wide: false },
                  { label: "Customer ID", value: displayValue(loanDetails?.customerId), wide: false },
                  { label: "Card Number", value: displayValue(loanDetails?.cardMasked), wide: false },
                  { label: "Payment Method", value: paymentMethod, wide: false },
                  { label: "Attempted Amount", value: `₹${selection.amount.toLocaleString("en-IN")}`, highlight: true, wide: false },
                  { label: "Transaction ID", value: displayValue(transaction?.transactionId), wide: false },
                  { label: "Reference Number", value: displayValue(session?.referenceNumber), wide: false },
                  { label: "Date", value: displayValue(session?.sessionDate), wide: false },
                  { label: "Time", value: displayValue(transaction?.transactionTime), wide: false },
                  { label: "Merchant", value: "ABC Bank Credit Cards", wide: false },
                  { label: "Failure Reason", value: displayValue(transaction?.failureReason, 'Transaction could not be completed'), wide: true },
                  { label: "Refund Status", value: "Pending Verification", amber: true, wide: false },
                  { label: "Payment Status", value: "FAILED", status: true, wide: false },
                ].map(({ label, value, highlight, wide, status, amber }) => (
                  <div key={label} className={`space-y-1.5 min-w-0 ${wide ? "col-span-2 sm:col-span-3" : ""}`}>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                    {status ? (
                      <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                        <span className="text-[12px] font-bold text-destructive">FAILED</span>
                      </span>
                    ) : amber ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[13px] font-bold text-amber-600">{value}</span>
                      </div>
                    ) : (
                      <p className={`text-[13px] font-semibold truncate ${highlight ? "text-destructive font-bold text-[15px]" : "text-foreground"}`}>{value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Official receipt */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-red-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-destructive/90 to-red-700 px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0"><Building2 size={18} className="text-white" /></div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-white leading-none">ABC Bank</p>
                    <p className="text-[10px] text-white/70 mt-0.5">Official Transaction Record</p>
                  </div>
                </div>
                <span className="bg-white/15 border border-white/25 rounded-full px-3 py-1.5 text-[10px] sm:text-[11px] font-bold text-white self-start sm:self-auto">FAILED — Digitally Generated</span>
              </div>
              <div className="flex items-center px-6 py-0">
                <div className="w-5 h-5 rounded-full bg-background border-2 border-dashed border-red-200 -ml-8 flex-shrink-0" />
                <div className="flex-1 border-t-2 border-dashed border-red-100" />
                <div className="w-5 h-5 rounded-full bg-background border-2 border-dashed border-red-200 -mr-8 flex-shrink-0" />
              </div>
              <div className="px-4 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-4">
                {[
                  { label: "Reference Number", value: displayValue(session?.referenceNumber) },
                  { label: "Transaction Number", value: displayValue(transaction?.transactionId) },
                  { label: "Attempted Amount", value: `₹${selection.amount.toLocaleString("en-IN")}`, red: true },
                  { label: "Payment Method", value: paymentMethod },
                  { label: "Authorization Status", value: "Declined" },
                  { label: "Failure Timestamp", value: `${displayValue(session?.sessionDate)}${transaction?.transactionTime ? `, ${transaction.transactionTime}` : ''}` },
                ].map(({ label, value, red }) => (
                  <div key={label} className="space-y-0.5 min-w-0">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className={`text-[13px] break-words ${red ? "text-destructive font-bold" : "text-foreground font-semibold"}`}>{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-red-50/60 border-t border-dashed border-red-100 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2"><Lock size={11} className="text-emerald-600" /><p className="text-[11px] text-emerald-600 font-medium">Digitally secured receipt</p></div>
                <p className="text-[10px] text-muted-foreground">Powered by 1Pay</p>
              </div>
            </div>

            <ReceiptActions receipt={receipt} variant="failure" />

            {/* Next actions */}
            <div>
              <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-3">What would you like to do?</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Retry Payment", icon: "↺", action: onRetry },
                  { label: "Change Method", icon: "⇄", action: onChangeMethod },
                  { label: "Payment History", icon: "📋", action: () => {} },
                  { label: "Return to Dashboard", icon: "🏠", action: () => {} },
                ].map(({ label, icon, action }) => (
                  <button key={label} onClick={action} className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 border-slate-200 bg-white font-semibold text-[12px] text-foreground hover:border-primary/30 hover:text-primary hover:shadow-md transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/30 shadow-sm">
                    <span className="text-xl leading-none">{icon}</span>{label}
                  </button>
                ))}
              </div>
            </div>

            {/* Help */}
            <SupportSection chatPrefill="Payment failed — need help" />
          </div>

          {/* Right sidebar */}
          <aside className="xl:sticky xl:top-24 space-y-4">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mb-2">Failed Transaction</p>
              <p className="text-3xl font-bold text-destructive tracking-tight">₹{selection.amount.toLocaleString("en-IN")}</p>
              <p className="text-[12px] text-muted-foreground mt-1 mb-4">{displayValue(session?.sessionDate)} · {displayValue(transaction?.transactionTime)}</p>
              <div className="space-y-2">
                {[{ label:"Ref", value:displayValue(session?.referenceNumber) },{ label:"TXN", value:displayValue(transaction?.transactionId) }].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                    <span className="text-[11px] font-bold font-mono text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3"><Shield size={13} className="text-primary" /><p className="text-[12px] font-bold text-foreground">Transaction Security</p></div>
              {["256-bit SSL Encryption","PCI-DSS Certified","RBI Compliant","Fraud Detection","End-to-End Encryption"].map((item) => (
                <div key={item} className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-[12px] font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3"><Info size={13} className="text-accent" /><p className="text-[12px] font-bold text-foreground">Refund Information</p></div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[12px] text-muted-foreground">Expected Refund Time</span>
                <span className="text-[12px] font-bold text-primary">3–7 Business Days</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] text-muted-foreground">Refund Status</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[12px] font-bold text-amber-600">Pending Verification</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-100">
                <p className="text-[11px] text-slate-500 leading-snug">If debited, the refund will be automatically processed per your bank&apos;s policy.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
