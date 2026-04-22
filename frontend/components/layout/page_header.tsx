/**
 * Standard page header: icon, headline, supporting paragraph.
 */

import * as React from 'react';

import { cn } from '@frontend/lib/cn';

export function PageHeader({
  icon,
  title,
  description,
  className,
  actions,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-100 to-teal-100 text-2xl">
            {icon}
          </div>
        ) : null}
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h1>
          {description ? <p className="mt-1 max-w-2xl text-sm text-ink-muted sm:text-base">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
