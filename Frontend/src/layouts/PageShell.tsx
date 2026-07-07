/**
 * Main application layout wrapping every page with header and footer.
 */

import { Building2, Lock } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLegalModal } from '@/context/LegalModalContext';

interface PageShellProps {
  children: ReactNode;
  /** Hide footer on mobile when a page has its own fixed bottom action bar */
  hideMobileFooter?: boolean;
}

export function PageShell({ children, hideMobileFooter = false }: PageShellProps) {
  const { openPrivacy, openTerms, openContact } = useLegalModal();

  return (
    <div className="min-h-screen bg-background font-[Inter,system-ui,sans-serif] flex flex-col overflow-x-hidden">
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 h-14 sm:h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm shadow-primary/30 flex-shrink-0">
              <Building2 size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="flex flex-col leading-none min-w-0">
              <span className="text-[12px] sm:text-[13px] font-semibold text-primary tracking-tight truncate">ABC Bank</span>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium tracking-wide uppercase truncate">
                Loan Repayment Portal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <Lock size={10} className="text-emerald-600 sm:w-[11px] sm:h-[11px]" />
            <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 tracking-wide">
              SECURE PAYMENT
            </span>
          </div>
        </div>
      </header>

      <main className={`flex-1 ${hideMobileFooter ? 'pb-24 sm:pb-6' : 'pb-20 sm:pb-6'}`}>{children}</main>

      <footer
        className={`border-t border-border bg-white ${
          hideMobileFooter ? 'hidden sm:block' : ''
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[11px] sm:text-[12px] text-muted-foreground text-center sm:text-left">
            © 2026 ABC Bank. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <button type="button" onClick={openPrivacy} className="text-[11px] sm:text-[12px] text-muted-foreground hover:text-primary transition-colors font-medium">
              Privacy Policy
            </button>
            <button type="button" onClick={openTerms} className="text-[11px] sm:text-[12px] text-muted-foreground hover:text-primary transition-colors font-medium">
              Terms &amp; Conditions
            </button>
            <button type="button" onClick={openContact} className="text-[11px] sm:text-[12px] text-muted-foreground hover:text-primary transition-colors font-medium">
              Contact Support
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
