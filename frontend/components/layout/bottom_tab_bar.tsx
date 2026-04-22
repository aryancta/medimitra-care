/**
 * Mobile bottom tab bar.
 *
 * Mirrors the top-nav routes but with large, thumb-friendly tap targets for
 * phones — recommended for elderly users who struggle with small hit zones.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@frontend/lib/cn';

const ITEMS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/scan', label: 'Scan', icon: '📷' },
  { href: '/schedule', label: 'Schedule', icon: '📅' },
  { href: '/safety', label: 'Safety', icon: '🛡️' },
  { href: '/ask', label: 'Ask', icon: '💬' },
];

export function BottomTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom,0.25rem)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-xl items-stretch justify-around">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 py-2 text-xs font-medium',
                  active ? 'text-teal-700' : 'text-ink-muted',
                )}
              >
                <span className="text-xl" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
