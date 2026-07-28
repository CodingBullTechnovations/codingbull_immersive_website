import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const registryPath = path.join(root, 'src', 'config', 'legacy-redirects.json');
const registrySource = await readFile(registryPath, 'utf8');
const redirects = JSON.parse(registrySource);
const failures = [];

const sourceMatches = [...registrySource.matchAll(/^\s*"([^"]+)"\s*:/gm)].map((match) => match[1]);
if (new Set(sourceMatches).size !== sourceMatches.length) failures.push('legacy redirect registry contains a duplicate source key');

for (const [source, destination] of Object.entries(redirects)) {
  if (!source.startsWith('/') || !destination.startsWith('/')) failures.push(`${source}: source and destination must be root-relative paths`);
  if (source !== source.toLowerCase() || destination !== destination.toLowerCase()) failures.push(`${source}: paths must be lowercase`);
  if (source !== '/' && source.endsWith('/')) failures.push(`${source}: source must not have a trailing slash`);
  if (destination !== '/' && destination.endsWith('/')) failures.push(`${source}: destination must not have a trailing slash`);
  if (source === destination) failures.push(`${source}: redirect points to itself`);
  if (Object.hasOwn(redirects, destination)) failures.push(`${source}: destination ${destination} creates a redirect chain`);
}

const [nextConfig, proxy, nginxMap] = await Promise.all([
  readFile(path.join(root, 'next.config.ts'), 'utf8'),
  readFile(path.join(root, 'src', 'proxy.ts'), 'utf8'),
  readFile(path.join(root, 'deployment', 'nginx-legacy-redirect-map.conf'), 'utf8'),
]);

if (!nextConfig.includes("import legacyRedirects from './src/config/legacy-redirects.json'")) failures.push('next.config.ts does not consume the shared redirect registry');
if (!proxy.includes("import legacyRedirects from '@/config/legacy-redirects.json'")) failures.push('src/proxy.ts does not consume the shared redirect registry');
for (const [source, destination] of Object.entries(redirects)) {
  if (!nginxMap.includes(`    ${source} ${destination};`)) failures.push(`generated Nginx map is missing ${source} → ${destination}`);
}

if (failures.length) {
  console.error(`Redirect guard failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log(`✓ redirect registry passed — ${Object.keys(redirects).length} one-hop legacy paths`);
