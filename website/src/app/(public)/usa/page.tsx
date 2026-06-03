import type { Metadata } from 'next';
import { CountryAuthorityPage } from '@/components/sections/CountryAuthorityPage';
import { generatePageMetadata, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(pageMetadata.usa);

export default function USAPage() {
  return (
    <CountryAuthorityPage
      title="Custom Software Development for USA Businesses"
      subtitle="CodingBull Technovations Pvt. Ltd. supports USA healthcare, e-commerce, HRMS, payroll, and custom software teams with scoped architecture, procurement-ready documentation, and founder-led delivery."
      marketLabel="USA Software Development"
      intro="USA buyers usually need clarity before engineering starts: system boundaries, data handling, access control, timeline, risk, and measurable business outcomes. CodingBull provides remote-first custom software delivery with written scope, milestone checkpoints, and technical decisions that are understandable to owners, operators, and procurement teams."
      responseWindow="Architecture response within 48 working hours, with overlap planning for USA time zones during discovery and milestone reviews."
      serviceFocus={[
        {
          title: 'Healthcare software for USA operators',
          href: '/services/healthcare-software-development',
          description: 'Medical software, clinic workflows, appointment scheduling, patient data handling, reporting, and compliance-scoped access planning.',
        },
        {
          title: 'SEO-first e-commerce development',
          href: '/services/ecommerce-development',
          description: 'Server-rendered storefronts, structured data, catalog architecture, inventory workflows, payment flows, and order operations.',
        },
        {
          title: 'HRMS and payroll systems',
          href: '/services/custom-hrms-payroll-software',
          description: 'Custom employee portals, attendance rules, payroll review flows, approvals, dashboards, and audit-ready HR operations.',
        },
        {
          title: 'Custom internal systems',
          href: '/services/custom-business-systems',
          description: 'Internal CRM, workflow automation, dashboards, approval systems, document flows, integrations, and reporting portals.',
        },
      ]}
      buyingSignals={[
        'Document data movement, access levels, audit expectations, and backup planning before launch.',
        'Define milestone acceptance criteria so product, operations, and leadership teams share the same expectation.',
        'Use server-rendered public pages and canonical URLs when organic discovery is part of the business case.',
        'Treat compliance requirements as discovery inputs, not generic claims pasted onto every proposal.',
      ]}
      proofPoints={[
        'Written scope that separates must-have workflows from future enhancement ideas.',
        'Architecture that explains frontend, backend, database, admin, integration, and reporting responsibilities.',
        'Role-based admin panels and audit logs for sensitive healthcare, HR, and internal business workflows.',
        'Delivery notes written in risk, timeline, and business outcome language, not only technical tickets.',
      ]}
      ctaLabel="Request USA Delivery Plan"
      ctaTrackingSource="usa_page_cta_primary"
    />
  );
}
