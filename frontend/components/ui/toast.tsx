/**
 * Minimal toast system.
 *
 * Global, context-based, zero-dependency. Import `useToast` in any client
 * component to show ephemeral feedback without pulling in a UI library.
 */

'use client';

import * as React from 'react';

import { cn } from '@frontend/lib/cn';

type Tone = 'info' | 'success' | 'warning' | 'error';
type Toast = { id: number; title: string; description?: string; tone: Tone };

type ToastContextValue = {
  toast: (t: { title: string; description?: string; tone?: Tone }) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback<ToastContextValue['toast']>((t) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, tone: 'info', ...t }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 4200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto animate-slide-up rounded-2xl border px-4 py-3 shadow-lg',
              t.tone === 'info' && 'border-teal-200 bg-white text-teal-900',
              t.tone === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-900',
              t.tone === 'warning' && 'border-amber-300 bg-amber-50 text-amber-900',
              t.tone === 'error' && 'border-red-300 bg-red-50 text-red-900',
            )}
          >
            <div className="text-sm font-semibold">{t.title}</div>
            {t.description ? <div className="mt-0.5 text-xs opacity-80">{t.description}</div> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    return { toast: () => undefined };
  }
  return ctx;
}
