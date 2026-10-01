/** Exercise CMS precedence and draft suppression without connecting to a database. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
let dbPost = null;
const none = () => null;
const publicContent = {
  getInsightBySlug: async () => dbPost,
  listInsightSlugStatuses: async () => dbPost ? [dbPost] : [],
  listVisibleCaseStudyStatuses: async () => [],
  listServiceSlugStatuses: async () => [],
  isCaseStudyPubliclyVisible: () => true,
};
const mocks = {
  'next/navigation': { notFound: () => { throw new Error('NOT_FOUND'); } },
  'next/link': { default: ({ children, href, ...props }) => React.createElement('a', { href, ...props }, children) },
  '@/components/sections/PageHero': { PageHero: none },
  '@/components/sections/CTASection': {
    CTASection: (props) => React.createElement('div', { 'data-cta': JSON.stringify(props) }),
  },
  '@/components/sections/InsightSidebar': { InsightSidebar: none },
  '@/components/sections/ReadingProgressBar': { ReadingProgressBar: none },
  '@/components/sections/RelatedLinksRail': { RelatedLinksRail: none },
  '@/components/sections/CodeBlock': { CodeBlock: none },
  '@/lib/schema': {
    JsonLd: none, generateArticleSchema: () => ({}), generateBreadcrumbSchema: () => ({}),
  },
  '@/lib/server/public-content': publicContent,
  '@/lib/server/sidebar-config': { getInsightSidebarConfigForSlug: async () => ({}) },
};
const loaded = new Map();
function load(name) {
  if (Object.hasOwn(mocks, name)) return mocks[name];
  if (!name.startsWith('@/')) return require(name);
  if (loaded.has(name)) return loaded.get(name);
  const base = path.resolve('src', name.slice(2));
  const file = ['.ts', '.tsx'].map((extension) => base + extension).find((candidate) => fs.existsSync(candidate));
  assert.ok(file, `Missing source module: ${name}`);
  const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    fileName: file,
  }).outputText;
  const loadedModule = { exports: {} };
  loaded.set(name, loadedModule.exports);
  vm.runInNewContext(output, { exports: loadedModule.exports, module: loadedModule, require: load, process, console, URL, Date }, { filename: file });
  return loadedModule.exports;
}

const article = load('@/app/(public)/insights/[slug]/page');
const conversion = load('@/content/insight-conversion');
const slug = 'patient-appointment-booking-system-architecture';
const props = { params: Promise.resolve({ slug }) };
for (const unknown of ['constructor', '__proto__', 'toString', 'unconfigured-article']) {
  assert.equal(conversion.getInsightConversion(unknown), undefined);
}

dbPost = {
  slug, status: 'PUBLISHED', title: 'CMS-owned title', excerpt: 'CMS-owned excerpt',
  body: '## CMS-owned workflow\n\nExisting administrator-authored body must survive.',
  author: 'CMS author', niche: 'HEALTHCARE', publishedAt: new Date('2026-05-27'),
  createdAt: new Date('2026-05-27'), contentUpdatedAt: new Date('2026-09-15'),
  metaTitle: 'CMS SEO title', metaDescription: 'CMS SEO description', canonicalPath: `/insights/${slug}`,
};
const metadata = await article.generateMetadata(props);
assert.equal(metadata.title, 'CMS SEO title | CodingBull Technovations');
assert.equal(metadata.description, dbPost.metaDescription);
assert.equal(metadata.openGraph.type, 'article');
assert.equal(metadata.openGraph.modifiedTime, '2026-10-01');
assert.equal(metadata.openGraph.authors[0], 'CMS author');
assert.equal(metadata.alternates.canonical, `https://www.codingbullz.com/insights/${slug}`);
const html = renderToStaticMarkup(await article.default(props));
assert.ok(html.includes('Existing administrator-authored body must survive.'));
assert.ok(html.includes('Before commissioning a booking system'));
assert.ok(html.includes('insight_appointment_contact'));

const sitemap = load('@/app/sitemap').default;
let urls = await sitemap();
let entry = urls.find((item) => item.url.endsWith(`/insights/${slug}`));
assert.equal(entry.lastModified.toISOString(), '2026-10-01T00:00:00.000Z');
dbPost.contentUpdatedAt = new Date('2026-10-02');
assert.equal((await article.generateMetadata(props)).openGraph.modifiedTime, '2026-10-02');
assert.equal((await sitemap()).find((item) => item.url.endsWith(`/insights/${slug}`)).lastModified.toISOString(), '2026-10-02T00:00:00.000Z');

dbPost.status = 'DRAFT';
await assert.rejects(article.default(props), /NOT_FOUND/);
assert.equal((await article.generateMetadata(props)).title, 'Post Not Found');
assert.ok(!(await article.generateStaticParams()).some((item) => item.slug === slug));
urls = await sitemap();
assert.ok(!urls.some((item) => item.url.endsWith(`/insights/${slug}`)));

dbPost = null;
for (const unknown of ['constructor', '__proto__', 'toString']) {
  const unknownProps = { params: Promise.resolve({ slug: unknown }) };
  await assert.rejects(article.default(unknownProps), /NOT_FOUND/);
  assert.equal((await article.generateMetadata(unknownProps)).title, 'Post Not Found');
}
const otherProps = { params: Promise.resolve({ slug: 'custom-ecommerce-inventory-order-automation' }) };
const unchanged = renderToStaticMarkup(await article.default(otherProps));
assert.ok(!unchanged.includes('Before commissioning a booking system'));
assert.ok(!unchanged.includes('insight_appointment_contact'));
assert.equal((await article.generateMetadata(otherProps)).openGraph.modifiedTime, undefined);
console.log('✓ insight CMS: admin body/SEO preserved; drafts hidden; supplement dates consistent; other articles retain default CTA');
