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
    slug: 'clinic-website-and-scheduling',
    title: 'Clinic Websites & Scheduling',
    description: 'Premium visually striking clinic websites equipped with intelligent real-time booking engines and patient communication flows.',
    accentColor: 'sky',
    painPoints: [
      'Outdated clinic website not generating patient leads',
      'Phone-only booking losing potential patients',
      'No online presence for doctor profiles and specializations',
      'No automated appointment confirmations or reminders',
    ],
    solution: 'We create cinematic clinic websites that double as lead-generation machines — with integrated booking, WhatsApp notifications, and doctor showcase pages.',
    features: [
      { title: 'Cinematic Design', description: 'Premium dark/light theme websites with smooth animations, optimized for trust and conversion.' },
      { title: 'Integrated Patient Bookings', description: 'Real-time availability calendar with instant confirmation and automated WhatsApp reminders.' },
      { title: 'WhatsApp Notification Flows', description: 'Automated messages for booking confirmation, reminders, follow-ups, and feedback collection.' },
      { title: 'Doctor Showcase', description: 'Individual profile pages with qualifications, specializations, availability, and patient reviews.' },
    ],
    techStack: ['Next.js', 'Tailwind CSS', 'Django', 'WhatsApp Business API', 'Google Calendar API'],
  },
  {
    slug: 'custom-crm-appointment-software',
    title: 'Custom CRM & Appointment Systems',
    description: 'Tailor-made Client Relationship Management tools and appointment software designed specifically around your operational flow.',
    accentColor: 'rose',
    painPoints: [
      'Generic CRMs forcing you to adapt to their workflow',
      'Lost client history across spreadsheets and email threads',
      'No automated follow-ups causing lead leakage',
      'Disconnected tools for booking, tracking, and reporting',
    ],
    solution: 'We build CRM and booking systems that mirror your exact operational workflow — not the other way around — with full client journey tracking and automation.',
    features: [
      { title: 'Client Journey Tracking', description: 'End-to-end pipeline from first contact through conversion to retention, with custom stages and notes.' },
      { title: 'Automated Reminders', description: 'Multi-channel reminders via WhatsApp, email, and SMS — configurable by event type and timing.' },
      { title: 'Sales Pipeline Automation', description: 'Lead scoring, stage progression rules, and automated task creation based on client activity.' },
      { title: 'Custom Dashboards', description: 'Real-time metrics on conversion rates, revenue, team performance, and booking patterns.' },
    ],
    techStack: ['React', 'Django', 'PostgreSQL', 'Celery', 'WhatsApp API', 'Chart.js'],
  },
];

export const servicesBySlug = Object.fromEntries(services.map(s => [s.slug, s]));
