import type { Metadata } from 'next';
import { CountryAuthorityPage } from '@/components/sections/CountryAuthorityPage';
import { generatePageMetadata, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(pageMetadata.india);

const indiaServiceFocus = [
  {
    title: 'Custom CRM development for Indian businesses',
    href: '/services/custom-crm-development',
    description: 'Lead tracking, follow-ups, customer records, sales pipelines, role-based access, and management dashboards for teams moving beyond spreadsheets.',
  },
  {
    title: 'Clinic management software in India',
    href: '/services/clinic-management-software-development',
    description: 'Appointment scheduling, patient records, doctor calendars, follow-up workflows, billing flow readiness, and secure admin access.',
  },
  {
    title: 'Hospital management software development',
    href: '/services/hospital-management-software-development',
    description: 'Registration, department workflows, appointment handling, billing and reporting foundations, admin dashboards, and audit-aware role planning.',
  },
  {
    title: 'Inventory and order management software',
    href: '/services/inventory-order-management-software',
    description: 'Product and SKU management, stock tracking, order workflows, e-commerce readiness, reports, and owner-friendly admin dashboards.',
  },
  {
    title: 'Attendance and payroll management software',
    href: '/services/attendance-payroll-management-software',
    description: 'Attendance capture, leave workflows, shift rules, payroll calculation flows, manager approvals, and multi-location reporting.',
  },
  {
    title: 'Healthcare software development',
    href: '/services/healthcare-software-development',
    description: 'Healthcare websites, appointment workflows, clinic systems, patient management foundations, and secure operational dashboards.',
  },
  {
    title: 'E-commerce development in India',
    href: '/services/ecommerce-development',
    description: 'SEO-ready storefronts, catalog control, order operations, inventory workflows, payment flow readiness, and maintainable admin controls.',
  },
  {
    title: 'Custom HRMS and payroll software',
    href: '/services/custom-hrms-payroll-software',
    description: 'Employee records, leave, attendance, payroll review, approvals, payslips, and self-service portals for Indian teams.',
  },
  {
    title: 'Custom business systems',
    href: '/services/custom-business-systems',
    description: 'Admin panels, dashboards, workflow automation, customer portals, approval systems, and internal tools built around daily operations.',
  },
];

const indiaCaseStudies = [
  {
    title: 'Physioway healthcare workflow proof',
    href: '/case-studies/physioway',
    description: 'Healthcare-oriented digital foundation with clearer service presentation, inquiry flow, and patient-facing structure.',
  },
  {
    title: 'Shashwat IVF clinic website proof',
    href: '/case-studies/shashwat-ivf',
    description: 'Healthcare website structure for a specialty clinic with content organization and a clearer path for prospective patients.',
  },
  {
    title: 'ANR Mechanical business website proof',
    href: '/case-studies/anr-mechanical',
    description: 'Business website foundation for a mechanical services company with service-led structure and inquiry-focused presentation.',
  },
];

export default function IndiaPage() {
  return (
    <CountryAuthorityPage
      title="Custom Software Development Company in India"
      subtitle="CodingBull builds custom software, websites, CRM, HRMS, e-commerce platforms, healthcare software, dashboards, and workflow automation for Indian businesses that need practical systems and direct engineering ownership."
      marketLabel="India Software Development"
      positioningTitle="Custom software development for Indian businesses"
      intro="Indian businesses need software that respects cost, speed, staff workflows, branch realities, and long-term maintainability. CodingBull is an Ahmedabad-based software partner that scopes the operating process first, then builds business websites, custom CRM, HRMS, healthcare systems, e-commerce workflows, inventory tools, dashboards, and internal software around real daily use."
      responseWindow="Architecture response within 48 Indian working hours for qualified healthcare, e-commerce, HRMS, payroll, and custom business system inquiries."
      deliveryModel="Ahmedabad-based, remote-capable delivery with written scope, fixed milestones, review calls, and change-control visibility for Indian businesses."
      bestFitProjects="Healthcare and clinic systems, CRM, HRMS, payroll, attendance, e-commerce, inventory/order automation, dashboards, admin panels, and custom business systems."
      marketHighlights={[
        {
          title: 'Ahmedabad engineering partner',
          description: 'Founder-led scoping from Ahmedabad with practical software delivery for Indian operating realities.',
        },
        {
          title: 'Fixed-scope milestones',
          description: 'Modules, acceptance criteria, dependencies, and delivery phases are written before production build.',
        },
        {
          title: 'Services plus proof',
          description: 'Visitors can move from service pages to case-study examples and then to a clear inquiry path.',
        },
      ]}
      serviceSectionTitle="Services available in India"
      serviceSectionDescription="CodingBull supports Indian businesses with custom software development, healthcare software, CRM development, HRMS software development, e-commerce development, inventory automation, and internal business systems."
      serviceFocus={indiaServiceFocus}
      buyingSignals={[
        'Clarify branches, roles, approvals, staff permissions, and reporting before choosing between a website, SaaS tool, or custom system.',
        'Use fixed milestones for CRM, HRMS, healthcare, inventory, and e-commerce workflows so cost and delivery expectations stay clear.',
        'Plan access control, audit logs, backups, and data handling for healthcare, payroll, attendance, and customer systems.',
        'Keep service, product, case-study, and market pages crawlable with canonical URLs when organic discovery matters.',
      ]}
      proofPoints={[
        'Founder-led scoping from an Ahmedabad-based software company.',
        'Clear module lists, milestones, acceptance criteria, assumptions, and change-control notes.',
        'Server-rendered public pages where SEO matters and secure admin panels where operations matter.',
        'Reusable architecture for future branch, role, location, or module expansion.',
      ]}
      caseStudyLinks={indiaCaseStudies}
      caseStudySectionTitle="Case-study proof for Indian buyers"
      caseStudySectionDescription="Review healthcare and business website examples before starting a custom CRM, HRMS, clinic software, e-commerce, or internal dashboard project."
      ctaLabel="Request India Build Plan"
      ctaTrackingSource="india_page_cta_primary"
    />
  );
}
