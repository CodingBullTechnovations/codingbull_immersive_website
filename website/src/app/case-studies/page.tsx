import { PageHero } from '@/components/sections/PageHero';
import { CaseStudyScrollShowcase } from '@/components/sections/CaseStudyScrollShowcase';
import { CTASection } from '@/components/sections/CTASection';
import { homeContent } from '@/content/home';

export const metadata = {
  title: 'Case Studies | CodingBull Technovations',
  description: 'Explore our deployed enterprise software architectures — from healthcare scheduling platforms to e-commerce and HRMS core systems.',
};

const caseStudies = [
  {
    title: 'Physioways Active Health LLP',
    industry: 'Healthcare Operations',
    description: 'Developed a comprehensive software suite handling everything from patient scheduling and attendance tracking to automated payroll processing for a multi-branch physiotherapy clinic network.',
    highlights: ['Attendance & KPI Tracking', 'Automated Payroll Algorithms', 'Staff Management Dashboard', 'Multi-Branch Operations'],
  },
  {
    title: 'Shashwat IVF',
    industry: 'Healthcare & Clinic Management',
    description: 'Built a dynamic system utilizing a powerful Django backend panel, granting full frontend administrative control to update clinic information and patient flows anytime, anywhere.',
    highlights: ['Dynamic Django Backend', 'Full Frontend CMS Control', 'Secure Patient Data Flow', 'Real-Time Content Updates'],
  },
  {
    title: 'ANR Mechanicals',
    industry: 'Engineering & Supply Chain',
    description: 'Designed and developed their high-end portfolio website to capture enterprise attention, notably highlighting their massive 150,000 sqft Tesla project. Other backend work remains under NDA.',
    highlights: ['Tesla 150,000 sqft Project', 'Premium Portfolio Design', 'Lead Capture Architecture', 'SEO Optimization'],
  },
  {
    title: 'Enterprise E-Commerce Platform',
    industry: 'Retail & Distribution',
    description: 'Engineered a highly SEO-friendly React and Django e-commerce platform. Almost all media and inventory is centralized via the backend, integrated with Shiprocket logistics and Razorpay payments.',
    highlights: ['React + Django Stack', 'Shiprocket Integration', 'Razorpay Gateway', 'Centralized Inventory', 'SEO-First Architecture'],
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        title="Architecting Real Systems"
        subtitle="We build proprietary software that runs serious enterprises. Explore our deployed architectures in Healthcare, Supply Chain, and E-Commerce."
        badge="Case Studies"
        accentColor="amber"
      />

      <CaseStudyScrollShowcase studies={caseStudies} />

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
