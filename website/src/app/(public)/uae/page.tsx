import type { Metadata } from 'next';
import { CountryAuthorityPage } from '@/components/sections/CountryAuthorityPage';
import { generatePageMetadata, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(pageMetadata.uae);

const uaeServiceFocus = [
  {
    title: 'CRM and lead management for UAE teams',
    href: '/services/custom-crm-development',
    description: 'Lead capture, sales pipelines, follow-ups, customer records, role-based access, and dashboards for service, sales, and trading teams.',
  },
  {
    title: 'Clinic and appointment software',
    href: '/services/clinic-management-software-development',
    description: 'Appointment booking, patient records, doctor schedules, follow-up management, billing workflow planning, and secure admin roles.',
  },
  {
    title: 'Hospital management software development',
    href: '/services/hospital-management-software-development',
    description: 'Patient registration, department workflows, appointments, billing/reporting foundations, admin dashboards, and audit-aware access planning.',
  },
  {
    title: 'Trading and distribution inventory systems',
    href: '/services/inventory-order-management-software',
    description: 'SKU management, stock tracking, order workflows, payment and shipping workflow readiness, e-commerce integration positioning, and reports.',
  },
  {
    title: 'Attendance and payroll management software',
    href: '/services/attendance-payroll-management-software',
    description: 'Attendance capture, leave, shift rules, payroll calculation workflow, approvals, multi-location staff reporting, and HRMS connection.',
  },
  {
    title: 'Healthcare software for UAE clinics',
    href: '/services/healthcare-software-development',
    description: 'Healthcare websites, appointment flows, clinic workflow foundations, patient management planning, and secure dashboard-ready architecture.',
  },
  {
    title: 'E-commerce workflow automation',
    href: '/services/ecommerce-development',
    description: 'SEO-ready storefronts, catalog structure, order workflows, inventory readiness, payment/shipping workflow planning, and admin control.',
  },
  {
    title: 'Custom HRMS and payroll software',
    href: '/services/custom-hrms-payroll-software',
    description: 'Employee records, attendance, leave, payroll review flows, approval chains, dashboards, and self-service workflows.',
  },
  {
    title: 'Business automation software UAE',
    href: '/services/custom-business-systems',
    description: 'Admin panels, dashboards, customer portals, approval systems, document workflows, internal tools, and reporting automation.',
  },
];

const uaeCaseStudies = [
  {
    title: 'Physioway healthcare workflow proof',
    href: '/case-studies/physioway',
    description: 'Healthcare-oriented structure and digital workflow foundation relevant to clinic, appointment, and patient-facing software discussions.',
  },
  {
    title: 'Shashwat IVF clinic website proof',
    href: '/case-studies/shashwat-ivf',
    description: 'Specialty healthcare website proof with organized service content and a clearer inquiry path.',
  },
  {
    title: 'ANR Mechanical business website proof',
    href: '/case-studies/anr-mechanical',
    description: 'Service-business website proof relevant to B2B presentation, contact flow, and future business-system planning.',
  },
];

export default function UAEPage() {
  return (
    <CountryAuthorityPage
      title="Custom Software Development for UAE Businesses"
      subtitle="CodingBull serves UAE businesses remotely from India with websites, CRM, e-commerce, inventory and order systems, clinic software, dashboards, and business automation."
      marketLabel="UAE Software Development"
      positioningTitle="Remote software development for UAE businesses"
      intro="UAE businesses often need digital systems that support fast-moving sales teams, premium customer expectations, trading and distribution workflows, e-commerce operations, clinic appointments, dashboards, and multi-location coordination. CodingBull works remotely from India to scope and build custom software, websites, CRM, inventory systems, and business automation with clear project ownership."
      responseWindow="Architecture response within 48 working hours with India-UAE time overlap for discovery, review, and milestone calls."
      deliveryModel="Remote-first delivery from India with India-UAE time overlap for discovery, reviews, milestone calls, written updates, and decision checkpoints."
      bestFitProjects="Trading and distribution inventory systems, CRM and lead management, e-commerce workflow automation, clinic and appointment systems, dashboards, reporting, HRMS/payroll, and admin panels."
      marketHighlights={[
        {
          title: 'UAE use-case fit',
          description: 'Strong fit for trading inventory, CRM, e-commerce operations, clinic appointments, dashboards, and business automation.',
        },
        {
          title: 'Cross-border delivery clarity',
          description: 'Scope, milestones, dependencies, review windows, and integration responsibilities are documented before production work.',
        },
        {
          title: 'Operational control',
          description: 'Systems are planned around owners, managers, staff, vendors, customers, permissions, and reporting needs.',
        },
      ]}
      serviceSectionTitle="Best-fit UAE software use cases"
      serviceSectionDescription="CodingBull supports UAE businesses with custom software development, web development, CRM development, e-commerce development, inventory software, clinic systems, dashboards, and business automation."
      serviceFocus={uaeServiceFocus}
      buyingSignals={[
        'Clarify branch, language, payment, reporting, inventory, lead-management, and approval needs before choosing a platform.',
        'Plan secure role-based access for owners, managers, staff, vendors, and customers.',
        'Use canonical, server-rendered pages for service, product, case-study, and e-commerce content that should rank in search.',
        'Document data handling, backup, admin access, and integration responsibilities before launch.',
      ]}
      proofPoints={[
        'Founder-led discovery with written scope and fixed delivery milestones.',
        'Architecture planning that supports multi-branch operations, admin control, and future feature expansion.',
        'SEO-ready public pages and secure private dashboards where each is appropriate.',
        'Practical integration planning for payment, email, WhatsApp-safe links, shipping, calendars, inventory, and reporting exports.',
      ]}
      caseStudyLinks={uaeCaseStudies}
      caseStudySectionTitle="Case-study proof for UAE buyers"
      caseStudySectionDescription="Review healthcare and business website examples before discussing a UAE CRM, e-commerce, inventory, clinic software, dashboard, or automation project."
      ctaLabel="Request UAE Build Plan"
      ctaTrackingSource="uae_page_cta_primary"
    />
  );
}
