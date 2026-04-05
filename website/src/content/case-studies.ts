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
    stats: [
      { label: 'Tesla Facility', value: '150k sqft' },
      { label: 'Contracts Won', value: '+3' },
      { label: 'Brand Value', value: 'High' },
    ],
    techStack: ['React', 'GSAP', 'Next.js', 'Static Optimization'],
  },
];

export const caseStudiesBySlug = Object.fromEntries(caseStudies.map(cs => [cs.slug, cs]));
