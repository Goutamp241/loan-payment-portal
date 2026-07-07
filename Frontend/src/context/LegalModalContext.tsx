/**
 * Global modals for Privacy Policy, Terms, and Contact Support (read-only).
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { X, Phone, Mail, MessageCircle, Copy, Check } from 'lucide-react';
import { getLegalDocument, type LegalDocumentKey } from '@/data/legalContent';
import { SUPPORT } from '@/constants/support';
import { useLiveChat } from '@/context/LiveChatContext';

type ModalType = LegalDocumentKey | 'contact' | null;

interface LegalModalContextValue {
  openPrivacy: () => void;
  openTerms: () => void;
  openContact: () => void;
}

const LegalModalContext = createContext<LegalModalContextValue | null>(null);

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="p-1.5 rounded-lg hover:bg-slate-100 text-muted-foreground hover:text-primary transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
    </button>
  );
}

function ModalShell({ title, subtitle, onClose, children }: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button type="button" className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={onClose} aria-label="Close dialog" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full sm:max-w-lg max-h-[min(92vh,640px)] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 id="modal-title" className="text-[16px] font-bold text-foreground">{title}</h2>
            {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
        <div className="px-5 py-3 border-t border-slate-100 flex-shrink-0">
          <button type="button" onClick={onClose} className="w-full py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold hover:bg-primary/90 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function LegalModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalType>(null);
  const { openChat } = useLiveChat();

  const close = useCallback(() => setModal(null), []);
  const openPrivacy = useCallback(() => setModal('privacy'), []);
  const openTerms = useCallback(() => setModal('terms'), []);
  const openContact = useCallback(() => setModal('contact'), []);

  const value = useMemo(() => ({ openPrivacy, openTerms, openContact }), [openPrivacy, openTerms, openContact]);

  const legal = modal === 'privacy' || modal === 'terms' ? getLegalDocument(modal) : null;

  return (
    <LegalModalContext.Provider value={value}>
      {children}
      {legal && (
        <ModalShell title={legal.title} subtitle={`Last updated: ${legal.lastUpdated}`} onClose={close}>
          <div className="space-y-4">
            {legal.sections.map((s) => (
              <div key={s.heading}>
                <h3 className="text-[13px] font-bold text-foreground mb-1">{s.heading}</h3>
                <p className="text-[12px] text-slate-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </ModalShell>
      )}
      {modal === 'contact' && (
        <ModalShell title="Contact Support" subtitle="We're here to help with your loan repayment" onClose={close}>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-slate-50/80">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Customer Care</p>
                <p className="text-[15px] font-bold text-foreground">{SUPPORT.phoneDisplay}</p>
                <p className="text-[11px] text-muted-foreground">{SUPPORT.careHours}</p>
              </div>
              <CopyButton text={SUPPORT.phoneDisplay} />
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-slate-50/80">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Email Support</p>
                <p className="text-[14px] font-bold text-primary break-all">{SUPPORT.email}</p>
                <p className="text-[11px] text-muted-foreground">Response within 24 hours</p>
              </div>
              <CopyButton text={SUPPORT.email} />
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-slate-50/80">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Live Chat</p>
                <p className="text-[14px] font-bold text-foreground">{SUPPORT.chatAvailability}</p>
                <p className="text-[11px] text-muted-foreground">Instant automated assistance</p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <a href={`tel:${SUPPORT.phone}`} className="flex-1 py-2.5 rounded-xl border-2 border-primary text-primary text-[12px] font-bold text-center hover:bg-primary/5 transition-colors">
                Call Now
              </a>
              <a href={`mailto:${SUPPORT.email}`} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 text-[12px] font-bold text-center hover:border-primary/30 transition-colors">
                Send Email
              </a>
              <button
                type="button"
                onClick={() => { close(); openChat('I need help with my payment'); }}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white text-[12px] font-bold hover:bg-primary/90 transition-colors"
              >
                Live Chat
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </LegalModalContext.Provider>
  );
}

export function useLegalModal(): LegalModalContextValue {
  const ctx = useContext(LegalModalContext);
  if (!ctx) throw new Error('useLegalModal must be used within LegalModalProvider');
  return ctx;
}
