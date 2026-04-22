/**
 * Accessible Button primitive.
 *
 * Loosely modelled on shadcn/ui's Button but trimmed to exactly what this
 * app needs. Supports variants (primary, secondary, ghost, destructive)
 * and sizes (sm, md, lg, xl). Always renders a real <button> element for
 * keyboard and screen-reader accessibility.
 */

import * as React from 'react';

import { cn } from '@frontend/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
type Size = 'sm' | 'md' | 'lg' | 'xl';

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    'bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-600 shadow-sm',
  secondary:
    'bg-saffron-500 text-white hover:bg-saffron-600 focus-visible:ring-saffron-400 shadow-sm',
  ghost:
    'bg-transparent text-ink hover:bg-slate-100 focus-visible:ring-slate-300',
  destructive:
    'bg-severity-severe text-white hover:bg-red-700 focus-visible:ring-red-400',
  outline:
    'bg-white text-ink border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-300',
};

const SIZE_STYLES: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-base',
  lg: 'h-12 px-5 text-base',
  xl: 'h-14 px-7 text-lg',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
