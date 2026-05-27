'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { writeAuditLog } from '@/lib/server/audit';
import { requireAdmin } from '@/lib/server/authz';
import { prisma } from '@/lib/server/prisma';

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim();
}

function parseDeleteDate(formData: FormData) {
  const value = z.string().min(10).parse(text(formData, 'beforeDate'));
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid deletion date.');
  }
  return date;
}

function requireConfirmation(formData: FormData, expected: string) {
  const confirmation = text(formData, 'confirmation');
  if (confirmation !== expected) {
    throw new Error(`Type ${expected} to confirm this destructive action.`);
  }
}

async function deleteEmptyProfiles() {
  const emptyProfiles = await prisma.visitorProfile.findMany({
    where: { sessions: { none: {} } },
    select: { id: true },
  });

  if (emptyProfiles.length === 0) return 0;

  const result = await prisma.visitorProfile.deleteMany({
    where: { id: { in: emptyProfiles.map((profile) => profile.id) } },
  });

  return result.count;
}

export async function deleteVisitorAction(formData: FormData) {
  const session = await requireAdmin('ADMIN');
  requireConfirmation(formData, 'DELETE');
  const visitorId = z.string().min(5).parse(text(formData, 'visitorId'));

  const before = await prisma.visitorProfile.findUnique({
    where: { id: visitorId },
    select: {
      id: true,
      visitorIdHash: true,
      latestIpAddress: true,
      totalSessions: true,
      totalEvents: true,
      _count: { select: { sessions: true } },
    },
  });

  if (!before) return;

  await prisma.visitorProfile.delete({ where: { id: visitorId } });

  await writeAuditLog({
    actorId: session.user.id,
    action: 'analytics.visitor.delete',
    entityType: 'VisitorProfile',
    entityId: visitorId,
    beforeSummary: {
      visitorIdHash: before.visitorIdHash,
      latestIpAddress: before.latestIpAddress,
      sessions: before._count.sessions,
      totalEvents: before.totalEvents,
    },
    afterSummary: { deleted: true },
  });

  revalidatePath('/admin/analytics');
  revalidatePath('/admin/analytics/visitors');
}

export async function deleteSessionAction(formData: FormData) {
  const session = await requireAdmin('ADMIN');
  requireConfirmation(formData, 'DELETE');
  const visitorSessionId = z.string().min(5).parse(text(formData, 'visitorSessionId'));

  const before = await prisma.visitorSession.findUnique({
    where: { id: visitorSessionId },
    select: {
      id: true,
      sessionIdHash: true,
      visitorId: true,
      ipAddress: true,
      landingPage: true,
      eventCount: true,
      _count: { select: { events: true } },
    },
  });

  if (!before) return;

  await prisma.visitorSession.delete({ where: { id: visitorSessionId } });
  await deleteEmptyProfiles();

  await writeAuditLog({
    actorId: session.user.id,
    action: 'analytics.session.delete',
    entityType: 'VisitorSession',
    entityId: visitorSessionId,
    beforeSummary: {
      sessionIdHash: before.sessionIdHash,
      ipAddress: before.ipAddress,
      landingPage: before.landingPage,
      events: before._count.events,
    },
    afterSummary: { deleted: true },
  });

  revalidatePath('/admin/analytics');
  revalidatePath('/admin/analytics/visitors');
}

export async function deleteBeforeDateAction(formData: FormData) {
  const session = await requireAdmin('ADMIN');
  requireConfirmation(formData, 'DELETE ANALYTICS');
  const beforeDate = parseDeleteDate(formData);
  const keepAggregates = formData.get('keepAggregates') === 'on';

  const [events, sessions] = await prisma.$transaction([
    prisma.analyticsEvent.deleteMany({ where: { createdAt: { lt: beforeDate } } }),
    prisma.visitorSession.deleteMany({ where: { lastSeenAt: { lt: beforeDate } } }),
  ]);
  const profiles = await deleteEmptyProfiles();
  const aggregates = keepAggregates
    ? { count: 0 }
    : await prisma.pageMetricDaily.deleteMany({ where: { date: { lt: beforeDate } } });

  await writeAuditLog({
    actorId: session.user.id,
    action: 'analytics.before_date.delete',
    entityType: 'FirstPartyAnalytics',
    beforeSummary: { beforeDate: beforeDate.toISOString(), keepAggregates },
    afterSummary: {
      eventsDeleted: events.count,
      sessionsDeleted: sessions.count,
      profilesDeleted: profiles,
      aggregatesDeleted: aggregates.count,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/analytics');
  revalidatePath('/admin/analytics/visitors');
}

export async function deleteNonConvertedBeforeDateAction(formData: FormData) {
  const session = await requireAdmin('ADMIN');
  requireConfirmation(formData, 'DELETE NON-CONVERTED');
  const beforeDate = parseDeleteDate(formData);

  const sessions = await prisma.visitorSession.findMany({
    where: {
      lastSeenAt: { lt: beforeDate },
      events: { none: { type: 'FORM_SUBMIT' } },
    },
    select: { id: true },
  });
  const sessionIds = sessions.map((item) => item.id);

  if (sessionIds.length === 0) {
    await writeAuditLog({
      actorId: session.user.id,
      action: 'analytics.non_converted_before_date.delete',
      entityType: 'FirstPartyAnalytics',
      beforeSummary: { beforeDate: beforeDate.toISOString() },
      afterSummary: { sessionsDeleted: 0, eventsDeleted: 0, profilesDeleted: 0 },
    });
    revalidatePath('/admin/analytics/visitors');
    return;
  }

  const [events, deletedSessions] = await prisma.$transaction([
    prisma.analyticsEvent.deleteMany({ where: { visitorSessionId: { in: sessionIds } } }),
    prisma.visitorSession.deleteMany({ where: { id: { in: sessionIds } } }),
  ]);
  const profiles = await deleteEmptyProfiles();

  await writeAuditLog({
    actorId: session.user.id,
    action: 'analytics.non_converted_before_date.delete',
    entityType: 'FirstPartyAnalytics',
    beforeSummary: { beforeDate: beforeDate.toISOString() },
    afterSummary: {
      sessionsDeleted: deletedSessions.count,
      eventsDeleted: events.count,
      profilesDeleted: profiles,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/analytics');
  revalidatePath('/admin/analytics/visitors');
}

export async function markRetentionReviewedAction(formData: FormData) {
  const session = await requireAdmin('ADMIN');
  const notes = text(formData, 'notes') || null;

  const existing = await prisma.analyticsRetentionReview.findFirst({ orderBy: { createdAt: 'asc' } });
  const review = existing
    ? await prisma.analyticsRetentionReview.update({
        where: { id: existing.id },
        data: { lastReviewedAt: new Date(), dismissedUntil: null, notes },
      })
    : await prisma.analyticsRetentionReview.create({
        data: { lastReviewedAt: new Date(), reviewDueAfterDays: 30, notes },
      });

  await writeAuditLog({
    actorId: session.user.id,
    action: 'analytics.retention.reviewed',
    entityType: 'AnalyticsRetentionReview',
    entityId: review.id,
    afterSummary: { lastReviewedAt: review.lastReviewedAt, notes: Boolean(notes) },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/analytics');
  revalidatePath('/admin/analytics/visitors');
}

export async function dismissRetentionReminderAction() {
  const session = await requireAdmin('ADMIN');
  const dismissedUntil = new Date();
  dismissedUntil.setDate(dismissedUntil.getDate() + 7);

  const existing = await prisma.analyticsRetentionReview.findFirst({ orderBy: { createdAt: 'asc' } });
  const review = existing
    ? await prisma.analyticsRetentionReview.update({
        where: { id: existing.id },
        data: { dismissedUntil },
      })
    : await prisma.analyticsRetentionReview.create({
        data: { reviewDueAfterDays: 30, dismissedUntil },
      });

  await writeAuditLog({
    actorId: session.user.id,
    action: 'analytics.retention.dismissed',
    entityType: 'AnalyticsRetentionReview',
    entityId: review.id,
    afterSummary: { dismissedUntil },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/analytics');
  revalidatePath('/admin/analytics/visitors');
}
