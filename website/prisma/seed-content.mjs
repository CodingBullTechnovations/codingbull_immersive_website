import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const root = process.cwd();

function loadTsModule(relativePath) {
  const filename = path.join(root, relativePath);
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  const compiledModule = { exports: {} };

  vm.runInNewContext(output, {
    module: compiledModule,
    exports: compiledModule.exports,
    console,
    require: (id) => {
      throw new Error(`Unsupported seed import "${id}" in ${relativePath}`);
    },
  }, { filename });

  return compiledModule.exports;
}

function serviceInterestForPath(pathname) {
  const lower = pathname.toLowerCase();
  if (lower.includes('healthcare') || lower.includes('clinic') || lower.includes('patient') || lower.includes('physioway') || lower.includes('shashwat') || lower.includes('ivf')) {
    return 'HEALTHCARE';
  }
  if (lower.includes('ecommerce') || lower.includes('e-commerce') || lower.includes('commerce') || lower.includes('inventory') || lower.includes('shopify') || lower.includes('order')) {
    return 'ECOMMERCE';
  }
  if (lower.includes('hrms') || lower.includes('payroll') || lower.includes('attendance') || lower.includes('employee') || lower.includes('leave')) {
    return 'HRMS';
  }
  return 'CUSTOM_SYSTEMS';
}

function seoIndustryForPath(pathname) {
  const interest = serviceInterestForPath(pathname);
  if (interest === 'HEALTHCARE') return 'HEALTHCARE';
  if (interest === 'ECOMMERCE') return 'ECOMMERCE';
  if (interest === 'HRMS') return 'HRMS';
  return 'CUSTOM_DEVELOPMENT';
}

function keywordsForService(service) {
  const map = {
    'healthcare-software-development': ['healthcare software development', ['clinic management software', 'patient appointment booking system'], 'Commercial investigation', 'Decision'],
    'ecommerce-development': ['e-commerce development', ['custom e-commerce platform', 'inventory order automation'], 'Commercial investigation', 'Decision'],
    'custom-hrms-payroll-software': ['custom HRMS software', ['payroll automation software', 'attendance management system'], 'Commercial investigation', 'Decision'],
    'custom-business-systems': ['custom business software', ['internal CRM', 'workflow automation'], 'Commercial investigation', 'Decision'],
  };

  return map[service.slug] ?? [service.title.toLowerCase(), [], 'Commercial investigation', 'Decision'];
}

function keywordFromSlug(slug) {
  return slug.replaceAll('-', ' ');
}

export async function seedContent(prisma) {
  const { services } = loadTsModule('src/content/services.ts');
  const { caseStudies } = loadTsModule('src/content/case-studies.ts');
  const { insights } = loadTsModule('src/content/insights.ts');

  for (const service of services) {
    const [primaryKeyword, secondaryKeywords, searchIntent, funnelStage] = keywordsForService(service);
    const pathname = `/services/${service.slug}`;

    await prisma.servicePage.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        metaTitle: service.title,
        metaDescription: service.description,
        niche: serviceInterestForPath(pathname),
        hero: {
          headline: service.title,
          summary: service.description,
        },
        painPoints: service.painPoints,
        modules: service.features,
        faqs: service.faqs ?? [],
        schemaData: { type: 'Service' },
        seoPrimaryKeyword: primaryKeyword,
        seoSecondaryKeywords: secondaryKeywords,
        seoSearchIntent: searchIntent,
        seoFunnelStage: funnelStage,
        seoIndustry: seoIndustryForPath(pathname),
        canonicalPath: pathname,
        internalLinkTargets: [],
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
      create: {
        slug: service.slug,
        title: service.title,
        metaTitle: service.title,
        metaDescription: service.description,
        niche: serviceInterestForPath(pathname),
        hero: {
          headline: service.title,
          summary: service.description,
        },
        painPoints: service.painPoints,
        modules: service.features,
        faqs: service.faqs ?? [],
        schemaData: { type: 'Service' },
        seoPrimaryKeyword: primaryKeyword,
        seoSecondaryKeywords: secondaryKeywords,
        seoSearchIntent: searchIntent,
        seoFunnelStage: funnelStage,
        seoIndustry: seoIndustryForPath(pathname),
        canonicalPath: pathname,
        internalLinkTargets: [],
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
  }

  for (const study of caseStudies) {
    const pathname = `/case-studies/${study.slug}`;

    await prisma.caseStudy.upsert({
      where: { slug: study.slug },
      update: {
        client: study.client,
        industry: study.category,
        title: study.title,
        problem: study.challenge,
        constraints: null,
        solution: study.solution,
        architecture: study.techStack.map((tech) => ({ title: tech, description: `${tech} used in the project architecture.` })),
        outcomes: study.outcome,
        metrics: study.stats,
        permissionStatus: 'APPROVED',
        seoPrimaryKeyword: keywordFromSlug(study.slug),
        seoSecondaryKeywords: [study.client, study.category],
        seoSearchIntent: 'Proof evaluation',
        seoFunnelStage: 'Consideration',
        seoIndustry: seoIndustryForPath(pathname),
        canonicalPath: pathname,
        internalLinkTargets: [],
        status: 'PUBLISHED',
        publishedAt: new Date(`${study.year}-01-01T00:00:00.000Z`),
      },
      create: {
        slug: study.slug,
        client: study.client,
        industry: study.category,
        title: study.title,
        problem: study.challenge,
        constraints: null,
        solution: study.solution,
        architecture: study.techStack.map((tech) => ({ title: tech, description: `${tech} used in the project architecture.` })),
        outcomes: study.outcome,
        metrics: study.stats,
        permissionStatus: 'APPROVED',
        seoPrimaryKeyword: keywordFromSlug(study.slug),
        seoSecondaryKeywords: [study.client, study.category],
        seoSearchIntent: 'Proof evaluation',
        seoFunnelStage: 'Consideration',
        seoIndustry: seoIndustryForPath(pathname),
        canonicalPath: pathname,
        internalLinkTargets: [],
        status: 'PUBLISHED',
        publishedAt: new Date(`${study.year}-01-01T00:00:00.000Z`),
      },
    });
  }

  for (const post of insights) {
    const pathname = `/insights/${post.slug}`;

    await prisma.insightPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        metaTitle: post.title,
        metaDescription: post.excerpt,
        excerpt: post.excerpt,
        body: post.content,
        author: post.author,
        niche: serviceInterestForPath(pathname),
        tags: [post.category],
        schemaData: { type: 'Article' },
        seoPrimaryKeyword: keywordFromSlug(post.slug),
        seoSecondaryKeywords: [post.category],
        seoSearchIntent: 'Informational',
        seoFunnelStage: 'Awareness',
        seoIndustry: seoIndustryForPath(pathname),
        canonicalPath: pathname,
        internalLinkTargets: [],
        status: 'PUBLISHED',
        publishedAt: new Date(`${post.date}T00:00:00.000Z`),
      },
      create: {
        slug: post.slug,
        title: post.title,
        metaTitle: post.title,
        metaDescription: post.excerpt,
        excerpt: post.excerpt,
        body: post.content,
        author: post.author,
        niche: serviceInterestForPath(pathname),
        tags: [post.category],
        schemaData: { type: 'Article' },
        seoPrimaryKeyword: keywordFromSlug(post.slug),
        seoSecondaryKeywords: [post.category],
        seoSearchIntent: 'Informational',
        seoFunnelStage: 'Awareness',
        seoIndustry: seoIndustryForPath(pathname),
        canonicalPath: pathname,
        internalLinkTargets: [],
        status: 'PUBLISHED',
        publishedAt: new Date(`${post.date}T00:00:00.000Z`),
      },
    });
  }

  const testimonials = [
    {
      person: 'Healthcare Client',
      role: 'Clinic Director',
      company: 'PhysioWays',
      quote: 'CodingBull built our entire clinic management system from scratch. The scheduling, patient intake, and follow-up workflows actually match how our clinic operates — no forced workarounds.',
      niche: 'HEALTHCARE',
      order: 1,
    },
    {
      person: 'Operations Client',
      role: 'Operations Head',
      company: 'Enterprise Client',
      quote: 'Working with a founder who understands business processes made all the difference. Our HRMS now handles payroll, attendance, and leave management without the issues we had with our previous solution.',
      niche: 'HRMS',
      order: 2,
    },
    {
      person: 'E-commerce Client',
      role: 'Business Owner',
      company: 'E-commerce Platform',
      quote: 'Fixed pricing gave us complete budget clarity. The system was delivered on time and actually does what was scoped — including the admin dashboard and reporting we needed from day one.',
      niche: 'ECOMMERCE',
      order: 3,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: {
        person_company: {
          person: testimonial.person,
          company: testimonial.company,
        },
      },
      update: {
        ...testimonial,
        permissionStatus: 'APPROVED',
        status: 'PUBLISHED',
      },
      create: {
        ...testimonial,
        permissionStatus: 'APPROVED',
        status: 'PUBLISHED',
      },
    });
  }

  const settings = [
    ['seo.expected.services', services.length, 'Expected seeded service pages.'],
    ['seo.expected.caseStudies', caseStudies.length, 'Expected seeded case studies.'],
    ['seo.expected.insights', insights.length, 'Expected seeded insight posts.'],
    ['seo.sourceOfTruth', 'database', 'Production content source of truth.'],
  ];

  for (const [key, value, description] of settings) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }

  console.log(`Seeded content: ${services.length} services, ${caseStudies.length} case studies, ${insights.length} insights, ${testimonials.length} testimonials.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  seedContent(prisma)
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
