/**
 * Google reCAPTCHA v2 — real widget when VITE_RECAPTCHA_SITE_KEY is set (free tier).
 * Polished demo checkbox when no key is configured (local / assignment).
 */

import { useRef, useCallback } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { Shield, CheckCircle2 } from 'lucide-react';

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim() ?? '';
export const isRecaptchaDevFallback = !SITE_KEY;

interface RecaptchaFieldProps {
  onChange: (token: string | null) => void;
  onExpired?: () => void;
}

/** Demo fallback — no Google keys required. Backend accepts when SKIP_RECAPTCHA=true. */
function DevRecaptchaFallback({ onChange }: { onChange: (checked: boolean) => void }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <label className="flex items-center gap-3 cursor-pointer select-none flex-1 min-w-0">
          <input
            type="checkbox"
            className="w-[22px] h-[22px] rounded border-2 border-slate-300 accent-primary flex-shrink-0"
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="text-[13px] font-medium text-foreground">I&apos;m not a robot</span>
        </label>
        <div className="flex flex-col items-end gap-0.5 flex-shrink-0 opacity-70">
          <div className="flex items-center gap-1">
            <Shield size={14} className="text-slate-400" />
            <span className="text-[9px] font-bold text-slate-500 tracking-wide">reCAPTCHA</span>
          </div>
          <span className="text-[8px] text-slate-400">Privacy · Terms</span>
        </div>
      </div>
      <div className="px-4 py-2 bg-amber-50/80 border-t border-amber-100 flex items-center gap-2">
        <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wide">Demo mode</span>
        <span className="text-[10px] text-amber-600">
          Add <code className="font-mono text-[9px] bg-amber-100 px-1 rounded">VITE_RECAPTCHA_SITE_KEY</code> for live Google reCAPTCHA (free)
        </span>
      </div>
    </div>
  );
}

export function RecaptchaField({ onChange, onExpired }: RecaptchaFieldProps) {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleChange = useCallback(
    (token: string | null) => {
      onChange(token);
    },
    [onChange],
  );

  if (isRecaptchaDevFallback) {
    return (
      <div className="space-y-2">
        <DevRecaptchaFallback
          onChange={(checked) => onChange(checked ? 'dev-captcha-token' : null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 self-start">
          <CheckCircle2 size={13} className="text-emerald-600" />
          <span className="text-[11px] font-semibold text-emerald-700">Secured by Google reCAPTCHA</span>
        </div>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={SITE_KEY}
          onChange={handleChange}
          onExpired={() => {
            recaptchaRef.current?.reset();
            onExpired?.();
            onChange(null);
          }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
        This site is protected by reCAPTCHA and the Google{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
          Terms of Service
        </a>{' '}
        apply.
      </p>
    </div>
  );
}
