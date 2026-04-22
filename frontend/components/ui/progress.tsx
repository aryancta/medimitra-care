/**
 * Horizontal progress bar with a saffron→teal gradient.
 */

import * as React from 'react';

import { cn } from '@frontend/lib/cn';

export function Progress({
  value,
  className,
  tone = 'brand',
}: {
  value: number;
  className?: string;
  tone?: 'brand' | 'severity';
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const fill =
    tone === 'severity'
      ? clamped >= 60
        ? 'bg-severity-severe'
        : clamped >= 25
          ? 'bg-severity-moderate'
          : 'bg-severity-mild'
      : 'bg-gradient-to-r from-saffron-500 to-teal-600';
  return (
    <div className={cn('h-3 w-full rounded-full bg-slate-100 overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', fill)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
