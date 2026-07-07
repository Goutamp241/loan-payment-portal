/**
 * Root application component.
 * Wraps the app with context providers and React Router.
 */

import { BrowserRouter } from 'react-router';
import { RepaymentProvider } from '@/context/RepaymentContext';
import { LiveChatProvider } from '@/context/LiveChatContext';
import { LegalModalProvider } from '@/context/LegalModalContext';
import { LiveChatWidget } from '@/components/support/LiveChatWidget';
import { AppRoutes } from '@/routes';

export default function App() {
  return (
    <BrowserRouter>
      <LiveChatProvider>
        <LegalModalProvider>
          <RepaymentProvider>
            <AppRoutes />
            <LiveChatWidget />
          </RepaymentProvider>
        </LegalModalProvider>
      </LiveChatProvider>
    </BrowserRouter>
  );
}
