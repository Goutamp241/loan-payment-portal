/**
 * RetryingPayment page — part of the loan repayment flow.
 * UI preserved from Figma Make export; API integration pending.
 */

import { useState, useEffect, useMemo } from 'react';
import { Lock, Shield, Timer, AlertTriangle, IndianRupee, CheckCircle2 } from 'lucide-react';
import { PageShell } from '@/layouts/PageShell';
import { PaymentStepper } from '@/components/payment/PaymentStepper';
import { ProcessingIllustration } from '@/components/illustrations/ProcessingIllustration';
import { RETRY_STEPS } from '@/utils/constants';
import type { PaymentSelection } from '@/types';

export function RetryingPaymentPage({
  selection, onComplete, onFail,
}: { selection: PaymentSelection; onComplete: () => void; onFail: () => void; }) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(28);
  const willSucceed = useMemo(() => Math.random() > 0.35, []);
  const W = "max-w-[680px] mx-auto w-full px-4 sm:px-6";

  useEffect(() => {
    let step = 0; let cancelled = false; const STEP_MS = 1600;
    const runStep = () => {
      if (cancelled || step >= RETRY_STEPS.length) { setTimeout(willSucceed ? onComplete : onFail, 1200); return; }
      setActiveStep(step);
      const start = Date.now(); const base = (step / RETRY_STEPS.length) * 100; const next = ((step + 1) / RETRY_STEPS.length) * 100;
      const frame = () => {
        if (cancelled) return;
        const pct = Math.min((Date.now() - start) / STEP_MS, 1);
        setProgress(base + (next - base) * pct);
        if (pct < 1) requestAnimationFrame(frame);
        else { setCompletedSteps((p) => [...p, step]); step++; setTimeout(runStep, 250); }
      };
      requestAnimationFrame(frame);
    };
    const t = setTimeout(runStep, 500); return () => { cancelled = true; clearTimeout(t); };
  }, []);

  useEffect(() => { const id = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000); return () => clearInterval(id); }, []);
  const allDone = completedSteps.length === RETRY_STEPS.length;

  return (
    <PageShell>
      <div className="bg-white border-b border-border">
        <div className="w-[90%] max-w-[1400px] mx-auto py-5">
          <PaymentStepper currentStep={5} />
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] text-primary font-semibold">Retry in progress — please wait</span>
          </div>
        </div>
      </div>
      <main className="flex-1 flex flex-col">
        <div className={`${W} py-10 md:py-14 space-y-8`}>
          <div className="flex justify-center">
            <ProcessingIllustration activeStep={Math.min(activeStep, 4)} allDone={allDone} />
          </div>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              {!allDone ? (
                <svg className="animate-spin w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                {allDone ? "Finalizing..." : "Retrying Your Payment"}
              </h1>
            </div>
            <p className="text-[14px] text-muted-foreground leading-relaxed max-w-md mx-auto">
              Please wait while we securely reconnect to the payment gateway. Do not close this window or refresh the page.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[12px] font-semibold">
              <span className="text-muted-foreground">Retrying securely...</span>
              <span className="text-primary">{Math.round(progress)}% Completed</span>
            </div>
            <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent transition-none" style={{ width: `${progress}%` }} />
              {!allDone && (
                <div className="absolute inset-y-0 rounded-full opacity-40"
                  style={{ width:"30%", left:`${Math.max(0,progress-15)}%`, background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)" }} />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-5 items-start">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-1">
              <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Processing Timeline</p>
              {RETRY_STEPS.map((label, idx) => {
                const done = completedSteps.includes(idx);
                const active = activeStep === idx && !done;
                return (
                  <div key={label} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${done ? "bg-emerald-500 shadow-sm shadow-emerald-200" : active ? "bg-primary/10 border-2 border-primary" : "bg-slate-100 border-2 border-slate-200"}`}>
                      {done ? <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4l3 3.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            : active ? <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                            : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                    </div>
                    <span className={`text-[13px] flex-1 transition-colors duration-300 ${done ? "text-emerald-600 font-semibold" : active ? "text-primary font-semibold" : "text-slate-400 font-medium"}`}>{label}</span>
                    {active && <svg className="animate-spin w-3.5 h-3.5 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" /></svg>}
                    {done && <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">Done</span>}
                  </div>
                );
              })}
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Estimated Time</p>
                <p className="text-3xl font-black text-primary tabular-nums font-mono">
                  {String(Math.floor(countdown / 60)).padStart(2,"0")}:{String(countdown % 60).padStart(2,"0")}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">Est. 15–30 seconds</p>
              </div>
              <div className="bg-white rounded-2xl border border-border shadow-sm p-4 space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Security Active</p>
                {["256-bit SSL","PCI-DSS","RBI Compliance","End-to-End Encryption","Fraud Detection"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-[12px] font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[13px] font-bold text-foreground">Important Notice</p>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Do not refresh the page, press the browser back button, or close this window. Your transaction is currently being processed.
              </p>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
