import type { CTAConfig } from '@/types/content';
import type { WhatsAppMessageKey } from '@/content/site';

interface InsightConversionContent {
  /** Site-authored decision guide; the CMS article body is preserved. */
  decisionGuide: string;
  updatedAt: string;
  jumpLabel: string;
  jumpHref: string;
  cta: CTAConfig;
  title: string;
  description: string;
  kicker: string;
  primaryLabel: string;
  primaryTrackingSource: string;
  whatsappMessageKey: WhatsAppMessageKey;
}

const insightConversionBySlug: Record<string, InsightConversionContent> = {
  'patient-appointment-booking-system-architecture': {
    updatedAt: '2026-10-01',
    jumpLabel: 'Clinic operator? Start with the decision checklist.',
    jumpHref: '#before-commissioning-a-booking-system',
    decisionGuide: `
## Before commissioning a booking system

A clinic operator does not need to choose a technology stack first. Start with the appointment workflow that currently requires a manual correction, and establish whether the existing system can support it.

### Configure, integrate, or build?

- **Configure the existing software** when its scheduling rules, staff permissions, reminders, and reports can handle the workflow. Ask the provider to demonstrate the exact scenario before buying a replacement.
- **Consider an integration** when the scheduling system is adequate but staff re-enter the same information elsewhere. Confirm API access, data ownership, costs, and who will maintain the connection.
- **Consider custom development** when a necessary rule cannot be supported through configuration or a suitable integration. Examples to investigate include shared resources across branches, different service durations, and coordinated home visits. These are assessment scenarios, not claims that every clinic needs custom software.

### Bring one real scheduling scenario

1. Describe who books the appointment, where it is recorded, and who confirms it.
2. List the doctor, therapist, room, travel, or equipment constraints involved.
3. Explain what happens when the slot changes or two requests arrive together.
4. Identify the manual correction and how often it occurs using your own records.
5. List the tools already in use and any export or integration restrictions.

Use a fictional or anonymised example when discussing the workflow; patient details are not needed for an initial project enquiry.

### Define success before agreeing the scope

Choose observable acceptance checks: conflicting bookings cannot both be confirmed, authorised staff can reschedule with an audit trail, reminders follow the agreed rules, and a failed notification is visible for follow-up. Agree the initial workflow, migration needs, training, hosting, and maintenance responsibilities before adding further modules.

For the wider service scope, see [clinic management software development](/services/clinic-management-software-development). The technical sections above explain the architecture; this checklist helps decide whether a software project is appropriate in the first place.
    `.trim(),
    title: 'Discuss your booking workflow.',
    description: 'Describe the scheduling rule your current tools cannot handle, the manual work it creates, and the systems already in use. Include that context in your enquiry so the project discussion starts with the operational problem.',
    kicker: 'Clinic booking / next step',
    primaryLabel: 'Discuss a Booking Workflow',
    primaryTrackingSource: 'insight_appointment_contact',
    whatsappMessageKey: 'bookingWorkflow',
    cta: {
      label: 'Discuss on WhatsApp',
      href: '#whatsapp',
      variant: 'secondary',
      trackingSource: 'insight_appointment_whatsapp',
      icon: 'whatsapp',
    },
  },
};

export function getInsightConversion(slug: string): InsightConversionContent | undefined {
  return Object.hasOwn(insightConversionBySlug, slug) ? insightConversionBySlug[slug] : undefined;
}
