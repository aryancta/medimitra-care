/**
 * Three big friendly cards: Scan, Schedule, Safety. They map one-to-one to
 * the MVP features listed in the project brief.
 */

import Link from 'next/link';

import { Card, CardDescription, CardHeader, CardTitle } from '@frontend/components/ui/card';

const CARDS = [
  {
    href: '/scan',
    icon: '📷',
    title: 'Scan My Medicine',
    description:
      'Point your camera at any Indian medicine strip. In about 3 seconds we identify the drug, dose, and purpose.',
    tone: 'from-saffron-100 to-saffron-50',
  },
  {
    href: '/schedule',
    icon: '📅',
    title: 'My Pill Schedule',
    description:
      'A pictogram-first daily plan with browser reminders, a Duolingo-style streak, and voice mode in Hindi or English.',
    tone: 'from-teal-100 to-teal-50',
  },
  {
    href: '/safety',
    icon: '🛡️',
    title: 'Check Safety',
    description:
      'One-number polypharmacy risk score, color-coded interaction alerts, and three talking-points for your next visit.',
    tone: 'from-purple-100 to-purple-50',
  },
];

export function HomeCards() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CARDS.map((card) => (
        <Link key={card.href} href={card.href} className="group">
          <Card className={`overflow-hidden bg-gradient-to-br ${card.tone} transition-transform group-hover:-translate-y-1`}>
            <CardHeader>
              <div className="text-4xl" aria-hidden>
                {card.icon}
              </div>
              <CardTitle className="mt-3">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
              <div className="mt-4 inline-flex items-center text-sm font-semibold text-teal-800 group-hover:underline">
                Open →
              </div>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </section>
  );
}
