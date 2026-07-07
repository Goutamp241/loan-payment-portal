/**
 * PaymentProcessing page — part of the loan repayment flow.
 * UI preserved from Figma Make export; API integration pending.
 */

import { useState, useEffect } from 'react';
import { Lock, Shield, Timer, AlertTriangle, IndianRupee, CheckCircle2, PhoneCall, MessageCircle, Mail } from 'lucide-react';
import { PageShell } from '@/layouts/PageShell';
import { PaymentStepper } from '@/components/payment/PaymentStepper';
import { ProcessingIllustration } from '@/components/illustrations/ProcessingIllustration';
import { PROCESSING_STEPS } from '@/utils/constants';
import { SupportSection } from '@/components/support/SupportSection';
import { useRepayment } from '@/hooks/useRepayment';
import { displayValue } from '@/utils/format';
import type { PaymentSelection } from '@/types';

export function PaymentProcessingPage({ selection, onComplete, onFail }: { selection: PaymentSelection; onComplete: () => void; onFail: () => void }) {
  const { loanDetails, session, transaction } = useRepayment();
  const willSucceed = transaction?.status === 'success';
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(28);

  // Drive step-by-step processing animation
  useEffect(() => {
    let step = 0;
    let cancelled = false;
    const STEP_MS = 1800;

    const runStep = () => {
      if (cancelled || step >= PROCESSING_STEPS.length) { setTimeout(willSucceed ? onComplete : onFail, 1400); return; }
      setActiveStep(step);
      const stepStart = Date.now();
      const baseProgress = (step / PROCESSING_STEPS.length) * 100;
      const nextProgress = ((step + 1) / PROCESSING_STEPS.length) * 100;

      const animFrame = () => {
        if (cancelled) return;
        const pct = Math.min((Date.now() - stepStart) / STEP_MS, 1);
        setProgress(baseProgress + (nextProgress - baseProgress) * pct);
        if (pct < 1) {
          requestAnimationFrame(animFrame);
        } else {
          setCompletedSteps((prev) => [...prev, step]);
          step++;
          setTimeout(runStep, 300);
        }
      };
      requestAnimationFrame(animFrame);
    };

    const t = setTimeout(runStep, 600);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  // Countdown timer — 28 → 0
  useEffect(() => {
    const id = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const allDone = completedSteps.length === PROCESSING_STEPS.length;
  const W = "max-w-[680px] mx-auto w-full px-4 sm:px-6";

  return (
    <PageShell>
      {/* ── Stepper ── */}
      <div className="bg-white border-b border-border">
        <div className="w-[90%] max-w-[1400px] mx-auto py-5">
          <PaymentStepper currentStep={5} />
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] text-primary font-semibold">Payment processing in progress</span>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col">
        <div className={`${W} py-10 md:py-14 space-y-8 flex-1`}>

          {/* ── Processing Illustration ── */}
          <div className="flex justify-center">
            <ProcessingIllustration activeStep={activeStep} allDone={allDone} customerName={loanDetails?.customerName} />
          </div>

          {/* ── Headline & spinner ── */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              {!allDone ? (
                <svg className="animate-spin w-6 h-6 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {allDone ? "Transaction Complete" : "Processing Your Payment"}
              </h1>
            </div>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md mx-auto">
              {allDone
                ? "Your payment has been processed successfully. A confirmation receipt will be sent shortly."
                : "Please wait while we securely complete your transaction. Do not close this window or refresh the page."}
            </p>
          </div>

          {/* ── Progress bar ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px] font-semibold">
              <span className="text-muted-foreground">{allDone ? "Completed" : "Processing..."}</span>
              <span className={allDone ? "text-emerald-600" : "text-primary"}>{Math.round(progress)}% Completed</span>
            </div>
            <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-none ${allDone ? "bg-emerald-500" : "bg-gradient-to-r from-primary to-accent"}`}
                style={{ width: `${progress}%` }}
              />
              {/* Shimmer effect */}
              {!allDone && (
                <div
                  className="absolute inset-y-0 rounded-full opacity-40"
                  style={{
                    width: "30%",
                    left: `${Math.max(0, progress - 15)}%`,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                  }}
                />
              )}
            </div>
          </div>

          {/* ── Two-column: Steps + Summary ── */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-5 items-start">

            {/* Processing steps */}
            <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 p-5 space-y-1">
              <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Live Processing Status</p>
              {PROCESSING_STEPS.map((label, idx) => {
                const done = completedSteps.includes(idx);
                const active = activeStep === idx && !done;
                const pending = idx > activeStep || (!done && !active);
                return (
                  <div key={label} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                    {/* Icon */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      done ? "bg-emerald-500 shadow-sm shadow-emerald-200" :
                      active ? "bg-primary/10 border-2 border-primary" :
                      "bg-slate-100 border-2 border-slate-200"
                    }`}>
                      {done ? (
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path d="M1 4l3 3.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : active ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </div>
                    {/* Label */}
                    <span className={`text-[13px] flex-1 transition-colors duration-300 ${
                      done ? "text-emerald-600 font-semibold" :
                      active ? "text-primary font-semibold" :
                      "text-slate-400 font-medium"
                    }`}>{label}</span>
                    {/* Active spinner */}
                    {active && (
                      <svg className="animate-spin w-3.5 h-3.5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                      </svg>
                    )}
                    {done && <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide flex-shrink-0">Done</span>}
                  </div>
                );
              })}
            </div>

            {/* Right: Summary + timer + security */}
            <div className="space-y-4">

              {/* Payment Summary */}
              <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 overflow-hidden">
                <div className="bg-gradient-to-br from-primary/6 to-accent/8 px-5 py-4 border-b border-primary/10">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Payment Summary</p>
                  <p className="text-2xl font-bold text-primary mt-1">₹{selection.amount.toLocaleString("en-IN")}</p>
                </div>
                <div className="px-5 py-4 space-y-2.5">
                  {[
                    { label: "Customer", value: displayValue(loanDetails?.customerName) },
                    { label: "Reference", value: displayValue(session?.referenceNumber) },
                    { label: "Method", value: "UPI" },
                    { label: "Date", value: displayValue(session?.sessionDate) },
                    { label: "Merchant", value: "ABC Bank Credit Cards" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-3">
                      <span className="text-[11px] text-muted-foreground flex-shrink-0">{label}</span>
                      <span className="text-[11px] font-semibold text-foreground text-right leading-snug">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Countdown */}
              <div className={`rounded-2xl border px-5 py-4 transition-all duration-500 ${
                allDone ? "bg-emerald-50 border-emerald-200" : "bg-white border-border shadow-sm shadow-slate-100"
              }`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${allDone ? "text-emerald-600" : "text-muted-foreground"}`}>
                  {allDone ? "Completed" : "Estimated completion"}
                </p>
                {allDone ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-500" />
                    <span className="text-lg font-bold text-emerald-600">Payment Successful</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-black text-primary tabular-nums font-mono">
                        {String(Math.floor(countdown / 60)).padStart(2, "0")}:{String(countdown % 60).padStart(2, "0")}
                      </span>
                      <span className="text-[12px] text-muted-foreground mb-1">remaining</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">Est. 15–30 seconds</p>
                  </>
                )}
              </div>

              {/* Security status */}
              <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 p-4 space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Security Status</p>
                {["256-bit SSL Encryption", "PCI-DSS Certified", "Bank-grade Security", "Fraud Detection Active", "End-to-End Encryption"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-[12px] font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Important Notice ── */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[13px] font-bold text-foreground">Important Notice</p>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Your payment is currently being processed. Please do not refresh the page, press the back button, or close your browser until the transaction is complete.
              </p>
            </div>
          </div>

          <SupportSection chatPrefill="Payment is processing — need help" compact className="!border-t !pt-5" />

        </div>
      </main>
    </PageShell>
  );
}
