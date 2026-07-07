import { CheckCircle2 } from 'lucide-react';
import { PAYMENT_STEPS } from '@/utils/constants';

const STEPS = PAYMENT_STEPS;

export function PaymentStepper({ currentStep, failedStep }: { currentStep: number; failedStep?: number }) {
  return (
    <div className="flex items-start gap-0" role="list" aria-label="Payment progress">
      {STEPS.map((step, idx) => {
        const stepNum = idx + 1;
        const failed = failedStep !== undefined && stepNum === failedStep;
        const completed = !failed && stepNum < currentStep;
        const active = !failed && stepNum === currentStep;
        const isLast = idx === STEPS.length - 1;

        return (
          <div key={step.label} className="flex items-start flex-1 min-w-0" role="listitem">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className="flex items-center w-full">
                {/* Left connector */}
                <div className={`flex-1 h-0.5 transition-colors duration-300 ${
                  idx === 0 ? "invisible" : failed ? "bg-red-300" : completed || active ? "bg-primary" : "bg-slate-200"
                }`} />
                {/* Circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  failed   ? "bg-destructive shadow-sm shadow-red-200 ring-4 ring-destructive/15" :
                  completed ? "bg-emerald-500 shadow-sm shadow-emerald-200" :
                  active    ? "bg-primary shadow-md shadow-primary/30 ring-4 ring-primary/15" :
                  "bg-slate-100 border-2 border-slate-200"
                }`}>
                  {failed ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 2l8 8M10 2l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : completed ? (
                    <CheckCircle2 size={16} className="text-white" />
                  ) : (
                    <span className={`text-[12px] font-bold ${active ? "text-white" : "text-slate-400"}`}>{stepNum}</span>
                  )}
                </div>
                {/* Right connector */}
                <div className={`flex-1 h-0.5 transition-colors duration-300 ${isLast ? "invisible" : completed ? "bg-primary" : "bg-slate-200"}`} />
              </div>
              <div className="mt-2 text-center px-1">
                <p className={`hidden sm:block text-[11px] font-semibold leading-tight transition-colors duration-200 ${
                  failed ? "text-destructive" : completed ? "text-emerald-600" : active ? "text-primary" : "text-slate-400"
                }`}>
                  {step.label}
                </p>
                <p className={`sm:hidden text-[10px] font-semibold leading-tight transition-colors duration-200 ${
                  failed ? "text-destructive" : completed ? "text-emerald-600" : active ? "text-primary" : "text-slate-400"
                }`}>
                  {step.shortLabel}
                </p>
                <p className={`text-[10px] font-medium mt-0.5 transition-colors duration-200 ${
                  failed ? "text-red-400" : completed ? "text-emerald-500" : active ? "text-accent" : "text-slate-300"
                }`}>
                  {failed ? "Failed" : completed ? "Completed" : active ? "Current Step" : ""}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
