/**
 * Pictogram schedule view.
 *
 * Features:
 *   - Timeline of doses grouped by time slot with huge tap targets.
 *   - Tap → mark taken (updates streak).
 *   - "Read schedule aloud" button using the Web Speech API in Hindi / English.
 *   - "Enable reminders" triggers browser Notification.requestPermission().
 *   - WhatsApp share-with-caregiver CTA.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';

import { Badge } from '@frontend/components/ui/badge';
import { Button } from '@frontend/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@frontend/components/ui/card';
import { Progress } from '@frontend/components/ui/progress';
import { Modal } from '@frontend/components/ui/modal';
import { useToast } from '@frontend/components/ui/toast';
import { usePatientStore } from '@frontend/state/patient_store';

import { adherenceToday, bestStreak, buildTimeline, nextDose } from '@backend/services/adherence_service';

export function ScheduleView() {
  const medicines = usePatientStore((s) => s.medicines);
  const language = usePatientStore((s) => s.language);
  const setLanguage = usePatientStore((s) => s.setLanguage);
  const markTaken = usePatientStore((s) => s.markTaken);
  const markMissed = usePatientStore((s) => s.markMissed);
  const removeMedicine = usePatientStore((s) => s.removeMedicine);
  const resetToSeed = usePatientStore((s) => s.resetToSeed);

  const { toast } = useToast();
  const timeline = buildTimeline(medicines);
  const adherence = adherenceToday(medicines);
  const streak = bestStreak(medicines);
  const next = nextDose(medicines);

  const [shareOpen, setShareOpen] = React.useState(false);

  function speakSchedule() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast({ title: 'Voice mode not available', description: 'Your browser does not support speech synthesis.', tone: 'warning' });
      return;
    }
    const utter = new SpeechSynthesisUtterance(
      language === 'hi'
        ? buildHindiNarration(timeline)
        : buildEnglishNarration(timeline),
    );
    utter.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utter.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    toast({ title: 'Reading your schedule', description: language === 'hi' ? 'हिंदी में' : 'in English', tone: 'info' });
  }

  function enableReminders() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast({ title: 'Reminders unavailable', description: 'This browser has no Notification API.', tone: 'warning' });
      return;
    }
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('MediMitra reminders enabled', {
          body: 'We\'ll gently remind you at each dose time.',
        });
        toast({ title: 'Reminders enabled', description: 'Keep this tab open for best results.', tone: 'success' });
      } else {
        toast({ title: 'Permission denied', description: 'You can enable reminders later in browser settings.', tone: 'warning' });
      }
    });
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today</CardTitle>
              <Badge tone="info">{adherence.pct}%</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-ink">
              {adherence.taken} <span className="text-base font-normal text-ink-muted">/ {adherence.total} doses taken</span>
            </p>
            <Progress value={adherence.pct} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Streak</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-ink">🔥 {streak} days</p>
            <p className="mt-2 text-sm text-ink-muted">Longest current streak across your pills.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Next dose</CardTitle></CardHeader>
          <CardContent>
            {next ? (
              <>
                <p className="text-xl font-semibold text-ink">{next.brand}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {next.minutesAway <= 0 ? 'Due right now' : `In ${next.minutesAway} min`} ({next.slot})
                </p>
              </>
            ) : (
              <p className="text-ink-muted">All caught up.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={speakSchedule}>🔊 Read aloud · {language === 'hi' ? 'हिंदी' : 'English'}</Button>
        <Button variant="outline" onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}>
          Switch to {language === 'hi' ? 'English' : 'हिंदी'}
        </Button>
        <Button variant="outline" onClick={enableReminders}>🔔 Enable reminders</Button>
        <Button variant="outline" onClick={() => setShareOpen(true)}>📲 Share with caregiver</Button>
        <Button variant="ghost" onClick={() => {
          resetToSeed();
          toast({ title: 'Schedule reset', description: 'Seed demo data loaded.', tone: 'info' });
        }}>↺ Reset demo data</Button>
      </div>

      {timeline.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-ink-muted">No medicines scheduled yet. Try the scanner to add your first pill.</p>
            <Link href="/scan" className="mt-3 inline-block">
              <Button>Go to Scan</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {timeline.map((entry) => (
            <Card key={entry.slot} className="overflow-hidden">
              <div className="flex items-center justify-between bg-gradient-to-r from-teal-50 to-saffron-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl" aria-hidden>{entry.glyph}</div>
                  <div>
                    <div className="font-display text-xl font-semibold text-ink">{entry.english}</div>
                    <div className="text-xs text-ink-muted">{entry.hindi} · around {formatHour(entry.hour)}</div>
                  </div>
                </div>
                <Badge tone={entry.items.every((i) => i.taken) ? 'success' : 'info'}>
                  {entry.items.filter((i) => i.taken).length}/{entry.items.length} taken
                </Badge>
              </div>
              <CardContent className="space-y-3 pt-4">
                {entry.items.map((item) => (
                  <div
                    key={item.scheduleId}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <div>
                      <div className="font-semibold text-ink">{item.brand}</div>
                      <div className="text-xs text-ink-muted">{item.strength}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.taken ? (
                        <Button size="sm" variant="outline" onClick={() => markMissed(item.scheduleId, entry.slot)}>
                          ↺ Unmark
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => {
                          markTaken(item.scheduleId, entry.slot);
                          toast({ title: `Taken: ${item.brand}`, tone: 'success' });
                        }}>
                          ✓ Mark taken
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          removeMedicine(item.scheduleId);
                          toast({ title: `Removed ${item.brand}`, tone: 'info' });
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
}

function ShareModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [url, setUrl] = React.useState('');
  const { toast } = useToast();
  const medicines = usePatientStore((s) => s.medicines);
  const patientName = usePatientStore((s) => s.patientName);

  React.useEffect(() => {
    if (!open) return;
    import('@backend/services/caregiver_link').then(({ encodeCaregiverPayload }) => {
      const token = encodeCaregiverPayload({
        patientName,
        generatedAt: new Date().toISOString(),
        schedule: medicines.map((m) => ({
          brand: m.brand,
          ingredient: m.ingredient,
          strength: m.strength,
          slots: m.slots,
          meal: m.meal,
          streakDays: m.streakDays,
        })),
      });
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      setUrl(`${origin}/caregiver/${token}`);
    });
  }, [open, medicines, patientName]);

  return (
    <Modal open={open} onClose={onClose} title="Share a read-only link with your caregiver">
      <p className="text-sm text-ink-muted">
        Send the link below to your adult child or primary caregiver. They can view the schedule, streaks, and risk
        score — but not edit anything.
      </p>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs break-all font-mono text-slate-700">
        {url || 'Generating…'}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={() => {
            navigator.clipboard.writeText(url).then(() => toast({ title: 'Link copied', tone: 'success' }));
          }}
        >
          Copy link
        </Button>
        <a
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#25D366] px-4 text-base font-semibold text-white shadow-sm"
          href={`https://wa.me/?text=${encodeURIComponent(`MediMitra care plan for ${patientName}: ${url}`)}`}
          target="_blank"
          rel="noreferrer"
        >
          Share on WhatsApp
        </a>
      </div>
    </Modal>
  );
}

function buildEnglishNarration(timeline: ReturnType<typeof buildTimeline>): string {
  if (!timeline.length) return 'You have no medicines scheduled today.';
  const parts = timeline.map((t) => {
    const list = t.items.map((i) => `${i.brand} ${i.strength}`).join(', ');
    return `${t.english}: take ${list}.`;
  });
  return `Here is your schedule for today. ${parts.join(' ')} Always consult your doctor.`;
}

function buildHindiNarration(timeline: ReturnType<typeof buildTimeline>): string {
  if (!timeline.length) return 'आज कोई दवा निर्धारित नहीं है।';
  const parts = timeline.map((t) => {
    const list = t.items.map((i) => `${i.brand}`).join(', ');
    return `${t.hindi} में लीजिए ${list}.`;
  });
  return `आज की दवा अनुसूची। ${parts.join(' ')} डॉक्टर से ज़रूर सलाह लें।`;
}

function formatHour(h: number): string {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const twelve = ((h + 11) % 12) + 1;
  return `${twelve} ${suffix}`;
}
