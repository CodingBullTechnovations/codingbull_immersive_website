import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { seedContent } from './seed-content.mjs';

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || 'CodingBull Owner';

async function main() {
  if (!email || !password) {
    console.log('Skipping admin seed. Set ADMIN_EMAIL and ADMIN_PASSWORD to bootstrap the first owner.');
  } else {
    if (password.length < 8) {
      throw new Error('ADMIN_PASSWORD must be at least 8 characters.');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.upsert({
      where: { email },
      update: {
        name,
        passwordHash,
        role: 'OWNER',
        status: 'ACTIVE',
      },
      create: {
        email,
        name,
        passwordHash,
        role: 'OWNER',
        status: 'ACTIVE',
      },
    });

    console.log(`Owner admin is ready: ${email}`);
  }

  await seedContent(prisma);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
