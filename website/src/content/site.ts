import type { SiteConfig } from '@/types/content';
import { env } from '@/lib/env';

export const whatsappMessages = {
  general:
    "Hi, I'd like to discuss a custom software project with CodingBull.",
  bookingWorkflow:
    "Hi, I'd like to discuss our clinic booking workflow, the tools we use, and whether configuration, integration, or custom development would help.",
  healthcare:
    "Hi, I'm interested in a custom healthcare software solution. I'd like to discuss a fixed-price project.",
  ecommerce:
    'Hi, I need a custom e-commerce system built. Can we discuss scope and fixed pricing?',
  hrms: "Hi, I'm looking for HRMS/payroll software for my team. I'd like a fixed-price quote.",
  customSystems:
    "Hi, I need a custom business system built around our workflow. I'd like to discuss scope and pricing.",
} as const;

export type WhatsAppMessageKey = keyof typeof whatsappMessages;

export const siteConfig: SiteConfig = {
  companyName: 'CodingBull Technovations Pvt. Ltd.',
  tagline: 'Custom Digital Systems for Healthcare, E-commerce & Workforce Operations',
  positioningStatement:
    'CodingBull builds custom digital systems that power healthcare clinics, e-commerce operations, and workforce management — delivered as fixed-price, founder-led engagements.',
  whatsappNumber: env.whatsappNumber,
  whatsappMessages,
  email: 'pranshu@codingbullz.com',
  phone: '+91 79848 91664',
  address: {
    // Street intentionally unpublished (owner decision). Postal code confirmed
    // by the owner as 380061 on 2026-07-12, resolving the earlier 380015/380061
    // ambiguity. Empty fields are omitted from schema, never emitted blank.
    street: '',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'IN',
    zip: '380061',
  },
  // Public profile URLs are managed in Admin → Social Links, not here. Schema
  // `sameAs` is populated at request time via sameAsSocialUrls(config).
  socialLinks: {},
  registration: {
    gst: '24AAMCC7617E1ZP',
    // CIN is NOT the GST number. It is the 21-character Corporate Identity
    // Number issued by the MCA (e.g. U62013GJ2024PTC123456), printed on the
    // Certificate of Incorporation. Add it here to strengthen corporate trust.
    cin: '',
  },
  baseUrl: env.baseUrl,
};

/** Generate WhatsApp URL with prefilled message */
export function getWhatsAppUrl(messageKey: WhatsAppMessageKey = 'general'): string {
  const message = encodeURIComponent(whatsappMessages[messageKey]);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${message}`;
}
