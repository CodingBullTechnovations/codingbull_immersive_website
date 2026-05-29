'use client';

import { useMemo, useState } from 'react';
import {
  SYSTEM_PRESETS,
  SYSTEM_PRESET_IDS,
  resolveDefaultSidebarConfig,
  resolveSidebarConfigForSlug,
  type ArchitectureCategory,
  type ArchitectureTag,
  type InsightSidebarStore,
  type InsightSidebarWidgetConfig,
} from '@/lib/sidebar-config';
import { saveSidebarConfigAction } from './actions';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function slugifyPresetId(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniquePresetId(label: string, store: InsightSidebarStore) {
  const base = slugifyPresetId(label) || 'custom-preset';
  let candidate = base;
  let i = 2;
  while (store.presets[candidate]) {
    candidate = `${base}-${i}`;
    i += 1;
  }
  return candidate;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer group">
      <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal ${
          checked ? 'bg-teal' : 'bg-white/15'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="text-sm font-bold text-white uppercase tracking-[0.14em] mb-5 font-[family-name:var(--font-outfit)]">{title}</h3>
      {children}
    </div>
  );
}

function TagEditor({
  categories,
  onChange,
}: {
  categories: ArchitectureCategory[];
  onChange: (cats: ArchitectureCategory[]) => void;
}) {
  const addCategory = () => {
    onChange([...categories, { label: '', tags: [{ text: '', accent: false }] }]);
  };

  const removeCategory = (idx: number) => {
    onChange(categories.filter((_, i) => i !== idx));
  };

  const updateCategoryLabel = (idx: number, label: string) => {
    const next = [...categories];
    next[idx] = { ...next[idx], label };
    onChange(next);
  };

  const addTag = (catIdx: number) => {
    const next = [...categories];
    next[catIdx] = { ...next[catIdx], tags: [...next[catIdx].tags, { text: '', accent: false }] };
    onChange(next);
  };

  const removeTag = (catIdx: number, tagIdx: number) => {
    const next = [...categories];
    next[catIdx] = { ...next[catIdx], tags: next[catIdx].tags.filter((_, i) => i !== tagIdx) };
    onChange(next);
  };

  const updateTag = (catIdx: number, tagIdx: number, patch: Partial<ArchitectureTag>) => {
    const next = [...categories];
    next[catIdx] = {
      ...next[catIdx],
      tags: next[catIdx].tags.map((t, i) => (i === tagIdx ? { ...t, ...patch } : t)),
    };
    onChange(next);
  };

  return (
    <div className="space-y-4 mt-4">
      {categories.map((cat, catIdx) => (
        <div key={catIdx} className="rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex items-center gap-3 mb-3">
            <input
              type="text"
              value={cat.label}
              onChange={(e) => updateCategoryLabel(catIdx, e.target.value)}
              placeholder="Category label (e.g. Frameworks & SSR)"
              className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-teal/50"
            />
            <button
              type="button"
              onClick={() => removeCategory(catIdx)}
              className="shrink-0 rounded-lg border border-red-400/20 px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-400/10 transition-colors"
            >
              Remove
            </button>
          </div>
          <div className="space-y-2">
            {cat.tags.map((tag, tagIdx) => (
              <div key={tagIdx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={tag.text}
                  onChange={(e) => updateTag(catIdx, tagIdx, { text: e.target.value })}
                  placeholder="Tag text (e.g. Next.js 16)"
                  className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white font-mono placeholder:text-white/20 outline-none focus:border-teal/50"
                />
                <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={tag.accent}
                    onChange={(e) => updateTag(catIdx, tagIdx, { accent: e.target.checked })}
                    className="accent-teal w-3.5 h-3.5"
                  />
                  <span className="text-[10px] uppercase tracking-wider text-teal/80">Accent</span>
                </label>
                <button
                  type="button"
                  onClick={() => removeTag(catIdx, tagIdx)}
                  className="text-red-300/60 hover:text-red-300 text-xs transition-colors"
                  title="Remove tag"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addTag(catIdx)}
            className="mt-2 rounded-lg border border-dashed border-white/10 px-3 py-1.5 text-xs text-white/40 hover:text-teal hover:border-teal/30 transition-colors"
          >
            + Add tag
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addCategory}
        className="w-full rounded-xl border border-dashed border-white/10 py-3 text-sm text-white/40 hover:text-teal hover:border-teal/30 transition-colors"
      >
        + Add category
      </button>
    </div>
  );
}

function WidgetConfigEditor({
  value,
  onChange,
}: {
  value: InsightSidebarWidgetConfig;
  onChange: (next: InsightSidebarWidgetConfig) => void;
}) {
  const update = <K extends keyof InsightSidebarWidgetConfig>(
    section: K,
    patch: Partial<InsightSidebarWidgetConfig[K]>,
  ) => {
    onChange({
      ...value,
      [section]: { ...value[section], ...patch },
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard title="HUD Telemetry Module">
        <div className="space-y-4">
          <Toggle
            label="Enable HUD Telemetry widget"
            checked={value.hudTelemetry.enabled}
            onChange={(v) => update('hudTelemetry', { enabled: v })}
          />
          <div className={`space-y-3 pl-2 border-l border-white/10 ml-1 transition-opacity ${!value.hudTelemetry.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 block mb-1.5">Title</label>
              <input
                type="text"
                value={value.hudTelemetry.title}
                onChange={(e) => update('hudTelemetry', { title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white font-mono outline-none focus:border-teal/50 placeholder:text-white/20"
              />
            </div>
            <Toggle label="System State row" checked={value.hudTelemetry.showSystemState} onChange={(v) => update('hudTelemetry', { showSystemState: v })} />
            <Toggle label="Latency row" checked={value.hudTelemetry.showLatency} onChange={(v) => update('hudTelemetry', { showLatency: v })} />
            <Toggle label="ISR Cache row" checked={value.hudTelemetry.showIsrCache} onChange={(v) => update('hudTelemetry', { showIsrCache: v })} />
            <Toggle label="Clock row" checked={value.hudTelemetry.showClock} onChange={(v) => update('hudTelemetry', { showClock: v })} />
            <Toggle label="Live Console Feed" checked={value.hudTelemetry.showConsoleFeed} onChange={(v) => update('hudTelemetry', { showConsoleFeed: v })} />
            <Toggle label="Activity Bars visualization" checked={value.hudTelemetry.showActivityBars} onChange={(v) => update('hudTelemetry', { showActivityBars: v })} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Architecture Spec Sheet">
        <div className="space-y-4">
          <Toggle
            label="Enable Architecture Specs widget"
            checked={value.architectureSpecs.enabled}
            onChange={(v) => update('architectureSpecs', { enabled: v })}
          />
          <div className={`space-y-3 pl-2 border-l border-white/10 ml-1 transition-opacity ${!value.architectureSpecs.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 block mb-1.5">Title</label>
              <input
                type="text"
                value={value.architectureSpecs.title}
                onChange={(e) => update('architectureSpecs', { title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white font-mono outline-none focus:border-teal/50 placeholder:text-white/20"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 block mb-1">Categories & Tags</label>
              <p className="text-xs text-white/30 mb-2">Define categories with labeled tags. Toggle &quot;Accent&quot; for teal highlights.</p>
              <TagEditor
                categories={value.architectureSpecs.categories}
                onChange={(categories) => update('architectureSpecs', { categories })}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Share Links">
        <div className="space-y-4">
          <Toggle
            label="Enable Share Links widget"
            checked={value.shareLinks.enabled}
            onChange={(v) => update('shareLinks', { enabled: v })}
          />
          <div className={`space-y-3 pl-2 border-l border-white/10 ml-1 transition-opacity ${!value.shareLinks.enabled ? 'opacity-30 pointer-events-none' : ''}`}>
            <Toggle label="LinkedIn" checked={value.shareLinks.linkedin} onChange={(v) => update('shareLinks', { linkedin: v })} />
            <Toggle label="X / Twitter" checked={value.shareLinks.twitter} onChange={(v) => update('shareLinks', { twitter: v })} />
            <Toggle label="WhatsApp" checked={value.shareLinks.whatsapp} onChange={(v) => update('shareLinks', { whatsapp: v })} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

export function SidebarConfigForm({
  initialStore,
  insightSlugs,
}: {
  initialStore: InsightSidebarStore;
  insightSlugs: string[];
}) {
  const [store, setStore] = useState<InsightSidebarStore>(initialStore);
  const [selectedSlug, setSelectedSlug] = useState(insightSlugs[0] ?? '');
  const [newPresetLabel, setNewPresetLabel] = useState('');
  const [newPresetSource, setNewPresetSource] = useState<'default' | 'selected-slug'>('default');
  const [defaultMode, setDefaultMode] = useState<'preset' | 'custom'>(store.defaultAssignment.mode);

  const presetList = useMemo(
    () =>
      Object.values(store.presets).sort((a, b) => {
        if (a.system !== b.system) return a.system ? -1 : 1;
        return a.label.localeCompare(b.label);
      }),
    [store.presets],
  );

  const selectedSlugAssignment = selectedSlug ? (store.perSlug[selectedSlug] ?? { mode: 'inherit' as const }) : { mode: 'inherit' as const };
  const effectiveDefaultConfig = store.defaultAssignment.mode === 'custom'
    ? store.defaultAssignment.customConfig
    : resolveDefaultSidebarConfig(store);
  const effectiveSelectedSlugConfig = selectedSlug ? resolveSidebarConfigForSlug(store, selectedSlug) : effectiveDefaultConfig;

  const upsertPreset = () => {
    const label = newPresetLabel.trim();
    if (!label) return;
    const id = uniquePresetId(label, store);
    const config = newPresetSource === 'selected-slug' && selectedSlug
      ? clone(effectiveSelectedSlugConfig)
      : clone(effectiveDefaultConfig);

    setStore((prev) => ({
      ...prev,
      presets: {
        ...prev.presets,
        [id]: { id, label, config, system: false },
      },
    }));
    setNewPresetLabel('');
  };

  const removePreset = (presetId: string) => {
    if (SYSTEM_PRESET_IDS.has(presetId)) return;
    setStore((prev) => {
      const next = clone(prev);
      delete next.presets[presetId];

      if (next.defaultAssignment.mode === 'preset' && next.defaultAssignment.presetId === presetId) {
        next.defaultAssignment = { mode: 'preset', presetId: SYSTEM_PRESETS[0].id };
      }

      for (const [slug, assignment] of Object.entries(next.perSlug)) {
        if (assignment.mode === 'preset' && assignment.presetId === presetId) {
          next.perSlug[slug] = { mode: 'inherit' };
        }
      }

      return next;
    });
  };

  const updateDefaultMode = (mode: 'preset' | 'custom') => {
    setDefaultMode(mode);
    setStore((prev) => {
      if (mode === 'preset') {
        const firstPreset = presetList[0]?.id ?? SYSTEM_PRESETS[0].id;
        return {
          ...prev,
          defaultAssignment: { mode: 'preset', presetId: firstPreset },
        };
      }
      return {
        ...prev,
        defaultAssignment: {
          mode: 'custom',
          customConfig: clone(resolveDefaultSidebarConfig(prev)),
        },
      };
    });
  };

  const updateSelectedSlugAssignmentMode = (mode: 'inherit' | 'preset' | 'custom') => {
    if (!selectedSlug) return;
    setStore((prev) => {
      const next = clone(prev);
      if (mode === 'inherit') {
        delete next.perSlug[selectedSlug];
        return next;
      }
      if (mode === 'preset') {
        next.perSlug[selectedSlug] = {
          mode: 'preset',
          presetId: presetList[0]?.id ?? SYSTEM_PRESETS[0].id,
        };
        return next;
      }
      next.perSlug[selectedSlug] = {
        mode: 'custom',
        customConfig: clone(resolveSidebarConfigForSlug(prev, selectedSlug)),
      };
      return next;
    });
  };

  return (
    <form action={saveSidebarConfigAction} className="space-y-8">
      <input type="hidden" name="store" value={JSON.stringify(store)} />

      <SectionCard title="Preset Library">
        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {presetList.map((preset) => (
              <div key={preset.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{preset.label}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/35">{preset.id}</p>
                  </div>
                  <span className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.12em] ${preset.system ? 'border-teal/30 text-teal' : 'border-white/20 text-white/50'}`}>
                    {preset.system ? 'System' : 'Custom'}
                  </span>
                </div>
                {!preset.system && (
                  <button
                    type="button"
                    onClick={() => removePreset(preset.id)}
                    className="mt-3 rounded-lg border border-red-400/20 px-2.5 py-1 text-xs font-semibold text-red-300 hover:bg-red-400/10 transition-colors"
                  >
                    Delete preset
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white mb-3">Create custom preset</p>
            <div className="grid gap-3 md:grid-cols-[1fr_220px_120px]">
              <input
                type="text"
                value={newPresetLabel}
                onChange={(e) => setNewPresetLabel(e.target.value)}
                placeholder="Preset label"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-teal/50"
              />
              <select
                value={newPresetSource}
                onChange={(e) => setNewPresetSource(e.target.value as 'default' | 'selected-slug')}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-teal/50"
              >
                <option value="default">From default config</option>
                <option value="selected-slug" disabled={!selectedSlug}>From selected slug config</option>
              </select>
              <button
                type="button"
                onClick={upsertPreset}
                className="rounded-xl bg-teal px-4 py-2 text-sm font-semibold text-black hover:bg-teal/80 transition-colors"
              >
                Add preset
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Default Sidebar Assignment">
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => updateDefaultMode('preset')}
              className={`rounded-xl border px-4 py-3 text-left ${defaultMode === 'preset' ? 'border-teal/40 bg-teal/10 text-teal' : 'border-white/10 text-white/60 hover:border-white/20'}`}
            >
              Use preset
            </button>
            <button
              type="button"
              onClick={() => updateDefaultMode('custom')}
              className={`rounded-xl border px-4 py-3 text-left ${defaultMode === 'custom' ? 'border-teal/40 bg-teal/10 text-teal' : 'border-white/10 text-white/60 hover:border-white/20'}`}
            >
              Use custom config
            </button>
          </div>

          {store.defaultAssignment.mode === 'preset' && (
            <select
              value={store.defaultAssignment.presetId}
              onChange={(e) => {
                const presetId = e.target.value;
                setStore((prev) => ({ ...prev, defaultAssignment: { mode: 'preset', presetId } }));
              }}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-teal/50"
            >
              {presetList.map((preset) => (
                <option key={preset.id} value={preset.id}>{preset.label}</option>
              ))}
            </select>
          )}

          {store.defaultAssignment.mode === 'custom' && (
            <WidgetConfigEditor
              value={store.defaultAssignment.customConfig}
              onChange={(customConfig) => {
                setStore((prev) => ({ ...prev, defaultAssignment: { mode: 'custom', customConfig } }));
              }}
            />
          )}
        </div>
      </SectionCard>

      <SectionCard title="Per-Insight Overrides">
        {insightSlugs.length === 0 ? (
          <p className="text-sm text-white/50">No insight slugs found yet.</p>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-teal/50"
              >
                {insightSlugs.map((slug) => (
                  <option key={slug} value={slug}>{slug}</option>
                ))}
              </select>
              <select
                value={selectedSlugAssignment.mode}
                onChange={(e) => updateSelectedSlugAssignmentMode(e.target.value as 'inherit' | 'preset' | 'custom')}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-teal/50"
              >
                <option value="inherit">Inherit default</option>
                <option value="preset">Use preset</option>
                <option value="custom">Use custom config</option>
              </select>
            </div>

            {selectedSlugAssignment.mode === 'preset' && (
              <select
                value={selectedSlugAssignment.presetId}
                onChange={(e) => {
                  if (!selectedSlug) return;
                  const presetId = e.target.value;
                  setStore((prev) => ({
                    ...prev,
                    perSlug: {
                      ...prev.perSlug,
                      [selectedSlug]: { mode: 'preset', presetId },
                    },
                  }));
                }}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-teal/50"
              >
                {presetList.map((preset) => (
                  <option key={preset.id} value={preset.id}>{preset.label}</option>
                ))}
              </select>
            )}

            {selectedSlugAssignment.mode === 'custom' && selectedSlug && (
              <WidgetConfigEditor
                value={selectedSlugAssignment.customConfig}
                onChange={(customConfig) => {
                  setStore((prev) => ({
                    ...prev,
                    perSlug: {
                      ...prev.perSlug,
                      [selectedSlug]: { mode: 'custom', customConfig },
                    },
                  }));
                }}
              />
            )}

            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-semibold text-white mb-3">Active overrides</p>
              {Object.keys(store.perSlug).length === 0 ? (
                <p className="text-xs text-white/40">No per-insight overrides configured.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(store.perSlug)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([slug, assignment]) => (
                      <div key={slug} className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
                        <div>
                          <p className="text-xs font-mono text-white/75">{slug}</p>
                          <p className="text-[10px] text-white/35 uppercase tracking-[0.1em]">
                            {assignment.mode === 'preset' ? `Preset: ${assignment.presetId}` : assignment.mode}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setStore((prev) => {
                              const next = clone(prev);
                              delete next.perSlug[slug];
                              return next;
                            });
                          }}
                          className="rounded-lg border border-red-400/20 px-2.5 py-1 text-xs font-semibold text-red-300 hover:bg-red-400/10 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Store Preview">
        <pre className="overflow-x-auto rounded-xl bg-black/30 p-4 text-xs text-white/50 font-mono leading-5 max-h-[400px] overflow-y-auto">
          {JSON.stringify(store, null, 2)}
        </pre>
      </SectionCard>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => {
            setStore(initialStore);
            setDefaultMode(initialStore.defaultAssignment.mode);
          }}
          className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/60 hover:text-white hover:border-white/20 transition-colors"
        >
          Reset to saved
        </button>
        <button
          type="submit"
          className="rounded-xl bg-teal px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-teal/80"
        >
          Save configuration
        </button>
      </div>
    </form>
  );
}
