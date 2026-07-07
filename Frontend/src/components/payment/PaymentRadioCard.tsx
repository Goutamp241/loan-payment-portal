interface PaymentRadioCardProps {
  id: string;
  selected: boolean;
  onSelect: () => void;
  badge?: string;
  badgeColor?: 'emerald' | 'amber';
  title: string;
  amount: string;
  amountColor: string;
  description: string;
}

export function PaymentRadioCard({ id, selected, onSelect, badge, badgeColor = "emerald", title, amount, amountColor, description }: PaymentRadioCardProps) {
  const badgeClasses = badgeColor === "emerald"
    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
    : "bg-amber-50 border border-amber-200 text-amber-700";

  return (
    <div
      id={id} role="radio" aria-checked={selected} tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && onSelect()}
      className={`rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
        selected
          ? "border-primary bg-primary/4 shadow-md shadow-primary/10"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md shadow-sm shadow-slate-100"
      }`}
    >
      <div className="flex items-center gap-4">
        <RadioDot selected={selected} />
        <div className="flex-1 flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[14px] font-bold text-foreground">{title}</p>
              {badge && (
                <span className={`text-[10px] font-bold uppercase tracking-wide rounded-full px-2 py-0.5 ${badgeClasses}`}>
                  {badge}
                </span>
              )}
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <p className={`text-xl font-bold tracking-tight flex-shrink-0 ${amountColor}`}>{amount}</p>
        </div>
      </div>
    </div>
  );
}

export function RadioDot({ selected }: { selected: boolean }) {
  return (
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${selected ? "border-primary" : "border-slate-300"}`}>
      {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
    </div>
  );
}
