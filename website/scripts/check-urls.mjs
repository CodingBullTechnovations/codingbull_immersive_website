/**
 * URL + domain guard. Fails the build on the classes of mistake that quietly
 * destroy search visibility:
 *
 *   1. The wrong domain (codingbull.com — missing the "z") anywhere in source.
 *   2. A public page whose canonical is missing, or points somewhere else
 *      (e.g. inheriting the homepage canonical, which de-indexes the page).
 *   3. A canonical that is not the agreed form: https + www + no trailing
 *      slash (root keeps "/"), all lowercase.
 *   4. og:url disagreeing with the canonical.
 *   5. A prerendered page missing from sitemap.xml, or /admin leaking into it.
 *
 * Run after `next build`: node scripts/check-urls.mjs
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, '.next', 'server', 'app');
const SRC_DIR = path.join(ROOT, 'src');
const CANONICAL_ORIGIN = 'https://www.codingbullz.com';

const failures = [];
const fail = (message) => failures.push(message);

async function walk(dir, filter) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full, filter)));
    else if (filter(full)) out.push(full);
  }
  return out;
}

// ---------------------------------------------------------------------------
// 1. Wrong-domain guard (source)
// ---------------------------------------------------------------------------
const sourceFiles = await walk(SRC_DIR, (f) => /\.(ts|tsx|mjs|js|css)$/.test(f));
// codingbull.com NOT followed by the "z" domain — i.e. the dangerous typo.
const wrongDomain = /codingbull\.com/g;
for (const file of sourceFiles) {
  const text = await readFile(file, 'utf8');
  if (wrongDomain.test(text.replace(/codingbullz\.com/g, ''))) {
    fail(`Wrong domain "codingbull.com" (missing z) in ${path.relative(ROOT, file)}`);
  }
  wrongDomain.lastIndex = 0;
}

// ---------------------------------------------------------------------------
// 2-5. Canonical / og:url / sitemap consistency (build output)
// ---------------------------------------------------------------------------
let sitemapUrls = new Set();
try {
  const sitemapBody = await readFile(path.join(APP_DIR, 'sitemap.xml.body'), 'utf8').catch(async () => {
    const alt = await walk(APP_DIR, (f) => f.endsWith('sitemap.xml.body') || f.endsWith('sitemap.xml'));
    return alt.length ? readFile(alt[0], 'utf8') : '';
  });
  sitemapUrls = new Set([...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()));
} catch {
  /* sitemap is generated dynamically in some modes; handled below */
}

const htmlFiles = await walk(APP_DIR, (f) => f.endsWith('.html'));
if (htmlFiles.length === 0) {
  fail('No prerendered HTML found in .next/server/app — run `next build` first.');
}

let checked = 0;
for (const file of htmlFiles) {
  const rel = path.relative(APP_DIR, file).replace(/\.html$/, '');
  if (rel.startsWith('admin')) continue; // admin is noindex by design
  if (rel === '_not-found' || rel.startsWith('_')) continue;

  const html = await readFile(file, 'utf8');
  const route = rel === 'index' ? '/' : `/${rel}`;
  // Next strips trailing slashes from metadata URLs under trailingSlash:false,
  // so the root canonical is the bare origin. Sitemap must match exactly.
  const expected = route === '/' ? CANONICAL_ORIGIN : `${CANONICAL_ORIGIN}${route}`;

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) {
    fail(`${route}: no canonical tag`);
    continue;
  }
  checked += 1;

  if (canonical !== expected) fail(`${route}: canonical is "${canonical}", expected "${expected}"`);
  if (canonical.startsWith('http://')) fail(`${route}: canonical uses http://`);
  if (!canonical.startsWith(CANONICAL_ORIGIN)) {
    fail(`${route}: canonical is not on ${CANONICAL_ORIGIN}`);
  }
  if (canonical !== canonical.toLowerCase()) fail(`${route}: canonical contains uppercase`);
  if (route !== '/' && canonical.endsWith('/')) fail(`${route}: canonical has a trailing slash`);

  const ogUrl = html.match(/property="og:url" content="([^"]+)"/)?.[1];
  if (ogUrl && ogUrl !== canonical) {
    fail(`${route}: og:url "${ogUrl}" does not match canonical "${canonical}"`);
  }

  if (sitemapUrls.size > 0 && !sitemapUrls.has(canonical)) {
    fail(`${route}: canonical "${canonical}" is missing from sitemap.xml`);
  }
}

for (const url of sitemapUrls) {
  if (url.includes('/admin')) fail(`sitemap.xml contains an admin URL: ${url}`);
  if (url.startsWith('http://')) fail(`sitemap.xml contains an http:// URL: ${url}`);
}

if (failures.length > 0) {
  console.error(`\n✖ URL guard failed (${failures.length} problem${failures.length > 1 ? 's' : ''}):\n`);
  for (const message of failures) console.error(`  - ${message}`);
  console.error('');
  process.exit(1);
}

console.log(`✓ URL guard passed — ${checked} routes, ${sitemapUrls.size} sitemap entries, canonical origin ${CANONICAL_ORIGIN}`);
