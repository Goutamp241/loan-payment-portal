/**
 * PaymentFailure page — part of the loan repayment flow.
 * UI preserved from Figma Make export; API integration pending.
 */

import {
  AlertTriangle, AlertCircle, IndianRupee, ChevronRight, ArrowLeft,
  MessageCircle, Mail, PhoneCall, Shield, Lock, Timer, Hash, RefreshCw,
  CreditCard, FileText, Info, CheckCircle2,
} from 'lucide-react';
import { PageShell } from '@/layouts/PageShell';
import { PaymentStepper } from '@/components/payment/PaymentStepper';
import { FailureIcon } from '@/components/feedback/FailureIcon';
import { SupportSection } from '@/components/support/SupportSection';
import { POSSIBLE_FAILURE_REASONS } from '@/utils/constants';
import { useRepayment } from '@/hooks/useRepayment';
import { displayValue } from '@/utils/format';
import type { PaymentSelection } from '@/types';

export function PaymentFailurePage({
  selection, onRetry, onChangeMethod, onReceipt,
}: { selection: PaymentSelection; onRetry: () => void; onChangeMethod: () => void; onReceipt: () => void; }) {
  const { loanDetails, session, transaction } = useRepayment();
  const W = "w-[90%] max-w-[1400px] mx-auto";
  return (
    <PageShell>
      <div className="bg-white border-b border-border">
        <div className={`${W} py-5`}>
          <PaymentStepper currentStep={5} failedStep={5} />
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <AlertTriangle size={12} className="text-destructive" />
            <span className="text-[11px] text-destructive font-semibold">Transaction could not be completed</span>
          </div>
        </div>
      </div>

      <div className={`${W} py-10 md:py-12 space-y-8`}>
        {/* Hero */}
        <div className="flex flex-col items-center text-center space-y-4">
          <FailureIcon />
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Payment Failed</h1>
            <p className="text-[15px] text-muted-foreground">We couldn&apos;t complete your payment.</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Your payment could not be completed at this time. No amount has been deducted, or if your bank has already debited the amount, it will be refunded automatically according to your bank&apos;s policy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[65fr_35fr] gap-6 items-start">
          {/* Left */}
          <div className="space-y-5">
            {/* Failure Details */}
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
                    <AlertCircle size={14} className="text-destructive" />
                  </div>
                  <p className="text-[14px] font-bold text-foreground">Failure Details</p>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span className="text-[11px] font-bold text-destructive">FAILED</span>
                </span>
              </div>
              <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5">
                {[
                  { label: "Customer Name", value: displayValue(loanDetails?.customerName), wide: false },
                  { label: "Credit Card", value: displayValue(loanDetails?.cardMasked), wide: false },
                  { label: "Payment Method", value: "UPI", wide: false },
                  { label: "Attempted Amount", value: `₹${selection.amount.toLocaleString("en-IN")}`, highlight: true, wide: false },
                  { label: "Transaction Date", value: displayValue(session?.sessionDate), wide: false },
                  { label: "Transaction Time", value: displayValue(transaction?.transactionTime), wide: false },
                  { label: "Reference Number", value: displayValue(session?.referenceNumber), wide: false },
                  { label: "Transaction ID", value: displayValue(transaction?.transactionId), wide: false },
                  { label: "Payment Status", value: "FAILED", status: true, wide: false },
                  { label: "Failure Reason", value: displayValue(transaction?.failureReason, 'Transaction could not be completed'), wide: true },
                ].map(({ label, value, highlight, status, wide }) => (
                  <div key={label} className={`space-y-1.5 min-w-0 ${wide ? "col-span-2 sm:col-span-3" : ""}`}>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                    {status ? (
                      <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                        <span className="text-[12px] font-bold text-destructive">FAILED</span>
                      </span>
                    ) : (
                      <p className={`text-[13px] font-semibold truncate ${highlight ? "text-destructive font-bold text-[15px]" : "text-foreground"}`}>{value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Possible Reasons */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Info size={14} className="text-amber-600" />
                </div>
                <p className="text-[14px] font-bold text-foreground">Possible Reasons</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {POSSIBLE_FAILURE_REASONS.map((r) => (
                  <div key={r} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    </div>
                    <span className="text-[12px] text-foreground font-medium leading-snug">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Refund Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <Info size={15} className="text-accent flex-shrink-0" />
                <p className="text-[14px] font-bold text-foreground">Refund Information</p>
              </div>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                If your account has already been debited, your bank will automatically process the refund.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="bg-white rounded-xl border border-blue-100 p-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Typical Refund Time</p>
                  <p className="text-[14px] font-bold text-primary mt-1">3–7 Business Days</p>
                </div>
                <div className="bg-white rounded-xl border border-blue-100 p-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Refund Status</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <p className="text-[13px] font-bold text-amber-600">Pending Verification</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Retry Payment", icon: "↺", action: onRetry, primary: true },
                { label: "Change Method", icon: "⇄", action: onChangeMethod },
                { label: "Failure Receipt", icon: "⬇", action: onReceipt },
                { label: "Contact Support", icon: "💬", action: () => {} },
              ].map(({ label, icon, action, primary }) => (
                <button key={label} onClick={action}
                  className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border-2 font-semibold text-[12px] transition-all hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                    primary
                      ? "bg-primary border-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
                      : "bg-white border-slate-200 text-foreground hover:border-primary/30 hover:text-primary shadow-sm"
                  }`}>
                  <span className="text-xl leading-none">{icon}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button onClick={onRetry}
                className="flex-1 py-4 rounded-xl bg-primary text-white text-base font-bold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.99] shadow-lg shadow-primary/25 hover:shadow-xl transition-all outline-none focus:ring-2 focus:ring-primary/30">
                ↺ Retry Payment
              </button>
              <button onClick={onChangeMethod}
                className="flex-1 sm:flex-none sm:w-56 py-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-primary/20">
                <ArrowLeft size={14} />Change Payment Method
              </button>
              <button className="text-[13px] font-semibold text-muted-foreground hover:text-primary transition-colors self-center px-4 py-2 outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20">
                Return to Dashboard
              </button>
            </div>

            {/* Help */}
            <SupportSection chatPrefill="My payment failed — need help" />
          </div>

          {/* Right sidebar */}
          <aside className="xl:sticky xl:top-24 space-y-4">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mb-2">Payment Failed</p>
              <p className="text-3xl font-bold text-destructive tracking-tight">₹{selection.amount.toLocaleString("en-IN")}</p>
              <p className="text-[12px] text-muted-foreground mt-1 mb-4">Attempted · {displayValue(session?.sessionDate)}</p>
              <div className="space-y-2">
                {[
                  { label: "Method", value: "UPI" },
                  { label: "Reference", value: displayValue(session?.referenceNumber) },
                  { label: "Time", value: displayValue(transaction?.transactionTime) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                    <span className="text-[11px] font-bold text-foreground font-mono">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-red-200 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                  <p className="text-[11px] text-slate-600 font-medium">Security verification completed</p>
                </div>
                <p className="text-[11px] text-muted-foreground ml-[19px] leading-snug">Bank response: {displayValue(transaction?.failureReason, '—')}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3"><Shield size={13} className="text-primary" /><p className="text-[12px] font-bold text-foreground">Security Verified</p></div>
              {["SSL Encryption","PCI-DSS","RBI Compliant","Fraud Protection"].map((item) => (
                <div key={item} className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-[12px] font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3"><Info size={13} className="text-accent" /><p className="text-[12px] font-bold text-foreground">Refund Status</p></div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[12px] text-muted-foreground">Expected Time</span>
                <span className="text-[12px] font-bold text-primary">3–7 Business Days</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[12px] text-muted-foreground">Status</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[12px] font-bold text-amber-600">Pending</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}
