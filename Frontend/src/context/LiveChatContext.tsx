/**
 * Live chat context — open chat from support buttons across pages.
 */

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface LiveChatContextValue {
  isOpen: boolean;
  openChat: (prefill?: string) => void;
  closeChat: () => void;
  prefillMessage: string | null;
  clearPrefill: () => void;
}

const LiveChatContext = createContext<LiveChatContextValue | null>(null);

export function LiveChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillMessage, setPrefillMessage] = useState<string | null>(null);

  const openChat = useCallback((prefill?: string) => {
    if (prefill) setPrefillMessage(prefill);
    setIsOpen(true);
  }, []);

  const closeChat = useCallback(() => setIsOpen(false), []);
  const clearPrefill = useCallback(() => setPrefillMessage(null), []);

  const value = useMemo(
    () => ({ isOpen, openChat, closeChat, prefillMessage, clearPrefill }),
    [isOpen, openChat, closeChat, prefillMessage, clearPrefill],
  );

  return <LiveChatContext.Provider value={value}>{children}</LiveChatContext.Provider>;
}

export function useLiveChat(): LiveChatContextValue {
  const ctx = useContext(LiveChatContext);
  if (!ctx) throw new Error('useLiveChat must be used within LiveChatProvider');
  return ctx;
}
