/**
 * Payment history — lists all transactions for the verified customer.
 */

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  History,
  Receipt,
  XCircle,
} from 'lucide-react';
import { PageShell } from '@/layouts/PageShell';
import { Spinner } from '@/components/feedback/Spinner';
import { SupportSection } from '@/components/support/SupportSection';
import { useRepayment } from '@/hooks/useRepayment';
import { paymentService } from '@/services/paymentService';
import { ApiError } from '@/services/api';
import { formatCurrency, displayValue } from '@/utils/format';
import type { PaymentHistoryItem } from '@/types';

interface PaymentHistoryPageProps {
  onBack: () => void;
}

function statusBadge(status: PaymentHistoryItem['status']) {
  if (status === 'success') {
    return (
      <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
        <CheckCircle2 size={11} />
        Success
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-red-700">
        <XCircle size={11} />
        Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
      <Clock size={11} />
      {status === 'processing' ? 'Processing' : 'Pending'}
    </span>
  );
}

function optionLabel(option: string): string {
  const map: Record<string, string> = {
    total: 'Pay Total Due',
    minimum: 'Pay Minimum Due',
    custom: 'Custom Amount',
  };
  return map[option] ?? option;
}

export function PaymentHistoryPage({ onBack }: PaymentHistoryPageProps) {
  const { authToken, loanDetails } = useRepayment();
  const [items, setItems] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const W = 'w-[90%] max-w-[1400px] mx-auto';

  useEffect(() => {
    if (!authToken) {
      setError('Please verify your identity first.');
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { transactions } = await paymentService.getHistory(authToken!);
        if (!cancelled) setItems(transactions);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Unable to load payment history.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [authToken]);

  return (
    <PageShell>
      <div className={`${W} py-8 md:py-10 space-y-6`}>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <History size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Payment History</h1>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                All repayment transactions for {displayValue(loanDetails?.customerName, 'your account')}
              </p>
            </div>
          </div>
          {loanDetails?.customerId && (
            <p className="text-[12px] text-muted-foreground font-mono bg-slate-50 border border-border rounded-lg px-3 py-2">
              ID: {loanDetails.customerId}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 overflow-hidden">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Spinner />
              <p className="text-[13px] text-muted-foreground">Loading transactions…</p>
            </div>
          )}

          {!loading && error && (
            <div className="px-6 py-12 text-center space-y-2">
              <p className="text-[14px] font-semibold text-red-600">{error}</p>
              <p className="text-[13px] text-muted-foreground">Try verifying again from the home page.</p>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="px-6 py-16 text-center space-y-3">
              <Receipt size={32} className="text-slate-300 mx-auto" />
              <p className="text-[14px] font-semibold text-foreground">No transactions yet</p>
              <p className="text-[13px] text-muted-foreground">Completed payments will appear here.</p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <>
              {/* Mobile: card list */}
              <div className="md:hidden divide-y divide-slate-100">
                {items.map((txn) => (
                  <div key={txn.id} className="px-4 py-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[12px] font-mono font-semibold text-foreground break-all">{txn.transactionId}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">{txn.transactionTime}</p>
                      </div>
                      <p className="text-[15px] font-bold text-primary flex-shrink-0">{formatCurrency(txn.amount)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {statusBadge(txn.status)}
                      <span className="text-[11px] text-muted-foreground">{optionLabel(txn.paymentOption)}</span>
                    </div>
                    {txn.failureReason && (
                      <p className="text-[11px] text-red-600 leading-snug">{txn.failureReason}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop: table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    {['Date & Time', 'Transaction ID', 'Payment Type', 'Amount', 'Status'].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((txn) => (
                    <tr key={txn.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 text-[13px] font-medium text-foreground whitespace-nowrap">
                        {txn.transactionTime}
                      </td>
                      <td className="px-5 py-4 text-[12px] font-mono font-semibold text-foreground">
                        {txn.transactionId}
                      </td>
                      <td className="px-5 py-4 text-[13px] text-muted-foreground">
                        {optionLabel(txn.paymentOption)}
                      </td>
                      <td className="px-5 py-4 text-[14px] font-bold text-primary whitespace-nowrap">
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          {statusBadge(txn.status)}
                          {txn.failureReason && (
                            <p className="text-[11px] text-red-600 max-w-[200px] leading-snug">{txn.failureReason}</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </>
          )}
        </div>

        <SupportSection chatPrefill="I need help with my payment history" />
      </div>
    </PageShell>
  );
}
