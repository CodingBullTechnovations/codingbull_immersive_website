import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { parseArgs } from 'node:util';

const websiteRoot = fileURLToPath(new URL('../', import.meta.url));
// Existing SiteSetting contract used by src/lib/social-links.ts and the admin.
const settingKey = 'social.links';
export const verifiedProfiles = JSON.parse(readFileSync(new URL('./public-profiles.json', import.meta.url), 'utf8'));

export function validateProfile(profile) {
  const rules = {
    techbehemoths: ['techbehemoths.com', /^\/company\/[a-z0-9-]+\/?$/],
    clutch: ['clutch.co', /^\/profile\/[a-z0-9-]+\/?$/],
    goodfirms: ['goodfirms.co', /^\/company\/[a-z0-9-]+\/?$/],
    pinterest: ['pinterest.com', /^\/[a-zA-Z0-9_]+\/?$/],
  };
  const rule = rules[profile.id];
  const url = new URL(profile.url);
  if (!rule || url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash
    || url.hostname.replace(/^www\./, '') !== rule[0] || !rule[1].test(url.pathname)
    || (profile.id === 'pinterest' && /^(settings|business|login|signup|ideas|search|pin|today|home)$/i.test(url.pathname.replaceAll('/', '')))) {
    throw new Error(`Invalid public profile URL for ${profile.id}. Use its HTTPS public company/profile page, not a dashboard or settings page.`);
  }
  return profile;
}

function identity(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname.replace(/^www\./, '')}${parsed.pathname.replace(/\/$/, '')}`;
  } catch { return undefined; }
}

// Additive only. Preserve every existing row, flag, embed and unknown setting field.
export function mergeProfiles(value, profiles) {
  if (value !== null && value !== undefined && (typeof value !== 'object' || Array.isArray(value))) {
    throw new Error('Existing social.links setting is malformed; no changes made. Review it in Admin Settings.');
  }
  const current = value ?? {};
  if (current.links !== undefined && !Array.isArray(current.links)) {
    throw new Error('Existing social.links links must be an array; no changes made.');
  }
  const links = [...(current.links ?? [])];
  const changes = [];
  for (const profile of profiles) {
    validateProfile(profile);
    const byId = links.find((link) => link?.id === profile.id);
    if (byId && identity(byId.url) !== identity(profile.url)) {
      throw new Error(`Existing ${profile.id} has a different URL. Nothing written; review that link in Admin Settings rather than silently replacing it.`);
    }
    const existing = byId ?? links.find((link) => identity(link?.url) === identity(profile.url));
    if (existing) {
      changes.push({ action: 'KEEP', label: profile.label, url: existing.url, note: 'Existing footer/schema visibility flags preserved; check Admin Settings if hidden.' });
      continue;
    }
    links.push({
      id: profile.id, platform: 'other', label: profile.label, url: profile.url,
      enabled: true, showInFooter: true, includeInSameAs: true, order: profile.order,
    });
    changes.push({ action: 'ADD', label: profile.label, url: profile.url });
  }
  return { value: { ...current, links }, changes, changed: changes.some((change) => change.action === 'ADD') };
}

export async function applyProfiles(tx, profiles, dryRun = false) {
  const setting = await tx.siteSetting.findUnique({ where: { key: settingKey } });
  const merged = mergeProfiles(setting?.value, profiles);
  if (!dryRun && merged.changed) {
    await tx.siteSetting.upsert({
      where: { key: settingKey },
      create: { key: settingKey, value: merged.value, description: 'Backend-managed public social profiles and approved social content embeds.' },
      update: { value: merged.value },
    });
  }
  return merged;
}

export async function runCommand(args = process.argv.slice(2)) {
  const { values } = parseArgs({ args, options: {
    'dry-run': { type: 'boolean', default: false },
    list: { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
    pinterest: { type: 'string' },
  } });
  if (values.help) {
    console.log('Usage: npm run addbacklinks -- [--list | --dry-run] [--pinterest https://www.pinterest.com/YOUR_HANDLE/]\n--list: show candidates without a database. --dry-run: preview database changes without writing.\nDefault: add missing profiles to social.links; preserve all existing settings.\nThis updates website profile links, not third-party backlinks.');
    return;
  }
  const profiles = verifiedProfiles.filter((profile) => !values.pinterest || profile.id !== 'pinterest');
  if (values.pinterest) profiles.push({ id: 'pinterest', label: 'Pinterest', url: values.pinterest, order: 130 });
  profiles.forEach(validateProfile);
  if (values.list) {
    console.table(profiles.map(({ label, url }) => ({ label, url })));
    return;
  }

  // Use Next's existing environment loading order, anchored to website/ regardless of cwd.
  const { default: nextEnv } = await import('@next/env');
  nextEnv.loadEnvConfig(websiteRoot, false);
  if (!process.env.DATABASE_URL?.trim()) throw new Error('DATABASE_URL is required. Set the server environment or website/.env.production. Use --list for a database-free preview.');
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const result = await prisma.$transaction((tx) => applyProfiles(tx, profiles, values['dry-run']), { isolationLevel: 'Serializable' });
    console.table(result.changes);
    console.log(values['dry-run'] ? 'Preview only: no database changes.' : result.changed ? 'Public profiles added to social.links.' : 'Already present: no database changes.');
    if (!values['dry-run'] && result.changed) console.log('Rebuild/restart using your existing deployment process to refresh static footer and Organization sameAs content.');
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  runCommand().catch((error) => {
    // Do not log database connection strings or driver diagnostics containing credentials.
    console.error(error?.name?.startsWith('Prisma')
      ? 'Database operation failed; check connection, migrations and permissions. No partial update committed. Retry if a concurrent edit occurred.'
      : error.message);
    process.exitCode = 1;
  });
}
