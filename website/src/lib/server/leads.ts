import {
  AnalyticsEventType,
  BudgetRange,
  LeadActivityType,
  type Lead,
  ProjectTimeline,
  ServiceInterest,
} from '@prisma/client';
import type { ContactFormData } from '@/lib/validation';
import { getIndustryForServiceInterest, getLandingPage, getTrafficChannel } from '@/lib/industry';
import { prisma } from '@/lib/server/prisma';
import { scoreLead } from '@/lib/server/lead-scoring';
import { sendLeadNotification } from '@/lib/server/email';

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
}

export async function createLeadFromContactForm(data: ContactFormData, context: CreateLeadContext) {
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

  const lead = await prisma.$transaction(async (tx) => {
    const createdLead = await tx.lead.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone.trim(),
        company: data.company?.trim() || null,
        website: data.companyWebsite?.trim() || null,
        country: data.country?.trim() || null,
        serviceInterest,
        industry,
        budgetRange,
        timeline,
        message: data.message.trim(),
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

    const trafficChannel = getTrafficChannel(data.referrer || context.referrer, data.utmMedium, data.utmSource);

    await tx.analyticsEvent.create({
      data: {
        type: AnalyticsEventType.FORM_SUBMIT,
        page: sourcePage,
        landingPage: getLandingPage(sourcePage),
        industry,
        trafficChannel,
        referrer: data.referrer || context.referrer || null,
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        metadata: {
          leadId: createdLead.id,
          serviceInterest,
          industry,
          budgetRange,
        },
      },
    });

    return createdLead;
  });

  await sendLeadNotification(lead);
  return lead;
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
