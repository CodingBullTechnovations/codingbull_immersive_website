import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$queryRaw`SELECT 1`;

  const [services, caseStudies, insights, credentials] = await Promise.all([
    prisma.servicePage.count(),
    prisma.caseStudy.count(),
    prisma.insightPost.count(),
    prisma.integrationCredential.count(),
  ]);

  console.log(JSON.stringify({
    ok: true,
    database: 'ok',
    content: { services, caseStudies, insights },
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
