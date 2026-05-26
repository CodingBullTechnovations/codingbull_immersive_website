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
    const ipHash = hashValue(getClientIp(headersList));
    const userAgentHash = hashValue(headersList.get('user-agent'));
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

    await createLeadFromContactForm(validated.data, {
      ipHash,
      userAgentHash,
      referrer,
    });

    return {
      success: true,
      message: 'Your inquiry has been received. We will respond within 24 hours.',
    };
  } catch (error) {
    console.error('[contact_form_submit_failed]', error);

    return {
      success: false,
      error: 'Lead capture is temporarily unavailable. Please contact us on WhatsApp.',
    };
  }
}
