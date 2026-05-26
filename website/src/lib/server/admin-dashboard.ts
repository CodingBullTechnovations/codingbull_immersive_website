import { subDays } from '@/lib/server/date';
import { prisma } from '@/lib/server/prisma';

export async function getAdminDashboardData() {
  const since = subDays(new Date(), 30);

  const [
    totalLeads,
    newLeads,
    qualifiedLeads,
    wonLeads,
    recentLeads,
    dailyMetrics,
    contentCounts,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.lead.count({ where: { status: 'QUALIFIED' } }),
    prisma.lead.count({ where: { status: 'WON' } }),
    prisma.lead.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        company: true,
        serviceInterest: true,
        status: true,
        score: true,
        createdAt: true,
      },
    }),
    prisma.pageMetricDaily.findMany({
      where: { date: { gte: since } },
      orderBy: { date: 'asc' },
    }),
    Promise.all([
      prisma.servicePage.count(),
      prisma.caseStudy.count(),
      prisma.insightPost.count(),
      prisma.testimonial.count(),
      prisma.fAQ.count(),
    ]),
  ]);

  const traffic = dailyMetrics.reduce(
    (acc, day) => ({
      visits: acc.visits + day.visits,
      ctaClicks: acc.ctaClicks + day.ctaClicks,
      formStarts: acc.formStarts + day.formStarts,
      formSubmits: acc.formSubmits + day.formSubmits,
      whatsappClicks: acc.whatsappClicks + day.whatsappClicks,
    }),
    { visits: 0, ctaClicks: 0, formStarts: 0, formSubmits: 0, whatsappClicks: 0 },
  );

  return {
    leads: {
      total: totalLeads,
      new: newLeads,
      qualified: qualifiedLeads,
      won: wonLeads,
      recent: recentLeads,
    },
    traffic,
    content: {
      services: contentCounts[0],
      caseStudies: contentCounts[1],
      insights: contentCounts[2],
      testimonials: contentCounts[3],
      faqs: contentCounts[4],
    },
  };
}
