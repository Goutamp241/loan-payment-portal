import { CheckCircle2, ChevronRight, Shield } from 'lucide-react';

export function SuccessCard({ onProceed }: { onProceed: () => void }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-border p-8 md:p-10 text-center space-y-6">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Identity Verified</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
          Your identity has been confirmed. Proceed to review your loan repayment details.
        </p>
      </div>
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-left">
        <p className="text-[12px] text-emerald-700 font-medium flex items-center gap-2">
          <Shield size={13} />
          Verified at {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · Session encrypted
        </p>
      </div>
      <button
        className="w-full py-4 bg-primary text-white rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/25"
        onClick={onProceed}
      >
        Go to Payment Details <ChevronRight size={16} />
      </button>
    </div>
  );
}
