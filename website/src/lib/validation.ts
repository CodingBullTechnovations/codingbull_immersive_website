import { z } from 'zod';

/**
 * Validation schema for the enterprise contact form.
 * Includes honeypot for basic spam protection.
 */
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().min(10, 'Invalid phone number'),
  service: z.enum(['healthcare', 'ecommerce', 'hrms', 'other', 'consulting']),
  budget: z.string().optional(),
  message: z.string().min(5, 'Description must be at least 5 characters'),
  // Honeypot field — should be empty
  website: z.string().max(0, { message: 'Spam detected' }).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
