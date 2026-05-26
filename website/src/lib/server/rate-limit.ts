import { prisma } from '@/lib/server/prisma';

interface RateLimitOptions {
  identifier: string;
  action: string;
  limit: number;
  windowMs: number;
}

export async function checkRateLimit({
  identifier,
  action,
  limit,
  windowMs,
}: RateLimitOptions) {
  const now = Date.now();
  const windowStart = new Date(Math.floor(now / windowMs) * windowMs);

  const bucket = await prisma.rateLimitBucket.upsert({
    where: {
      identifier_action_windowStart: {
        identifier,
        action,
        windowStart,
      },
    },
    create: {
      identifier,
      action,
      windowStart,
      count: 1,
    },
    update: {
      count: {
        increment: 1,
      },
    },
  });

  return {
    allowed: bucket.count <= limit,
    count: bucket.count,
    limit,
    retryAfterSeconds: Math.ceil((windowStart.getTime() + windowMs - now) / 1000),
  };
}
