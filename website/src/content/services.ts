export interface ServiceContent {
  slug: string;
  title: string;
  description: string;
  accentColor: string;
  painPoints: string[];
  solution: string;
  features: { title: string; description: string }[];
  techStack: string[];
}

export const services: ServiceContent[] = [
  {
    slug: 'healthcare-software-development',
    title: 'Healthcare Software Development',
    description: 'Clinic systems, smart scheduling, patient management, and full-scale healthcare platform architecture built for HIPAA-compliant, high-volume modern clinics.',
    accentColor: 'teal',
    painPoints: [
      'Manual appointment scheduling causing double-bookings and no-shows',
      'Paper-based patient records slowing down consultations',
      'No real-time visibility into doctor availability across branches',
      'Compliance gaps in patient data handling',
    ],
    solution: 'We architect end-to-end healthcare platforms that automate patient flow — from online booking through consultation to follow-up — while keeping all data encrypted and compliant.',
    features: [
      { title: 'Smart Appointment Engine', description: 'Real-time slot management with automated reminders via WhatsApp and SMS, reducing no-shows by up to 40%.' },
      { title: 'Patient Records & Analytics', description: 'Centralized digital records with search, filters, and analytics dashboards for clinical decision-making.' },
      { title: 'Doctor Availability Grid', description: 'Multi-branch, multi-doctor scheduling with leave management, shift rotation, and conflict detection.' },
      { title: 'Compliance & Security', description: 'End-to-end encryption, role-based access, audit logs, and data residency controls for healthcare regulations.' },
    ],
    techStack: ['React', 'Next.js', 'Django', 'PostgreSQL', 'Redis', 'WhatsApp API', 'AWS'],
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
  },
];

export const servicesBySlug = Object.fromEntries(services.map(s => [s.slug, s]));
