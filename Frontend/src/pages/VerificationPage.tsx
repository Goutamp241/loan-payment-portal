/**
 * Verification page — part of the loan repayment flow.
 * UI preserved from Figma Make export; API integration pending.
 */

import { useState } from 'react';
import { Shield, Lock, Globe, Clock, Phone, CreditCard, ChevronRight, AlertCircle } from 'lucide-react';
import { PageShell } from '@/layouts/PageShell';
import { InputGroup } from '@/components/forms/InputGroup';
import { Spinner } from '@/components/feedback/Spinner';
import { SuccessCard } from '@/components/feedback/SuccessCard';
import { BankingIllustration } from '@/components/illustrations/BankingIllustration';
import { RecaptchaField } from '@/components/forms/RecaptchaField';
import { SupportSection } from '@/components/support/SupportSection';
import { useRepayment } from '@/hooks/useRepayment';
import { verificationService } from '@/services/verificationService';
import { ApiError } from '@/services/api';
import { MOBILE_REGEX, CARD_REGEX } from '@/utils/constants';
import { validateMobile, validateCard } from '@/utils/validation';
import type { InputField } from '@/types';

interface VerificationPageProps {
  onSuccess: () => void;
}

export function VerificationPage({ onSuccess }: VerificationPageProps) {
  const { setAuthToken, setVerification, resetFlow } = useRepayment();
  const [mobile, setMobile] = useState<InputField>({ value: "", state: "default", error: "" });
  const [card, setCard] = useState<InputField>({ value: "", state: "default", error: "" });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isFormValid = MOBILE_REGEX.test(mobile.value) && CARD_REGEX.test(card.value) && !!captchaToken;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    resetFlow();

    try {
      const result = await verificationService.verify({
        mobile: mobile.value,
        cardLast4: card.value,
        captchaToken: captchaToken!,
      });
      setAuthToken(result.token);
      setVerification(result.verification);
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Verification failed. Please check your details and try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleProceed() {
    onSuccess();
  }

  return (
    <PageShell>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start lg:items-center min-h-[calc(100vh-10rem)]">
          {/* Left */}
          <div className="lg:py-8 space-y-10">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-3.5 py-1.5">
                <Shield size={13} className="text-primary" />
                <span className="text-[12px] font-semibold text-primary tracking-wide uppercase">RBI Regulated &amp; Compliant</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.15] tracking-tight">
                Loan Repayment<br /><span className="text-primary">Portal</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">
                Securely view and repay your credit card dues in a few simple steps.
              </p>
            </div>
            <BankingIllustration />
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm shadow-slate-100 space-y-4">
              <p className="text-[13px] font-bold text-primary uppercase tracking-widest">Why Choose Us?</p>
              <ul className="space-y-3">
                {[
                  { icon: Shield, label: "Bank-grade Security", desc: "256-bit TLS encryption on every transaction" },
                  { icon: Lock, label: "End-to-End Encryption", desc: "Your data is never exposed in transit" },
                  { icon: Globe, label: "RBI Compliant", desc: "Fully regulated and audited portal" },
                  { icon: Clock, label: "24×7 Secure Payments", desc: "Round-the-clock availability" },
                ].map(({ icon: Icon, label, desc }) => (
                  <li key={label} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground leading-tight">{label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right */}
          <div className="lg:py-8 flex justify-center lg:justify-end">
            <div className="w-full max-w-[460px]">
              {submitted ? (
                <SuccessCard onProceed={handleProceed} />
              ) : (
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-300/60 border border-border p-8 md:p-10 space-y-7">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
                        <Shield size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Step 1 of 4</p>
                        <p className="text-[13px] font-semibold text-primary">Identity Verification</p>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Verify Your Identity</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Enter your registered details to securely access your loan account.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <InputGroup
                      id="mobile" label="Registered Mobile Number" icon={<Phone size={16} />}
                      placeholder="Enter 10-digit mobile number" value={mobile.value}
                      fieldState={mobile.state} error={mobile.error}
                      onChange={(e) => { const r = e.target.value.replace(/\D/g,"").slice(0,10); setMobile({ value: r, ...validateMobile(r) }); }}
                      onBlur={() => mobile.value && setMobile(p => ({ ...p, ...validateMobile(p.value) }))}
                      type="tel" inputMode="numeric" maxLength={10} autoComplete="tel"
                    />
                    <InputGroup
                      id="card" label="Last 4 Digits of Credit Card" icon={<CreditCard size={16} />}
                      placeholder="e.g. 4821" value={card.value}
                      fieldState={card.state} error={card.error}
                      onChange={(e) => { const r = e.target.value.replace(/\D/g,"").slice(0,4); setCard({ value: r, ...validateCard(r) }); }}
                      onBlur={() => card.value && setCard(p => ({ ...p, ...validateCard(p.value) }))}
                      type="text" inputMode="numeric" maxLength={4} autoComplete="cc-number"
                    />

                    <RecaptchaField
                      onChange={setCaptchaToken}
                      onExpired={() => setCaptchaToken(null)}
                    />

                    <button
                      type="submit" disabled={!isFormValid || isSubmitting}
                      className={`w-full py-4 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-200 ${isFormValid && !isSubmitting ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.98] shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                    >
                      {isSubmitting ? (
                        <><Spinner />Verifying...</>
                      ) : (
                        <>Continue <ChevronRight size={16} /></>
                      )}
                    </button>

                    {submitError && (
                      <p role="alert" className="text-[12px] text-destructive flex items-center gap-1.5 font-medium">
                        <AlertCircle size={13} />{submitError}
                      </p>
                    )}
                  </form>

                  <div className="flex items-start gap-2.5 pt-1 border-t border-slate-100">
                    <Lock size={13} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      Your information is protected using bank-grade security. We never store or share your card details.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <SupportSection chatPrefill="Help with account verification" className="mt-8 pb-4" />
      </div>
    </PageShell>
  );
}
