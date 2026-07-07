/**
 * GatewayRedirect page — part of the loan repayment flow.
 * UI preserved from Figma Make export; API integration pending.
 */

import { useState } from 'react';
import { Lock, Shield, ChevronRight, IndianRupee, Timer, AlertTriangle, Building2, CheckCircle2, Info } from 'lucide-react';
import { PageShell } from '@/layouts/PageShell';
import { PaymentStepper } from '@/components/payment/PaymentStepper';
import { GatewayIllustration } from '@/components/illustrations/GatewayIllustration';
import { GATEWAY_STEPS } from '@/utils/constants';
import { useRepayment } from '@/hooks/useRepayment';
import { displayValue } from '@/utils/format';
import type { PaymentSelection } from '@/types';

export function GatewayRedirectPage({ selection, onProceed }: { selection: PaymentSelection; onProceed: () => void }) {
  const { session } = useRepayment();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  // Drive the step-by-step animation
  useState(() => {
    let step = 0;
    const STEP_DURATION = 900;

    const tick = () => {
      if (step >= GATEWAY_STEPS.length) { setDone(true); setTimeout(onProceed, 900); return; }
      setCurrentStep(step);
      const start = Date.now();
      const base = (step / GATEWAY_STEPS.length) * 100;
      const next = ((step + 1) / GATEWAY_STEPS.length) * 100;

      const animate = () => {
        const elapsed = Date.now() - start;
        const pct = Math.min(elapsed / STEP_DURATION, 1);
        setProgress(base + (next - base) * pct);
        if (pct < 1) {
          requestAnimationFrame(animate);
        } else {
          setCompletedSteps((prev) => [...prev, step]);
          step++;
          setTimeout(tick, 200);
        }
      };
      requestAnimationFrame(animate);
    };

    const t = setTimeout(tick, 400);
    return () => clearTimeout(t);
  });

  return (
    <div className="min-h-screen bg-background font-[Inter,system-ui,sans-serif] flex flex-col overflow-x-hidden">
      {/* Header — same as all screens */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 h-14 sm:h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
              <Building2 size={18} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-semibold text-primary tracking-tight">ABC Bank</span>
              <span className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
                Loan Repayment Portal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Lock size={11} className="text-emerald-600" />
            <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 tracking-wide">SECURE PAYMENT</span>
          </div>
        </div>
      </header>

      {/* Centered content — full remaining height */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-[520px] mx-auto space-y-7">

          {/* ── Central Illustration ── */}
          <div className="flex justify-center">
            <GatewayIllustration done={done} />
          </div>

          {/* ── Heading ── */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              {done ? "Connection Established" : "Redirecting to Secure Payment Gateway"}
            </h1>
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              {done
                ? "Your payment request has been securely transferred to 1Pay."
                : "Your payment request is being securely transferred. Please wait."}
            </p>
          </div>

          {/* ── Animated Progress Bar ── */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
              <span>{done ? "Secure connection ready" : "Connecting securely..."}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* ── Step Checklist ── */}
          <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 p-5 space-y-3">
            {GATEWAY_STEPS.map((label, idx) => {
              const completed = completedSteps.includes(idx);
              const active = currentStep === idx && !completed;
              return (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    completed
                      ? "bg-emerald-500 shadow-sm shadow-emerald-200"
                      : active
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-slate-100 border-2 border-slate-200"
                  }`}>
                    {completed ? (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 3.5L4 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : active ? (
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <span className={`text-[13px] transition-colors duration-300 ${
                    completed ? "text-emerald-600 font-semibold" :
                    active ? "text-primary font-semibold" :
                    "text-slate-400 font-medium"
                  }`}>
                    {label}
                  </span>
                  {active && (
                    <svg className="animate-spin w-3.5 h-3.5 text-primary ml-auto flex-shrink-0" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Security Trust Card ── */}
          <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
                <Shield size={14} className="text-primary" />
              </div>
              <p className="text-[13px] font-bold text-foreground">Your payment is protected with:</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
              {[
                "256-bit SSL Encryption",
                "RBI Compliant",
                "PCI-DSS Secure Payment",
                "End-to-End Encryption",
                "Bank-grade Security",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-[12px] font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Please Wait card ── */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
            <Info size={15} className="text-accent flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[13px] font-bold text-foreground">Please Wait</p>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                You are being redirected to our trusted payment partner. Do not close this window.
                This usually takes <span className="font-semibold text-foreground">less than 5 seconds</span>.
              </p>
            </div>
          </div>

          {/* ── Estimated Wait ── */}
          <div className="flex items-center justify-center gap-2.5 bg-white border border-border rounded-2xl px-5 py-3.5 shadow-sm shadow-slate-100">
            <Timer size={14} className="text-primary flex-shrink-0" />
            <span className="text-[13px] text-muted-foreground">Estimated wait:</span>
            <span className="text-[13px] font-bold text-foreground">3–5 seconds</span>
          </div>

          {/* ── Do not close notice ── */}
          <p className="text-center text-[12px] text-muted-foreground flex items-center justify-center gap-1.5">
            <Lock size={11} className="text-slate-400" />
            Do not close or refresh this page while the transfer is in progress.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-5">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20">
              <Shield size={12} className="text-white" />
            </div>
            <span className="text-[12px] font-bold text-primary tracking-tight">1Pay</span>
            <span className="text-[12px] text-muted-foreground font-medium">Secure Gateway</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Processing secure online payment...</p>
        </div>
      </footer>
    </div>
  );
}

// ─── Gateway Illustration ──────────────────────────────────────────────────────
