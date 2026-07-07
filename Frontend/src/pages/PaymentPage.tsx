/**
 * Payment page — part of the loan repayment flow.
 * UI preserved from Figma Make export; API integration pending.
 */

import { useState, useEffect } from 'react';
import {
  Lock, Shield, ChevronRight, IndianRupee, ArrowLeft, CreditCard, Building2,
  Wallet, Timer, MessageCircle, Mail, PhoneCall, AlertTriangle, Info, Hash,
  CheckCircle2, AlertCircle, User, Receipt, FileText,
} from 'lucide-react';
import { PageShell } from '@/layouts/PageShell';
import { PaymentStepper } from '@/components/payment/PaymentStepper';
import { Spinner } from '@/components/feedback/Spinner';
import { SmartphoneIcon } from '@/components/icons/SmartphoneIcon';
import { SupportSection } from '@/components/support/SupportSection';
import { QRCodeSVG } from '@/components/illustrations/QRCodeSVG';
import { useRepayment } from '@/hooks/useRepayment';
import { formatCurrency, displayValue } from '@/utils/format';
import type { PaymentSelection, PayMethodTab, PaymentMethodSelection, WalletOption } from '@/types';

interface PaymentPageProps {
  selection: PaymentSelection;
  onBack: () => void;
  onPay: (method: PaymentMethodSelection) => void;
}

export function PaymentPage({
  selection,
  onBack,
  onPay,
}: PaymentPageProps) {
  const { loanDetails, session } = useRepayment();
  const [tab, setTab] = useState<PayMethodTab>("upi");

  // UPI
  const [upiId, setUpiId] = useState("");
  const [upiError, setUpiError] = useState("");

  // Card
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  // Net Banking
  const [bankSearch, setBankSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  // Wallet
  const [selectedWallet, setSelectedWallet] = useState<WalletOption>(null);

  // Payment
  const [isPaying, setIsPaying] = useState(false);

  // Session countdown — 10:00
  const [seconds, setSeconds] = useState(600);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const timerWarning = seconds <= 120;

  const W = "w-[90%] max-w-[1400px] mx-auto";

  // Per-tab validity
  const upiValid = /^[\w.\-]{2,}@[\w]{2,}$/.test(upiId);
  const cardValid = cardNum.replace(/\s/g, "").length === 16 && cardName.trim().length > 1 && cardExpiry.length === 5 && cardCvv.length >= 3;
  const netBankingValid = !!selectedBank;
  const walletValid = !!selectedWallet;
  const canPay =
    (tab === "upi" && upiValid) ||
    (tab === "card" && cardValid) ||
    (tab === "netbanking" && netBankingValid) ||
    (tab === "wallet" && walletValid);

  function formatCard(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  function buildPaymentMethod(): PaymentMethodSelection {
    if (tab === 'upi') return { tab, label: `UPI — ${upiId}` };
    if (tab === 'card') {
      const last4 = cardNum.replace(/\s/g, '').slice(-4);
      return { tab, label: `Card ending ${last4}` };
    }
    if (tab === 'netbanking') return { tab, label: `Net Banking — ${selectedBank.split('–')[0].trim()}` };
    const walletNames: Record<NonNullable<WalletOption>, string> = {
      amazonpay: 'Amazon Pay',
      mobikwik: 'MobiKwik',
      paytm: 'Paytm',
      freecharge: 'Freecharge',
    };
    return { tab, label: walletNames[selectedWallet!] ?? 'Wallet' };
  }

  async function handlePay() {
    if (!canPay || isPaying) return;
    setIsPaying(true);
    await new Promise((r) => setTimeout(r, 800));
    onPay(buildPaymentMethod());
    setIsPaying(false);
  }

  const BANKS = ["SBI – State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "PNB – Punjab National Bank", "Bank of Baroda", "Canara Bank", "Union Bank of India", "IndusInd Bank"];
  const filteredBanks = bankSearch ? BANKS.filter((b) => b.toLowerCase().includes(bankSearch.toLowerCase())) : BANKS;

  const tabs: { id: PayMethodTab; label: string; icon: React.ReactNode }[] = [
    { id: "upi", label: "UPI", icon: <SmartphoneIcon /> },
    { id: "card", label: "Card", icon: <CreditCard size={16} /> },
    { id: "netbanking", label: "Net Banking", icon: <Building2 size={16} /> },
    { id: "wallet", label: "Wallets", icon: <Wallet size={16} /> },
  ];

  return (
    <PageShell hideMobileFooter>
      {/* ── Progress Stepper ── */}
      <div className="bg-white border-b border-border">
        <div className={`${W} py-5`}>
          <PaymentStepper currentStep={4} />
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Lock size={12} className="text-emerald-600" />
            <span className="text-[11px] text-emerald-700 font-semibold">Secure Payment Gateway Active</span>
          </div>
        </div>
      </div>

      <div className={`${W} py-7 pb-28 sm:pb-12 space-y-6`}>

        {/* ── Gateway Sub-header ── */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-[12px] sm:text-[13px] font-medium min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20 flex-shrink-0">
                <Building2 size={15} className="text-white" />
              </div>
              <span className="font-semibold text-foreground">ABC Bank</span>
              <span className="text-slate-300 hidden sm:inline">→</span>
              <Lock size={13} className="text-emerald-500 flex-shrink-0" />
              <span className="font-semibold text-foreground">Secure Payment Gateway</span>
              <span className="text-slate-300 hidden sm:inline">→</span>
              <div className="flex items-center gap-1.5 bg-primary/8 rounded-lg px-2.5 py-1">
                <Shield size={12} className="text-primary" />
                <span className="text-primary font-bold text-[12px]">1Pay</span>
              </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-700">Secure Connection</span>
            </div>
            {["256-bit SSL", "PCI-DSS", "Bank-grade"].map((b) => (
              <span key={b} className="text-[10px] font-semibold text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">{b}</span>
            ))}
          </div>
        </div>

        {/* ── Main two-column layout ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[65fr_35fr] gap-6 items-start">

          {/* ── LEFT: Payment Methods ── */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 overflow-hidden">

              {/* Tab bar */}
              <div className="flex border-b border-slate-100 overflow-x-auto">
                {tabs.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={`flex-1 min-w-[4.5rem] flex flex-col items-center gap-1 sm:gap-1.5 py-3 sm:py-4 px-1 sm:px-2 text-[10px] sm:text-[12px] font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/30 ${
                      tab === id
                        ? "text-primary border-b-2 border-primary bg-primary/3"
                        : "text-muted-foreground hover:text-foreground hover:bg-slate-50 border-b-2 border-transparent"
                    }`}
                  >
                    <span className={tab === id ? "text-primary" : "text-muted-foreground"}>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8">

                {/* ── UPI ── */}
                {tab === "upi" && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-[15px] font-bold text-foreground mb-1">Pay using UPI</p>
                      <p className="text-[13px] text-muted-foreground">Enter your UPI ID to initiate the payment.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-foreground block">UPI ID</label>
                      <div className="relative">
                        <input
                          type="text" placeholder="example@upi" value={upiId}
                          onChange={(e) => { setUpiId(e.target.value); setUpiError(""); }}
                          onBlur={() => { if (upiId && !upiValid) setUpiError("Enter a valid UPI ID (e.g. name@upi)"); }}
                          className={`w-full px-4 py-3.5 rounded-xl border text-sm font-medium outline-none bg-white placeholder:text-slate-400 transition-all duration-200 ${
                            upiError ? "border-destructive ring-2 ring-destructive/20" :
                            upiValid ? "border-emerald-400 ring-2 ring-emerald-400/20" :
                            "border-slate-200 hover:border-slate-300 focus:border-accent focus:ring-2 focus:ring-accent/20"
                          }`}
                        />
                        {upiValid && <CheckCircle2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />}
                        {upiError && <AlertCircle size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-destructive" />}
                      </div>
                      {upiError && <p className="text-[12px] text-destructive flex items-center gap-1.5"><AlertCircle size={11} />{upiError}</p>}
                    </div>

                    {/* UPI Apps */}
                    <div className="space-y-3">
                      <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Supported Apps</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        {[
                          { name: "Google Pay", color: "#1A73E8", letter: "G" },
                          { name: "PhonePe", color: "#5F259F", letter: "P" },
                          { name: "Paytm", color: "#002970", letter: "P" },
                          { name: "BHIM", color: "#00A651", letter: "B" },
                          { name: "Amazon Pay", color: "#FF9900", letter: "A" },
                        ].map(({ name, color, letter }) => (
                          <div key={name} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all duration-200"
                              style={{ backgroundColor: `${color}12` }}>
                              <span className="text-lg font-black" style={{ color }}>{letter}</span>
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight max-w-[52px]">{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest px-2">OR</span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center gap-4">
                      <p className="text-[13px] font-semibold text-foreground">Scan QR Code</p>
                      <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm inline-block">
                        <QRCodeSVG />
                      </div>
                      <div className="flex items-center gap-2">
                        <SmartphoneIcon />
                        <p className="text-[12px] text-muted-foreground font-medium">Open any UPI app to scan.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Card ── */}
                {tab === "card" && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-[15px] font-bold text-foreground mb-1">Credit / Debit Card</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {[
                          { label: "VISA", bg: "#1A1F71", fg: "#fff" },
                          { label: "MC", bg: "#EB001B", fg: "#fff" },
                          { label: "RuPay", bg: "#166534", fg: "#fff" },
                          { label: "AMEX", bg: "#007BC1", fg: "#fff" },
                        ].map(({ label, bg, fg }) => (
                          <div key={label} className="h-7 px-2.5 rounded-md border border-slate-200 flex items-center justify-center shadow-sm"
                            style={{ backgroundColor: bg }}>
                            <span className="text-[10px] font-black tracking-wider" style={{ color: fg }}>{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Card Number */}
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-foreground block">Card Number</label>
                        <div className="relative">
                          <CreditCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text" placeholder="0000 0000 0000 0000"
                            value={cardNum}
                            onChange={(e) => setCardNum(formatCard(e.target.value))}
                            maxLength={19}
                            className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-accent focus:ring-2 focus:ring-accent/20 text-sm font-medium outline-none bg-white placeholder:text-slate-300 transition-all duration-200 tracking-widest"
                          />
                        </div>
                      </div>
                      {/* Card Holder */}
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold text-foreground block">Card Holder Name</label>
                        <div className="relative">
                          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text" placeholder="Name on card"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value.toUpperCase())}
                            className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-accent focus:ring-2 focus:ring-accent/20 text-sm font-medium outline-none bg-white placeholder:text-slate-300 transition-all duration-200 tracking-wide"
                          />
                        </div>
                      </div>
                      {/* Expiry + CVV */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-semibold text-foreground block">Expiry Date</label>
                          <input
                            type="text" placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            maxLength={5}
                            className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-accent focus:ring-2 focus:ring-accent/20 text-sm font-medium outline-none bg-white placeholder:text-slate-300 transition-all duration-200"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[13px] font-semibold text-foreground block">CVV</label>
                          <div className="relative">
                            <input
                              type="password" placeholder="•••"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              maxLength={4}
                              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-accent focus:ring-2 focus:ring-accent/20 text-sm font-medium outline-none bg-white placeholder:text-slate-300 transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>
                      {/* Save card */}
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div
                          role="checkbox" aria-checked={saveCard} tabIndex={0}
                          onClick={() => setSaveCard((v) => !v)}
                          onKeyDown={(e) => e.key === " " && setSaveCard((v) => !v)}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 cursor-pointer ${saveCard ? "bg-primary border-primary" : "bg-white border-slate-300 group-hover:border-primary/50"}`}
                        >
                          {saveCard && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 3.5L4 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[13px] text-foreground select-none">Save card for future payments</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* ── Net Banking ── */}
                {tab === "netbanking" && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-[15px] font-bold text-foreground mb-1">Net Banking</p>
                      <p className="text-[13px] text-muted-foreground">Select your bank to proceed.</p>
                    </div>
                    <div className="relative">
                      <input
                        type="text" placeholder="Search bank..."
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-accent focus:ring-2 focus:ring-accent/20 text-sm outline-none bg-white placeholder:text-slate-400 transition-all duration-200"
                      />
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                      </svg>
                    </div>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {filteredBanks.map((bank) => (
                        <button
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                            selectedBank === bank
                              ? "border-primary bg-primary/4 shadow-sm shadow-primary/10"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[11px] font-black ${selectedBank === bank ? "bg-primary text-white" : "bg-primary/8 text-primary"}`}>
                            {bank.slice(0, 2).toUpperCase()}
                          </div>
                          <span className={`text-[13px] font-semibold ${selectedBank === bank ? "text-primary" : "text-foreground"}`}>{bank}</span>
                          {selectedBank === bank && <CheckCircle2 size={15} className="text-primary ml-auto flex-shrink-0" />}
                        </button>
                      ))}
                      {filteredBanks.length === 0 && (
                        <p className="text-center text-[13px] text-muted-foreground py-6">No banks found for "{bankSearch}"</p>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Wallets ── */}
                {tab === "wallet" && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-[15px] font-bold text-foreground mb-1">Mobile Wallets</p>
                      <p className="text-[13px] text-muted-foreground">Choose your preferred wallet.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { id: "amazonpay", name: "Amazon Pay", color: "#FF9900", initial: "A", sub: "Amazon Wallet" },
                        { id: "mobikwik", name: "MobiKwik", color: "#1E3799", initial: "M", sub: "SuperCash Wallet" },
                        { id: "paytm", name: "Paytm Wallet", color: "#002970", initial: "P", sub: "Paytm Balance" },
                        { id: "freecharge", name: "Freecharge", color: "#E31837", initial: "F", sub: "FC Balance" },
                      ] as const).map(({ id, name, color, initial, sub }) => (
                        <button
                          key={id}
                          onClick={() => setSelectedWallet(id as WalletOption)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                            selectedWallet === id
                              ? "border-primary bg-primary/4 shadow-md shadow-primary/10"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md shadow-sm shadow-slate-100"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-lg shadow-sm"
                            style={{ backgroundColor: color }}>
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-[13px] font-bold leading-tight truncate ${selectedWallet === id ? "text-primary" : "text-foreground"}`}>{name}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
                          </div>
                          {selectedWallet === id && <CheckCircle2 size={14} className="text-primary ml-auto flex-shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Pay button (inside left card, desktop only) ── */}
                <div className="mt-8 space-y-3 hidden sm:block">
                  <button
                    disabled={!canPay || isPaying}
                    onClick={handlePay}
                    className={`w-full py-4 rounded-xl text-base font-bold tracking-wide flex items-center justify-center gap-2.5 transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/30 ${
                      canPay && !isPaying
                        ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.99] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {isPaying ? (
                      <><Spinner />Processing Payment...</>
                    ) : (
                      <>
                        <Lock size={16} />
                        Pay ₹{selection.amount.toLocaleString("en-IN")} Securely
                        <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                  <button
                    onClick={onBack}
                    className="w-full py-3 rounded-xl border-2 border-slate-200 bg-white text-[13px] font-semibold text-foreground hover:border-primary/30 hover:text-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center justify-center gap-2 outline-none"
                  >
                    <ArrowLeft size={14} />Back to Review
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Summary + Security + Timer ── */}
          <aside className="xl:sticky xl:top-24 space-y-4">

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 overflow-hidden">
              <div className="bg-gradient-to-br from-primary/6 to-accent/8 px-5 py-4 border-b border-primary/10">
                <div className="flex items-center gap-2 mb-1">
                  <Receipt size={13} className="text-primary" />
                  <p className="text-[12px] font-bold text-primary uppercase tracking-widest">Payment Summary</p>
                </div>
                <p className="text-3xl font-bold text-primary tracking-tight">₹{selection.amount.toLocaleString("en-IN")}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{selection.label}</p>
              </div>
              <div className="px-5 py-4 space-y-3">
                {[
                  { label: "Outstanding Amount", value: loanDetails ? formatCurrency(loanDetails.totalDue) : "—" },
                  { label: "Selected Payment", value: selection.label },
                  { label: "Processing Fee", value: "₹0", green: true },
                  { label: "Convenience Fee", value: "₹0", green: true },
                  { label: "Discount", value: "₹0", green: true },
                ].map(({ label, value, green }) => (
                  <div key={label} className="flex items-center justify-between gap-3">
                    <span className="text-[12px] text-muted-foreground">{label}</span>
                    <span className={`text-[12px] font-semibold ${green ? "text-emerald-600" : "text-foreground"}`}>{value}</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-3">
                  <span className="text-[13px] font-bold text-foreground">Total Payable</span>
                  <span className="text-lg font-bold text-primary">₹{selection.amount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <FileText size={13} className="text-primary" />
                <p className="text-[12px] font-bold text-primary uppercase tracking-widest">Transaction Details</p>
              </div>
              {[
                { label: "Reference", value: displayValue(session?.referenceNumber) },
                { label: "Date", value: displayValue(session?.sessionDate) },
                { label: "Merchant", value: "ABC Bank Credit Cards" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-start justify-between gap-3">
                  <span className="text-[11px] text-muted-foreground">{label}</span>
                  <span className="text-[11px] font-semibold text-foreground text-right max-w-[150px] leading-snug">{value}</span>
                </div>
              ))}
            </div>

            {/* Session Timer */}
            <div className={`rounded-2xl border p-4 flex items-center justify-between gap-3 transition-all duration-500 ${
              timerWarning ? "bg-red-50 border-red-200" : "bg-white border-border shadow-sm shadow-slate-100"
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${timerWarning ? "bg-red-100" : "bg-primary/8"}`}>
                  <Timer size={13} className={timerWarning ? "text-red-500" : "text-primary"} />
                </div>
                <div>
                  <p className={`text-[11px] font-bold uppercase tracking-wide ${timerWarning ? "text-red-600" : "text-muted-foreground"}`}>
                    {timerWarning ? "Session expiring soon!" : "Session expires in"}
                  </p>
                </div>
              </div>
              <span className={`text-xl font-black tabular-nums tracking-tight font-mono ${timerWarning ? "text-red-600" : "text-primary"}`}>
                {mins}:{secs}
              </span>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-2xl border border-border shadow-sm shadow-slate-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={13} className="text-primary" />
                <p className="text-[12px] font-bold text-foreground">Your payment is protected by</p>
              </div>
              <div className="space-y-2">
                {["SSL Encryption", "PCI-DSS", "RBI Guidelines", "Fraud Detection", "Secure Gateway"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-[12px] font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Message */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 space-y-1">
              <div className="flex items-center gap-2">
                <Lock size={11} className="text-emerald-600" />
                <p className="text-[11px] font-semibold text-emerald-700">No card information is stored.</p>
              </div>
              <p className="text-[11px] text-emerald-600 ml-[19px]">Your payment is processed securely.</p>
            </div>
          </aside>
        </div>

        {/* ── Help & Support ── */}
        <SupportSection chatPrefill="Help choosing payment method" className="pb-24 sm:pb-4" />
      </div>

      {/* ── Mobile sticky Pay button ── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border px-4 py-3 flex gap-3 shadow-lg shadow-slate-200/80">
        <button onClick={onBack}
          className="flex-none w-24 py-3.5 rounded-xl border-2 border-slate-200 text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-1.5 outline-none">
          <ArrowLeft size={14} />Back
        </button>
        <button
          disabled={!canPay || isPaying} onClick={handlePay}
          className={`flex-1 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all outline-none ${
            canPay && !isPaying
              ? "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/25"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isPaying ? <><Spinner />Processing...</> : <><Lock size={14} />Pay ₹{selection.amount.toLocaleString("en-IN")}</>}
        </button>
      </div>
    </PageShell>
  );
}
