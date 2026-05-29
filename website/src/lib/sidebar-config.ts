import { z } from 'zod';

export const SIDEBAR_CONFIG_KEY = 'insight_sidebar.config';
export const SIDEBAR_CONFIG_VERSION = 2 as const;

export interface ArchitectureTag {
  text: string;
  accent: boolean;
}

export interface ArchitectureCategory {
  label: string;
  tags: ArchitectureTag[];
}

export interface InsightSidebarWidgetConfig {
  hudTelemetry: {
    enabled: boolean;
    title: string;
    showSystemState: boolean;
    showLatency: boolean;
    showIsrCache: boolean;
    showClock: boolean;
    showConsoleFeed: boolean;
    showActivityBars: boolean;
  };
  architectureSpecs: {
    enabled: boolean;
    title: string;
    categories: ArchitectureCategory[];
  };
  shareLinks: {
    enabled: boolean;
    linkedin: boolean;
    twitter: boolean;
    whatsapp: boolean;
  };
}

export type SidebarDefaultAssignment =
  | { mode: 'preset'; presetId: string }
  | { mode: 'custom'; customConfig: InsightSidebarWidgetConfig };

export type SidebarSlugAssignment =
  | { mode: 'inherit' }
  | { mode: 'preset'; presetId: string }
  | { mode: 'custom'; customConfig: InsightSidebarWidgetConfig };

export interface SidebarPreset {
  id: string;
  label: string;
  config: InsightSidebarWidgetConfig;
  system: boolean;
}

export interface InsightSidebarStore {
  version: typeof SIDEBAR_CONFIG_VERSION;
  presets: Record<string, SidebarPreset>;
  defaultAssignment: SidebarDefaultAssignment;
  perSlug: Record<string, SidebarSlugAssignment>;
}

export const DEFAULT_WIDGET_CONFIG: InsightSidebarWidgetConfig = {
  hudTelemetry: {
    enabled: true,
    title: '[ HUD TELEMETRY MODULE ]',
    showSystemState: true,
    showLatency: true,
    showIsrCache: true,
    showClock: true,
    showConsoleFeed: true,
    showActivityBars: true,
  },
  architectureSpecs: {
    enabled: true,
    title: '// ARCHITECTURE SPECS',
    categories: [
      {
        label: 'Frameworks & SSR',
        tags: [
          { text: 'Next.js 16', accent: true },
          { text: 'React 19', accent: false },
        ],
      },
      {
        label: 'State & Database',
        tags: [
          { text: 'Prisma Client', accent: false },
          { text: 'PostgreSQL', accent: true },
        ],
      },
      {
        label: 'CDN & Optimizations',
        tags: [
          { text: 'ISR Caching', accent: false },
          { text: 'Cloudflare', accent: false },
        ],
      },
    ],
  },
  shareLinks: {
    enabled: true,
    linkedin: true,
    twitter: true,
    whatsapp: true,
  },
};

export const SYSTEM_PRESETS: SidebarPreset[] = [
  {
    id: 'default-full-hud',
    label: 'Default (Full HUD)',
    system: true,
    config: DEFAULT_WIDGET_CONFIG,
  },
  {
    id: 'minimal',
    label: 'Minimal',
    system: true,
    config: {
      hudTelemetry: { ...DEFAULT_WIDGET_CONFIG.hudTelemetry, enabled: false },
      architectureSpecs: { ...DEFAULT_WIDGET_CONFIG.architectureSpecs, enabled: false },
      shareLinks: { ...DEFAULT_WIDGET_CONFIG.shareLinks, enabled: true },
    },
  },
  {
    id: 'tech-focus',
    label: 'Tech Focus',
    system: true,
    config: {
      hudTelemetry: { ...DEFAULT_WIDGET_CONFIG.hudTelemetry, enabled: false },
      architectureSpecs: { ...DEFAULT_WIDGET_CONFIG.architectureSpecs, enabled: true },
      shareLinks: { ...DEFAULT_WIDGET_CONFIG.shareLinks, enabled: false },
    },
  },
];

export const SYSTEM_PRESET_IDS = new Set(SYSTEM_PRESETS.map((preset) => preset.id));

export const DEFAULT_SIDEBAR_STORE: InsightSidebarStore = {
  version: SIDEBAR_CONFIG_VERSION,
  presets: SYSTEM_PRESETS.reduce<Record<string, SidebarPreset>>((acc, preset) => {
    acc[preset.id] = preset;
    return acc;
  }, {}),
  defaultAssignment: { mode: 'preset', presetId: SYSTEM_PRESETS[0].id },
  perSlug: {},
};

const tagSchema = z.object({
  text: z.string().trim().min(1).max(60),
  accent: z.boolean(),
});

const categorySchema = z.object({
  label: z.string().trim().min(1).max(80),
  tags: z.array(tagSchema).min(1).max(20),
});

export const widgetConfigSchema = z.object({
  hudTelemetry: z.object({
    enabled: z.boolean(),
    title: z.string().trim().min(1).max(100),
    showSystemState: z.boolean(),
    showLatency: z.boolean(),
    showIsrCache: z.boolean(),
    showClock: z.boolean(),
    showConsoleFeed: z.boolean(),
    showActivityBars: z.boolean(),
  }),
  architectureSpecs: z.object({
    enabled: z.boolean(),
    title: z.string().trim().min(1).max(100),
    categories: z.array(categorySchema).max(10),
  }),
  shareLinks: z.object({
    enabled: z.boolean(),
    linkedin: z.boolean(),
    twitter: z.boolean(),
    whatsapp: z.boolean(),
  }),
});

const presetIdSchema = z.string().trim().min(1).max(100).regex(/^[a-z0-9-_.]+$/i);

const defaultAssignmentSchema = z.union([
  z.object({
    mode: z.literal('preset'),
    presetId: presetIdSchema,
  }),
  z.object({
    mode: z.literal('custom'),
    customConfig: widgetConfigSchema,
  }),
]);

const slugAssignmentSchema = z.union([
  z.object({ mode: z.literal('inherit') }),
  z.object({
    mode: z.literal('preset'),
    presetId: presetIdSchema,
  }),
  z.object({
    mode: z.literal('custom'),
    customConfig: widgetConfigSchema,
  }),
]);

export const sidebarStoreSchema = z.object({
  version: z.literal(SIDEBAR_CONFIG_VERSION),
  presets: z.record(
    presetIdSchema,
    z.object({
      id: presetIdSchema,
      label: z.string().trim().min(1).max(80),
      config: widgetConfigSchema,
      system: z.boolean(),
    }),
  ),
  defaultAssignment: defaultAssignmentSchema,
  perSlug: z.record(
    z.string().trim().min(1).max(200),
    slugAssignmentSchema,
  ),
});

const legacyWidgetConfigSchema = widgetConfigSchema;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function normalizeSidebarStore(raw: unknown): InsightSidebarStore {
  const parsedCurrent = sidebarStoreSchema.safeParse(raw);
  if (parsedCurrent.success) {
    return enforceSystemPresets(parsedCurrent.data);
  }

  const parsedLegacy = legacyWidgetConfigSchema.safeParse(raw);
  if (parsedLegacy.success) {
    const base = clone(DEFAULT_SIDEBAR_STORE);
    base.defaultAssignment = {
      mode: 'custom',
      customConfig: parsedLegacy.data,
    };
    return base;
  }

  return clone(DEFAULT_SIDEBAR_STORE);
}

function enforceSystemPresets(store: InsightSidebarStore): InsightSidebarStore {
  const merged = clone(store);
  for (const preset of SYSTEM_PRESETS) {
    merged.presets[preset.id] = preset;
  }
  return merged;
}

function resolvePresetConfig(store: InsightSidebarStore, presetId: string): InsightSidebarWidgetConfig | null {
  const preset = store.presets[presetId];
  if (!preset) return null;
  const parsed = widgetConfigSchema.safeParse(preset.config);
  return parsed.success ? parsed.data : null;
}

function resolveAssignment(
  assignment: SidebarDefaultAssignment | SidebarSlugAssignment,
  store: InsightSidebarStore,
): InsightSidebarWidgetConfig | null {
  if (assignment.mode === 'custom') {
    const parsed = widgetConfigSchema.safeParse(assignment.customConfig);
    return parsed.success ? parsed.data : null;
  }
  if (assignment.mode === 'preset') {
    return resolvePresetConfig(store, assignment.presetId);
  }
  return null;
}

export function resolveDefaultSidebarConfig(store: InsightSidebarStore): InsightSidebarWidgetConfig {
  return resolveAssignment(store.defaultAssignment, store) ?? DEFAULT_WIDGET_CONFIG;
}

export function resolveSidebarConfigForSlug(store: InsightSidebarStore, slug: string): InsightSidebarWidgetConfig {
  const override = store.perSlug[slug];

  if (override && override.mode !== 'inherit') {
    const overrideConfig = resolveAssignment(override, store);
    if (overrideConfig) return overrideConfig;
  }

  return resolveDefaultSidebarConfig(store);
}
