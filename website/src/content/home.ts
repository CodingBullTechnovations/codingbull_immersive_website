import type { HomeContent } from '@/types/content';

export const homeContent: HomeContent = {
  hero: {
    headline: 'Proprietary Digital Products That Run Your Enterprise',
    subheadline:
      'Healthcare scheduling. E-commerce architecture. Enterprise workforce management. We engineer the core software infrastructure that serious businesses depend on.',
    primaryCTA: {
      label: 'Get Fixed-Price Quote',
      href: '#whatsapp',
      variant: 'primary',
      trackingSource: 'hero_primary',
      icon: 'whatsapp',
    },
    secondaryCTA: {
      label: 'View Case Studies',
      href: '/case-studies',
      variant: 'secondary',
      trackingSource: 'hero_secondary',
      icon: 'arrow',
    },
  },

  trustStats: [
    { label: 'Founder-Led Architecture', value: 'Direct', icon: 'shield' },
    { label: 'Products Deployed', value: '50+', icon: 'check' },
    { label: 'Core Platforms', value: 'Healthcare · E-com · HRMS', icon: 'layers' },
    { label: 'Adopters', value: 'India & USA', icon: 'globe' },
  ],

  whatWeBuild: [
    {
      title: 'Healthcare Systems',
      description:
        'Clinic websites, appointment booking, patient intake, scheduling, care coordination, and healthcare CRM that clinics actually use.',
      href: '/services/healthcare-software-development',
      icon: 'health',
    },
    {
      title: 'E-commerce Platforms',
      description:
        'High-conversion storefronts, intelligent order management, and Business Process Automation backend systems built exclusively for enterprise growth.',
      href: '/services/ecommerce-development',
      icon: 'cart',
    },
    {
      title: 'HRMS & Payroll',
      description:
        'Attendance tracking, payroll processing, leave management, workforce dashboards, and multi-location operations management.',
      href: '/services/custom-hrms-payroll-software',
      icon: 'users',
    },
    {
      title: 'Custom Business Software',
      description:
        'CRM platforms, appointment systems, reporting dashboards, approval workflows, and operational tools tailored to your process.',
      href: '/contact',
      icon: 'settings',
    },
  ],

  industryFocus: [
    {
      title: 'Healthcare Core Engine',
      description:
        'Our proprietary healthcare platforms handle complex scheduling, automated intake, and multi-location coordination. Currently powering operations at Physioway Active Health LLP and Shashwat IVF.',
      icon: 'health',
    },
    {
      title: 'E-commerce Architecture',
      description:
        'We license high-performance Business Process Automation, order routing, and inventory systems that keep massive international supply chains running flawlessly. Currently deployed at ANR Mechanical (Tesla Supply Chain Partner, NY).',
      icon: 'cart',
    },
    {
      title: 'Enterprise HRMS & Automation',
      description:
        'Powering large-scale operational HRMS through comprehensive Business Process Automation. Our proprietary tools handle attendance, payroll compliance, leave generation, and security logs automatically.',
      icon: 'users',
    },
  ],

  whyChooseUs: [
    {
      title: 'Fixed-Price Projects',
      description:
        'No hourly billing surprises. Every project starts with a clear scope, a fixed price, and a defined timeline. You know what you\'re paying before we write a single line of code.',
      icon: 'price',
    },
    {
      title: 'Custom-Built, Not Template-Based',
      description:
        'We don\'t reskin templates. Every system is designed around your specific workflows, data, and operational needs — because your business isn\'t generic.',
      icon: 'code',
    },
    {
      title: 'Business-Process Understanding',
      description:
        'We don\'t just write code. We understand appointment flows, payroll cycles, order pipelines, and approval chains — and we build software that fits those processes.',
      icon: 'process',
    },
    {
      title: 'Clean, Maintainable Systems',
      description:
        'Every system we deliver is built to last. Clean architecture, proper documentation, and code your future team can actually understand and extend.',
      icon: 'maintain',
    },
  ],

  proof: [
    {
      value: '50+',
      label: 'Platform Deployments',
      description: 'Active installations across our 3 core sectors',
    },
    {
      value: '3',
      label: 'Proprietary Products',
      description: 'Healthcare, E-commerce, and HRMS core systems',
    },
    {
      value: 'Global',
      label: 'Adoption Rate',
      description: 'Licensing technology to India and the USA',
    },
    {
      value: 'Architect-Led',
      label: 'Integrations',
      description: 'Direct technical oversight from setup to launch',
    },
  ],

  featuredCaseStudies: ['anr-mechanical', 'physioway', 'shashwat-ivf'],

  process: [
    {
      number: 1,
      title: 'Discovery',
      description:
        'We learn your business, your workflows, your pain points, and your goals. No generic questionnaires — a real conversation about what you need.',
    },
    {
      number: 2,
      title: 'Scope & Architecture',
      description:
        'We define exactly what will be built, which modules, which integrations, and which workflows. Clear documentation before any development starts.',
    },
    {
      number: 3,
      title: 'Fixed-Price Proposal',
      description:
        'You receive a detailed proposal with scope, timeline, and a fixed price. No hidden costs. No hourly surprises. Approve it and we begin.',
    },
    {
      number: 4,
      title: 'Build & Review',
      description:
        'Iterative development with regular demos. You see progress, give feedback, and we adjust — all within the agreed scope and timeline.',
    },
    {
      number: 5,
      title: 'Launch & Support',
      description:
        'We deploy, test, and hand over. Post-launch support ensures everything runs smoothly. Your system is production-ready from day one.',
    },
  ],

  faq: [
    {
      question: 'How does fixed-price engagement work?',
      answer:
        'We scope your project in detail during the discovery phase, then provide a fixed price and timeline. You approve before any work begins. No hourly billing, no scope ambiguity, no surprise invoices.',
    },
    {
      question: 'What industries do you specialize in?',
      answer:
        'We focus on healthcare software (clinic systems, scheduling, patient management), e-commerce operations (storefronts, order management, backend systems), and HRMS/payroll (attendance, payroll, workforce management).',
    },
    {
      question: 'Do you work with clients outside India?',
      answer:
        'Yes. We serve both Indian and international clients, including businesses in the USA. Our founder-led approach ensures direct communication regardless of timezone.',
    },
    {
      question: 'What technology stack do you use?',
      answer:
        'We use modern, production-grade technologies including React, Next.js, Django, Python, PostgreSQL, and cloud infrastructure. The exact stack is chosen based on your project requirements.',
    },
    {
      question: 'How long does a typical project take?',
      answer:
        'Timelines depend on complexity. A clinic website with booking takes 4–6 weeks. A full HRMS or e-commerce platform takes 8–16 weeks. We provide exact timelines during the scoping phase.',
    },
    {
      question: 'Do you provide ongoing support after launch?',
      answer:
        'Yes. Post-launch support is part of every engagement. We ensure your system is stable, handle any issues, and can extend the system as your business grows.',
    },
  ],

  founderNote: {
    message:
      "Every product we build at CodingBull Technovations Pvt. Ltd. (GSTIN: 24AAMCC7617E1ZP) is overseen directly by me. When you partner with us, you're not talking to a sales team — you're talking to the architect. That's how we keep product quality high and integrations flawless.",
    name: 'Pranshu Dixit',
    role: 'Founder, CodingBull Technovations',
    cta: {
      label: 'Speak to the Architect',
      href: '#whatsapp',
      variant: 'primary',
      trackingSource: 'founder_note_cta',
      icon: 'whatsapp',
    },
  },

  finalCTA: {
    label: 'Start Your Project Today',
    href: '#whatsapp',
    variant: 'primary',
    trackingSource: 'final_cta',
    icon: 'whatsapp',
  },
};
