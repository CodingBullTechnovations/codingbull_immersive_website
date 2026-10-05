/** Exercise actual Google import code with isolated API and storage boundaries. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
let values, requests, statuses, credentials, imports, responses;
function reset(overrides = {}, replies = [{ access_token: 'test-token' }, { rows: [] }]) {
  values = { client_id: 'test-client', client_secret: 'test-secret', refresh_token: 'test-refresh', site_url: ' SC-DOMAIN:CODINGBULLZ.COM ', property_id: ' properties/12345 ', ...overrides };
  requests = []; statuses = []; credentials = []; imports = []; responses = [...replies];
}
const mocks = {
  '@/lib/server/credentials': {
    getIntegrationValue: async (_provider, key) => values[key] ?? '',
    upsertCredential: async (data) => credentials.push(data),
  },
  '@/lib/server/prisma': { prisma: {
    seoSyncStatus: { upsert: async (data) => statuses.push(data) },
    searchPerformanceDaily: { upsert: async (data) => imports.push(data) },
    ga4LandingPageDaily: { upsert: async (data) => imports.push(data) },
  } },
};
const loaded = new Map();
function load(name) {
  if (Object.hasOwn(mocks, name)) return mocks[name];
  if (!name.startsWith('@/')) return require(name);
  if (loaded.has(name)) return loaded.get(name);
  const file = path.resolve('src', name.slice(2) + (name.endsWith('.mjs') ? '' : '.ts'));
  const loadedModule = { exports: {} };
  loaded.set(name, loadedModule.exports);
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(output, {
    exports: loadedModule.exports, module: loadedModule, require: load, process, console, URL, URLSearchParams, Date, Error,
    fetch: async (url, options) => {
      requests.push({ url, options });
      assert.ok(responses.length, 'Unexpected API request');
      const reply = responses.shift();
      if (reply instanceof Error) throw reply;
      if (reply.unreadable) return { ok: false, status: 502, json: async () => { throw new Error('Invalid JSON'); } };
      return { ok: !reply.error, status: reply.error ? 400 : 200, json: async () => reply };
    },
  }, { filename: file });
  return loadedModule.exports;
}
const sync = load('@/lib/server/seo-sync');
reset({}, [{ access_token: 'test-token' }, { rows: [{ keys: ['clinic', 'https://www.codingbullz.com/services/clinic', 'ind', 'mobile'], clicks: 1, impressions: 10 }] }]);
assert.equal((await sync.runSearchConsoleSync({ days: 1 })).rowsImported, 1);
assert.ok(requests[1].url.includes('sc-domain%3Acodingbullz.com'));
assert.equal(imports.length, 1);
assert.equal(statuses.at(-1).update.lastError, null);
assert.equal(credentials.at(-1).value, 'sc-domain:codingbullz.com');
assert.equal(credentials.at(-1).status, 'VERIFIED');
reset({ site_url: ' https://www.codingbullz.com ' });
await sync.runSearchConsoleSync({ days: 1 });
assert.ok(requests[1].url.includes(encodeURIComponent('https://www.codingbullz.com/')));
reset({}, [{ access_token: 'test-token' }, { rows: [{ dimensionValues: [{ value: '20261004' }, { value: '/contact' }, { value: 'linkedin.com' }, { value: 'social' }], metricValues: [{ value: '5' }, { value: '3' }, { value: '4' }, { value: '2' }] }] }]);
await sync.runGa4Sync({ days: 1 });
assert.equal(imports[0].create.conversions, 2, 'Key event count must persist in the existing reporting field');
assert.ok(requests[1].url.includes('properties/12345:runReport'));
assert.equal(JSON.parse(requests[1].options.body).metrics.at(-1).name, 'keyEvents');
assert.equal(credentials.at(-1).value, '12345');
for (const [key, value, run] of [
  ['site_url', 'https://wrong.example/', sync.runSearchConsoleSync],
  ['property_id', 'G-123456', sync.runGa4Sync],
]) {
  reset({ [key]: value });
  await assert.rejects(run({ days: 1 }), /configuration:/);
  assert.equal(requests.length, 0, 'Invalid properties must fail before authentication');
  assert.equal(credentials.at(-1).status, 'ERROR');
}
reset({}, [{ error: 'invalid_grant', error_description: 'Token expired' }]);
await assert.rejects(sync.runSearchConsoleSync({ days: 1 }), /Google OAuth token refresh: HTTP 400; Token expired/);
assert.equal(imports.length, 0);
assert.equal(requests.length, 1);
assert.ok(statuses.at(-1).update.lastError.includes('Google OAuth token refresh'));
reset({}, [{}]);
await assert.rejects(sync.runGa4Sync(), /did not contain an access token/);
reset({}, [new Error('network failure')]);
await assert.rejects(sync.runGa4Sync(), /Google OAuth token refresh: network request failed/);
for (const [run, expected] of [[sync.runSearchConsoleSync, /Search Console query .*HTTP 400; Permission denied/], [sync.runGa4Sync, /GA4 report .*HTTP 400; Permission denied/]]) {
  reset({}, [{ access_token: 'test-token' }, { error: { message: 'Permission denied' } }]);
  await assert.rejects(run({ days: 1 }), expected);
  assert.equal(imports.length, 0);
  for (const secret of ['test-token', 'test-refresh', 'test-secret']) {
    assert.ok(!JSON.stringify({ statuses, credentials }).includes(secret));
  }
}
reset({}, [{ unreadable: true }]);
await assert.rejects(sync.runGa4Sync(), /Google OAuth token refresh: HTTP 502; Google returned an unreadable response/);
reset({}, [{ access_token: 'test-token' }, { rows: [{ keys: ['clinic', 'https://www.codingbullz.com/', 'ind', 'mobile'] }] }, { error: { message: 'Second day failed' } }]);
await assert.rejects(sync.runSearchConsoleSync({ days: 2 }), /Search Console query .*Second day failed/);
assert.equal(imports.length, 1, 'Completed days remain imported for an idempotent retry');
assert.ok(statuses.every((item) => !item.update.lastSuccessfulAt), 'Partial failure must not record full-run success');
assert.equal(credentials.at(-1).status, 'ERROR');
// Execute the actual CLI entry point with fake Prisma, env and network.
async function runCli(replies, days = '1', overrides = {}) {
  reset(overrides, replies);
  const fakeProcess = { argv: ['node', 'sync-seo.mjs', `--days=${days}`], env: {
    GOOGLE_CLIENT_ID: values.client_id, GOOGLE_CLIENT_SECRET: values.client_secret,
    GOOGLE_REFRESH_TOKEN: values.refresh_token, GOOGLE_SEARCH_CONSOLE_SITE_URL: values.site_url,
    GA4_PROPERTY_ID: values.property_id,
  }, exitCode: 0 };
  let disconnected = false;
  const output = [];
  const fakeStorage = {
    ...mocks['@/lib/server/prisma'].prisma,
    integrationCredential: { findUnique: async () => null },
    $disconnect: async () => { disconnected = true; },
  };
  const file = path.resolve('prisma/sync-seo.mjs');
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  await vm.runInNewContext(`(async () => { ${compiled} })()`, {
    exports: {}, process: fakeProcess, URL, URLSearchParams, Date, Error,
    console: { log: (text) => output.push(text), error: (text) => output.push(text) },
    require: (name) => name === '@prisma/client'
      ? { PrismaClient: class { constructor() { return fakeStorage; } } }
      : name === '../src/lib/google-sync-protocol.mjs'
        ? load('@/lib/google-sync-protocol.mjs') : require(name),
  }, { filename: file });
  assert.equal(disconnected, true);
  return { exitCode: fakeProcess.exitCode, output };
}
let cli = await runCli([{ access_token: 'test-token' }, { error: { message: 'Query rejected' } }, { access_token: 'test-token' }, { rows: [] }]);
assert.equal(cli.exitCode, 1);
assert.ok(statuses.some((item) => item.where.provider === 'SEARCH_CONSOLE' && item.update.lastError?.includes('Search Console query')));
assert.ok(statuses.some((item) => item.where.provider === 'GA4' && item.update.lastSuccessfulAt), 'GA4 must run after Search Console failure');
assert.ok(requests[3].url.includes('properties/12345:runReport'));
assert.equal(JSON.parse(requests[3].options.body).metrics.at(-1).name, 'keyEvents');
cli = await runCli([{ access_token: 'test-token' }, { rows: [] }, { access_token: 'test-token' }, { rows: [] }]);
assert.equal(cli.exitCode, 0);
assert.ok(requests[1].url.includes('sc-domain%3Acodingbullz.com'));
assert.equal(statuses.filter((item) => item.update.lastSuccessfulAt).length, 2);
cli = await runCli([], 'NaN');
assert.equal(cli.exitCode, 1);
assert.equal(requests.length, 0);
assert.equal(statuses.length, 0);
console.log('Google sync checks passed: normalization, invalid configuration, token/report failures, status updates, and import success. No real API or database writes.');
