'use server';

import { contactFormSchema, type ContactFormData } from '@/lib/validation';

/**
 * Server Action for processing the contact form.
 * Includes honeypot check and simulated email sending for Phase 2.
 */
export async function submitContactForm(data: ContactFormData) {
  // 1. Validate with Zod
  const validated = contactFormSchema.safeParse(data);
  
  if (!validated.success) {
    return {
      success: false,
      error: 'Invalid form data. Please check your inputs.',
    };
  }

  // 2. Simulated Delay (Wait for UX feedback)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 3. Honeypot check (handled by Zod, but just to be sure)
  if (data.website) {
    console.warn('[SPAM DETECTED]: Honeypot filled by bot.');
    return {
      success: true, // Fail silently to not give bots feedback
      message: 'Inquiry received. Thank you.', 
    };
  }

  // 4. Log the lead for the founder (Simulating internal notification)
  console.log('--- NEW LEAD RECEIVED ---');
  console.log(`Name: ${data.name}`);
  console.log(`Email: ${data.email}`);
  console.log(`Company: ${data.company || 'N/A'}`);
  console.log(`Phone: ${data.phone}`);
  console.log(`Service: ${data.service}`);
  console.log(`Budget: ${data.budget || 'Not specified'}`);
  console.log(`Message: ${data.message}`);
  console.log('-------------------------');

  // 5. In a production environment, you would call an email service here:
  // await resend.emails.send({ ... });

  return {
    success: true,
    message: 'Your inquiry has been received. We will respond within 24 hours.',
  };
}
