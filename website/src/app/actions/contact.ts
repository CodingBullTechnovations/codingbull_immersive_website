'use server';

import { headers } from 'next/headers';
import { contactFormSchema, type ContactFormData } from '@/lib/validation';
import { getClientIp, hashValue } from '@/lib/server/crypto';
import { checkRateLimit } from '@/lib/server/rate-limit';
import { createLeadFromContactForm } from '@/lib/server/leads';

/**
 * Server Action for production lead capture.
 */
export async function submitContactForm(data: ContactFormData) {
  if (data.website) {
    return {
      success: true,
      created: false,
      message: 'Inquiry received. Thank you.',
    };
  }

  const validated = contactFormSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: 'Invalid form data. Please check your inputs.',
    };
  }

  try {
    const headersList = await headers();
    const ipAddress = getClientIp(headersList);
    const userAgent = headersList.get('user-agent');
    const ipHash = hashValue(ipAddress);
    const userAgentHash = hashValue(userAgent);
    const sessionIdHash = hashValue(validated.data.sessionId);
    const visitorIdHash = hashValue(validated.data.visitorId);
    const referrer = headersList.get('referer');
    const emailHash = hashValue(validated.data.email.toLowerCase());
    const identifier = ipHash ?? emailHash ?? 'anonymous';

    const rateLimit = await checkRateLimit({
      identifier,
      action: 'contact_form',
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      return {
        success: false,
        error: `Too many inquiries from this connection. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
      };
    }

    const result = await createLeadFromContactForm(validated.data, {
      ipHash,
      userAgentHash,
      referrer,
      ipAddress,
      userAgent,
      sessionIdHash,
      visitorIdHash,
      country: headersList.get('cf-ipcountry') ?? headersList.get('x-vercel-ip-country'),
      region: headersList.get('x-vercel-ip-country-region') ?? headersList.get('x-region'),
      city: headersList.get('x-vercel-ip-city') ?? headersList.get('x-city'),
    });

    return {
      success: true,
      created: result.created,
      message: "Your inquiry has been received. We'll review it and get back to you shortly.",
    };
  } catch (error) {
    console.error('[contact_form_submit_failed]', error);

    return {
      success: false,
      error: 'Lead capture is temporarily unavailable. Please contact us on WhatsApp.',
    };
  }
}
