/**
 * The site's internal link graph in one typed place.
 *
 * Audit findings this closes: /ahmedabad had zero contextual inbound links;
 * the two Ahmedabad keyword pages never linked back; the four country pages
 * never cross-linked; child service pages rendered no related links because
 * the old map was parent-only; case studies and insights never referenced
 * each other; detail pages never linked back to their index.
 *
 * Rule: define each relationship ONCE here, derive the reverse automatically,
 * and render it through the shared RelatedLinksRail. Never hand-add anchors.
 */

export interface GraphLink {
  label: string;
  href: string;
  description?: string;
}

/** Parent service → its specialised child services (authored once). */
const serviceChildren: Record<string, GraphLink[]> = {
  'healthcare-software-development': [
    {
      label: 'Clinic Management Software Development',
      href: '/services/clinic-management-software-development',
      description: 'Appointments, patient records, doctor schedules, follow-ups, billing workflows, and role-based access for clinics.',
    },
    {
      label: 'Hospital Management Software Development',
      href: '/services/hospital-management-software-development',
      description: 'Patient registration, department workflows, admin dashboards, and billing/reporting foundations for hospitals.',
    },
  ],
  'ecommerce-development': [
    {
      label: 'Inventory and Order Management Software',
      href: '/services/inventory-order-management-software',
      description: 'Stock tracking, SKU management, order workflows, and payment/shipping readiness.',
    },
  ],
  'custom-hrms-payroll-software': [
    {
      label: 'Attendance and Payroll Management Software',
      href: '/services/attendance-payroll-management-software',
      description: 'Attendance capture, leave, shift rules, payroll calculation, approvals, and HR reporting.',
    },
  ],
  'custom-business-systems': [
    {
      label: 'Custom CRM Development',
      href: '/services/custom-crm-development',
      description: 'Lead tracking, customer management, follow-ups, role-based access, workflow automation, and dashboards.',
    },
  ],
};

/** Human labels for the parent services, used when generating child→parent links. */
const serviceParentLabels: Record<string, string> = {
  'healthcare-software-development': 'Healthcare Software Development',
  'ecommerce-development': 'E-commerce Development',
  'custom-hrms-payroll-software': 'HRMS and Payroll Software',
  'custom-business-systems': 'Custom Business Systems',
};

/**
 * Bidirectional service graph: parent → children, child → parent, and
 * child ↔ sibling. Built once at module load from `serviceChildren`, so the
 * reverse direction can never drift out of sync with the forward one.
 */
export const serviceRelatedLinks: Record<string, GraphLink[]> = (() => {
  const graph: Record<string, GraphLink[]> = {};

  for (const [parentSlug, children] of Object.entries(serviceChildren)) {
    graph[parentSlug] = [...children];

    for (const child of children) {
      const childSlug = child.href.replace('/services/', '');
      const siblings = children.filter((item) => item.href !== child.href);
      graph[childSlug] = [
        {
          label: serviceParentLabels[parentSlug] ?? parentSlug,
          href: `/services/${parentSlug}`,
          description: 'The broader service this specialisation sits inside.',
        },
        ...siblings,
      ];
    }
  }

  return graph;
})();

export const countryPages: GraphLink[] = [
  { label: 'India', href: '/india', description: 'Custom software for Indian businesses.' },
  { label: 'USA', href: '/usa', description: 'Procurement-ready delivery for USA teams.' },
  { label: 'UAE', href: '/uae', description: 'Fast delivery for UAE operations.' },
  { label: 'Canada', href: '/canada', description: 'Secure delivery for Canadian businesses.' },
];

/** Every country page links to the other three. */
export function countrySiblings(currentHref: string): GraphLink[] {
  return countryPages.filter((page) => page.href !== currentHref);
}

export const ahmedabadCluster: GraphLink[] = [
  {
    label: 'Software Company in Ahmedabad',
    href: '/ahmedabad',
    description: 'Local delivery model, service coverage, and how Ahmedabad engagements run.',
  },
  {
    label: 'Software Development Company in Ahmedabad',
    href: '/software-development-company-ahmedabad',
    description: 'Custom software, CRM, HRMS, dashboards, and internal systems for Ahmedabad businesses.',
  },
  {
    label: 'Web Development Company in Ahmedabad',
    href: '/web-development-company-ahmedabad',
    description: 'Business websites, responsive pages, and inquiry-focused web presence.',
  },
];

/** The other two pages in the Ahmedabad cluster. */
export function ahmedabadSiblings(currentHref: string): GraphLink[] {
  return ahmedabadCluster.filter((page) => page.href !== currentHref);
}

/** Entry points offered from otherwise dead-end pages (about, contact, legal). */
export const primaryEntryPoints: GraphLink[] = [
  {
    label: 'Services',
    href: '/services',
    description: 'Healthcare, e-commerce, HRMS, and custom business systems we build.',
  },
  {
    label: 'Case Studies',
    href: '/case-studies',
    description: 'Deployed systems with the constraints and decisions behind them.',
  },
  {
    label: 'Insights',
    href: '/insights',
    description: 'Operational writing from real delivery work.',
  },
];
