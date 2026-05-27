export interface ServiceContent {
  slug: string;
  title: string;
  description: string;
  accentColor: string;
  painPoints: string[];
  solution: string;
  features: { title: string; description: string }[];
  techStack: string[];
  faqs?: { question: string; answer: string }[];
}

export const services: ServiceContent[] = [
  {
    slug: 'healthcare-software-development',
    title: 'Healthcare Software Development',
    description: 'Clinic systems, smart scheduling, patient management, and full-scale healthcare platform architecture built with scoped privacy, audit, and security controls for high-volume modern clinics.',
    accentColor: 'teal',
    painPoints: [
      'Manual appointment scheduling causing double-bookings and no-shows',
      'Paper-based patient records slowing down consultations',
      'No real-time visibility into doctor availability across branches',
      'Compliance gaps in patient data handling',
    ],
    solution: 'We architect end-to-end healthcare platforms that automate patient flow — from online booking through consultation to follow-up — while keeping encryption, auditability, and access controls scoped to the operating model.',
    features: [
      { title: 'Smart Appointment Engine', description: 'Real-time slot management with automated reminders via WhatsApp and SMS, reducing no-shows by up to 40%.' },
      { title: 'Patient Records & Analytics', description: 'Centralized digital records with search, filters, and analytics dashboards for clinical decision-making.' },
      { title: 'Doctor Availability Grid', description: 'Multi-branch, multi-doctor scheduling with leave management, shift rotation, and conflict detection.' },
      { title: 'Compliance & Security', description: 'End-to-end encryption, role-based access, audit logs, and data residency controls for healthcare regulations.' },
    ],
    techStack: ['React', 'Next.js', 'Django', 'PostgreSQL', 'Redis', 'WhatsApp API', 'AWS'],
    faqs: [
      {
        question: 'What is healthcare software development?',
        answer: 'Healthcare software development is the design and engineering of secure digital systems for clinics, hospitals, diagnostics, patient intake, appointment booking, medical records, staff workflows, and operational reporting.',
      },
      {
        question: 'Can CodingBull build clinic appointment and patient management software?',
        answer: 'Yes. CodingBull builds clinic appointment systems, patient intake flows, branch-wise schedules, patient records, staff dashboards, and reporting modules around the clinic workflow.',
      },
      {
        question: 'Do healthcare systems need custom security controls?',
        answer: 'Yes. Healthcare systems should use role-based access, audit logs, encrypted transport, controlled backups, and scoped data access. Compliance requirements are finalized during project discovery based on country and use case.',
      },
    ],
  },
  {
    slug: 'ecommerce-development',
    title: 'E-Commerce Development',
    description: 'High-conversion storefronts, intelligent order workflows, and backend operations tailored for massive scale with SEO-first architecture.',
    accentColor: 'amber',
    painPoints: [
      'Generic platforms limiting customization and performance',
      'Poor SEO rankings despite quality products',
      'Manual inventory tracking causing overselling',
      'Fragmented payment and shipping integrations',
    ],
    solution: 'We build custom React + Django e-commerce platforms where almost all media and content is backend-controlled, with automated inventory, shipping, and payment flows.',
    features: [
      { title: 'Custom Inventory Management', description: 'Real-time stock tracking across warehouses with low-stock alerts, batch operations, and SKU management.' },
      { title: 'Shiprocket & Razorpay Integration', description: 'Automated shipping label generation, tracking updates, and seamless payment processing with refund handling.' },
      { title: 'SEO-First Architecture', description: 'Server-rendered React/Next.js storefront with structured data, sitemap generation, and Core Web Vitals optimization.' },
      { title: 'Django Admin Panel', description: 'Full frontend control from the backend — update products, banners, categories, and media without touching code.' },
    ],
    techStack: ['React', 'Next.js', 'Django REST', 'PostgreSQL', 'Razorpay', 'Shiprocket', 'Cloudflare'],
    faqs: [
      {
        question: 'When should a business choose custom e-commerce development?',
        answer: 'Custom e-commerce development is useful when inventory, pricing, checkout, shipping, SEO, or backend operations cannot be handled cleanly by a standard template or plugin stack.',
      },
      {
        question: 'Can CodingBull build SEO-first e-commerce websites?',
        answer: 'Yes. CodingBull uses server-rendered pages, structured data, clean category architecture, optimized media, and backend-controlled product content for SEO-first e-commerce builds.',
      },
      {
        question: 'Which e-commerce operations can be automated?',
        answer: 'Common automations include inventory alerts, order routing, invoice generation, shipping labels, payment reconciliation, product publishing, abandoned inquiry follow-up, and operations dashboards.',
      },
    ],
  },
  {
    slug: 'custom-hrms-payroll-software',
    title: 'Custom HRMS & Payroll Systems',
    description: 'Enterprise HR solutions handling attendance, complex payroll formulas, workforce dashboards, and multi-location shift management.',
    accentColor: 'violet',
    painPoints: [
      'Excel-based payroll prone to calculation errors and delays',
      'No centralized employee records across branches',
      'Manual attendance tracking with no accountability',
      'Complex leave policies impossible to enforce consistently',
    ],
    solution: 'We engineer HRMS platforms that automate the entire employee lifecycle — from onboarding through attendance tracking to payslip generation — scaled for 500+ employees.',
    features: [
      { title: 'Automated Attendance', description: 'Biometric/GPS-based check-in with shift management, overtime calculation, and real-time dashboards.' },
      { title: 'Smart Payroll Engine', description: 'Custom formulas for deductions, bonuses, PF, ESI, and TDS — generating error-free payslips every cycle.' },
      { title: 'Leave & Policy Management', description: 'Configurable leave types, approval workflows, carry-forward rules, and encashment calculations.' },
      { title: 'Employee Self-Service', description: 'Mobile-friendly portal for leave requests, payslip downloads, attendance history, and document uploads.' },
    ],
    techStack: ['React', 'Django', 'PostgreSQL', 'Celery', 'Redis', 'PDF Generation', 'REST API'],
    faqs: [
      {
        question: 'What is a custom HRMS and payroll system?',
        answer: 'A custom HRMS and payroll system manages employee records, attendance, leave policies, salary rules, payslips, approvals, compliance exports, and workforce reporting around a company-specific process.',
      },
      {
        question: 'Can custom HRMS handle complex payroll formulas?',
        answer: 'Yes. Custom payroll engines can model attendance deductions, overtime, incentives, allowances, PF, ESI, TDS, leave encashment, branch rules, and role-specific salary logic.',
      },
      {
        question: 'When is custom HRMS better than SaaS HR software?',
        answer: 'Custom HRMS is better when the organization has non-standard shifts, multi-branch attendance rules, unique payroll formulas, custom approvals, or deep integration needs.',
      },
    ],
  },
  {
    slug: 'custom-business-systems',
    title: 'Custom Business Systems',
    description: 'Workflow portals, dashboards, internal CRMs, approval systems, reporting tools, and automation layers built around how your business actually operates.',
    accentColor: 'sky',
    painPoints: [
      'Teams jumping between spreadsheets, WhatsApp, email, and disconnected SaaS tools',
      "Generic software forcing your operations into someone else's workflow",
      'Manual reporting slowing down founder and manager decisions',
      'No single source of truth for approvals, tasks, documents, and customer history',
    ],
    solution: 'We design and build custom operating systems for your business: role-based portals, workflow automation, reporting dashboards, CRM logic, document flows, and integrations that match your process end to end.',
    features: [
      { title: 'Workflow Automation', description: 'Approval flows, task routing, reminders, escalations, and operational checklists mapped to your actual process.' },
      { title: 'Internal CRM & Portals', description: 'Customer, vendor, employee, or partner portals with role-based access and full activity history.' },
      { title: 'Reporting Dashboards', description: 'Founder and manager dashboards for revenue, operations, team output, conversion, and bottleneck visibility.' },
      { title: 'Integration Layer', description: 'Connect payments, calendars, email, WhatsApp-safe links, accounting exports, and third-party APIs without creating data silos.' },
    ],
    techStack: ['Next.js', 'React', 'PostgreSQL', 'Prisma', 'Node.js', 'Resend', 'Cloudflare'],
    faqs: [
      {
        question: 'What are custom business systems?',
        answer: 'Custom business systems are private software platforms for operations such as internal CRM, approval workflows, dashboards, vendor portals, document flows, reporting, and process automation.',
      },
      {
        question: 'When should a company build custom software instead of buying SaaS?',
        answer: 'A company should consider custom software when off-the-shelf tools force process compromises, create data silos, require excessive manual work, or cannot match the business workflow.',
      },
      {
        question: 'Can CodingBull build internal dashboards and workflow portals?',
        answer: 'Yes. CodingBull builds role-based dashboards, internal CRMs, approval portals, reporting systems, and automation layers using Next.js, React, PostgreSQL, and secure server-side architecture.',
      },
    ],
  },
];

export const servicesBySlug = Object.fromEntries(services.map(s => [s.slug, s]));
