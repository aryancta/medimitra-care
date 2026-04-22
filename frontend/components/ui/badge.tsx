/**
 * Severity / informational Badge.
 */

import * as React from 'react';

import { cn } from '@frontend/lib/cn';

type Tone = 'neutral' | 'mild' | 'moderate' | 'severe' | 'info' | 'success';

const STYLES: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  info: 'bg-teal-50 text-teal-800 ring-teal-200',
  success: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  mild: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  moderate: 'bg-amber-50 text-amber-800 ring-amber-200',
  severe: 'bg-red-50 text-red-800 ring-red-200',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        STYLES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
