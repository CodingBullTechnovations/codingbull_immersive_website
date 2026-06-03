import type { Metadata } from 'next';
import { CountryAuthorityPage } from '@/components/sections/CountryAuthorityPage';
import { generatePageMetadata, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(pageMetadata.uae);

export default function UAEPage() {
  return (
    <CountryAuthorityPage
      title="Custom Software Development for UAE Businesses"
      subtitle="CodingBull Technovations Pvt. Ltd. builds healthcare, e-commerce, HRMS, payroll, internal CRM, and workflow automation software for UAE teams that need fast execution and clear operational control."
      marketLabel="UAE Software Development"
      intro="UAE businesses often need digital systems that support fast-moving teams, premium customer expectations, multi-location operations, and cross-border workflows. CodingBull helps scope and build custom software for clinics, e-commerce brands, HR teams, and service businesses that want direct engineering ownership without unnecessary agency layers."
      responseWindow="Architecture response within 48 working hours with India-UAE time overlap for discovery, review, and milestone calls."
      serviceFocus={[
        {
          title: 'Healthcare software for UAE clinics',
          href: '/services/healthcare-software-development',
          description: 'Appointment booking, patient records, branch-wise doctor schedules, billing, reminders, secure roles, and operational dashboards.',
        },
        {
          title: 'E-commerce development for UAE brands',
          href: '/services/ecommerce-development',
          description: 'Fast storefronts, SEO-ready category pages, inventory automation, payment workflows, shipping logic, and admin-controlled content.',
        },
        {
          title: 'HRMS and payroll automation',
          href: '/services/custom-hrms-payroll-software',
          description: 'Attendance, leave, employee portals, salary rules, approvals, payslips, and workforce reporting for multi-location teams.',
        },
        {
          title: 'Custom business systems',
          href: '/services/custom-business-systems',
          description: 'Internal CRM, approval systems, dashboards, document workflows, customer portals, vendor portals, and reporting automation.',
        },
      ]}
      buyingSignals={[
        'Clarify branch, language, payment, reporting, and approval needs before choosing a platform.',
        'Plan secure role-based access for owners, managers, staff, vendors, and customers.',
        'Use canonical, server-rendered pages for service and e-commerce content that should rank in search.',
        'Document data handling, backup, admin access, and integration responsibilities before launch.',
      ]}
      proofPoints={[
        'Founder-led discovery with written scope and fixed delivery milestones.',
        'Architecture that supports multi-branch operations, admin control, and future feature expansion.',
        'SEO-ready public pages and secure private dashboards where each is appropriate.',
        'Practical integration planning for payment, email, WhatsApp-safe links, shipping, calendars, and reporting exports.',
      ]}
      ctaLabel="Request UAE Build Plan"
      ctaTrackingSource="uae_page_cta_primary"
    />
  );
}
