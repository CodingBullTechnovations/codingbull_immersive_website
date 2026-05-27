// =============================================================================
// Shared TypeScript types for all content structures
// =============================================================================

// --- Site Config ---
export interface SiteConfig {
  companyName: string;
  tagline: string;
  positioningStatement: string;
  whatsappNumber: string;
  whatsappMessages: Record<string, string>;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
  registration: {
    gst?: string;
    cin?: string;
  };
  baseUrl: string;
}

// --- Navigation ---
export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  href?: string;
  items: NavItem[];
}

export type NavEntry = NavItem | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return 'items' in entry;
}

// --- CTA ---
export type CTAVariant = 'primary' | 'secondary' | 'ghost';

export interface CTAConfig {
  label: string;
  href: string;
  variant: CTAVariant;
  trackingSource: string;
  icon?: 'whatsapp' | 'arrow' | 'phone' | 'calendar';
}

// --- Trust & Stats ---
export interface TrustStat {
  label: string;
  value: string;
  icon?: string;
}

// --- Process ---
export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

// --- FAQ ---
export interface FAQItem {
  question: string;
  answer: string;
}

// --- Testimonial ---
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  industry: string;
}

// --- Case Study ---
export interface CaseStudy {
  slug: string;
  clientName: string;
  clientIndustry: string;
  challenge: string;
  businessContext: string;
  whyCustom: string;
  whatWasBuilt: string;
  modules: string[];
  implementationHighlights: string[];
  outcome: string;
  image?: string;
  ctaLabel: string;
}

// --- Service Page ---
export interface ServicePainPoint {
  title: string;
  description: string;
  icon?: string;
}

export interface ServiceModule {
  title: string;
  description: string;
}

export interface ServicePage {
  slug: string;
  title: string;
  subtitle: string;
  heroDescription: string;
  painPoints: ServicePainPoint[];
  solutions: ServiceModule[];
  modules: string[];
  features: string[];
  faq: FAQItem[];
  cta: CTAConfig;
  relatedCaseStudies: string[]; // slugs
}

// --- Geo Page ---
export interface GeoPage {
  slug: string;
  city?: string;
  region: string;
  country: string;
  headline: string;
  subheadline: string;
  description: string;
  trustSignals: string[];
  servicesHighlight: string[];
  localCaseStudies: string[]; // slugs
  cta: CTAConfig;
}

// --- Homepage Sections ---
export interface HeroContent {
  headline: string;
  subheadline: string;
  primaryCTA: CTAConfig;
  secondaryCTA: CTAConfig;
}

export interface WhatWeBuildItem {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
  icon: string;
}

export interface ProofMetric {
  value: string;
  label: string;
  description?: string;
}

export interface FounderNote {
  message: string;
  name: string;
  role: string;
  cta: CTAConfig;
}

export interface HomeContent {
  hero: HeroContent;
  trustStats: TrustStat[];
  whatWeBuild: WhatWeBuildItem[];
  industryFocus: ServicePainPoint[];
  whyChooseUs: WhyChooseUsItem[];
  proof: ProofMetric[];
  featuredCaseStudies: string[]; // slugs
  process: ProcessStep[];
  faq: FAQItem[];
  founderNote: FounderNote;
  finalCTA: CTAConfig;
}

// --- Insights / Blog ---
export interface InsightFrontmatter {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  description: string;
  author: string;
  readingTime?: string;
  image?: string;
}

// --- Footer ---
export interface FooterColumn {
  title: string;
  links: NavItem[];
}

export interface FooterContent {
  columns: FooterColumn[];
  legalLinks: NavItem[];
  companyInfo: string;
}

// --- Page Metadata ---
export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  noIndex?: boolean;
}
