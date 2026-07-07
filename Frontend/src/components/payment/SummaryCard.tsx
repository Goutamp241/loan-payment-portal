import type { ReactNode } from 'react';

interface SummaryCardProps {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string;
  valueColor: string;
  valueSize?: string;
  borderColor: string;
  customValue?: ReactNode;
}

export function SummaryCard({ icon, iconBg, label, value, valueColor, valueSize = "text-xl", borderColor, customValue }: SummaryCardProps) {
  return (
    <div className={`bg-white rounded-2xl border ${borderColor} shadow-sm shadow-slate-100 p-4 space-y-2 hover:shadow-md transition-shadow duration-200`}>
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>{icon}</div>
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
      {customValue || <p className={`${valueSize} font-bold ${valueColor} tracking-tight leading-tight`}>{value}</p>}
    </div>
  );
}
