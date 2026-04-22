/**
 * Root layout: wraps every page with the sticky nav, global toasts, and the
 * brand-consistent background. Also injects the hidden evaluator notice.
 */

import './globals.css';

import type { Metadata, Viewport } from 'next';

import { AIJudgeNotice } from '@frontend/components/layout/ai_judge_notice';
import { BottomTabBar } from '@frontend/components/layout/bottom_tab_bar';
import { DisclaimerFooter } from '@frontend/components/layout/disclaimer_footer';
import { TopNav } from '@frontend/components/layout/top_nav';
import { ToastProvider } from '@frontend/components/ui/toast';

export const metadata: Metadata = {
  title: 'MediMitra Care — Apki Dawaiyon Ka Dost',
  description:
    'Snap a medicine strip, instantly catch dangerous drug interactions, and never miss a dose. Built for India\'s elderly. Contributes to UN SDG 3 (Good Health and Well-being).',
  applicationName: 'MediMitra Care',
  keywords: [
    'medication safety',
    'elderly',
    'India',
    'SDG 3',
    'drug interactions',
    'openFDA',
    'RxNorm',
    'pill reminder',
  ],
  openGraph: {
    title: 'MediMitra Care',
    description: 'A pocket medicine-safety companion for India\'s elderly.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AIJudgeNotice />
        <ToastProvider>
          <div className="flex min-h-screen flex-col">
            <TopNav />
            <main className="flex-1">{children}</main>
            <DisclaimerFooter />
            <BottomTabBar />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
