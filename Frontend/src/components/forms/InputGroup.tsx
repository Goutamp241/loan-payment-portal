import { AlertCircle, CheckCircle2 } from 'lucide-react';
import type { InputState } from '@/types';

interface InputGroupProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  fieldState: InputState;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  autoComplete?: string;
}

export function InputGroup({ id, label, icon, placeholder, value, fieldState, error, onChange, onBlur, type = "text", inputMode, maxLength, autoComplete }: InputGroupProps) {
  const base = "w-full pl-11 pr-10 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 outline-none bg-white placeholder:text-slate-400 text-foreground";
  const variants: Record<InputState, string> = {
    default: "border-slate-200 hover:border-slate-300 focus:border-accent focus:ring-2 focus:ring-accent/20",
    focus: "border-accent ring-2 ring-accent/20",
    success: "border-emerald-400 ring-2 ring-emerald-400/20",
    error: "border-destructive ring-2 ring-destructive/20",
  };
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-foreground block">{label}</label>
      <div className="relative">
        <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${fieldState === "error" ? "text-destructive" : fieldState === "success" ? "text-emerald-500" : "text-muted-foreground"}`}>{icon}</span>
        <input id={id} type={type} inputMode={inputMode} maxLength={maxLength} autoComplete={autoComplete} placeholder={placeholder} value={value} onChange={onChange} onBlur={onBlur} aria-invalid={fieldState === "error"} aria-describedby={error ? `${id}-error` : undefined} className={`${base} ${variants[fieldState]}`} />
        {(fieldState === "success" || fieldState === "error") && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {fieldState === "success" ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-destructive" />}
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[12px] text-destructive flex items-center gap-1.5 font-medium">
          <AlertCircle size={11} />{error}
        </p>
      )}
    </div>
  );
}
