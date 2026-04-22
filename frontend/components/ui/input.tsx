/**
 * Input + Textarea primitives with consistent focus styling.
 */

import * as React from 'react';

import { cn } from '@frontend/lib/cn';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-base text-ink placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-ink placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('mb-1.5 block text-sm font-medium text-ink', className)}
      {...props}
    />
  );
}
