/**
 * Pre-stored live chat responses (simulated support bot).
 */

export interface CannedChatMessage {
  id: string;
  role: 'system' | 'user';
  text: string;
}

export const CHAT_WELCOME: CannedChatMessage = {
  id: 'welcome',
  role: 'system',
  text: 'Hello! Welcome to ABC Bank Loan Repayment Support. I can help with payment status, receipts, OTP issues, refunds, loan balances, and security questions. Choose a quick reply or type your question below.',
};

export const QUICK_REPLIES = [
  'Check payment status',
  'Download PDF receipt',
  'OTP not working',
  'Payment failed — what next?',
  'Minimum vs total due?',
  'Is my payment secure?',
  'Speak to an agent',
] as const;

const KEYWORD_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['status', 'successful', 'success', 'paid', 'complete', 'confirm'],
    response:
      'If your payment was successful, you will see a green confirmation screen with your Transaction ID. Download your PDF receipt for records. The updated balance usually reflects within 24 hours on your loan account.',
  },
  {
    keywords: ['receipt', 'download', 'pdf', 'print', 'email', 'share', 'statement'],
    response:
      'On the Payment Successful page, tap Download Receipt to save a PDF file. You can also Print, Email (opens your mail app with receipt details), or Share via your device. Failure receipts can be downloaded the same way from the failure receipt page.',
  },
  {
    keywords: ['otp', 'code', 'not received', 'invalid', 'wrong', '1562', 'expired'],
    response:
      'The OTP is sent to your registered mobile number on the 1Pay screen. Enter the 4-digit code carefully. If incorrect, the payment will be declined — you can retry with a new transaction. After 5 wrong attempts, the transaction is locked for security.',
  },
  {
    keywords: ['fail', 'failed', 'declined', 'error', 'unsuccessful', 'rejected'],
    response:
      'If payment failed, no amount should be debited. Tap Retry Payment on the failure screen, or change your payment method (UPI, Card, Net Banking). Download the failure receipt for your records. Common causes: wrong OTP, session timeout, or bank decline.',
  },
  {
    keywords: ['refund', 'money', 'debited', 'charged', 'reverse', 'pending'],
    response:
      'If money was debited but payment shows failed, it will auto-reverse within 5–7 business days. Keep your Transaction ID and Reference Number. Email support@abcbank.in or call 1800-258-0096 with these details for faster resolution.',
  },
  {
    keywords: ['agent', 'human', 'person', 'call', 'speak', 'representative'],
    response:
      'Our support team is available at 1800-258-0096 (Mon–Sat, 9 AM–6 PM) and support@abcbank.in (24 hr response). You can also use Contact Support in the footer for phone and email details.',
  },
  {
    keywords: ['minimum', 'total', 'custom', 'amount', 'due', 'balance', 'outstanding'],
    response:
      'On Loan Details you can pay Total Due (full outstanding), Minimum Due (avoids late fee), or Custom Amount. Paying minimum keeps your account in good standing; paying total clears the cycle balance.',
  },
  {
    keywords: ['secure', 'safe', 'security', 'encrypt', 'ssl', 'pci', 'fraud'],
    response:
      'Yes — this portal uses 256-bit TLS, AES-256-GCM encrypted APIs, JWT sessions, and 1Pay PCI-DSS compliant processing. We never store full card numbers. OTP verification adds an extra layer before payment completes.',
  },
  {
    keywords: ['verify', 'verification', 'mobile', 'card', 'login', 'identity'],
    response:
      'Enter your registered 10-digit mobile number and last 4 digits of your credit card on the verification page. Complete the security check, then you will receive a session token to view loan details securely.',
  },
  {
    keywords: ['session', 'timeout', 'expired', 'logout', 'again'],
    response:
      'Sessions expire after 1 hour for your security. If you see "Session expired", return to the verification page and sign in again with your mobile and card details.',
  },
  {
    keywords: ['upi', 'card', 'net banking', 'wallet', 'method', 'paytm', 'gpay'],
    response:
      'On the Payment page, choose UPI, Card, Net Banking, or Wallet. After selecting, you will be redirected to the 1Pay gateway to enter OTP. All methods are processed with the same security standards.',
  },
  {
    keywords: ['privacy', 'policy', 'terms', 'condition', 'data'],
    response:
      'Read our Privacy Policy and Terms & Conditions via the links in the footer or on the Review page before proceeding. They explain how we handle your data and payment terms.',
  },
  {
    keywords: ['fee', 'charge', 'processing', 'convenience', 'gst'],
    response:
      'Processing and convenience fees are shown on the Loan Details and Review pages before you pay. ABC Bank may waive fees during promotional periods. No hidden charges are added after confirmation.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'help', 'start'],
    response:
      'Hi! I am the ABC Bank virtual assistant. Ask me about payments, receipts, OTP, failures, or security — or pick a quick reply below.',
  },
  {
    keywords: ['zero', 'no payment', 'nothing', 'cleared', 'paid off'],
    response:
      'If your outstanding balance is zero, you will see a "No Payment Required" message on the Loan Details page. No payment action is needed until a new bill is generated.',
  },
];

export function getChatResponse(userMessage: string): string {
  const normalized = userMessage.toLowerCase().trim();
  if (!normalized) {
    return 'Please type your question or choose a quick reply below.';
  }

  for (const entry of KEYWORD_RESPONSES) {
    if (entry.keywords.some((kw) => normalized.includes(kw))) {
      return entry.response;
    }
  }

  return 'Thank you for your message. Please share your Reference Number or Transaction ID for faster help. Call 1800-258-0096 (Mon–Sat, 9 AM–6 PM) or email support@abcbank.in. You can also use Contact Support in the page footer.';
}
