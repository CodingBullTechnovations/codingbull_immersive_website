import type { SiteConfig } from '@/types/content';
import { env } from '@/lib/env';

export const siteConfig: SiteConfig = {
  companyName: 'CodingBull Technovations Pvt. Ltd.',
  tagline: 'Custom Digital Systems for Healthcare, E-commerce & Workforce Operations',
  positioningStatement:
    'CodingBull builds custom digital systems that power healthcare clinics, e-commerce operations, and workforce management — delivered as fixed-price, founder-led engagements.',
  whatsappNumber: env.whatsappNumber,
  whatsappMessages: {
    general:
      "Hi, I'd like to discuss a custom software project with CodingBull.",
    healthcare:
      "Hi, I'm interested in a custom healthcare software solution. I'd like to discuss a fixed-price project.",
    ecommerce:
      'Hi, I need a custom e-commerce system built. Can we discuss scope and fixed pricing?',
    hrms: "Hi, I'm looking for HRMS/payroll software for my team. I'd like a fixed-price quote.",
  },
  email: 'hello@codingbullz.com',
  phone: '+91 98765 43210',
  address: {
    street: 'Ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    zip: '380015',
  },
  socialLinks: {
    linkedin: 'https://linkedin.com/company/codingbull',
    twitter: 'https://twitter.com/codingbull',
    instagram: 'https://instagram.com/codingbull',
  },
  registration: {
    gst: '24AAMCC7617E1ZP', // Add when available
    cin: '', // Add when available
  },
  baseUrl: env.baseUrl,
};

/** Generate WhatsApp URL with prefilled message */
export function getWhatsAppUrl(messageKey: keyof typeof siteConfig.whatsappMessages = 'general'): string {
  const message = encodeURIComponent(siteConfig.whatsappMessages[messageKey]);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${message}`;
}
