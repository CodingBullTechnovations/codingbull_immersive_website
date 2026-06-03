import type { Metadata } from 'next';
import { CountryAuthorityPage } from '@/components/sections/CountryAuthorityPage';
import { generatePageMetadata, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata(pageMetadata.usa);

const usaServiceFocus = [
  {
    title: 'Custom CRM development for USA businesses',
    href: '/services/custom-crm-development',
    description: 'Lead tracking, customer records, sales pipeline views, follow-up workflows, role-based access, and reporting dashboards.',
  },
  {
    title: 'Clinic management software partner',
    href: '/services/clinic-management-software-development',
    description: 'Appointment workflows, patient records, provider schedules, follow-up management, billing workflow planning, and secure roles.',
  },
  {
    title: 'Hospital management software development',
    href: '/services/hospital-management-software-development',
    description: 'Patient registration, department workflows, appointment handling, billing/reporting foundations, admin dashboards, and audit-log planning.',
  },
  {
    title: 'Inventory and order management software',
    href: '/services/inventory-order-management-software',
    description: 'SKU management, stock tracking, order workflows, payment and shipping readiness, e-commerce integration planning, and reports.',
  },
  {
    title: 'Attendance and payroll management software',
    href: '/services/attendance-payroll-management-software',
    description: 'Attendance capture, leave flows, shift rules, payroll calculation workflows, approvals, multi-location teams, and HR reports.',
  },
  {
    title: 'Healthcare software development partner',
    href: '/services/healthcare-software-development',
    description: 'Healthcare websites, clinic workflow foundations, appointment systems, secure admin surfaces, and dashboard-ready architecture.',
  },
  {
    title: 'Web and e-commerce development',
    href: '/services/ecommerce-development',
    description: 'SEO-ready websites, storefronts, catalog architecture, product pages, checkout workflow readiness, and admin-controlled content.',
  },
  {
    title: 'Custom HRMS and payroll software',
    href: '/services/custom-hrms-payroll-software',
    description: 'Employee portals, records, attendance, leave, payroll review flows, approvals, dashboards, and documentation-friendly workflows.',
  },
  {
    title: 'Custom business systems',
    href: '/services/custom-business-systems',
    description: 'Admin panels, dashboards, internal workflow tools, approval systems, document flows, portals, and reporting automation.',
  },
];

const usaCaseStudies = [
  {
    title: 'Physioway healthcare workflow proof',
    href: '/case-studies/physioway',
    description: 'Healthcare-oriented structure that shows how service presentation, inquiry flow, and operational thinking can support a digital build.',
  },
  {
    title: 'Shashwat IVF clinic website proof',
    href: '/case-studies/shashwat-ivf',
    description: 'Specialty healthcare website foundation with organized service content and a clearer inquiry path.',
  },
  {
    title: 'ANR Mechanical business website proof',
    href: '/case-studies/anr-mechanical',
    description: 'Business website structure for a services company with crawlable service pages and contact-focused presentation.',
  },
];

export default function USAPage() {
  return (
    <CountryAuthorityPage
      title="Custom Software Development for USA Businesses"
      subtitle="CodingBull is an India-based software development partner for USA businesses needing fixed-scope websites, CRM, dashboards, e-commerce workflows, healthcare software, and internal systems."
      marketLabel="USA Software Development"
      positioningTitle="Remote software development for USA businesses"
      intro="USA buyers often need a practical offshore software development partner that can turn a business workflow into a fixed-scope website, CRM, dashboard, e-commerce workflow, healthcare software foundation, or internal system. CodingBull works remotely from India with written scope, milestone checkpoints, and technical decisions explained in business language."
      responseWindow="Architecture response within 48 working hours, with overlap planning for USA time zones during discovery and milestone reviews."
      deliveryModel="Remote-first delivery from India with planned USA time-zone overlap for discovery, reviews, written delivery notes, and milestone approvals."
      bestFitProjects="Fixed-scope business websites, CRM systems, dashboards, e-commerce workflow automation, healthcare workflow software, internal admin panels, and operational reporting tools."
      marketHighlights={[
        {
          title: 'Outsource defined workflows safely',
          description: 'Best suited for scoped websites, CRM, dashboards, admin panels, automation, and integrations that can be described in milestones.',
        },
        {
          title: 'Documentation before build',
          description: 'System boundaries, repository access, handover expectations, and source-code ownership terms should be documented in the scope.',
        },
        {
          title: 'Business-readable delivery',
          description: 'Milestone notes explain assumptions, risks, dependencies, and decisions without hiding behind technical ticket language.',
        },
      ]}
      serviceSectionTitle="What USA clients can outsource safely"
      serviceSectionDescription="CodingBull focuses on clearly scoped web development, CRM development, healthcare workflow foundations, e-commerce systems, HRMS/payroll workflows, dashboards, and internal business software that can be planned remotely."
      serviceFocus={usaServiceFocus}
      buyingSignals={[
        'Define system boundaries, access levels, data movement, backup expectations, and handover responsibilities before launch.',
        'Break work into fixed-scope milestones so product, operations, and leadership teams share the same expectations.',
        'Use server-rendered public pages and canonical URLs when organic discovery is part of the business case.',
        'Treat legal, privacy, healthcare, and compliance requirements as discovery inputs to be scoped with the client, not generic claims.',
      ]}
      proofPoints={[
        'Written scope that separates must-have workflows from future enhancement ideas.',
        'Architecture notes that explain frontend, backend, database, admin, integration, and reporting responsibilities.',
        'Role-based admin panels and audit-log planning where sensitive healthcare, HR, and internal business workflows require it.',
        'Remote delivery communication designed for owners, operators, and managers, not only developers.',
      ]}
      caseStudyLinks={usaCaseStudies}
      caseStudySectionTitle="Proof links for USA buyers"
      caseStudySectionDescription="Use these examples to review how CodingBull structures healthcare websites, service-business websites, inquiry paths, and software foundations before discussing a USA project."
      ctaLabel="Request USA Delivery Plan"
      ctaTrackingSource="usa_page_cta_primary"
    />
  );
}
