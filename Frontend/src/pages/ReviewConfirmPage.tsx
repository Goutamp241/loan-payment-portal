/**
 * ReviewConfirm page — part of the loan repayment flow.
 * UI preserved from Figma Make export; API integration pending.
 */

import { useState } from 'react';
import {
  ArrowLeft, ChevronRight, IndianRupee, Receipt, FileText, Store, Tag,
  Fingerprint, Shield, Lock, MessageCircle, Mail, PhoneCall, Timer, Wallet,
  AlertTriangle, Info, Pencil, Hash, User, Phone, CreditCard, BadgeCheck,
  CheckCircle2, CalendarClock, Globe, AlertCircle,
} from 'lucide-react';
import { PageShell } from '@/layouts/PageShell';
import { PaymentStepper } from '@/components/payment/PaymentStepper';
import { SectionHeading } from '@/components/payment/SectionHeading';
import { Spinner } from '@/components/feedback/Spinner';
import { useRepayment } from '@/hooks/useRepayment';
import { paymentService } from '@/services/paymentService';
import { ApiError } from '@/services/api';
import { useLegalModal } from '@/context/LegalModalContext';
import { SupportSection } from '@/components/support/SupportSection';
import { formatCurrency, displayValue } from '@/utils/format';
import type { PaymentSelection } from '@/types';

export function ReviewConfirmPage({
  selection,
  onBack,
  onProceed,
}: {
  selection: PaymentSelection;
  onBack: () => void;
  onProceed: () => void;
}) {
  const { loanDetails, session, authToken, setTransaction } = useRepayment();
  const { openPrivacy, openTerms } = useLegalModal();
  const [checkedReview, setCheckedReview] = useState(false);
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [proceedError, setProceedError] = useState<string | null>(null);

  const canProceed = checkedReview && checkedTerms;
  const W = "w-[90%] max-w-[1400px] mx-auto";

  async function handleProceed() {
    if (!canProceed || isProcessing || !authToken) return;
    setIsProcessing(true);
    setProceedError(null);

    try {
      const result = await paymentService.initiate(authToken, {
        selection,
        acceptedPrivacyPolicy: checkedTerms,
        acceptedTerms: checkedTerms,
      });
      setTransaction({
        id: result.id,
        transactionId: result.transactionId,
        transactionTime: '',
        status: 'pending',
        amount: result.amount,
      });
      onProceed();
    } catch (err) {
      setProceedError(
        err instanceof ApiError ? err.message : 'Failed to submit payment request.',
      );
    } finally {
      setIsProcessing(false);
    }
  }

  const summaryRows = [
    { label: "Outstanding Amount", value: loanDetails ? formatCurrency(loanDetails.totalDue) : "—", color: "" },
    { label: "Selected Option", value: selection.label, color: "" },
    { label: "Selected Amount", value: formatCurrency(selection.amount), color: "font-bold text-primary" },
    { label: "Payment Method", value: "Net Banking / UPI", color: "" },
    { label: "Processing Fee", value: loanDetails?.processingFee ? formatCurrency(loanDetails.processingFee) : "₹0", color: "text-emerald-600" },
    { label: "Convenience Fee", value: loanDetails?.convenienceFee ? formatCurrency(loanDetails.convenienceFee) : "₹0", color: "text-emerald-600" },
    { label: "Discount", value: "₹0", color: "text-emerald-600" },
  ];

  return (
    <PageShell hideMobileFooter>
      {/* ── Progress Stepper ── */}
      <div className="bg-white border-b border-border">
        <div className={`${W} py-5`}>
          <PaymentStepper currentStep={3} />
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Timer size={12} className="text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground font-medium">Estimated time remaining: Less than 30 seconds</span>
          </div>
        </div>
      </div>

      <div className={`${W} py-8 md:py-10 pb-28 sm:pb-12 space-y-7`}>

        {/* ── Page Header ── */}
        <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Review &amp; Confirm Payment</h1>
            <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed max-w-lg">
              Please review your payment details carefully before continuing to the secure payment gateway.
            </p>
          </div>
          <div className="flex-shrink-0 bg-white border border-border rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-sm shadow-slate-100">
            <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
              <Lock size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-foreground leading-none">Secure Payment</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug max-w-[160px]">Bank-grade encryption active</p>
            </div>
          </div>
        </div>

        {/* ── Main two-column layout ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[65fr_35fr] gap-6 items-start">

          {/* ── Left column ── */}
          <div className="space-y-5">

            {/* Customer Information */}
            <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
                    <User size={14} className="text-primary" />
                  </div>
                  <p className="text-[14px] font-bold text-foreground">Customer Information</p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                  <BadgeCheck size={12} className="text-emerald-600" />
                  <span className="text-[11px] font-semibold text-emerald-700">Identity Verified</span>
                </div>
              </div>
              <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-5">
                {[
                  { label: "Customer Name", value: displayValue(loanDetails?.customerName), icon: User, sensitive: false },
                  { label: "Registered Mobile", value: displayValue(loanDetails?.mobileMasked), icon: Phone, sensitive: true },
                  { label: "Credit Card", value: displayValue(loanDetails?.cardMasked), icon: CreditCard, sensitive: true },
                  { label: "Customer ID", value: displayValue(loanDetails?.customerId), icon: Hash, sensitive: false },
                  { label: "Verification Status", value: "verified", icon: BadgeCheck, sensitive: false },
                ].map(({ label, value, icon: Icon, sensitive }) => (
                  <div key={label} className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Icon size={11} className="text-muted-foreground flex-shrink-0" />
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide truncate">{label}</p>
                      {sensitive && <Lock size={9} className="text-slate-300 flex-shrink-0" />}
                    </div>
                    {value === "verified" ? (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                        <span className="text-[13px] font-semibold text-emerald-600">Verified</span>
                      </div>
                    ) : (
                      <p className="text-[13px] font-semibold text-foreground truncate">{value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
                  <Receipt size={14} className="text-primary" />
                </div>
                <p className="text-[14px] font-bold text-foreground">Payment Summary</p>
              </div>
              <div className="px-6 py-5 space-y-3.5">
                {summaryRows.map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <span className="text-[13px] text-muted-foreground">{label}</span>
                    <span className={`text-[13px] font-semibold text-right ${color || "text-foreground"}`}>{value}</span>
                  </div>
                ))}
                <div className="border-t-2 border-slate-100 pt-4 mt-2 flex items-center justify-between gap-4">
                  <span className="text-base font-bold text-foreground">Total Payable</span>
                  <span className="text-2xl font-bold text-primary tracking-tight">
                    ₹{selection.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Transaction Information */}
            <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
                  <FileText size={14} className="text-primary" />
                </div>
                <p className="text-[14px] font-bold text-foreground">Transaction Information</p>
              </div>
              <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                {[
                  { label: "Transaction Date", value: displayValue(session?.sessionDate), icon: CalendarClock },
                  { label: "Processing Time", value: "Within 2–4 business hours", icon: Timer },
                  { label: "Merchant Name", value: "ABC Bank Credit Cards", icon: Store },
                  { label: "Merchant ID", value: "ABCB-CC-2025", icon: Tag },
                  { label: "Reference Number", value: displayValue(session?.referenceNumber), icon: Fingerprint },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Icon size={11} className="text-muted-foreground flex-shrink-0" />
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
                    </div>
                    <p className="text-[13px] font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Before You Continue */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Info size={15} className="text-accent flex-shrink-0" />
                <h3 className="text-[13px] font-bold text-foreground">Before You Continue</h3>
              </div>
              <ul className="space-y-2">
                {[
                  "The payment cannot be modified after confirmation.",
                  "Please verify the payment amount before proceeding.",
                  "Do not refresh or close the browser during payment.",
                  "A confirmation receipt will be generated after successful payment.",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    </div>
                    <p className="text-[12px] text-slate-600 leading-relaxed">{point}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Terms & Confirmation */}
            <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 p-6 space-y-4">
              <p className="text-[14px] font-bold text-foreground">Terms &amp; Confirmation</p>
              {[
                {
                  id: "check-review",
                  checked: checkedReview,
                  onToggle: () => setCheckedReview((v) => !v),
                  label: "I have reviewed all payment details and confirm they are correct.",
                },
                {
                  id: "check-terms",
                  checked: checkedTerms,
                  onToggle: () => setCheckedTerms((v) => !v),
                  label: (
                    <>
                      I agree to the{" "}
                      <button type="button" onClick={openPrivacy} className="text-accent underline underline-offset-2 hover:text-primary transition-colors">
                        Privacy Policy
                      </button>{" "}
                      and{" "}
                      <button type="button" onClick={openTerms} className="text-accent underline underline-offset-2 hover:text-primary transition-colors">
                        Terms &amp; Conditions
                      </button>
                      .
                    </>
                  ),
                },
              ].map(({ id, checked, onToggle, label }) => (
                <label key={id} className="flex items-start gap-3 cursor-pointer group" htmlFor={id}>
                  <div
                    id={id}
                    role="checkbox"
                    aria-checked={checked}
                    tabIndex={0}
                    onClick={onToggle}
                    onKeyDown={(e) => e.key === " " && onToggle()}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer ${
                      checked
                        ? "bg-primary border-primary shadow-sm shadow-primary/30"
                        : "bg-white border-slate-300 group-hover:border-primary/50"
                    }`}
                  >
                    {checked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 3.5L4 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[13px] text-foreground leading-relaxed select-none">{label}</span>
                </label>
              ))}
            </div>

            {/* Security & Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { icon: Lock, label: "256-bit SSL Encryption" },
                { icon: Globe, label: "RBI Compliant" },
                { icon: BadgeCheck, label: "Secure Banking Session" },
                { icon: IndianRupee, label: "No Processing Fee" },
                { icon: Shield, label: "Bank-grade Security" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="bg-white border border-border rounded-xl p-3 flex flex-col items-center gap-2 text-center hover:border-primary/20 hover:shadow-sm transition-all duration-200">
                  <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center">
                    <Icon size={14} className="text-primary" />
                  </div>
                  <p className="text-[10px] font-semibold text-muted-foreground leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons — desktop */}
            {proceedError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-700">
                <AlertCircle size={16} className="flex-shrink-0" />
                {proceedError}
              </div>
            )}
            <div className="hidden sm:flex flex-row gap-4 pt-1">
              <button
                onClick={onBack}
                className="flex-none w-48 py-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center justify-center gap-2 outline-none"
              >
                <ArrowLeft size={15} />Back to Payment Details
              </button>
              <button
                disabled={!canProceed || isProcessing}
                onClick={handleProceed}
                className={`flex-1 py-4 rounded-xl text-base font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/30 ${
                  canProceed && !isProcessing
                    ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.99] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isProcessing ? (
                  <><Spinner />Redirecting to Secure Gateway...</>
                ) : (
                  <>Proceed to Secure Payment <ChevronRight size={18} /></>
                )}
              </button>
            </div>
          </div>

          {/* ── Right: Sticky Payment Summary Sidebar ── */}
          <aside aria-label="Payment Summary" className="xl:sticky xl:top-24 space-y-4">
            <SectionHeading icon={<Receipt size={14} />} title="Payment Summary" />
            <div className="bg-white rounded-2xl border border-primary/15 shadow-md shadow-primary/8 overflow-hidden">
              {/* Amount highlight */}
              <div className="bg-gradient-to-br from-primary/6 to-accent/8 px-6 py-5 border-b border-primary/10">
                <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">Total Payable</p>
                <p className="text-4xl font-bold text-primary tracking-tight">
                  ₹{selection.amount.toLocaleString("en-IN")}
                </p>
                <p className="text-[12px] text-muted-foreground mt-1">{selection.label}</p>
              </div>
              <div className="px-6 py-5 space-y-3.5">
                {[
                  { label: "Payment Method", value: "Net Banking / UPI" },
                  { label: "Processing Fee", value: "₹0.00 (Waived)", green: true },
                  { label: "Reference", value: displayValue(session?.referenceNumber) },
                ].map(({ label, value, green }) => (
                  <div key={label} className="flex items-start justify-between gap-3">
                    <span className="text-[12px] text-muted-foreground">{label}</span>
                    <span className={`text-[12px] font-semibold text-right ${green ? "text-emerald-600" : "text-foreground"}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-50/70 border-t border-emerald-100 px-6 py-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield size={12} className="text-emerald-600 flex-shrink-0" />
                  <p className="text-[11px] text-emerald-700 font-semibold">Bank-grade encryption active</p>
                </div>
                <div className="flex items-center gap-2">
                  <Lock size={12} className="text-emerald-600 flex-shrink-0" />
                  <p className="text-[11px] text-emerald-700 font-medium">Your data is end-to-end protected</p>
                </div>
              </div>
            </div>

            {/* Confirm status indicator */}
            <div className={`rounded-xl border px-4 py-3 flex items-center gap-3 transition-all duration-300 ${
              canProceed ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"
            }`}>
              {canProceed ? (
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
              ) : (
                <AlertCircle size={16} className="text-slate-400 flex-shrink-0" />
              )}
              <p className={`text-[12px] font-semibold ${canProceed ? "text-emerald-700" : "text-slate-500"}`}>
                {canProceed
                  ? "Ready to proceed — all confirmations received."
                  : "Please confirm both checkboxes to proceed."}
              </p>
            </div>
          </aside>
        </div>

        <SupportSection chatPrefill="I need help before completing payment" className="pb-24 sm:pb-4" />
      </div>

      {/* ── Sticky Mobile Action Bar ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border px-4 py-3 flex gap-3 shadow-lg shadow-slate-200/80">
        <button
          onClick={onBack}
          className="flex-none w-24 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary transition-all duration-200 flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-primary/20 outline-none"
        >
          <ArrowLeft size={14} />Back
        </button>
        <button
          disabled={!canProceed || isProcessing}
          onClick={handleProceed}
          className={`flex-1 py-3.5 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-200 outline-none ${
            canProceed && !isProcessing
              ? "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/25"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isProcessing ? <><Spinner />Redirecting...</> : <>Proceed to Secure Payment <ChevronRight size={15} /></>}
        </button>
      </div>
    </PageShell>
  );
}
