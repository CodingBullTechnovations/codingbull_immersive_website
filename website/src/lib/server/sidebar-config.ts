import {
  DEFAULT_SIDEBAR_STORE,
  DEFAULT_WIDGET_CONFIG,
  SIDEBAR_CONFIG_KEY,
  normalizeSidebarStore,
  resolveDefaultSidebarConfig,
  resolveSidebarConfigForSlug,
  type InsightSidebarStore,
  type InsightSidebarWidgetConfig,
} from '@/lib/sidebar-config';
import { isDatabaseConfigured, prisma } from '@/lib/server/prisma';

export {
  SIDEBAR_CONFIG_KEY,
  DEFAULT_WIDGET_CONFIG as DEFAULT_SIDEBAR_CONFIG,
  type InsightSidebarStore,
  type InsightSidebarWidgetConfig,
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function getInsightSidebarStore(): Promise<InsightSidebarStore> {
  if (!isDatabaseConfigured()) return clone(DEFAULT_SIDEBAR_STORE);

  try {
    const row = await prisma.siteSetting.findUnique({
      where: { key: SIDEBAR_CONFIG_KEY },
    });
    if (!row) return clone(DEFAULT_SIDEBAR_STORE);
    return normalizeSidebarStore(row.value);
  } catch (error) {
    console.error('[sidebar_store_query_failed]', error);
    return clone(DEFAULT_SIDEBAR_STORE);
  }
}

export async function getInsightSidebarConfig(): Promise<InsightSidebarWidgetConfig> {
  const store = await getInsightSidebarStore();
  return resolveDefaultSidebarConfig(store);
}

export async function getInsightSidebarConfigForSlug(slug: string): Promise<InsightSidebarWidgetConfig> {
  const store = await getInsightSidebarStore();
  return resolveSidebarConfigForSlug(store, slug);
}
