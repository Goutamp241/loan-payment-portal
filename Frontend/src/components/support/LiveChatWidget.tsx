/**
 * Simulated live chat — pre-stored system responses (no real agent backend).
 */

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useLiveChat } from '@/context/LiveChatContext';
import {
  CHAT_WELCOME,
  QUICK_REPLIES,
  getChatResponse,
  type CannedChatMessage,
} from '@/data/chatResponses';

function nowLabel() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function LiveChatWidget() {
  const { isOpen, openChat, closeChat, prefillMessage, clearPrefill } = useLiveChat();
  const [messages, setMessages] = useState<(CannedChatMessage & { time: string })[]>([
    { ...CHAT_WELCOME, time: nowLabel() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefillMessage) {
      setInput(prefillMessage);
      clearPrefill();
    }
  }, [prefillMessage, clearPrefill]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  function reply(userText: string) {
    const trimmed = userText.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', text: trimmed, time: nowLabel() },
    ]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `s-${Date.now()}`,
          role: 'system',
          text: getChatResponse(trimmed),
          time: nowLabel(),
        },
      ]);
      setIsTyping(false);
    }, 700 + Math.random() * 500);
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => openChat()}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[55] flex items-center gap-2 bg-primary text-white pl-3 sm:pl-4 pr-4 sm:pr-5 py-2.5 sm:py-3 rounded-full shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105 max-w-[calc(100vw-2rem)]"
        aria-label="Open live chat support"
      >
        <MessageCircle size={20} />
        <span className="text-[12px] sm:text-[13px] font-bold">Live Chat</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-[55] sm:w-[min(100vw-2rem,380px)] w-auto bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-border overflow-hidden flex flex-col max-h-[min(65vh,520px)] sm:max-h-[min(70vh,520px)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-white leading-none">ABC Bank Support</p>
            <p className="text-[10px] text-white/75 mt-0.5">Typically replies instantly</p>
          </div>
        </div>
        <button
          type="button"
          onClick={closeChat}
          className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
          aria-label="Close chat"
        >
          <X size={16} className="text-white" />
        </button>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/80">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-primary/10' : 'bg-emerald-100'
              }`}
            >
              {msg.role === 'user' ? (
                <User size={14} className="text-primary" />
              ) : (
                <Bot size={14} className="text-emerald-600" />
              )}
            </div>
            <div className={`max-w-[78%] ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block px-3.5 py-2.5 rounded-2xl text-[12px] leading-relaxed text-left ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm'
                }`}
              >
                {msg.text}
              </div>
              <p className="text-[9px] text-muted-foreground mt-1 px-1">{msg.time}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 items-center text-[11px] text-muted-foreground pl-9">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.3s]" />
            </span>
            Support is typing…
          </div>
        )}
      </div>

      {/* Quick replies */}
      <div className="px-3 pt-2 flex flex-wrap gap-1.5 flex-shrink-0 bg-white border-t border-slate-100">
        {QUICK_REPLIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => reply(q)}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/8 text-primary hover:bg-primary/15 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        className="p-3 flex gap-2 border-t border-slate-100 bg-white flex-shrink-0"
        onSubmit={(e) => {
          e.preventDefault();
          reply(input);
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message…"
          className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-40 transition-colors flex-shrink-0"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
