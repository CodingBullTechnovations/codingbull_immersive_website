import {
  AnalyticsEventType,
  BudgetRange,
  LeadActivityType,
  Prisma,
  type Lead,
  ProjectTimeline,
  ServiceInterest,
} from '@prisma/client';
import type { ContactFormData } from '@/lib/validation';
import { getIndustryForServiceInterest, getLandingPage, getTrafficChannel } from '@/lib/industry';
import { prisma } from '@/lib/server/prisma';
import { scoreLead } from '@/lib/server/lead-scoring';
import { sendLeadNotification } from '@/lib/server/email';
import { upsertVisitorAttribution } from '@/lib/server/visitor-attribution';

function mapServiceInterest(value: ContactFormData['service']) {
  const map: Record<ContactFormData['service'], ServiceInterest> = {
    healthcare: ServiceInterest.HEALTHCARE,
    ecommerce: ServiceInterest.ECOMMERCE,
    hrms: ServiceInterest.HRMS,
    custom_systems: ServiceInterest.CUSTOM_SYSTEMS,
    consulting: ServiceInterest.CONSULTING,
    other: ServiceInterest.OTHER,
  };

  return map[value] ?? ServiceInterest.OTHER;
}

function mapBudget(value?: ContactFormData['budget']) {
  const map: Record<NonNullable<ContactFormData['budget']>, BudgetRange> = {
    under_2000: BudgetRange.UNDER_2000,
    '2000_3000': BudgetRange.BETWEEN_2000_3000,
    '3000_5000': BudgetRange.BETWEEN_3000_5000,
    above_5000: BudgetRange.ABOVE_5000,
    unknown: BudgetRange.UNKNOWN,
  };

  return value ? map[value] : BudgetRange.UNKNOWN;
}

function mapTimeline(value?: ContactFormData['timeline']) {
  const map: Record<NonNullable<ContactFormData['timeline']>, ProjectTimeline> = {
    asap: ProjectTimeline.ASAP,
    this_month: ProjectTimeline.THIS_MONTH,
    this_quarter: ProjectTimeline.THIS_QUARTER,
    flexible: ProjectTimeline.FLEXIBLE,
    unknown: ProjectTimeline.UNKNOWN,
  };

  return value ? map[value] : ProjectTimeline.UNKNOWN;
}

export interface CreateLeadContext {
  ipHash?: string | null;
  userAgentHash?: string | null;
  referrer?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  sessionIdHash?: string | null;
  visitorIdHash?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
}

export async function createLeadFromContactForm(data: ContactFormData, context: CreateLeadContext) {
  const normalizedEmail = data.email.toLowerCase().trim();
  const normalizedMessage = data.message.trim();
  const serviceInterest = mapServiceInterest(data.service);
  const industry = getIndustryForServiceInterest(serviceInterest);
  const budgetRange = mapBudget(data.budget);
  const timeline = mapTimeline(data.timeline);
  const sourcePage = data.sourcePage || '/contact';
  const score = scoreLead({
    serviceInterest,
    budgetRange,
    timeline,
    country: data.country,
    message: data.message,
    sourcePage,
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const createdLead = await tx.lead.create({
        data: {
          submissionId: data.submissionId,
          name: data.name.trim(),
          email: normalizedEmail,
          phone: data.phone.trim(),
          company: data.company?.trim() || null,
          website: data.companyWebsite?.trim() || null,
          country: data.country?.trim() || null,
          serviceInterest,
          industry,
          budgetRange,
          timeline,
          message: normalizedMessage,
          sourcePage,
          referrer: data.referrer || context.referrer || null,
          utmSource: data.utmSource || null,
          utmMedium: data.utmMedium || null,
          utmCampaign: data.utmCampaign || null,
          utmTerm: data.utmTerm || null,
          utmContent: data.utmContent || null,
          score,
          ipHash: context.ipHash ?? null,
          userAgentHash: context.userAgentHash ?? null,
        },
      });

      await tx.leadActivity.create({
        data: {
          leadId: createdLead.id,
          type: LeadActivityType.FORM_SUBMIT,
          title: 'Inquiry submitted',
          detail: `${createdLead.name} submitted the contact form from ${sourcePage}.`,
          metadata: {
            score,
            budgetRange,
            timeline,
            serviceInterest,
            industry,
          },
        },
      });

      const trafficChannel = getTrafficChannel(
        data.referrer || context.referrer,
        data.utmMedium,
        data.utmSource,
      );
      const landingPage = getLandingPage(sourcePage);
      const visitorSessionId = await upsertVisitorAttribution(tx, {
        sessionIdHash: context.sessionIdHash,
        visitorIdHash: context.visitorIdHash,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        country: context.country,
        region: context.region,
        city: context.city,
        landingPage,
        page: sourcePage,
        referrer: data.referrer || context.referrer || null,
        trafficChannel,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
      });

      await tx.analyticsEvent.create({
        data: {
          visitorSessionId,
          type: AnalyticsEventType.FORM_SUBMIT,
          page: sourcePage,
          landingPage,
          industry,
          trafficChannel,
          sessionIdHash: context.sessionIdHash,
          visitorIdHash: context.visitorIdHash,
          referrer: data.referrer || context.referrer || null,
          utmSource: data.utmSource || null,
          utmMedium: data.utmMedium || null,
          utmCampaign: data.utmCampaign || null,
          country: context.country,
          metadata: {
            leadId: createdLead.id,
            serviceInterest,
            industry,
            budgetRange,
            ipHash: context.ipHash,
            userAgentHash: context.userAgentHash,
          },
        },
      });

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      await tx.pageMetricDaily.upsert({
        where: {
          date_page_industry_trafficChannel: {
            date: today,
            page: sourcePage,
            industry,
            trafficChannel,
          },
        },
        create: {
          date: today,
          page: sourcePage,
          industry,
          trafficChannel,
          visits: 0,
          ctaClicks: 0,
          formStarts: 0,
          formSubmits: 1,
          whatsappClicks: 0,
        },
        update: { formSubmits: { increment: 1 } },
      });

      return { lead: createdLead, created: true };
    });

    await sendLeadNotification(result.lead);
    return result;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const existingLead = await prisma.lead.findUnique({ where: { submissionId: data.submissionId } });
      if (existingLead) return { lead: existingLead, created: false };
    }
    throw error;
  }
}

export async function getLeadStats() {
  const [total, newLeads, qualified, won, recentLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.lead.count({ where: { status: 'QUALIFIED' } }),
    prisma.lead.count({ where: { status: 'WON' } }),
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        assignedTo: {
          select: { name: true, email: true },
        },
      },
    }),
  ]);

  return { total, newLeads, qualified, won, recentLeads };
}

export async function listLeads() {
  return prisma.lead.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

export async function getLead(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      activities: {
        orderBy: { createdAt: 'desc' },
      },
      notes: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { name: true, email: true },
          },
        },
      },
      emailDeliveries: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export type LeadWithDetails = NonNullable<Awaited<ReturnType<typeof getLead>>>;
export type LeadListItem = Awaited<ReturnType<typeof listLeads>>[number];
export type LeadRecord = Lead;
