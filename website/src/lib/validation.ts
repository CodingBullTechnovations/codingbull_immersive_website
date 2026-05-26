import { z } from 'zod';

/**
 * Validation schema for the enterprise contact form.
 * Includes honeypot for basic spam protection.
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().max(120).optional(),
  companyWebsite: z.string().url('Enter a valid website URL').optional().or(z.literal('')),
  country: z.string().max(80).optional(),
  phone: z.string().min(10, 'Invalid phone number'),
  service: z.enum(['healthcare', 'ecommerce', 'hrms', 'custom_systems', 'consulting', 'other']),
  budget: z.enum(['under_2000', '2000_3000', '3000_5000', 'above_5000', 'unknown']).optional(),
  timeline: z.enum(['asap', 'this_month', 'this_quarter', 'flexible', 'unknown']).optional(),
  message: z.string().min(20, 'Please share at least 20 characters about the requirement'),
  sourcePage: z.string().max(300).optional(),
  referrer: z.string().max(500).optional(),
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(120).optional(),
  utmTerm: z.string().max(120).optional(),
  utmContent: z.string().max(120).optional(),
  website: z.string().max(0, { message: 'Spam detected' }).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
