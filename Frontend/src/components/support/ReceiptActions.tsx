/**
 * Receipt action buttons — download, print, email, share.
 */

import { useState } from 'react';
import { Download, Printer, Mail, Share2 } from 'lucide-react';
import {
  downloadReceipt,
  printReceipt,
  emailReceipt,
  shareReceipt,
  type ReceiptData,
} from '@/utils/receipt';

interface ReceiptActionsProps {
  receipt: ReceiptData;
  variant?: 'success' | 'failure';
}

export function ReceiptActions({ receipt, variant = 'success' }: ReceiptActionsProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  function flash(message: string) {
    setFeedback(message);
    setTimeout(() => setFeedback(null), 2500);
  }

  const actions = [
    {
      label: 'Download Receipt',
      icon: Download,
      primary: true,
      run: () => {
        downloadReceipt(receipt);
        flash('PDF receipt downloaded');
      },
    },
    {
      label: 'Print Receipt',
      icon: Printer,
      primary: false,
      run: () => printReceipt(receipt),
    },
    {
      label: 'Email Receipt',
      icon: Mail,
      primary: false,
      run: () => {
        emailReceipt(receipt);
        flash('Opening email client…');
      },
    },
    {
      label: 'Share Receipt',
      icon: Share2,
      primary: false,
      run: async () => {
        try {
          await shareReceipt(receipt);
          flash('Receipt shared');
        } catch {
          flash('Share cancelled');
        }
      },
    },
  ];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {actions.map(({ label, icon: Icon, primary, run }) => (
          <button
            key={label}
            type="button"
            onClick={run}
            className={`flex flex-col items-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-3 rounded-2xl border-2 font-semibold text-[10px] sm:text-[12px] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/30 hover:shadow-md ${
              primary
                ? variant === 'failure'
                  ? 'bg-primary border-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20'
                  : 'bg-primary border-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20'
                : 'bg-white border-slate-200 text-foreground hover:border-primary/30 hover:text-primary shadow-sm shadow-slate-100'
            }`}
          >
            <Icon size={20} strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>
      {feedback && (
        <p className="text-center text-[12px] font-medium text-emerald-600">{feedback}</p>
      )}
    </div>
  );
}
