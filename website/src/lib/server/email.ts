import { DeliveryStatus, EmailProvider, type Lead } from '@prisma/client';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { prisma } from '@/lib/server/prisma';
import { getEmailConfig } from '@/lib/server/env';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function leadEmailHtml(lead: Lead) {
  const rows = [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Company', lead.company ?? 'Not provided'],
    ['Country', lead.country ?? 'Not provided'],
    ['Service', lead.serviceInterest],
    ['Budget', lead.budgetRange],
    ['Timeline', lead.timeline],
    ['Source page', lead.sourcePage ?? 'Unknown'],
    ['Referrer', lead.referrer ?? 'Unknown'],
    ['Score', String(lead.score)],
  ];

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
      <h2>New CodingBull inquiry</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="font-weight:700;border-bottom:1px solid #e5e7eb">${escapeHtml(label)}</td><td style="border-bottom:1px solid #e5e7eb">${escapeHtml(value)}</td></tr>`,
          )
          .join('')}
      </table>
      <h3>Project details</h3>
      <p>${escapeHtml(lead.message).replaceAll('\n', '<br />')}</p>
    </div>
  `;
}

async function recordDelivery(input: {
  leadId: string;
  provider: EmailProvider;
  status: DeliveryStatus;
  toEmail: string;
  fromEmail: string;
  subject: string;
  providerMessageId?: string | null;
  providerResponse?: unknown;
  error?: string | null;
}) {
  await prisma.emailDelivery.create({
    data: {
      leadId: input.leadId,
      provider: input.provider,
      status: input.status,
      toEmail: input.toEmail,
      fromEmail: input.fromEmail,
      subject: input.subject,
      providerMessageId: input.providerMessageId ?? null,
      providerResponse: input.providerResponse ? JSON.parse(JSON.stringify(input.providerResponse)) : undefined,
      error: input.error ?? null,
      sentAt: input.status === DeliveryStatus.SENT ? new Date() : null,
    },
  });
}

export async function sendLeadNotification(lead: Lead) {
  const config = getEmailConfig();
  const subject = `New ${lead.serviceInterest.toLowerCase()} inquiry from ${lead.name}`;
  const html = leadEmailHtml(lead);

  if (config.resendApiKey) {
    try {
      const resend = new Resend(config.resendApiKey);
      const result = await resend.emails.send({
        from: config.emailFrom,
        to: [config.contactEmail],
        replyTo: lead.email,
        subject,
        html,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      await recordDelivery({
        leadId: lead.id,
        provider: EmailProvider.RESEND,
        status: DeliveryStatus.SENT,
        toEmail: config.contactEmail,
        fromEmail: config.emailFrom,
        subject,
        providerMessageId: result.data?.id ?? null,
        providerResponse: result.data,
      });
      return;
    } catch (error) {
      await recordDelivery({
        leadId: lead.id,
        provider: EmailProvider.RESEND,
        status: DeliveryStatus.FAILED,
        toEmail: config.contactEmail,
        fromEmail: config.emailFrom,
        subject,
        error: error instanceof Error ? error.message : 'Unknown Resend error',
      });
    }
  }

  if (config.smtpHost && config.smtpUser && config.smtpPassword) {
    try {
      const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpPort === 465,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPassword,
        },
      });

      const info = await transporter.sendMail({
        from: config.smtpFrom,
        to: config.contactEmail,
        replyTo: lead.email,
        subject,
        html,
      });

      await recordDelivery({
        leadId: lead.id,
        provider: EmailProvider.SMTP,
        status: DeliveryStatus.SENT,
        toEmail: config.contactEmail,
        fromEmail: config.smtpFrom,
        subject,
        providerMessageId: info.messageId,
        providerResponse: info,
      });
      return;
    } catch (error) {
      await recordDelivery({
        leadId: lead.id,
        provider: EmailProvider.SMTP,
        status: DeliveryStatus.FAILED,
        toEmail: config.contactEmail,
        fromEmail: config.smtpFrom,
        subject,
        error: error instanceof Error ? error.message : 'Unknown SMTP error',
      });
    }
  }

  await recordDelivery({
    leadId: lead.id,
    provider: EmailProvider.MANUAL,
    status: DeliveryStatus.SKIPPED,
    toEmail: config.contactEmail,
    fromEmail: config.emailFrom,
    subject,
    error: 'No Resend or SMTP credentials configured.',
  });
}
