import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$queryRaw`SELECT 1`;

  const requiredServiceSlugs = [
    'healthcare-software-development',
    'ecommerce-development',
    'custom-hrms-payroll-software',
    'custom-business-systems',
  ];
  const requiredInsightSlugs = [
    'why-django-powers-healthcare-backends',
    'react-nextjs-seo-first-ecommerce',
    'building-hrms-that-scales-500-employees',
    'anr-mechanicals-digital-presence',
    'clinic-management-software-modules',
    'patient-appointment-booking-system-architecture',
    'custom-ecommerce-inventory-order-automation',
    'shopify-vs-custom-ecommerce-platform',
    'payroll-automation-rules-custom-hrms',
    'multi-location-attendance-management-system',
    'internal-crm-workflow-automation-guide',
    'saas-vs-custom-software-decision-guide',
  ];

  const [services, caseStudies, insights, credentials, serviceRows, insightRows] = await Promise.all([
    prisma.servicePage.count(),
    prisma.caseStudy.count(),
    prisma.insightPost.count(),
    prisma.integrationCredential.count(),
    prisma.servicePage.findMany({ where: { slug: { in: requiredServiceSlugs }, status: 'PUBLISHED' }, select: { slug: true } }),
    prisma.insightPost.findMany({ where: { slug: { in: requiredInsightSlugs }, status: 'PUBLISHED' }, select: { slug: true } }),
  ]);

  const serviceSlugs = new Set(serviceRows.map((row) => row.slug));
  const insightSlugs = new Set(insightRows.map((row) => row.slug));
  const missingServices = requiredServiceSlugs.filter((slug) => !serviceSlugs.has(slug));
  const missingInsights = requiredInsightSlugs.filter((slug) => !insightSlugs.has(slug));

  if (missingServices.length > 0 || missingInsights.length > 0) {
    throw new Error(`Missing required published content: services=${missingServices.join(',') || 'none'} insights=${missingInsights.join(',') || 'none'}`);
  }

  console.log(JSON.stringify({
    ok: true,
    database: 'ok',
    content: {
      services,
      caseStudies,
      insights,
      requiredServices: requiredServiceSlugs.length,
      requiredInsights: requiredInsightSlugs.length,
    },
    staticRoutesExpectedInSitemap: ['/india', '/usa', '/uae', '/canada'],
    credentials,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
