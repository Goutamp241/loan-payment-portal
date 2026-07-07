/**
 * Simulated 1Pay gateway — OTP verification (demo OTP: 1562).
 * Styled as an external payment page (not ABC Bank branding).
 */

import { useRef, useState, type KeyboardEvent } from 'react';
import { Lock, Shield, IndianRupee, Timer, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Spinner } from '@/components/feedback/Spinner';
import { useRepayment } from '@/hooks/useRepayment';
import { paymentService } from '@/services/paymentService';
import { ApiError } from '@/services/api';
import { formatCurrency, displayValue } from '@/utils/format';
import type { PaymentSelection } from '@/types';

const OTP_LENGTH = 4;
const DEMO_OTP_HINT = import.meta.env.VITE_DEMO_OTP ?? '1562';

interface OnePaySandboxPageProps {
  selection: PaymentSelection;
  onSuccess: () => void;
  onFailure: () => void;
}

export function OnePaySandboxPage({ selection, onSuccess, onFailure }: OnePaySandboxPageProps) {
  const { loanDetails, session, transaction, paymentMethod, authToken, setTransaction } = useRepayment();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otp = digits.join('');
  const canVerify = otp.length === OTP_LENGTH && !isVerifying;

  function handleDigitChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError(null);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    if (!canVerify || !authToken || !transaction?.id || !paymentMethod) return;

    setIsVerifying(true);
    setError(null);

    try {
      const { transaction: result } = await paymentService.verifyOtp(authToken, {
        transactionId: transaction.id,
        otp,
        paymentMethod: paymentMethod.tab,
        paymentMethodLabel: paymentMethod.label,
      });

      setTransaction(result);

      if (result.status === 'success') {
        onSuccess();
      } else {
        onFailure();
      }
    } catch (err) {
      if (err instanceof ApiError && err.code === 'OTP_LOCKED') {
        setError('Too many invalid OTP attempts. Please go back and start a new payment.');
        return;
      }
      setError(err instanceof ApiError ? err.message : 'OTP verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 font-[Inter,system-ui,sans-serif] flex flex-col">
      {/* 1Pay header */}
      <header className="bg-white/5 border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white text-[13px] font-black tracking-tighter">1P</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[14px] font-bold text-white tracking-tight">1Pay</span>
              <span className="text-[10px] text-indigo-300 font-medium">Secure Payment Gateway</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-400/30 rounded-full px-2.5 py-1">
            <Lock size={10} className="text-emerald-400" />
            <span className="text-[10px] font-semibold text-emerald-300">256-bit SSL</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-md">
          {/* Merchant card */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4">
              <p className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wider">Paying to</p>
              <p className="text-[18px] font-bold text-white mt-0.5">ABC Bank — Loan Repayment</p>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Amount */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-[13px] text-slate-500">Amount</span>
                <span className="text-[22px] font-bold text-slate-900 flex items-center gap-0.5">
                  <IndianRupee size={18} strokeWidth={2.5} />
                  {selection.amount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2.5">
                {[
                  { label: 'Payment Method', value: displayValue(paymentMethod?.label) },
                  { label: 'Transaction ID', value: displayValue(transaction?.transactionId) },
                  { label: 'Reference', value: displayValue(session?.referenceNumber) },
                  { label: 'Customer', value: displayValue(loanDetails?.customerName) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-[12px]">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-slate-700 font-medium text-right max-w-[60%] truncate">{value}</span>
                  </div>
                ))}
              </div>

              {/* OTP section */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                <div className="flex items-start gap-2.5">
                  <Shield size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-slate-800">Enter OTP to authorize payment</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      OTP sent to {displayValue(loanDetails?.mobileMasked, 'your registered mobile')}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-200 bg-white text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-3 py-2">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <p className="text-[12px] font-medium">{error}</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={!canVerify}
                className={`w-full py-3.5 rounded-xl text-[14px] font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                  canVerify
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isVerifying ? (
                  <><Spinner /> Verifying...</>
                ) : (
                  <><CheckCircle2 size={16} /> Verify &amp; Complete Payment</>
                )}
              </button>

              {/* Demo hint */}
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                <Timer size={13} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  <span className="font-semibold">Demo mode:</span> Enter OTP{' '}
                  <span className="font-mono font-bold">{DEMO_OTP_HINT}</span> for successful payment.
                  Any other OTP will simulate a declined transaction.
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-slate-500 mt-4">
            Powered by 1Pay · Simulated sandbox for demonstration purposes
          </p>
        </div>
      </main>
    </div>
  );
}
