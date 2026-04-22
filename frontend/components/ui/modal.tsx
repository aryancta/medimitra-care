/**
 * Tiny controlled Modal. No external deps.
 */

'use client';

import * as React from 'react';

import { cn } from '@frontend/lib/cn';

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg';
}) {
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full animate-slide-up rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl',
          size === 'lg' ? 'max-w-2xl' : 'max-w-md',
        )}
      >
        {title ? (
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          </div>
        ) : null}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-slate-500 hover:bg-slate-100"
        >
          ✕
        </button>
        <div className="px-6 py-5">{children}</div>
        {footer ? <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}
