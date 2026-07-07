/**
 * Support contact card — opens live chat, contact modal, or direct links.
 */

import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { useLiveChat } from '@/context/LiveChatContext';
import { useLegalModal } from '@/context/LegalModalContext';
import { SUPPORT } from '@/constants/support';

interface SupportContactProps {
  icon: LucideIcon;
  label: string;
  sub: string;
  desc?: string;
  action?: 'chat' | 'phone' | 'email' | 'contact';
  chatPrefill?: string;
  className?: string;
  /** Prevent line breaks inside phone numbers / email */
  noWrapSub?: boolean;
}

export function SupportContact({
  icon: Icon,
  label,
  sub,
  desc,
  action = 'chat',
  chatPrefill,
  className = '',
  noWrapSub = true,
}: SupportContactProps) {
  const { openChat } = useLiveChat();
  const { openContact } = useLegalModal();

  function handleClick() {
    if (action === 'chat') {
      openChat(chatPrefill ?? label);
      return;
    }
    if (action === 'contact' || action === 'phone' || action === 'email') {
      openContact();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group w-full text-left rounded-2xl border border-border bg-white p-5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/25 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/15 group-hover:to-primary/10 transition-colors">
          <Icon size={18} className="text-primary" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] font-bold text-foreground leading-tight">{label}</p>
            <ChevronRight
              size={14}
              className="text-slate-300 flex-shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
            />
          </div>
          <p
            className={`text-[13px] font-semibold text-primary mt-1.5 leading-tight ${
              noWrapSub ? 'whitespace-nowrap overflow-hidden text-ellipsis' : 'break-words'
            }`}
            title={sub}
          >
            {sub}
          </p>
          {desc && (
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{desc}</p>
          )}
        </div>
      </div>
    </button>
  );
}

export { SUPPORT };
