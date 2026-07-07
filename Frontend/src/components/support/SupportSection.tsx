/**
 * Reusable Need Help section — consistent across all portal pages.
 */

import { PhoneCall, MessageCircle, Mail } from 'lucide-react';
import { SupportContact } from '@/components/support/SupportContact';
import { SUPPORT } from '@/constants/support';

interface SupportSectionProps {
  chatPrefill?: string;
  className?: string;
  compact?: boolean;
}

export function SupportSection({ chatPrefill, className = '', compact = false }: SupportSectionProps) {
  return (
    <section aria-label="Help and Support" className={`border-t border-slate-100 pt-6 sm:pt-7 pb-2 ${className}`}>
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.14em] mb-4">
        Need Help?
      </p>
      <div
        className={`grid gap-3 sm:gap-4 ${
          compact ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 md:grid-cols-3'
        }`}
      >
        <SupportContact
          icon={PhoneCall}
          label="Customer Care"
          sub={SUPPORT.phoneDisplay}
          desc={SUPPORT.careHours}
          action="contact"
        />
        <SupportContact
          icon={MessageCircle}
          label="Live Chat"
          sub={SUPPORT.chatAvailability}
          desc="Instant response"
          action="chat"
          chatPrefill={chatPrefill}
          noWrapSub={false}
        />
        <SupportContact
          icon={Mail}
          label="Email Support"
          sub={SUPPORT.email}
          desc="Response within 24 hrs"
          action="contact"
        />
      </div>
    </section>
  );
}
