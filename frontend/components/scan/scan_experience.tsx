/**
 * Scan experience: demo grid + camera/upload + result card + add-to-pills.
 */

'use client';

import * as React from 'react';

import { Badge } from '@frontend/components/ui/badge';
import { Button } from '@frontend/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@frontend/components/ui/card';
import { PageHeader } from '@frontend/components/layout/page_header';
import { useToast } from '@frontend/components/ui/toast';
import { buildKeyHeaders, readApiKeys } from '@frontend/lib/api_keys_storage';
import { usePatientStore } from '@frontend/state/patient_store';

import { INDIAN_MEDICINES, findMedicine } from '@data/indian_medicines';
import { defaultSlotsFor } from '@data/pictograms';

type ScanResult = {
  brand: string;
  ingredient: string;
  strength: string;
  rxcui: string;
  indication: string;
  category: string;
  warnings: string[];
  sideEffects: string[];
  source: 'gemini-live' | 'demo-mode';
  labelSource: 'openFDA (live)' | 'openFDA (cached)';
  interactions: Array<{
    severity: 'mild' | 'moderate' | 'severe';
    reason: string;
    advice: string;
    against: string;
    source: string;
  }>;
};

const DEMO_BRANDS = ['Crocin Advance', 'Combiflam', 'Telma 40', 'Metformin SR 500', 'Dolo 650', 'Pan 40'];

export function ScanExperience() {
  const { toast } = useToast();
  const medicines = usePatientStore((s) => s.medicines);
  const addMedicine = usePatientStore((s) => s.addMedicine);

  const [scanning, setScanning] = React.useState(false);
  const [result, setResult] = React.useState<ScanResult | null>(null);
  const [keysConfigured, setKeysConfigured] = React.useState(false);

  React.useEffect(() => {
    setKeysConfigured(Boolean(readApiKeys().gemini));
  }, []);

  async function runScan(params: { demoBrand?: string; file?: File }) {
    setScanning(true);
    setResult(null);
    try {
      const headers: Record<string, string> = {
        'content-type': 'application/json',
        ...buildKeyHeaders(),
      };
      let body: string;
      const existingIngredients = medicines.map((m) => m.ingredient);
      if (params.file) {
        const base64 = await fileToBase64(params.file);
        body = JSON.stringify({ mimeType: params.file.type, imageBase64: base64, existingIngredients });
      } else {
        body = JSON.stringify({ demoBrand: params.demoBrand, existingIngredients });
      }
      const res = await fetch('/api/scan', { method: 'POST', headers, body });
      if (!res.ok) throw new Error(`scan-failed-${res.status}`);
      const parsed = (await res.json()) as ScanResult;
      setResult(parsed);
      toast({
        title: parsed.source === 'gemini-live' ? 'Identified with Gemini' : 'Demo-mode identification',
        description: `${parsed.brand} · ${parsed.strength}`,
        tone: 'success',
      });
    } catch (err) {
      toast({ title: 'Scan failed', description: 'Try a demo medicine instead.', tone: 'error' });
    } finally {
      setScanning(false);
    }
  }

  function handleFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    runScan({ file });
  }

  function handleAddToPills() {
    if (!result) return;
    const catalog = findMedicine(result.brand) ?? findMedicine(result.ingredient);
    addMedicine({
      id: `scanned-${Date.now()}`,
      brand: result.brand,
      ingredient: result.ingredient,
      strength: result.strength,
      rxcui: result.rxcui,
      slots: catalog ? defaultSlotsFor(catalog.defaultFrequency) : ['morning'],
      meal: 'after-meal',
    });
    toast({
      title: 'Added to your pill schedule',
      description: `${result.brand} will remind you at the right time.`,
      tone: 'success',
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon="📷"
        title="Snap-a-Strip Medicine Scanner"
        description="Zero typing required. We identify the drug, pull FDA-grade warnings, and cross-check your schedule for dangerous combinations — all in one tap."
      />

      {!keysConfigured ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Running in <strong>demo mode</strong>. Add your free Gemini API key in{' '}
          <a className="underline" href="/settings">Settings</a> to unlock live image identification.
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Try a demo strip</CardTitle>
          <p className="mt-1 text-sm text-ink-muted">
            Tap any common Indian brand below to simulate a scan. No camera or upload required.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {DEMO_BRANDS.map((brand) => {
              const med = findMedicine(brand);
              if (!med) return null;
              return (
                <button
                  key={brand}
                  onClick={() => runScan({ demoBrand: brand })}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 text-left transition-transform hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-card"
                >
                  <div className="text-3xl">💊</div>
                  <div className="mt-2 text-sm font-semibold text-ink">{med.brand}</div>
                  <div className="text-xs text-ink-muted">{med.ingredient} · {med.strength}</div>
                  <div className="mt-2 text-[11px] text-teal-700 opacity-0 transition group-hover:opacity-100">
                    Tap to scan →
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col items-start gap-2 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Or scan a real strip</p>
              <p className="text-xs text-ink-muted">Upload a photo from your gallery or take a new one.</p>
            </div>
            <label className="inline-block">
              <span className="sr-only">Upload a medicine strip photo</span>
              <input type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" id="scan-upload" />
              <Button onClick={() => document.getElementById('scan-upload')?.click()} variant="secondary" size="lg">
                📸 Upload / take photo
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {scanning ? <ScanningCard /> : null}
      {result ? (
        <ResultCard result={result} onAdd={handleAddToPills} alreadyInList={medicines.some((m) => m.ingredient.toLowerCase() === result.ingredient.toLowerCase())} />
      ) : null}
    </div>
  );
}

function ScanningCard() {
  return (
    <Card className="animate-slide-up">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-3xl animate-pulse-soft">📷</div>
        <div>
          <p className="font-display text-xl font-semibold text-ink">Reading your strip…</p>
          <p className="mt-1 text-sm text-ink-muted">Matching against RxNorm + openFDA. Usually ~3 seconds.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ResultCard({
  result,
  alreadyInList,
  onAdd,
}: {
  result: ScanResult;
  alreadyInList: boolean;
  onAdd: () => void;
}) {
  const severe = result.interactions.find((i) => i.severity === 'severe');
  const moderate = result.interactions.find((i) => i.severity === 'moderate');
  const bannerTone = severe ? 'severe' : moderate ? 'moderate' : 'mild';

  return (
    <div className="space-y-4 animate-slide-up">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-saffron-500 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest opacity-80">Identified</div>
              <div className="font-display text-2xl font-semibold">{result.brand}</div>
              <div className="text-sm opacity-90">{result.ingredient} · {result.strength}</div>
            </div>
            <Badge tone="neutral" className="bg-white/20 text-white ring-white/30">
              {result.source === 'gemini-live' ? 'Gemini Live' : 'Demo mode'}
            </Badge>
          </div>
        </div>
        <CardContent className="space-y-4 pt-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <InfoTile label="Category" value={result.category} glyph="🏷️" />
            <InfoTile label="Used for" value={result.indication} glyph="💡" clamp />
            <InfoTile label="FDA source" value={result.labelSource} glyph="🔗" />
          </div>

          {result.warnings.length ? (
            <div>
              <div className="mb-2 text-sm font-semibold text-ink">FDA warnings</div>
              <ul className="space-y-1 text-sm text-ink-muted">
                {result.warnings.slice(0, 3).map((w, i) => (
                  <li key={i} className="flex gap-2"><span className="text-amber-600">⚠</span><span>{w}</span></li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.sideEffects.length ? (
            <div>
              <div className="mb-2 text-sm font-semibold text-ink">Common side effects</div>
              <div className="flex flex-wrap gap-2">
                {result.sideEffects.slice(0, 4).map((s, i) => (
                  <Badge key={i} tone="neutral">{s}</Badge>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
            <Button onClick={onAdd} size="lg" disabled={alreadyInList}>
              {alreadyInList ? 'Already in your pills' : '➕ Add to my pills'}
            </Button>
            <a href="/ask" className="text-sm font-semibold text-teal-700 hover:underline">
              Ask MediMitra about this →
            </a>
          </div>
        </CardContent>
      </Card>

      {result.interactions.length ? (
        <Card className={
          bannerTone === 'severe'
            ? 'border-red-300 bg-red-50'
            : bannerTone === 'moderate'
              ? 'border-amber-300 bg-amber-50'
              : 'border-emerald-300 bg-emerald-50'
        }>
          <CardContent className="py-5">
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                {bannerTone === 'severe' ? '🛑' : bannerTone === 'moderate' ? '⚠' : '✅'}
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-ink">
                  {bannerTone === 'severe'
                    ? 'Severe interaction flagged'
                    : bannerTone === 'moderate'
                      ? 'Moderate interaction flagged'
                      : 'Mild interaction to note'}
                </div>
                <ul className="mt-2 space-y-2 text-sm text-ink">
                  {result.interactions.map((ix, i) => (
                    <li key={i} className="rounded-xl border border-white/50 bg-white/70 p-3">
                      <div className="font-medium">with {ix.against}</div>
                      <div className="text-ink-muted">{ix.reason}</div>
                      <div className="mt-1 text-xs text-ink-muted">
                        <strong>Advice:</strong> {ix.advice} · <em>Source: {ix.source}</em>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex items-start gap-3 py-5">
            <div className="text-2xl">✅</div>
            <div>
              <div className="font-display text-lg font-semibold text-ink">No interactions found</div>
              <p className="text-sm text-ink-muted">
                We checked {findExistingCount()} existing medicines and the DrugBank open dataset ({INDIAN_MEDICINES.length} drugs covered).
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoTile({ label, value, glyph, clamp }: { label: string; value: string; glyph: string; clamp?: boolean }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="text-xs font-medium uppercase tracking-wider text-ink-muted">
        <span className="mr-1" aria-hidden>{glyph}</span>
        {label}
      </div>
      <div className={`mt-1 text-sm font-medium text-ink ${clamp ? 'line-clamp-3' : ''}`}>{value}</div>
    </div>
  );
}

function findExistingCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem('medimitra_patient_state');
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { state?: { medicines?: unknown[] } };
    return parsed?.state?.medicines?.length ?? 0;
  } catch {
    return 0;
  }
}

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buf);
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)) as number[]);
  }
  return typeof window !== 'undefined' ? window.btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
}
