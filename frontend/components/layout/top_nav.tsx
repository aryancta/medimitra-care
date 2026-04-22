/**
 * Mobile-first top navigation bar with a subtle gradient logo mark.
 *
 * Stays sticky on scroll so the "Home" and "Settings" shortcuts are always
 * one tap away — particularly important on a phone-held-at-arm's-length
 * interaction model for elderly users.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@frontend/lib/cn';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/scan', label: 'Scan' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/safety', label: 'Safety' },
  { href: '/ask', label: 'Ask' },
];

export function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="container flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2 font-display">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-500 to-teal-600 text-lg font-bold text-white shadow-glow">
            M
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-ink">MediMitra Care</span>
            <span className="hidden text-[11px] text-ink-muted sm:inline">Apki Dawaiyon Ka Dost · आपकी दवाइयों का दोस्त</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink',
                pathname === item.href && 'bg-teal-50 text-teal-800',
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/settings"
            className={cn(
              'rounded-full px-3 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink',
              pathname === '/settings' && 'bg-saffron-100 text-saffron-800',
            )}
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}
