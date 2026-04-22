/**
 * Settings panel.
 *
 * Renders three free-tier API key slots (Gemini, openFDA, Hugging Face),
 * plus a language toggle and a "reset demo data" action.
 */

'use client';

import * as React from 'react';

import { Badge } from '@frontend/components/ui/badge';
import { Button } from '@frontend/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@frontend/components/ui/card';
import { Input, Label } from '@frontend/components/ui/input';
import { useToast } from '@frontend/components/ui/toast';
import { clearApiKeys, readApiKeys, writeApiKeys, type ApiKeyName } from '@frontend/lib/api_keys_storage';
import { usePatientStore } from '@frontend/state/patient_store';

type KeySpec = {
  name: ApiKeyName;
  label: string;
  description: string;
  signup: string;
  placeholder: string;
};

const KEYS: KeySpec[] = [
  {
    name: 'gemini',
    label: 'Google Gemini (2.5 Flash)',
    description: 'Multimodal scanning + conversational Q&A. Free tier: 1,500 requests/day.',
    signup: 'https://aistudio.google.com/apikey',
    placeholder: 'AIza...',
  },
  {
    name: 'openfda',
    label: 'openFDA',
    description: 'Official FDA drug labels & adverse-event reports. Free; optional key raises the rate limit.',
    signup: 'https://open.fda.gov/apis/authentication/',
    placeholder: 'Your openFDA key (optional)',
  },
  {
    name: 'huggingface',
    label: 'Hugging Face',
    description: 'Used to refresh the DrugBank DDI bundle. Free tier is ample for any demo.',
    signup: 'https://huggingface.co/settings/tokens',
    placeholder: 'hf_...',
  },
];

export function SettingsPanel() {
  const [bundle, setBundle] = React.useState<Record<ApiKeyName, string>>({ gemini: '', openfda: '', huggingface: '' });
  const language = usePatientStore((s) => s.language);
  const setLanguage = usePatientStore((s) => s.setLanguage);
  const resetToSeed = usePatientStore((s) => s.resetToSeed);
  const { toast } = useToast();

  React.useEffect(() => {
    const current = readApiKeys();
    setBundle({
      gemini: current.gemini ?? '',
      openfda: current.openfda ?? '',
      huggingface: current.huggingface ?? '',
    });
  }, []);

  function saveOne(name: ApiKeyName) {
    const value = bundle[name].trim();
    const current = readApiKeys();
    const next = { ...current, [name]: value || undefined };
    writeApiKeys(next);
    toast({ title: value ? `${titleFor(name)} key saved` : `${titleFor(name)} key cleared`, tone: 'success' });
  }

  function clearAll() {
    clearApiKeys();
    setBundle({ gemini: '', openfda: '', huggingface: '' });
    toast({ title: 'All keys cleared', description: 'App is back in demo mode.', tone: 'info' });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>API keys</CardTitle>
            <Badge tone="info">localStorage only</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {KEYS.map((k) => (
            <div key={k.name} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="mb-0">{k.label}</Label>
                  <p className="text-xs text-ink-muted">{k.description}</p>
                </div>
                <a
                  href={k.signup}
                  className="text-xs font-semibold text-teal-700 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get a free key →
                </a>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Input
                  type="password"
                  autoComplete="off"
                  placeholder={k.placeholder}
                  value={bundle[k.name]}
                  onChange={(e) => setBundle((prev) => ({ ...prev, [k.name]: e.target.value }))}
                  className="flex-1 min-w-[220px]"
                />
                <Button variant="outline" onClick={() => saveOne(k.name)}>Save</Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setBundle((prev) => ({ ...prev, [k.name]: '' }));
                    saveOne(k.name);
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button variant="destructive" onClick={clearAll}>Clear all keys</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2">Language</Label>
            <div className="flex gap-2">
              <Button
                variant={language === 'en' ? 'primary' : 'outline'}
                onClick={() => setLanguage('en')}
              >
                English
              </Button>
              <Button
                variant={language === 'hi' ? 'primary' : 'outline'}
                onClick={() => setLanguage('hi')}
              >
                हिंदी
              </Button>
            </div>
          </div>
          <div>
            <Label className="mb-2">Demo data</Label>
            <Button
              variant="outline"
              onClick={() => {
                resetToSeed();
                toast({ title: 'Seed patient restored', tone: 'info' });
              }}
            >
              ↺ Restore seed patient &amp; medicines
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function titleFor(name: ApiKeyName): string {
  return KEYS.find((k) => k.name === name)?.label ?? name;
}
