import type { Metadata } from 'next';
import { CountryAuthorityPage } from '@/components/sections/CountryAuthorityPage';
import { generatePageMetadata, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(pageMetadata.canada);

export default function CanadaPage() {
  return (
    <CountryAuthorityPage
      title="Custom Software Development for Canadian Businesses"
      subtitle="CodingBull Technovations Pvt. Ltd. builds healthcare, e-commerce, HRMS, payroll, internal CRM, and custom business systems for Canadian teams that need secure architecture and predictable delivery."
      marketLabel="Canada Software Development"
      intro="Canadian businesses often need careful data handling, clear documentation, reliable remote collaboration, and software that fits specific service workflows. CodingBull scopes healthcare, e-commerce, HRMS, payroll, and internal business platforms around the operating process before writing production code."
      responseWindow="Architecture response within 48 working hours with planned overlap for Canadian discovery, review, and milestone decisions."
      serviceFocus={[
        {
          title: 'Healthcare software for Canada',
          href: '/services/healthcare-software-development',
          description: 'Clinic workflows, appointment systems, patient records, secure role models, reporting, reminders, and compliance-scoped architecture planning.',
        },
        {
          title: 'Custom e-commerce software',
          href: '/services/ecommerce-development',
          description: 'Server-rendered storefronts, structured data, inventory workflows, order management, payment flows, shipping logic, and SEO content control.',
        },
        {
          title: 'Custom HRMS and payroll',
          href: '/services/custom-hrms-payroll-software',
          description: 'Employee records, attendance, leave, payroll review, approval chains, payslips, dashboards, and self-service portals.',
        },
        {
          title: 'Internal CRM and workflow automation',
          href: '/services/custom-business-systems',
          description: 'Business process automation, internal CRM, approval portals, reporting dashboards, customer portals, and integration layers.',
        },
      ]}
      buyingSignals={[
        'Capture privacy, consent, retention, access, and backup expectations before engineering begins.',
        'Define the operational workflow in writing so remote delivery stays measurable and accountable.',
        'Use SEO-first public architecture where service, product, and insight pages support organic discovery.',
        'Separate private operational dashboards from public marketing pages with proper authentication and roles.',
      ]}
      proofPoints={[
        'Fixed-scope proposal with explicit modules, integrations, assumptions, and acceptance criteria.',
        'Security-conscious architecture with role-based access, audit logs, and controlled admin surfaces.',
        'Content and sitemap structures that keep only canonical live URLs available for crawling.',
        'Delivery communication designed for owners and operators, not only developers.',
      ]}
      ctaLabel="Request Canada Build Plan"
      ctaTrackingSource="canada_page_cta_primary"
    />
  );
}
