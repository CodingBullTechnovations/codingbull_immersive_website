'use server';

import { revalidatePath } from 'next/cache';
import { signOut } from '@/auth';
import { requireAdmin } from '@/lib/server/authz';
import { prisma } from '@/lib/server/prisma';

export async function signOutAction() {
  await signOut({ redirectTo: '/admin/login' });
}

export async function testTrackingAction() {
  const session = await requireAdmin('ADMIN');
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  await prisma.$transaction([
    prisma.analyticsEvent.create({
      data: {
        type: 'PAGE_VIEW',
        page: '/__admin_tracking_test',
        landingPage: '/__admin_tracking_test',
        industry: 'GENERAL',
        trafficChannel: 'DIRECT',
        sessionIdHash: `admin-test-${session.user.id}`,
        visitorIdHash: `admin-test-${session.user.id}`,
        metadata: {
          source: 'admin_tracking_test',
        },
      },
    }),
    prisma.pageMetricDaily.upsert({
      where: {
        date_page_industry_trafficChannel: {
          date: today,
          page: '/__admin_tracking_test',
          industry: 'GENERAL',
          trafficChannel: 'DIRECT',
        },
      },
      create: {
        date: today,
        page: '/__admin_tracking_test',
        industry: 'GENERAL',
        trafficChannel: 'DIRECT',
        visits: 1,
      },
      update: {
        visits: { increment: 1 },
      },
    }),
    prisma.siteSetting.upsert({
      where: { key: 'analytics.lastTrackingTestAt' },
      update: { value: new Date().toISOString(), description: 'Last admin-triggered tracking test.' },
      create: { key: 'analytics.lastTrackingTestAt', value: new Date().toISOString(), description: 'Last admin-triggered tracking test.' },
    }),
  ]);

  revalidatePath('/admin');
  revalidatePath('/admin/analytics');
}
