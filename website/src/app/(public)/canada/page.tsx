import type { Metadata } from 'next';
import { CountryAuthorityPage } from '@/components/sections/CountryAuthorityPage';
import { generatePageMetadata, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(pageMetadata.canada);

const canadaServiceFocus = [
  {
    title: 'Custom CRM development for Canada businesses',
    href: '/services/custom-crm-development',
    description: 'Lead pipelines, customer records, task and follow-up workflows, role-based access, dashboards, and reporting for service and sales teams.',
  },
  {
    title: 'Clinic management software development',
    href: '/services/clinic-management-software-development',
    description: 'Appointment booking, patient records, provider schedules, follow-up workflows, billing workflow possibilities, and secure access planning.',
  },
  {
    title: 'Hospital management software development',
    href: '/services/hospital-management-software-development',
    description: 'Patient registration, department workflows, appointment handling, billing/reporting foundations, admin dashboards, and audit-log planning.',
  },
  {
    title: 'Inventory and order management software',
    href: '/services/inventory-order-management-software',
    description: 'Products, SKUs, stock tracking, order workflows, e-commerce integration readiness, payment/shipping workflow planning, and reports.',
  },
  {
    title: 'Attendance and payroll management software',
    href: '/services/attendance-payroll-management-software',
    description: 'Attendance capture, leave, shift rules, payroll calculation workflows, manager approvals, multi-location teams, and HR reporting.',
  },
  {
    title: 'Healthcare software development',
    href: '/services/healthcare-software-development',
    description: 'Healthcare websites, clinic workflows, appointment systems, patient management foundations, role-aware dashboards, and secure admin surfaces.',
  },
  {
    title: 'Business website and e-commerce development',
    href: '/services/ecommerce-development',
    description: 'SEO-ready websites, storefronts, catalog structure, order workflows, inventory readiness, and maintainable content controls.',
  },
  {
    title: 'Custom HRMS and payroll software',
    href: '/services/custom-hrms-payroll-software',
    description: 'Employee records, attendance, leave, payroll review, approvals, payslips, dashboards, and employee self-service workflows.',
  },
  {
    title: 'Custom business systems',
    href: '/services/custom-business-systems',
    description: 'Internal admin panels, dashboards, portals, approval systems, document workflows, customer portals, and reporting automation.',
  },
];

const canadaCaseStudies = [
  {
    title: 'Physioway healthcare workflow proof',
    href: '/case-studies/physioway',
    description: 'Healthcare service presentation and digital workflow foundation relevant to clinic and appointment software discussions.',
  },
  {
    title: 'Shashwat IVF clinic website proof',
    href: '/case-studies/shashwat-ivf',
    description: 'Specialty clinic website structure with organized service content and inquiry-focused presentation.',
  },
  {
    title: 'ANR Mechanical business website proof',
    href: '/case-studies/anr-mechanical',
    description: 'Business website proof for a service company, with clearer structure for services, trust, and contact flow.',
  },
];

export default function CanadaPage() {
  return (
    <CountryAuthorityPage
      title="Custom Software Development for Canadian Businesses"
      subtitle="CodingBull serves Canadian businesses remotely from India with business websites, CRM, clinic and appointment systems, dashboards, e-commerce workflows, and custom software."
      marketLabel="Canada Software Development"
      positioningTitle="Remote software development for Canadian businesses"
      intro="Canadian businesses often need a practical India software development partner for fixed-scope websites, CRM, clinic systems, dashboards, e-commerce workflows, HRMS, payroll, and custom internal tools. CodingBull works remotely from India with clear documentation, milestone planning, and software scoped around the business process before production build starts."
      responseWindow="Architecture response within 48 working hours with planned overlap for Canadian discovery, review, and milestone decisions."
      deliveryModel="Remote-first delivery from India with planned overlap for Canadian discovery, milestone reviews, written updates, and decision checkpoints."
      bestFitProjects="Business websites, custom CRM, clinic and appointment systems, dashboards, e-commerce workflows, HRMS/payroll systems, admin panels, and internal automation."
      marketHighlights={[
        {
          title: 'Best-fit Canadian projects',
          description: 'Useful for defined websites, CRM, clinic workflows, dashboards, e-commerce operations, and internal systems that need careful scope.',
        },
        {
          title: 'Remote collaboration rhythm',
          description: 'Discovery notes, milestone reviews, decision logs, and acceptance criteria keep delivery clear across time zones.',
        },
        {
          title: 'Maintainable foundation',
          description: 'Public pages, private dashboards, admin controls, and future integrations are planned around ownership and handover needs.',
        },
      ]}
      serviceSectionTitle="What CodingBull can build for Canadian businesses"
      serviceSectionDescription="CodingBull supports Canadian small businesses, clinics, service teams, and operators with custom CRM development, web development, clinic software, e-commerce workflows, HRMS/payroll systems, dashboards, and internal automation."
      serviceFocus={canadaServiceFocus}
      buyingSignals={[
        'Capture privacy, access, retention, backup, admin, and handover expectations before engineering begins.',
        'Define operational workflows in writing so remote delivery stays measurable and accountable.',
        'Use SEO-ready public architecture where service, product, case-study, and insight pages support organic discovery.',
        'Separate private operational dashboards from public marketing pages with proper authentication and roles.',
      ]}
      proofPoints={[
        'Fixed-scope proposal with explicit modules, integration assumptions, dependencies, and acceptance criteria.',
        'Security-conscious architecture planning with role-based access, audit logs, and controlled admin surfaces where needed.',
        'Content and sitemap structures that keep only canonical live URLs available for crawling.',
        'Delivery communication designed for owners and operators, not only developers.',
      ]}
      caseStudyLinks={canadaCaseStudies}
      caseStudySectionTitle="Case-study proof for Canadian buyers"
      caseStudySectionDescription="Review these healthcare and service-business examples to understand how CodingBull structures proof, inquiry paths, and maintainable foundations before discussing a Canadian project."
      ctaLabel="Request Canada Build Plan"
      ctaTrackingSource="canada_page_cta_primary"
    />
  );
}
