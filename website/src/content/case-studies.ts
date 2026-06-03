export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  category: string;
  year: string;
  accentColor: string;
  challenge: string;
  solution: string;
  outcome: string;
  stats: { label: string; value: string }[];
  techStack: string[];
  summary?: string;
  projectType?: string;
  market?: string;
  mainServiceCategory?: string;
  deliveryModel?: string;
  status?: string;
  servicesInvolved?: { label: string; href: string; description?: string }[];
  modules?: string[];
  technicalApproach?: string[];
  businessValue?: string[];
  roadmap?: string[];
  cta?: {
    title: string;
    description: string;
    label: string;
  };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'physioway',
    title: 'Multi-Branch Clinic Management & Analytics',
    client: 'Physioway Active Health LLP',
    category: 'Healthcare Systems',
    year: '2024',
    accentColor: 'teal',
    challenge: 'Physioway struggled with fragmented patient records across multiple branches, manual attendance tracking for therapists, and an opaque sales pipeline leading to high lead leakage.',
    solution: 'We architected a custom Django-powered clinic management system with a real-time availability engine, automated PDF payroll generation for 50+ staff, and an integrated CRM for patient journey tracking.',
    outcome: 'Successful deployment across 4 branches, reducing payroll processing time from 3 days to 45 seconds and increasing patient follow-up efficiency by 35%.',
    summary: 'A custom clinic operations platform for multi-branch patient records, appointment visibility, therapist workflows, payroll automation, and CRM-style patient journey tracking.',
    projectType: 'Custom clinic management and operations system',
    market: 'Ahmedabad / India healthcare operations',
    mainServiceCategory: 'Healthcare software development',
    deliveryModel: 'Founder-led custom software build',
    status: 'Deployed project case study',
    servicesInvolved: [
      {
        label: 'Healthcare Software Development',
        href: '/services/healthcare-software-development',
        description: 'Clinic workflows, patient records, appointment logic, reporting, and secure healthcare operations.',
      },
      {
        label: 'Clinic Management Software Development',
        href: '/services/clinic-management-software-development',
        description: 'Appointment booking, patient records, doctor or therapist schedules, follow-ups, and clinic dashboards.',
      },
      {
        label: 'Custom CRM Development',
        href: '/services/custom-crm-development',
        description: 'Lead tracking, patient journey visibility, follow-ups, owner views, and workflow dashboards.',
      },
      {
        label: 'Attendance and Payroll Management Software',
        href: '/services/attendance-payroll-management-software',
        description: 'Attendance, payroll review, PDF generation, staff workflows, and multi-location operations.',
      },
    ],
    modules: [
      'Multi-branch patient record foundation',
      'Real-time appointment and availability workflow',
      'Therapist attendance and payroll automation',
      'Integrated CRM-style patient journey tracking',
      'Operational dashboards for clinic visibility',
      'Backend foundation for reports and future workflow modules',
    ],
    technicalApproach: [
      'React and Next.js interface for clinic-facing workflows',
      'Django backend with PostgreSQL for structured patient and operational data',
      'Redis and Celery for background processing where asynchronous work is required',
      'Role-aware workflow planning for clinic staff, management, and operational users',
    ],
    businessValue: [
      'Created a clearer operating foundation for multi-branch clinic work',
      'Made patient context, appointment activity, and follow-ups easier to organize',
      'Helped reduce manual payroll preparation pressure through automation',
      'Gave management a stronger base for operational visibility and future reporting',
    ],
    roadmap: [
      'Deeper patient self-service or patient app workflows if clinic demand supports it',
      'More advanced follow-up automation and source-quality dashboards',
      'Additional healthcare integrations after data model and permissions remain stable in live usage',
    ],
    cta: {
      title: 'Need a similar healthcare system?',
      description: 'Share the clinic workflow, branches, patient records, staff roles, appointment rules, and reporting needs. CodingBull can scope a focused healthcare software build.',
      label: 'Get Healthcare Software Quote',
    },
    stats: [
      { label: 'Patient Records', value: '15k+' },
      { label: 'Daily Interactions', value: '500+' },
      { label: 'Branches', value: '4' },
    ],
    techStack: ['React', 'Next.js', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
  },
  {
    slug: 'shashwat-ivf',
    title: 'High-Conversion Healthcare Lead Generation',
    client: 'Shashwat IVF',
    category: 'Clinic Websites',
    year: '2025',
    accentColor: 'rose',
    challenge: 'Shashwat IVF needed a premium digital presence that captured the trust of prospective patients while automating their booking flow and reducing phone-call burden on staff.',
    solution: 'Designed and engineered an immersive, high-performance website with real-time slot booking and an automated WhatsApp notification engine for appointments and reminders.',
    outcome: 'Significant reduction in manual booking errors and a 2x increase in qualified online patient inquiries within the first 6 months.',
    summary: 'A healthcare lead-generation website and appointment-flow foundation designed to help prospective patients understand services, build trust, and inquire with less manual booking friction.',
    projectType: 'Healthcare website and lead-generation system',
    market: 'Ahmedabad / India healthcare search and patient inquiries',
    mainServiceCategory: 'Healthcare website and clinic software',
    deliveryModel: 'Founder-led website and workflow build',
    status: 'Deployed project case study',
    servicesInvolved: [
      {
        label: 'Healthcare Software Development',
        href: '/services/healthcare-software-development',
        description: 'Healthcare workflows, patient inquiry paths, appointment readiness, and secure operating foundations.',
      },
      {
        label: 'Clinic Management Software Development',
        href: '/services/clinic-management-software-development',
        description: 'Appointment workflows, patient management, follow-up visibility, and clinic-facing operational logic.',
      },
      {
        label: 'Hospital Management Software Development',
        href: '/services/hospital-management-software-development',
        description: 'Healthcare workflow planning, departments, roles, reporting, and integration-ready architecture for larger care teams.',
      },
      {
        label: 'Web Development Company in Ahmedabad',
        href: '/web-development-company-ahmedabad',
        description: 'SEO-ready business websites, lead-generation pages, WhatsApp/contact flows, and maintainable code.',
      },
    ],
    modules: [
      'Premium healthcare website structure',
      'Patient inquiry and booking flow',
      'WhatsApp notification and reminder workflow',
      'Responsive service and trust-building pages',
      'Performance-conscious frontend foundation',
      'Healthcare content structure for patient decision-making',
    ],
    technicalApproach: [
      'Next.js frontend for fast, structured public pages',
      'Framer Motion used for controlled premium interaction',
      'Django API foundation for booking and workflow behavior',
      'WhatsApp Business workflow used for appointment communication where scoped',
    ],
    businessValue: [
      'Created a clearer digital presence for prospective patients',
      'Made the inquiry and booking path easier to understand and act on',
      'Reduced dependence on manual phone-call handling for every booking step',
      'Established a foundation for future clinic workflow and patient communication improvements',
    ],
    roadmap: [
      'Deeper service landing pages for specific treatment searches',
      'More structured patient follow-up flows after inquiry data is reviewed',
      'Expanded clinic or hospital workflow modules if operational scope grows beyond the website',
    ],
    cta: {
      title: 'Need a similar healthcare website or booking flow?',
      description: 'Share the services, inquiry process, appointment flow, and patient trust concerns. CodingBull can scope a website and workflow foundation.',
      label: 'Get Healthcare Website Quote',
    },
    stats: [
      { label: 'Lead Growth', value: '120%' },
      { label: 'Booking Speed', value: '<2min' },
      { label: 'Automation', value: '80%' },
    ],
    techStack: ['Next.js', 'Framer Motion', 'Django API', 'WhatsApp Business'],
  },
  {
    slug: 'anr-mechanical',
    title: 'Industrial Portfolio for Enterprise Tenders',
    client: 'ANR Mechanicals',
    category: 'Industrial Systems',
    year: '2024',
    accentColor: 'blue',
    challenge: 'ANR Mechanicals had no digital proof of their massive scale (like the 150,000 sqft Tesla facility), making it difficult to win high-end tenders against digitally-savvy competitors.',
    solution: 'Built a cinematic, high-impact portfolio showcased their engineering precision through interactive project modules and high-resolution industrial documentation.',
    outcome: 'Transformed their sales process, enabling their team to present their scale to enterprise boards and securing bigger contracts using the digital portfolio.',
    summary: 'An industrial portfolio website built to help ANR Mechanicals present project scale, engineering capability, and business credibility during enterprise tender and sales conversations.',
    projectType: 'Industrial portfolio and business website',
    market: 'Industrial / enterprise tender presentation',
    mainServiceCategory: 'Business website and custom systems foundation',
    deliveryModel: 'Founder-led website and digital proof build',
    status: 'Deployed project case study',
    servicesInvolved: [
      {
        label: 'Web Development Company in Ahmedabad',
        href: '/web-development-company-ahmedabad',
        description: 'Business websites, responsive pages, SEO-ready structure, lead capture, and maintainable code.',
      },
      {
        label: 'Custom Business Systems',
        href: '/services/custom-business-systems',
        description: 'Business process software, dashboards, portals, workflow systems, and reporting foundations.',
      },
      {
        label: 'Inventory and Order Management Software',
        href: '/services/inventory-order-management-software',
        description: 'Inventory, order, stock, and operational workflow systems that can be scoped for commerce or industrial operations.',
      },
      {
        label: 'Software Development Company in Ahmedabad',
        href: '/software-development-company-ahmedabad',
        description: 'Custom software, CRM, HRMS, admin panels, e-commerce, healthcare systems, dashboards, and automation.',
      },
    ],
    modules: [
      'Cinematic industrial portfolio structure',
      'Project showcase and capability presentation',
      'High-resolution project documentation display',
      'Responsive frontend presentation for sales conversations',
      'Static optimization foundation for fast public pages',
      'Expandable structure for future business proof and project modules',
    ],
    technicalApproach: [
      'React and Next.js frontend for the public portfolio',
      'GSAP used for controlled motion and industrial presentation',
      'Static optimization for public-facing project pages',
      'Visual structure designed around proof, scale, and presentation clarity',
    ],
    businessValue: [
      'Created a stronger digital proof asset for enterprise presentations',
      'Made project scale easier to show during tender and sales conversations',
      'Helped organize industrial documentation into a more credible public format',
      'Built a foundation that can later support deeper project pages or operational modules',
    ],
    roadmap: [
      'Add deeper project pages as more approved project documentation becomes available',
      'Connect inquiry flows or CRM tracking if sales operations require it',
      'Scope inventory, order, or operations dashboards separately if internal workflow needs emerge',
    ],
    cta: {
      title: 'Need a similar business website or proof system?',
      description: 'Share the business proof, project portfolio, sales process, and internal workflow needs. CodingBull can scope a focused website or custom software foundation.',
      label: 'Get Business Website Quote',
    },
    stats: [
      { label: 'Tesla Facility', value: '150k sqft' },
      { label: 'Contracts Won', value: '+3' },
      { label: 'Brand Value', value: 'High' },
    ],
    techStack: ['React', 'GSAP', 'Next.js', 'Static Optimization'],
  },
];

export const caseStudiesBySlug = Object.fromEntries(caseStudies.map(cs => [cs.slug, cs]));
