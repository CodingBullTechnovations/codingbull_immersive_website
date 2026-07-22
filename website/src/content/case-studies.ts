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
    title: 'Healthcare Treatment & Digital Platform',
    client: 'Physioway Active Health LLP',
    category: 'Healthcare Systems',
    year: '2024',
    accentColor: 'teal',
    challenge: 'Physioway Active Health LLP needed a custom digital platform that could support its day-to-day treatment work and provide a maintainable foundation for its online presence.',
    solution: 'We created Physioways.com as a custom healthcare platform for Physioway Active Health LLP and continue to support the organization through product work and digital marketing.',
    outcome: 'Physioway uses the delivered platform in its day-to-day treatment operations, while CodingBull continues to support its digital presence and marketing.',
    summary: 'A custom healthcare platform used by Physioway Active Health LLP in day-to-day treatment operations, with ongoing product and digital marketing support from CodingBull.',
    projectType: 'Custom healthcare product and digital platform',
    market: 'Ahmedabad / India healthcare operations',
    mainServiceCategory: 'Healthcare software development',
    deliveryModel: 'Founder-led custom software build',
    status: 'Deployed project case study',
    servicesInvolved: [
      {
        label: 'Healthcare Software Development',
        href: '/services/healthcare-software-development',
        description: 'Custom healthcare products designed around real treatment and operating workflows.',
      },
      {
        label: 'Web Development Company in Ahmedabad',
        href: '/web-development-company-ahmedabad',
        description: 'Maintainable public websites, service content, lead paths, and long-term digital foundations.',
      },
    ],
    modules: [
      'Custom healthcare product foundation',
      'Day-to-day treatment workflow support',
      'Public healthcare service experience',
      'Maintainable content and service presentation',
      'Ongoing product support',
      'Digital marketing support',
    ],
    technicalApproach: [
      'Custom web product created for Physioway Active Health LLP',
      'Public healthcare experience delivered at Physioways.com',
      'Maintainable foundation for ongoing product improvements',
      'Product and digital marketing support coordinated by CodingBull',
    ],
    businessValue: [
      'Created a digital platform used in day-to-day treatment operations',
      'Established a clearer online presence for Physioway services',
      'Connected ongoing product work with digital marketing support',
      'Built a foundation that can continue evolving with the organization',
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
      { label: 'Platform', value: 'Physioways.com' },
      { label: 'Operational Use', value: 'Day-to-day' },
      { label: 'Ongoing Support', value: 'Product + marketing' },
    ],
    techStack: ['React', 'Next.js', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
  },
  {
    slug: 'shashwat-ivf',
    title: 'Admin-Managed Healthcare Website',
    client: 'Shashwat IVF',
    category: 'Clinic Websites',
    year: '2025',
    accentColor: 'rose',
    challenge: 'Shashwat IVF needed a professional healthcare website that its own team could keep current without relying on developers for routine content and visual updates.',
    solution: 'We created a healthcare website backed by Django Admin, giving the team control over blogs, colors, images, team members, and other core website content.',
    outcome: 'The delivered website gives Shashwat IVF a maintainable online presence and lets its team manage most public content directly through Django Admin.',
    summary: 'A healthcare website with extensive Django Admin controls for blogs, brand colors, images, team profiles, and core page content.',
    projectType: 'Healthcare website and content management system',
    market: 'Ahmedabad / India healthcare website',
    mainServiceCategory: 'Healthcare website development',
    deliveryModel: 'Founder-led website and CMS build',
    status: 'Deployed project case study',
    servicesInvolved: [
      {
        label: 'Healthcare Software Development',
        href: '/services/healthcare-software-development',
        description: 'Healthcare-facing digital experiences with maintainable content and operating foundations.',
      },
      {
        label: 'Web Development Company in Ahmedabad',
        href: '/web-development-company-ahmedabad',
        description: 'Business websites with editable content, responsive pages, and maintainable code.',
      },
    ],
    modules: [
      'Premium healthcare website structure',
      'Django Admin content management',
      'Blog publishing workflow',
      'Responsive service and trust-building pages',
      'Image and team-member management',
      'Brand color and core content controls',
    ],
    technicalApproach: [
      'Next.js frontend for fast, structured public pages',
      'Framer Motion used for controlled premium interaction',
      'Django Admin backend for structured website content',
      'Editable content models for blogs, media, team members, colors, and page content',
    ],
    businessValue: [
      'Created a clearer digital presence for prospective patients',
      'Let the clinic team publish blogs and update website content directly',
      'Reduced developer dependence for routine image, team, color, and content changes',
      'Established a maintainable foundation for future digital improvements',
    ],
    roadmap: [
      'Deeper service landing pages for specific treatment searches',
      'Structured inquiry analytics after enough website data is available',
      'Clinic workflow integrations if operational scope later grows beyond the website',
    ],
    cta: {
      title: 'Need a similar admin-managed healthcare website?',
      description: 'Share the services, content, media, team profiles, brand controls, and publishing workflow. CodingBull can scope a maintainable website and CMS foundation.',
      label: 'Get Healthcare Website Quote',
    },
    stats: [
      { label: 'Content Backend', value: 'Django Admin' },
      { label: 'Publishing', value: 'Team-managed' },
      { label: 'Editable Areas', value: 'Site-wide' },
    ],
    techStack: ['Next.js', 'Framer Motion', 'Django', 'Structured Content'],
  },
  {
    slug: 'anr-mechanical',
    title: 'Industrial Portfolio & Online Presence',
    client: 'ANR Mechanicals',
    category: 'Industrial Systems',
    year: '2024',
    accentColor: 'blue',
    challenge: 'ANR Mechanicals had no online presence despite an industrial portfolio that included a 150,000 sq ft project for Tesla in New York.',
    solution: 'We built a focused industrial website that presents ANR Mechanicals, its capabilities, and its project portfolio through a clear, modern digital experience.',
    outcome: 'The delivered website established ANR Mechanicals online and gave the company a dedicated place to present major work, including its 150,000 sq ft Tesla project in New York.',
    summary: 'We brought ANR Mechanicals online and turned its industrial portfolio, including a 150,000 sq ft New York project for Tesla, into inspectable digital proof.',
    projectType: 'Industrial portfolio and business website',
    market: 'Industrial services · New York, USA',
    mainServiceCategory: 'Business website development',
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
      'Dedicated showcase for ANR’s Tesla project in New York',
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
      'Established a professional online presence for the business',
      'Made ANR’s 150,000 sq ft Tesla project visible as portfolio proof',
      'Made capabilities and completed work easier for prospective buyers to inspect',
      'Organized industrial project material into a clearer public format',
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
      { label: 'Portfolio Client', value: 'Tesla' },
      { label: 'Project Scale', value: '150,000 sq ft' },
      { label: 'Project Location', value: 'New York, USA' },
    ],
    techStack: ['React', 'GSAP', 'Next.js', 'Static Optimization'],
  },
];

export const caseStudiesBySlug = Object.fromEntries(caseStudies.map(cs => [cs.slug, cs]));
