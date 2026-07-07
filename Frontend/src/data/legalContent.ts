/**
 * Read-only legal document content for Privacy Policy & Terms modals.
 */

export const PRIVACY_POLICY = {
  title: 'Privacy Policy',
  lastUpdated: 'July 2026',
  sections: [
    {
      heading: '1. Introduction',
      body: 'ABC Bank ("we", "our", "us") operates the Loan Repayment Portal. This Privacy Policy explains how we collect, use, and protect your personal information when you use our online repayment services.',
    },
    {
      heading: '2. Information We Collect',
      body: 'We collect information you provide during verification (registered mobile number, last 4 digits of your credit card), payment selections, and transaction details. We do not store full card numbers or UPI PINs on our servers. Payment authentication is handled securely by the 1Pay payment gateway.',
    },
    {
      heading: '3. How We Use Your Information',
      body: 'Your information is used solely to verify your identity, display loan outstanding balances, process repayments, generate receipts, and comply with applicable banking regulations. We do not sell your personal data to third parties.',
    },
    {
      heading: '4. Data Security',
      body: 'We use industry-standard security measures including 256-bit TLS encryption, AES-256-GCM encrypted API payloads, JWT session tokens, and PCI-DSS compliant payment processing through 1Pay. Access to your data is restricted to authorised systems and personnel.',
    },
    {
      heading: '5. Data Retention',
      body: 'Transaction records are retained as required by RBI guidelines and applicable law. Session data expires after one hour of inactivity. You may request information about your data by contacting our support team.',
    },
    {
      heading: '6. Your Rights',
      body: 'You have the right to access, correct, or request deletion of your personal data subject to regulatory requirements. To exercise these rights, contact support@abcbank.in or call 1800-258-0096.',
    },
    {
      heading: '7. Contact Us',
      body: 'For privacy-related queries: Email support@abcbank.in | Phone 1800-258-0096 | Hours: Mon–Sat, 9 AM–6 PM.',
    },
  ],
};

export const TERMS_AND_CONDITIONS = {
  title: 'Terms & Conditions',
  lastUpdated: 'July 2026',
  sections: [
    {
      heading: '1. Acceptance of Terms',
      body: 'By accessing and using the ABC Bank Loan Repayment Portal, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use this service.',
    },
    {
      heading: '2. Eligibility',
      body: 'You must be the registered holder of the loan/credit card account associated with the mobile number and card details provided during verification. Unauthorised access is strictly prohibited.',
    },
    {
      heading: '3. Payment Processing',
      body: 'All payments are processed through the 1Pay secure payment gateway. ABC Bank is not responsible for delays caused by your bank, payment network, or incorrect payment details entered by you. Successful payment confirmation is subject to gateway authorisation.',
    },
    {
      heading: '4. Payment Options',
      body: 'You may pay Total Due, Minimum Due, or a Custom Amount within your outstanding balance. Minimum due payments must be made before the due date to avoid late payment charges as per your loan agreement.',
    },
    {
      heading: '5. Fees & Charges',
      body: 'Processing and convenience fees, if applicable, are displayed before you confirm payment. ABC Bank may waive fees at its discretion. GST and other statutory charges apply as per prevailing regulations.',
    },
    {
      heading: '6. Refunds & Reversals',
      body: 'Failed transactions are automatically reversed within 5–7 business days. For disputed transactions, contact customer care with your Transaction ID and Reference Number within 30 days of the transaction date.',
    },
    {
      heading: '7. Limitation of Liability',
      body: 'ABC Bank shall not be liable for indirect, incidental, or consequential damages arising from use of this portal, except as required by applicable law. Our liability is limited to the amount of the transaction in dispute.',
    },
    {
      heading: '8. Governing Law',
      body: 'These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.',
    },
  ],
};

export type LegalDocumentKey = 'privacy' | 'terms';

export function getLegalDocument(key: LegalDocumentKey) {
  return key === 'privacy' ? PRIVACY_POLICY : TERMS_AND_CONDITIONS;
}
