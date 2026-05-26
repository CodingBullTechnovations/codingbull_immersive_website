import { prisma } from '@/lib/server/prisma';

export async function listServicePages() {
  return prisma.servicePage.findMany({ orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }] });
}

export async function getServicePage(id: string) {
  return prisma.servicePage.findUnique({ where: { id } });
}

export async function listCaseStudiesAdmin() {
  return prisma.caseStudy.findMany({ orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }] });
}

export async function getCaseStudyAdmin(id: string) {
  return prisma.caseStudy.findUnique({ where: { id } });
}

export async function listInsightPostsAdmin() {
  return prisma.insightPost.findMany({ orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }] });
}

export async function getInsightPostAdmin(id: string) {
  return prisma.insightPost.findUnique({ where: { id } });
}

export async function listTestimonialsAdmin() {
  return prisma.testimonial.findMany({ orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }] });
}

export async function getTestimonialAdmin(id: string) {
  return prisma.testimonial.findUnique({ where: { id } });
}

export async function listFaqsAdmin() {
  return prisma.fAQ.findMany({ orderBy: [{ pageSlug: 'asc' }, { order: 'asc' }] });
}

export async function getFaqAdmin(id: string) {
  return prisma.fAQ.findUnique({ where: { id } });
}

export async function listSettingsAdmin() {
  return prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
}

export async function listMediaAdmin() {
  return prisma.mediaAsset.findMany({ orderBy: { updatedAt: 'desc' } });
}

export async function listUsersAdmin() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
}

export async function listAuditLogsAdmin() {
  return prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: {
      actor: {
        select: { name: true, email: true },
      },
    },
  });
}
