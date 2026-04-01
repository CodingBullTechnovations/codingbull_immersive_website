import type { NavEntry } from '@/types/content';

export const mainNav: NavEntry[] = [
  {
    label: 'Services',
    href: '/services',
    items: [
      {
        label: 'Healthcare Software',
        href: '/services/healthcare-software-development',
        description: 'Clinic systems, scheduling, patient management',
      },
      {
        label: 'E-commerce Systems',
        href: '/services/ecommerce-development',
        description: 'Storefronts, order workflows, backend ops',
      },
      {
        label: 'HRMS & Payroll',
        href: '/services/custom-hrms-payroll-software',
        description: 'Attendance, payroll, workforce management',
      },
      {
        label: 'Clinic Website & Scheduling',
        href: '/services/clinic-website-and-scheduling',
        description: 'Premium clinic websites with booking',
      },
      {
        label: 'Custom CRM & Appointments',
        href: '/services/custom-crm-appointment-software',
        description: 'CRM, scheduling, client management',
      },
    ],
  },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
];
