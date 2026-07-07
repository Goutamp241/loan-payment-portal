/**
 * Shown when the API returns zero outstanding balance (assignment requirement).
 */

import { CheckCircle2 } from 'lucide-react';
import { PageShell } from '@/layouts/PageShell';
import { PaymentStepper } from '@/components/payment/PaymentStepper';
import type { LoanDetails } from '@/types';

interface NoPaymentRequiredProps {
  loanDetails: LoanDetails;
  onBack: () => void;
}

export function NoPaymentRequired({ loanDetails, onBack }: NoPaymentRequiredProps) {
  const W = 'w-[90%] max-w-[1400px] mx-auto';

  return (
    <PageShell>
      <div className="bg-white border-b border-border">
        <div className={`${W} py-5`}>
          <PaymentStepper currentStep={2} />
        </div>
      </div>

      <div className={`${W} py-16 md:py-24`}>
        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">No Payment Required</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hi {loanDetails.customerName}, your account has no outstanding balance at this time.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-4 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/25"
          >
            Return to Verification
          </button>
        </div>
      </div>
    </PageShell>
  );
}
