'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ContentStatus, PermissionStatus, SeoIndustry, ServiceInterest } from '@prisma/client';
import { z } from 'zod';
import { requireAdmin } from '@/lib/server/authz';
import { prisma } from '@/lib/server/prisma';
import { writeAuditLog } from '@/lib/server/audit';

const slugSchema = z.string().trim().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens.');
const statusSchema = z.nativeEnum(ContentStatus);
const nicheSchema = z.nativeEnum(ServiceInterest);
const permissionSchema = z.nativeEnum(PermissionStatus);
const seoIndustrySchema = z.nativeEnum(SeoIndustry);

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function optionalValue(formData: FormData, key: string) {
  const text = value(formData, key);
  return text || null;
}

function numberValue(formData: FormData, key: string) {
  const raw = value(formData, key);
  return raw ? Number(raw) : 0;
}

function lines(raw: string) {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function pairs(raw: string, leftKey: string, rightKey: string) {
  return lines(raw).map((line) => {
    const [left, ...rightParts] = line.split('|');
    return {
      [leftKey]: left.trim(),
      [rightKey]: rightParts.join('|').trim(),
    };
  });
}

function tags(raw: string) {
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function publishedAt(status: ContentStatus, existing?: Date | null) {
  if (status !== 'PUBLISHED') return null;
  return existing ?? new Date();
}

async function updateContentStatus(entityType: string, id: string, status: ContentStatus) {
  switch (entityType) {
    case 'ServicePage':
      return prisma.servicePage.update({ where: { id }, data: { status, publishedAt: status === 'PUBLISHED' ? new Date() : null } });
    case 'InsightPost':
      return prisma.insightPost.update({ where: { id }, data: { status, publishedAt: status === 'PUBLISHED' ? new Date() : null } });
    case 'CaseStudy':
      return prisma.caseStudy.update({ where: { id }, data: { status, publishedAt: status === 'PUBLISHED' ? new Date() : null } });
    case 'FAQ':
      return prisma.fAQ.update({ where: { id }, data: { status } });
    case 'Testimonial':
      return prisma.testimonial.update({ where: { id }, data: { status } });
    default:
      throw new Error('Unsupported content type.');
  }
}

function revalidateContentList(entityType: string) {
  const paths: Record<string, string> = {
    ServicePage: '/admin/content/services',
    InsightPost: '/admin/content/insights',
    CaseStudy: '/admin/content/case-studies',
    FAQ: '/admin/content/faqs',
    Testimonial: '/admin/content/testimonials',
  };
  const publicPaths: Record<string, string> = {
    ServicePage: '/services',
    InsightPost: '/insights',
    CaseStudy: '/case-studies',
  };

  revalidatePath(paths[entityType] ?? '/admin/content');
  if (publicPaths[entityType]) {
    revalidatePath(publicPaths[entityType]);
  }
}

export async function archiveContentAction(formData: FormData) {
  const session = await requireAdmin('EDITOR');
  const entityType = z.enum(['ServicePage', 'InsightPost', 'CaseStudy', 'FAQ', 'Testimonial']).parse(value(formData, 'entityType'));
  const id = z.string().min(5).parse(value(formData, 'id'));
  const confirmation = value(formData, 'confirmation');

  if (confirmation !== 'ARCHIVE') {
    throw new Error('Type ARCHIVE to archive this content.');
  }

  const saved = await updateContentStatus(entityType, id, ContentStatus.ARCHIVED);

  await writeAuditLog({
    actorId: session.user.id,
    action: 'content.archive',
    entityType,
    entityId: id,
    afterSummary: { status: 'ARCHIVED' },
  });

  revalidateContentList(entityType);
  if ('slug' in saved && typeof saved.slug === 'string') {
    revalidatePath(`/services/${saved.slug}`);
    revalidatePath(`/insights/${saved.slug}`);
    revalidatePath(`/case-studies/${saved.slug}`);
  }
}

export async function restoreContentAction(formData: FormData) {
  const session = await requireAdmin('EDITOR');
  const entityType = z.enum(['ServicePage', 'InsightPost', 'CaseStudy', 'FAQ', 'Testimonial']).parse(value(formData, 'entityType'));
  const id = z.string().min(5).parse(value(formData, 'id'));
  const saved = await updateContentStatus(entityType, id, ContentStatus.DRAFT);

  await writeAuditLog({
    actorId: session.user.id,
    action: 'content.restore_draft',
    entityType,
    entityId: id,
    afterSummary: { status: 'DRAFT' },
  });

  revalidateContentList(entityType);
  if ('slug' in saved && typeof saved.slug === 'string') {
    revalidatePath(`/services/${saved.slug}`);
    revalidatePath(`/insights/${saved.slug}`);
    revalidatePath(`/case-studies/${saved.slug}`);
  }
}

export async function saveServicePageAction(formData: FormData) {
  const session = await requireAdmin('EDITOR');
  const id = optionalValue(formData, 'id');
  const status = statusSchema.parse(value(formData, 'status'));
  const slug = slugSchema.parse(value(formData, 'slug'));
  const existing = id ? await prisma.servicePage.findUnique({ where: { id } }) : null;

  const data = {
    slug,
    title: z.string().min(3).parse(value(formData, 'title')),
    metaTitle: optionalValue(formData, 'metaTitle'),
    metaDescription: optionalValue(formData, 'metaDescription'),
    body: optionalValue(formData, 'body'),
    niche: nicheSchema.parse(value(formData, 'niche')),
    hero: {
      headline: value(formData, 'heroHeadline'),
      summary: value(formData, 'heroSummary'),
    },
    painPoints: lines(value(formData, 'painPoints')),
    modules: pairs(value(formData, 'modules'), 'title', 'description'),
    faqs: pairs(value(formData, 'faqs'), 'question', 'answer'),
    seoPrimaryKeyword: optionalValue(formData, 'seoPrimaryKeyword'),
    seoSecondaryKeywords: tags(value(formData, 'seoSecondaryKeywords')),
    seoSearchIntent: optionalValue(formData, 'seoSearchIntent'),
    seoFunnelStage: optionalValue(formData, 'seoFunnelStage'),
    seoIndustry: seoIndustrySchema.parse(value(formData, 'seoIndustry')),
    canonicalPath: optionalValue(formData, 'canonicalPath'),
    internalLinkTargets: lines(value(formData, 'internalLinkTargets')),
    status,
    publishedAt: publishedAt(status, existing?.publishedAt),
  };

  const saved = id
    ? await prisma.servicePage.update({ where: { id }, data })
    : await prisma.servicePage.create({ data });

  await writeAuditLog({
    actorId: session.user.id,
    action: id ? 'service.update' : 'service.create',
    entityType: 'ServicePage',
    entityId: saved.id,
    afterSummary: { slug: saved.slug, status: saved.status },
  });

  revalidatePath('/admin/content/services');
  revalidatePath('/services');
  revalidatePath(`/services/${saved.slug}`);
  if (existing?.slug && existing.slug !== saved.slug) {
    revalidatePath(`/services/${existing.slug}`);
  }
  redirect(`/admin/content/services/${saved.id}`);
}

export async function saveInsightPostAction(formData: FormData) {
  const session = await requireAdmin('EDITOR');
  const id = optionalValue(formData, 'id');
  const status = statusSchema.parse(value(formData, 'status'));
  const existing = id ? await prisma.insightPost.findUnique({ where: { id } }) : null;

  const data = {
    slug: slugSchema.parse(value(formData, 'slug')),
    title: z.string().min(3).parse(value(formData, 'title')),
    metaTitle: optionalValue(formData, 'metaTitle'),
    metaDescription: optionalValue(formData, 'metaDescription'),
    excerpt: z.string().min(20).parse(value(formData, 'excerpt')),
    body: z.string().min(80).parse(value(formData, 'body')),
    author: z.string().min(2).parse(value(formData, 'author')),
    niche: nicheSchema.parse(value(formData, 'niche')),
    tags: tags(value(formData, 'tags')),
    seoPrimaryKeyword: optionalValue(formData, 'seoPrimaryKeyword'),
    seoSecondaryKeywords: tags(value(formData, 'seoSecondaryKeywords')),
    seoSearchIntent: optionalValue(formData, 'seoSearchIntent'),
    seoFunnelStage: optionalValue(formData, 'seoFunnelStage'),
    seoIndustry: seoIndustrySchema.parse(value(formData, 'seoIndustry')),
    canonicalPath: optionalValue(formData, 'canonicalPath'),
    internalLinkTargets: lines(value(formData, 'internalLinkTargets')),
    status,
    publishedAt: publishedAt(status, existing?.publishedAt),
  };

  const saved = id
    ? await prisma.insightPost.update({ where: { id }, data })
    : await prisma.insightPost.create({ data });

  await writeAuditLog({
    actorId: session.user.id,
    action: id ? 'insight.update' : 'insight.create',
    entityType: 'InsightPost',
    entityId: saved.id,
    afterSummary: { slug: saved.slug, status: saved.status },
  });

  revalidatePath('/admin/content/insights');
  revalidatePath('/insights');
  revalidatePath(`/insights/${saved.slug}`);
  if (existing?.slug && existing.slug !== saved.slug) {
    revalidatePath(`/insights/${existing.slug}`);
  }
  redirect(`/admin/content/insights/${saved.id}`);
}

export async function saveCaseStudyAction(formData: FormData) {
  const session = await requireAdmin('EDITOR');
  const id = optionalValue(formData, 'id');
  const status = statusSchema.parse(value(formData, 'status'));
  const existing = id ? await prisma.caseStudy.findUnique({ where: { id } }) : null;

  const data = {
    slug: slugSchema.parse(value(formData, 'slug')),
    client: z.string().min(2).parse(value(formData, 'client')),
    industry: z.string().min(2).parse(value(formData, 'industry')),
    title: z.string().min(3).parse(value(formData, 'title')),
    problem: z.string().min(20).parse(value(formData, 'problem')),
    constraints: optionalValue(formData, 'constraints'),
    solution: z.string().min(20).parse(value(formData, 'solution')),
    architecture: pairs(value(formData, 'architecture'), 'title', 'description'),
    outcomes: z.string().min(20).parse(value(formData, 'outcomes')),
    metrics: pairs(value(formData, 'metrics'), 'label', 'value'),
    seoPrimaryKeyword: optionalValue(formData, 'seoPrimaryKeyword'),
    seoSecondaryKeywords: tags(value(formData, 'seoSecondaryKeywords')),
    seoSearchIntent: optionalValue(formData, 'seoSearchIntent'),
    seoFunnelStage: optionalValue(formData, 'seoFunnelStage'),
    seoIndustry: seoIndustrySchema.parse(value(formData, 'seoIndustry')),
    canonicalPath: optionalValue(formData, 'canonicalPath'),
    internalLinkTargets: lines(value(formData, 'internalLinkTargets')),
    permissionStatus: permissionSchema.parse(value(formData, 'permissionStatus')),
    status,
    publishedAt: publishedAt(status, existing?.publishedAt),
  };

  const saved = id
    ? await prisma.caseStudy.update({ where: { id }, data })
    : await prisma.caseStudy.create({ data });

  await writeAuditLog({
    actorId: session.user.id,
    action: id ? 'caseStudy.update' : 'caseStudy.create',
    entityType: 'CaseStudy',
    entityId: saved.id,
    afterSummary: { slug: saved.slug, status: saved.status, permissionStatus: saved.permissionStatus },
  });

  revalidatePath('/admin/content/case-studies');
  revalidatePath('/case-studies');
  revalidatePath(`/case-studies/${saved.slug}`);
  if (existing?.slug && existing.slug !== saved.slug) {
    revalidatePath(`/case-studies/${existing.slug}`);
  }
  redirect(`/admin/content/case-studies/${saved.id}`);
}

export async function saveTestimonialAction(formData: FormData) {
  const session = await requireAdmin('EDITOR');
  const id = optionalValue(formData, 'id');
  const status = statusSchema.parse(value(formData, 'status'));

  const data = {
    person: z.string().min(2).parse(value(formData, 'person')),
    role: optionalValue(formData, 'role'),
    company: z.string().min(2).parse(value(formData, 'company')),
    quote: z.string().min(20).parse(value(formData, 'quote')),
    niche: optionalValue(formData, 'niche') ? nicheSchema.parse(value(formData, 'niche')) : null,
    permissionStatus: permissionSchema.parse(value(formData, 'permissionStatus')),
    status,
    order: numberValue(formData, 'order'),
  };

  const saved = id
    ? await prisma.testimonial.update({ where: { id }, data })
    : await prisma.testimonial.create({ data });

  await writeAuditLog({
    actorId: session.user.id,
    action: id ? 'testimonial.update' : 'testimonial.create',
    entityType: 'Testimonial',
    entityId: saved.id,
    afterSummary: { company: saved.company, status: saved.status },
  });

  revalidatePath('/admin/content/testimonials');
  redirect(`/admin/content/testimonials/${saved.id}`);
}

export async function saveFaqAction(formData: FormData) {
  const session = await requireAdmin('EDITOR');
  const id = optionalValue(formData, 'id');

  const data = {
    question: z.string().min(8).parse(value(formData, 'question')),
    answer: z.string().min(20).parse(value(formData, 'answer')),
    niche: optionalValue(formData, 'niche') ? nicheSchema.parse(value(formData, 'niche')) : null,
    pageSlug: optionalValue(formData, 'pageSlug'),
    status: statusSchema.parse(value(formData, 'status')),
    order: numberValue(formData, 'order'),
  };

  const saved = id
    ? await prisma.fAQ.update({ where: { id }, data })
    : await prisma.fAQ.create({ data });

  await writeAuditLog({
    actorId: session.user.id,
    action: id ? 'faq.update' : 'faq.create',
    entityType: 'FAQ',
    entityId: saved.id,
    afterSummary: { pageSlug: saved.pageSlug, status: saved.status },
  });

  revalidatePath('/admin/content/faqs');
  redirect(`/admin/content/faqs/${saved.id}`);
}

export async function saveSettingAction(formData: FormData) {
  const session = await requireAdmin('ADMIN');
  const key = z.string().min(2).max(80).regex(/^[a-zA-Z0-9_.-]+$/).parse(value(formData, 'key'));
  const description = optionalValue(formData, 'description');
  const rawValue = value(formData, 'value');
  const parsedValue = JSON.parse(rawValue);

  const saved = await prisma.siteSetting.upsert({
    where: { key },
    update: { value: parsedValue, description },
    create: { key, value: parsedValue, description },
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: 'setting.upsert',
    entityType: 'SiteSetting',
    entityId: saved.id,
    afterSummary: { key },
  });

  revalidatePath('/admin/settings');
  redirect('/admin/settings');
}
