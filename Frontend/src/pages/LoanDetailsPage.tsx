/**
 * LoanDetails page — part of the loan repayment flow.
 * UI preserved from Figma Make export; API integration pending.
 */

import { useState, useEffect } from 'react';
import {
  User, CalendarClock, AlertTriangle, IndianRupee, ArrowLeft, ChevronRight,
  CreditCard, BadgeCheck, Hash, Info, Building2, Lock, Timer, Phone,
  CheckCircle2, Receipt, Wallet, Pencil, AlertCircle, Shield, PhoneCall,
  MessageCircle, Mail, RefreshCw,
} from 'lucide-react';
import { PageShell } from '@/layouts/PageShell';
import { PaymentStepper } from '@/components/payment/PaymentStepper';
import { SectionHeading } from '@/components/payment/SectionHeading';
import { SummaryCard } from '@/components/payment/SummaryCard';
import { PaymentRadioCard, RadioDot } from '@/components/payment/PaymentRadioCard';
import { Spinner } from '@/components/feedback/Spinner';
import { NoPaymentRequired } from '@/components/feedback/NoPaymentRequired';
import { SupportSection } from '@/components/support/SupportSection';
import { useLoanDetailsLoader } from '@/hooks/useLoanDetailsLoader';
import { formatCurrency, formatDisplayDate } from '@/utils/format';
import type { PaymentOption, PaymentSelection } from '@/types';

interface LoanDetailsPageProps {
  onBack: () => void;
  onProceed: (sel: PaymentSelection) => void;
}

export function LoanDetailsPage({ onBack, onProceed }: LoanDetailsPageProps) {
  const { loanDetails, loanLoading, loanError, reload } = useLoanDetailsLoader();
  const [paymentOption, setPaymentOption] = useState<PaymentOption>('total');
  const [customAmount, setCustomAmount] = useState('');
  const [customError, setCustomError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loanDetails) return;
    setPaymentOption(loanDetails.totalDue > 0 ? 'total' : 'minimum');
    setCustomAmount('');
    setCustomError('');
  }, [loanDetails?.totalDue, loanDetails?.minimumDue, loanDetails]);

  if (loanLoading) {
    return (
      <PageShell hideMobileFooter>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Spinner />
          <p className="text-sm text-muted-foreground">Loading your payment details...</p>
        </div>
      </PageShell>
    );
  }

  if (loanError || !loanDetails) {
    return (
      <PageShell hideMobileFooter>
        <div className="max-w-md mx-auto py-20 px-6 text-center space-y-4">
          <AlertCircle size={40} className="text-destructive mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Unable to Load Payment Details</h2>
          <p className="text-sm text-muted-foreground">{loanError ?? 'No payment data available.'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button type="button" onClick={() => void reload()} className="py-3 px-5 bg-primary text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
              <RefreshCw size={14} />Retry
            </button>
            <button type="button" onClick={onBack} className="py-3 px-5 border border-border rounded-xl text-sm font-semibold">
              Back to Verification
            </button>
          </div>
        </div>
      </PageShell>
    );
  }

  if (loanDetails.totalDue <= 0 && loanDetails.minimumDue <= 0) {
    return <NoPaymentRequired loanDetails={loanDetails} onBack={onBack} />;
  }

  const { totalDue, minimumDue, processingFee } = loanDetails;

  function getSelectedAmount(): number {
    if (paymentOption === 'total') return totalDue;
    if (paymentOption === 'minimum') return minimumDue;
    return parseFloat(customAmount) || 0;
  }

  function handleCustomAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d.]/g, '');
    setCustomAmount(raw);
    const val = parseFloat(raw);
    if (!raw) setCustomError('');
    else if (isNaN(val) || val <= 0) setCustomError('Enter a valid amount');
    else if (val < minimumDue) setCustomError(`Minimum payable amount is ${formatCurrency(minimumDue)}`);
    else if (val > totalDue) setCustomError(`Amount cannot exceed ${formatCurrency(totalDue)}`);
    else setCustomError('');
  }

  const canProceed =
    paymentOption !== 'custom' ||
    (customAmount !== '' && !customError && parseFloat(customAmount) >= minimumDue);

  const selectedAmount = getSelectedAmount();
  const totalPayable = canProceed && selectedAmount > 0 ? selectedAmount + processingFee : 0;

  async function handleProceed() {
    if (!canProceed || isProcessing) return;
    setIsProcessing(true);
    const labelMap: Record<PaymentOption, string> = {
      total: 'Pay Total Due',
      minimum: 'Pay Minimum Due',
      custom: 'Custom Amount',
    };
    onProceed({ option: paymentOption, amount: selectedAmount, label: labelMap[paymentOption] });
    setIsProcessing(false);
  }

  // shared container class — 90% of viewport, max 1400px
  const W = "w-[90%] max-w-[1400px] mx-auto";

  return (
    <PageShell hideMobileFooter>

      {/* ── Progress Stepper — full dashboard width ── */}
      <div className="bg-white border-b border-border">
        <div className={`${W} px-0 py-5`}>
          <PaymentStepper currentStep={2} />
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Timer size={12} className="text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground font-medium">Estimated time: Less than 1 minute</span>
          </div>
        </div>
      </div>

      {/* ── Main scrollable content ── */}
      <div className={`${W} py-8 md:py-10 space-y-7 pb-28 sm:pb-12`}>

        {/* ── Welcome Banner — full width ── */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl px-4 sm:px-8 py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 shadow-md shadow-primary/20">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-white leading-snug break-words">Welcome, {loanDetails.customerName} 👋</h1>
            <p className="text-[13px] text-white/80 mt-1.5 leading-relaxed">
              Review your outstanding balance and complete your payment securely.
            </p>
          </div>
          <div className="flex-shrink-0 bg-white/15 border border-white/25 rounded-xl px-5 py-3.5 flex items-center gap-3 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Lock size={15} className="text-white" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-none">Secure Session</p>
              <p className="text-[11px] text-white/70 mt-0.5 leading-none">Your session is encrypted.</p>
            </div>
          </div>
        </div>

        {/* ── Row 1: Customer Info (40%) + Outstanding Summary (60%) ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] gap-6 items-start">

          {/* Customer Information */}
          <section aria-label="Customer Information">
            <SectionHeading icon={<User size={14} />} title="Customer Information" />
            <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 overflow-hidden h-full">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <p className="text-[13px] font-semibold text-foreground">Account Details</p>
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                  <BadgeCheck size={12} className="text-emerald-600" />
                  <span className="text-[11px] font-semibold text-emerald-700">Identity Verified</span>
                </div>
              </div>
              <div className="px-4 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-5">
                {[
                  { label: "Customer Name", value: loanDetails.customerName, icon: User, sensitive: false },
                  { label: "Registered Mobile", value: loanDetails.mobileMasked, icon: Phone, sensitive: true },
                  { label: "Credit Card Number", value: loanDetails.cardMasked, icon: CreditCard, sensitive: true },
                  { label: "Payment Due Date", value: formatDisplayDate(loanDetails.paymentDueDate), icon: CalendarClock, sensitive: false },
                  { label: "Customer ID", value: loanDetails.customerId, icon: Hash, sensitive: false },
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
          </section>

          {/* Outstanding Summary */}
          <section aria-label="Outstanding Summary">
            <SectionHeading icon={<Receipt size={14} />} title="Outstanding Summary" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <SummaryCard
                icon={<IndianRupee size={16} className="text-primary" />} iconBg="bg-primary/8"
                label="Total Due" value={formatCurrency(totalDue)} valueColor="text-primary" valueSize="text-2xl"
                borderColor="border-primary/20"
              />
              <SummaryCard
                icon={<IndianRupee size={16} className="text-amber-600" />} iconBg="bg-amber-50"
                label="Minimum Due" value={formatCurrency(minimumDue)} valueColor="text-amber-600" valueSize="text-2xl"
                borderColor="border-border"
              />
              <SummaryCard
                icon={<CalendarClock size={16} className="text-accent" />} iconBg="bg-accent/10"
                label="Payment Due" value={formatDisplayDate(loanDetails.paymentDueDate)} valueColor="text-foreground" valueSize="text-lg"
                borderColor="border-border"
              />
              <SummaryCard
                icon={<AlertTriangle size={16} className="text-orange-500" />} iconBg="bg-orange-50"
                label="Status" value="" valueColor="" borderColor="border-border"
                customValue={
                  <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span className="text-[12px] font-semibold text-orange-600">Pending</span>
                  </span>
                }
              />
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <p className="text-[11px] text-muted-foreground">
                Last Updated: <span className="font-semibold text-foreground">{loanDetails.lastUpdated}</span>
              </p>
            </div>
          </section>
        </div>

        {/* ── Row 2: Payment Options (65%) + Summary sidebar (35%) ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[65fr_35fr] gap-6 items-start">

          {/* Left: Payment Options + Important Info */}
          <div className="space-y-5">
            <section aria-label="Payment Options">
              <SectionHeading icon={<Wallet size={14} />} title="Payment Options" />
              <div className="space-y-4" role="radiogroup" aria-label="Select payment amount">
                <PaymentRadioCard
                  id="opt-total" selected={paymentOption === "total"} onSelect={() => setPaymentOption("total")}
                  badge="Recommended" badgeColor="emerald"
                  title="Pay Total Due" amount={formatCurrency(totalDue)} amountColor="text-primary"
                  description="Clear your outstanding balance and avoid interest charges."
                />
                <PaymentRadioCard
                  id="opt-minimum" selected={paymentOption === "minimum"} onSelect={() => setPaymentOption("minimum")}
                  badge="Most Chosen" badgeColor="amber"
                  title="Pay Minimum Due" amount={formatCurrency(minimumDue)} amountColor="text-amber-600"
                  description="Avoid late payment penalties. Interest applies on remaining balance."
                />

                {/* Custom Amount */}
                <div
                  role="radio" aria-checked={paymentOption === "custom"} tabIndex={0}
                  onClick={() => setPaymentOption("custom")}
                  onKeyDown={(e) => (e.key === " " || e.key === "Enter") && setPaymentOption("custom")}
                  className={`rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                    paymentOption === "custom"
                      ? "border-accent bg-accent/4 shadow-lg shadow-accent/10"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md shadow-sm shadow-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <RadioDot selected={paymentOption === "custom"} />
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 min-w-0">
                      <div className="min-w-0">
                        <p className="text-[15px] font-bold text-foreground">Custom Amount</p>
                        <p className="text-[13px] text-muted-foreground mt-0.5 break-words">
                          Enter any amount between {formatCurrency(minimumDue)} and {formatCurrency(totalDue)}.
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground flex-shrink-0">
                        <Pencil size={13} />
                        <span className="text-[12px] font-medium">Enter amount</span>
                      </div>
                    </div>
                  </div>
                  {paymentOption === "custom" && (
                    <div className="mt-5 pt-5 border-t border-accent/20" onClick={(e) => e.stopPropagation()}>
                      <label htmlFor="custom-amount" className="text-[12px] font-semibold text-foreground block mb-2">
                        Enter Amount (₹)
                      </label>
                      <div className="relative max-w-sm">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground select-none">₹</span>
                        <input
                          id="custom-amount" type="text" inputMode="decimal" placeholder="e.g. 5,000"
                          value={customAmount} onChange={handleCustomAmountChange} autoFocus
                          className={`w-full pl-8 pr-10 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 outline-none bg-white placeholder:text-slate-300 text-foreground ${
                            customError
                              ? "border-destructive ring-2 ring-destructive/20"
                              : customAmount && !customError
                                ? "border-emerald-400 ring-2 ring-emerald-400/20"
                                : "border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
                          }`}
                        />
                        {customAmount && !customError && (
                          <CheckCircle2 size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                        )}
                      </div>
                      {customError && (
                        <p className="mt-2 text-[12px] text-destructive flex items-center gap-1.5 font-medium">
                          <AlertCircle size={11} />{customError}
                        </p>
                      )}
                      {customAmount && !customError && (
                        <p className="mt-2 text-[12px] text-emerald-600 flex items-center gap-1.5 font-medium">
                          <CheckCircle2 size={11} />Amount looks good
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Important Information */}
            <section aria-label="Important Information">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Info size={15} className="text-accent flex-shrink-0" />
                  <h3 className="text-[13px] font-bold text-foreground">Important Information</h3>
                </div>
                <ul className="space-y-2">
                  {[
                    "Paying the full amount avoids interest charges.",
                    "Paying the minimum amount avoids late payment penalties.",
                    "Custom Amount lets you pay any amount within the allowed range.",
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
            </section>
          </div>

          {/* Right: Sticky Payment Summary */}
          <section aria-label="Payment Summary" className="xl:sticky xl:top-24">
            <SectionHeading icon={<Receipt size={14} />} title="Payment Summary" />
            <div className="bg-white rounded-2xl border border-border shadow-md shadow-slate-100/80 overflow-hidden">
              <div className="p-6 space-y-4">
                {[
                  {
                    label: "Selected Amount",
                    value: canProceed && selectedAmount > 0 ? `₹${selectedAmount.toLocaleString("en-IN")}` : "—",
                    bold: true,
                    color: canProceed && selectedAmount > 0 ? "text-primary" : "text-muted-foreground",
                  },
                  { label: "Payment Method", value: "Net Banking / UPI", bold: false, color: "text-foreground" },
                  { label: "Processing Fee", value: processingFee > 0 ? formatCurrency(processingFee) : "₹0.00 (Waived)", bold: false, color: "text-emerald-600" },
                ].map(({ label, value, bold, color }) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <span className="text-[12px] text-muted-foreground">{label}</span>
                    <span className={`text-[13px] font-${bold ? "bold" : "semibold"} ${color} text-right`}>{value}</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                  <span className="text-[14px] font-bold text-foreground">Total Payable</span>
                  <span className={`text-xl font-bold ${canProceed && totalPayable > 0 ? "text-primary" : "text-muted-foreground"}`}>
                    {canProceed && totalPayable > 0 ? `₹${totalPayable.toLocaleString("en-IN")}` : "—"}
                  </span>
                </div>
              </div>
              <div className="bg-emerald-50/60 border-t border-emerald-100 px-6 py-3.5 flex items-center gap-2">
                <Shield size={12} className="text-emerald-600 flex-shrink-0" />
                <p className="text-[11px] text-emerald-700 font-medium leading-snug">
                  Your payment is protected using bank-grade security.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ── Trust Indicators ── */}
        <div className="bg-white border border-border rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {[
            { icon: Lock, text: "256-bit SSL Encryption" },
            { icon: BadgeCheck, text: "Secure Banking Session" },
            { icon: Timer, text: "Avg. completion: less than 1 minute" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={text} className={`flex items-center gap-2.5 ${i < 2 ? "sm:border-r sm:border-slate-100 sm:pr-6" : ""} flex-1`}>
              <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
                <Icon size={13} className="text-primary" />
              </div>
              <span className="text-[12px] font-semibold text-foreground">{text}</span>
            </div>
          ))}
        </div>

        {/* ── Action Buttons (desktop / tablet) ── */}
        <div className="hidden sm:flex flex-row gap-4 pt-1">
          <button
            onClick={onBack}
            className="flex-none w-40 py-4 rounded-xl border-2 border-slate-200 bg-white text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center justify-center gap-2 outline-none"
          >
            <ArrowLeft size={15} />Back
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
            {isProcessing ? <><Spinner />Processing...</> : <>Proceed to Review <ChevronRight size={18} /></>}
          </button>
        </div>

        <SupportSection chatPrefill="Help with loan payment options" className="pb-24 sm:pb-4" />
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
          {isProcessing ? <><Spinner />Processing...</> : <>Proceed to Review <ChevronRight size={15} /></>}
        </button>
      </div>
    </PageShell>
  );
}
