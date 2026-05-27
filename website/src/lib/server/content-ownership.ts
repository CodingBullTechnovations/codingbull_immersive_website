export type ContentOwnershipLevel = 'DB_CONTROLLED' | 'MIXED_DB_STATIC' | 'STATIC_CODE';

export interface ContentOwnershipItem {
  route: string;
  label: string;
  level: ContentOwnershipLevel;
  editableInAdmin: boolean;
  adminSection: string | null;
  ownerNote: string;
}

const ownershipMatrix: ContentOwnershipItem[] = [
  {
    route: '/services/[service]',
    label: 'Service detail pages',
    level: 'DB_CONTROLLED',
    editableInAdmin: true,
    adminSection: '/admin/content/services',
    ownerNote: 'Published service pages are controlled from admin after seeding.',
  },
  {
    route: '/insights/[slug]',
    label: 'Insight article pages',
    level: 'DB_CONTROLLED',
    editableInAdmin: true,
    adminSection: '/admin/content/insights',
    ownerNote: 'Published insight articles are controlled from admin after seeding.',
  },
  {
    route: '/case-studies/[slug]',
    label: 'Case study detail pages',
    level: 'DB_CONTROLLED',
    editableInAdmin: true,
    adminSection: '/admin/content/case-studies',
    ownerNote: 'Published case studies are controlled from admin after seeding.',
  },
  {
    route: '/insights',
    label: 'Insights index page',
    level: 'MIXED_DB_STATIC',
    editableInAdmin: true,
    adminSection: '/admin/content/insights',
    ownerNote: 'Shows DB posts first and static fallback where DB content is missing.',
  },
  {
    route: '/services',
    label: 'Services index page',
    level: 'STATIC_CODE',
    editableInAdmin: false,
    adminSection: null,
    ownerNote: 'Page copy and ordering are code-managed.',
  },
  {
    route: '/case-studies',
    label: 'Case studies index page',
    level: 'STATIC_CODE',
    editableInAdmin: false,
    adminSection: null,
    ownerNote: 'Page copy and proof layout are code-managed.',
  },
  {
    route: '/',
    label: 'Homepage',
    level: 'STATIC_CODE',
    editableInAdmin: false,
    adminSection: null,
    ownerNote: 'Hero, sections, and CTA copy are code-managed.',
  },
  {
    route: '/about',
    label: 'About page',
    level: 'STATIC_CODE',
    editableInAdmin: false,
    adminSection: null,
    ownerNote: 'Founder and company narrative are code-managed.',
  },
  {
    route: '/contact',
    label: 'Contact page',
    level: 'STATIC_CODE',
    editableInAdmin: false,
    adminSection: null,
    ownerNote: 'Contact messaging is code-managed; lead capture flows into admin.',
  },
  {
    route: '/ahmedabad',
    label: 'Ahmedabad landing page',
    level: 'STATIC_CODE',
    editableInAdmin: false,
    adminSection: null,
    ownerNote: 'City-specific content is code-managed.',
  },
  {
    route: '/india',
    label: 'India landing page',
    level: 'STATIC_CODE',
    editableInAdmin: false,
    adminSection: null,
    ownerNote: 'Regional positioning and CTA copy are code-managed.',
  },
  {
    route: '/usa',
    label: 'USA landing page',
    level: 'STATIC_CODE',
    editableInAdmin: false,
    adminSection: null,
    ownerNote: 'Regional positioning and CTA copy are code-managed.',
  },
  {
    route: '/privacy',
    label: 'Privacy policy page',
    level: 'STATIC_CODE',
    editableInAdmin: false,
    adminSection: null,
    ownerNote: 'Legal policy content is code-managed.',
  },
  {
    route: '/terms',
    label: 'Terms page',
    level: 'STATIC_CODE',
    editableInAdmin: false,
    adminSection: null,
    ownerNote: 'Legal policy content is code-managed.',
  },
];

export function getContentOwnershipMatrix() {
  return ownershipMatrix;
}

export function getContentOwnershipSummary() {
  const dbControlled = ownershipMatrix.filter((item) => item.level === 'DB_CONTROLLED').length;
  const mixed = ownershipMatrix.filter((item) => item.level === 'MIXED_DB_STATIC').length;
  const staticCode = ownershipMatrix.filter((item) => item.level === 'STATIC_CODE').length;

  return {
    dbControlled,
    mixed,
    staticCode,
    notAdminControlled: ownershipMatrix.filter((item) => !item.editableInAdmin),
  };
}
