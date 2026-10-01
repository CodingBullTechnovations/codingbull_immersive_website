/** Execute the actual handlers with in-memory storage; no database or email writes. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const prismaTypes = require('@prisma/client');
const events = [];
const leads = new Map();
const activities = [];
const metrics = [];
const notifications = [];
const tx = {
  analyticsEvent: { create: async ({ data }) => { events.push(data); return data; } },
  pageMetricDaily: { upsert: async (data) => { metrics.push(data); } },
  leadActivity: { create: async ({ data }) => { activities.push(data); } },
  lead: {
    create: async ({ data }) => {
      if (leads.has(data.submissionId)) {
        throw new prismaTypes.Prisma.PrismaClientKnownRequestError('Duplicate submission', {
          code: 'P2002', clientVersion: 'test',
        });
      }
      const lead = { ...data, id: `lead-${leads.size + 1}` };
      leads.set(data.submissionId, lead);
      return lead;
    },
  },
};
const storage = {
  $transaction: async (callback) => callback(tx),
  lead: { findUnique: async ({ where }) => leads.get(where.submissionId) },
  siteSetting: { upsert: async () => { throw new Error('Unexpected analytics error'); } },
};

function loadSource(relativePath, overrides = {}) {
  const file = path.resolve('src', relativePath);
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: file,
  }).outputText;
  const loadedModule = { exports: {} };
  const mocks = {
    '@/lib/server/prisma': { prisma: storage },
    '@/lib/server/crypto': { getClientIp: () => null, hashValue: () => null },
    '@/lib/server/visitor-attribution': { upsertVisitorAttribution: async () => 'test-session' },
    '@/lib/industry': loadIndustry(),
    ...overrides,
  };
  vm.runInNewContext(output, {
    exports: loadedModule.exports, module: loadedModule, console, Date,
    require: (name) => Object.hasOwn(mocks, name) ? mocks[name] : require(name),
  }, { filename: file });
  return loadedModule.exports;
}

function loadIndustry() {
  const file = path.resolve('src/lib/industry.ts');
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loadedModule = { exports: {} };
  vm.runInNewContext(output, { exports: loadedModule.exports, module: loadedModule, require, URL });
  return loadedModule.exports;
}

const { POST } = loadSource('app/api/analytics/events/route.ts');
const request = (payload) => new Request('http://localhost/api/analytics/events', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
});

for (const name of ['form_submit', 'constructor', '__proto__', 'unknown_event']) {
  const response = await POST(request({ name, page: '/contact' }));
  assert.equal(response.status, 200);
}
assert.equal(events.length, 0, 'Public conversion events must not enter analytics storage');
assert.equal(metrics.length, 0, 'Public conversion events must not increment daily totals');
assert.equal((await POST(request({ name: 42 }))).status, 400);
assert.equal(events.length, 0);

for (const name of ['page_view', 'cta_click', 'whatsapp_click', 'form_start', 'phone_click', 'email_click']) {
  assert.equal((await POST(request({ name, page: '/insights/example' }))).status, 200);
}
assert.equal(events.length, 6, 'Existing browser event types remain available');
assert.equal(events.filter((event) => event.type === prismaTypes.AnalyticsEventType.FORM_SUBMIT).length, 0);
assert.equal(metrics.reduce((sum, metric) => sum + metric.create.formSubmits, 0), 0);
assert.equal(metrics.reduce((sum, metric) => sum + metric.create.whatsappClicks, 0), 1);

const { createLeadFromContactForm } = loadSource('lib/server/leads.ts', {
  '@/lib/server/lead-scoring': { scoreLead: () => 0 },
  '@/lib/server/email': { sendLeadNotification: async (lead) => { notifications.push(lead.id); } },
});
// Simulate an article campaign landing followed by a contact-page navigation.
const sessionStorage = new Map();
const browser = {
  location: { pathname: '/insights/patient-appointment-booking-system-architecture', hostname: 'www.codingbullz.com', search: '?utm_source=linkedin&utm_medium=social&utm_campaign=clinic_workflow_test' },
  sessionStorage: { getItem: (key) => sessionStorage.get(key), setItem: (key, value) => sessionStorage.set(key, value) },
};
const browserDocument = { referrer: 'https://www.linkedin.com/feed/' };
const acquisitionFile = path.resolve('src/lib/acquisition-attribution.ts');
const acquisitionModule = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync(acquisitionFile, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { module: acquisitionModule, exports: acquisitionModule.exports, window: browser, document: browserDocument, URL, URLSearchParams });
const initial = acquisitionModule.exports.getSessionAcquisition();
browser.location = { ...browser.location, pathname: '/contact', search: '' };
browserDocument.referrer = 'https://www.codingbullz.com/insights/patient-appointment-booking-system-architecture';
const retained = acquisitionModule.exports.getSessionAcquisition();
assert.equal(retained.utmCampaign, initial.utmCampaign);
assert.equal(retained.referrer, initial.referrer);
assert.equal(retained.landingPage, initial.landingPage);
const formSource = fs.readFileSync('src/components/sections/ContactForm.tsx', 'utf8');
assert.ok(formSource.includes("setValue('landingPage', attribution.landingPage)"));
assert.ok(!formSource.includes("params.get('utm_source')"));
const data = {
  submissionId: 'isolated-test-submission', name: 'Test Operator', email: 'test@example.invalid',
  phone: '+0000000000', service: 'healthcare', message: 'Scheduling workflow test only',
  ...retained, sourcePage: '/contact',
};
const first = await createLeadFromContactForm(data, {});
const replay = await createLeadFromContactForm(data, {});
assert.equal(first.created, true);
assert.equal(replay.created, false);
assert.equal(first.lead.id, replay.lead.id);
assert.equal(leads.size, 1);
assert.equal(activities.length, 1);
assert.equal(notifications.length, 1);
const submissions = events.filter((event) => event.type === prismaTypes.AnalyticsEventType.FORM_SUBMIT);
assert.equal(submissions.length, 1);
assert.equal(submissions[0].metadata.leadId, first.lead.id);
assert.equal(submissions[0].utmCampaign, data.utmCampaign);
assert.equal(submissions[0].landingPage, initial.landingPage);
assert.equal(submissions[0].trafficChannel, 'SOCIAL');
sessionStorage.clear();
assert.equal(acquisitionModule.exports.getSessionAcquisition().referrer, '', 'Internal referrers are not acquisition sources');
assert.equal(metrics.filter((metric) => metric.create.formSubmits === 1).length, 1);
const direct = await createLeadFromContactForm({ ...data, submissionId: 'direct-test-submission', referrer: '', utmSource: '', utmMedium: '', utmCampaign: '' }, { referrer: 'https://www.codingbullz.com/contact' });
const directEvent = events.find((event) => event.metadata?.leadId === direct.lead.id);
assert.equal(directEvent.trafficChannel, 'DIRECT');
assert.equal(directEvent.referrer, '');
assert.equal(loadIndustry().getTrafficChannel('https://www.codingbullz.com/contact'), 'DIRECT');
sessionStorage.clear();
browserDocument.referrer = 'https://external.example/' + 'a'.repeat(600);
assert.equal(acquisitionModule.exports.getSessionAcquisition().referrer.length, 500);
console.log('✓ enquiry tracking: forged events ignored; clicks preserved; saved leads counted once with attribution');
