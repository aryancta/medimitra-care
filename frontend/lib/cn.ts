/**
 * Tiny className helper.
 *
 * Merges `clsx` conditional logic with `tailwind-merge`'s conflict
 * resolution so that `cn('p-2', 'p-4')` correctly yields `p-4`.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
