import type { Metadata } from 'next';
import { CountryAuthorityPage } from '@/components/sections/CountryAuthorityPage';
import { generatePageMetadata, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(pageMetadata.india);

export default function IndiaPage() {
  return (
    <CountryAuthorityPage
      title="Custom Software Development Company in India"
      subtitle="CodingBull Technovations Pvt. Ltd. builds healthcare, e-commerce, HRMS, payroll, internal CRM, and workflow automation software for Indian businesses that need fixed-scope delivery and operational depth."
      marketLabel="India Software Development"
      intro="Indian businesses usually need strict cost control, quick iteration, multilingual or multi-branch operating realities, and systems that work for staff who are already busy. CodingBull maps the daily workflow first, then builds software that supports clinics, e-commerce teams, HR departments, and founder-led operations without forcing generic SaaS workarounds."
      responseWindow="Architecture response within 48 Indian working hours for qualified healthcare, e-commerce, HRMS, payroll, and custom business system inquiries."
      serviceFocus={[
        {
          title: 'Medical and healthcare software in India',
          href: '/services/healthcare-software-development',
          description: 'Clinic management, appointment booking, patient records, branch schedules, billing workflows, follow-up reminders, and secure admin access.',
        },
        {
          title: 'E-commerce development in India',
          href: '/services/ecommerce-development',
          description: 'SEO-first storefronts, catalog control, inventory automation, payment flows, shipping integrations, and backend operations for Indian brands.',
        },
        {
          title: 'Custom HRMS and payroll software',
          href: '/services/custom-hrms-payroll-software',
          description: 'Attendance, leave, payroll formulas, payslips, multi-location rules, approval workflows, and employee self-service portals.',
        },
        {
          title: 'Custom business systems',
          href: '/services/custom-business-systems',
          description: 'Internal CRM, dashboards, approval portals, reporting systems, document flows, and process automation for Indian operations teams.',
        },
      ]}
      buyingSignals={[
        'Scope must cover branch, role, and approval differences before engineering starts.',
        'Pricing should be fixed to milestones, not vague hourly estimates with unclear delivery ownership.',
        'Healthcare and payroll systems need access control, audit logs, backups, and careful data handling.',
        'Public pages such as service, product, and category pages should be crawlable and canonical from launch.',
      ]}
      proofPoints={[
        'Founder-led scoping with engineering ownership before proposal.',
        'Clear modules, milestones, acceptance criteria, and change-control notes.',
        'Server-rendered public pages where SEO matters and secure admin panels where operations matter.',
        'Reusable architecture for future branch, role, country, or module expansion.',
      ]}
      ctaLabel="Request India Build Plan"
      ctaTrackingSource="india_page_cta_primary"
    />
  );
}
