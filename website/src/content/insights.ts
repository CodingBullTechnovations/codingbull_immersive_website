export interface InsightPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;      // Full article content (markdown-style)
  author: string;
  date: string;
  readingTime: string;
  category: string;
  accentColor: string;
}

export const insights: InsightPost[] = [
  {
    slug: 'why-django-powers-healthcare-backends',
    title: 'Why Django Powers Our Healthcare Backends',
    excerpt: 'Django\'s built-in admin, ORM, and security middleware make it the ideal choice for healthcare platforms where data integrity and rapid iteration matter most.',
    content: `
## The Healthcare Backend Challenge

Building healthcare software isn't like building a typical web app. You're dealing with sensitive patient data, complex scheduling logic, and regulatory requirements that change across regions. The backend framework you choose has to handle all of this without becoming a maintenance nightmare.

## Why We Chose Django

After evaluating Node.js, Spring Boot, and Laravel for our healthcare projects (including Physioways Active Health LLP), we settled on Django for three core reasons:

### 1. The Admin Panel is a Superpower

Django's auto-generated admin panel means our healthcare clients get a full CMS out of the box. Clinic managers can update doctor schedules, view attendance reports, and manage patient data — all without waiting for us to build custom interfaces.

For Physioways, we extended the admin with:
- Custom attendance tracking dashboards
- Payroll calculation views with override capabilities
- Staff KPI monitoring widgets

### 2. ORM + Migrations = Data Safety

Healthcare data schemas evolve constantly. New fields for COVID protocols, insurance integrations, telehealth flags — Django's migration system handles schema evolution gracefully. We've pushed 200+ migrations on a single project without a single data loss incident.

### 3. Security by Default

Django's middleware stack gives us CSRF protection, SQL injection prevention, and session management out of the box. For healthcare, we layer on:
- Field-level encryption for PII
- Role-based access control (RBAC) per clinic branch
- Audit logging for every data mutation

## Real-World Performance

Our Physioways deployment handles 500+ daily appointment operations with sub-200ms API response times on a single \$40/month server. Django's efficiency means healthcare startups can launch without enterprise-level infrastructure costs.

## When Django Isn't the Answer

We're honest — Django isn't ideal for real-time features like live chat or WebSocket-heavy applications. For those, we pair Django's API layer with a lightweight Node.js service for the real-time components.

## Bottom Line

Django lets us ship healthcare platforms in weeks, not months, with the security and maintainability that medical software demands.
    `.trim(),
    author: 'Pranshu Dixit',
    date: '2025-03-15',
    readingTime: '6 min read',
    category: 'Backend Architecture',
    accentColor: 'teal',
  },
  {
    slug: 'react-nextjs-seo-first-ecommerce',
    title: 'React + Next.js for SEO-First E-Commerce',
    excerpt: 'How we built an e-commerce platform that ranks on page 1 for competitive keywords using server-side rendering, structured data, and Core Web Vitals optimization.',
    content: `
## The SEO Problem with Traditional React SPAs

Most React e-commerce sites are client-side rendered SPAs. Google can crawl them, but the rendering delay means:
- Product pages often aren't indexed for weeks
- Dynamic content (prices, stock status) isn't captured accurately
- Core Web Vitals scores suffer, hurting rankings

## Our Next.js Architecture

For our enterprise e-commerce client, we built a hybrid rendering strategy:

### Static Generation for Product Catalogs

Product listing pages are statically generated at build time with ISR (Incremental Static Regeneration) set to 60 seconds. This means:
- Pages load in under 1 second globally
- Product data refreshes every minute from our Django backend
- Zero server load for the most-visited pages

### Server-Side Rendering for Dynamic Pages

Cart, checkout, and user account pages use SSR to ensure real-time accuracy. We pass authentication cookies server-side so the page arrives fully rendered.

### Structured Data Automation

Every product page automatically generates:
- Product schema with price, availability, review ratings
- BreadcrumbList schema for navigation context
- Organization schema for brand authority

This is generated from our Django admin — no developer intervention needed.

## Django as the Content Engine

Here's what makes our architecture unique: **almost all frontend content is controlled from the Django backend.** The store manager can:
- Update hero banners and promotional sections
- Modify product descriptions, pricing, and media
- Control category hierarchies and navigation
- Manage SEO meta tags per page

The Next.js frontend fetches this data at build time, so changes propagate within the ISR interval without any redeployment.

## Results

Within 3 months of launch:
- **47 product keywords** ranking on Google page 1
- **LCP under 1.2 seconds** on mobile
- **Conversion rate 2.3x higher** than the previous Shopify store

## Integration Stack

- **Razorpay** for payments with automatic receipt generation
- **Shiprocket** for logistics with real-time tracking widgets
- **Cloudflare** for CDN, DDoS protection, and edge caching

## Key Takeaway

SEO for e-commerce isn't about meta tags — it's about architecture. Server-rendered pages with structured data, fast load times, and fresh content is what Google actually rewards.
    `.trim(),
    author: 'Pranshu Dixit',
    date: '2025-02-28',
    readingTime: '7 min read',
    category: 'E-Commerce Engineering',
    accentColor: 'amber',
  },
  {
    slug: 'building-hrms-that-scales-500-employees',
    title: 'Building HRMS That Scales to 500+ Employees',
    excerpt: 'The architectural decisions behind our custom HRMS platform — from complex payroll algorithms to multi-branch attendance tracking.',
    content: `
## Why Off-the-Shelf HRMS Fails at Scale

We've seen companies outgrow Zoho People, greytHR, and even custom Excel sheets within 2 years. The pattern is always the same:
- Payroll edge cases the platform can't handle (special allowances, project-based bonuses)
- Attendance rules that don't match actual shift patterns
- Leave policies too complex for the platform's configuration UI

## Our Approach: Configuration Over Customization

Instead of building a rigid system, we built a **rule engine** that clinic and factory managers can configure:

### The Payroll Formula Engine

Every organization has unique payroll calculations. Our engine supports:

\`\`\`
Base Salary → Attendance Deductions → PF/ESI → Tax → Bonuses → Net Pay
\`\`\`

Each step is a configurable rule. For our client Physioways:
- Therapists get per-session bonuses above a threshold
- Admin staff have fixed monthly salaries with overtime
- Part-time contractors are paid hourly with a different tax bracket

All of this runs through the same engine with different rule configurations.

### Multi-Branch Attendance

For organizations with 3+ locations, attendance gets complicated:
- Different shift timings per branch
- Employees floating between branches
- Branch-specific holidays and compensatory offs

We solved this with a **branch context** system — every attendance record is tagged with a branch ID, and policies cascade from organization → branch → department → individual.

### The Self-Service Portal

Employees interact with the system through a mobile-optimized portal:
- Apply for leave and track approval status
- Download payslips (auto-generated PDFs)
- View attendance history and regularization requests
- Update personal documents and bank details

### Compliance Reports

The system auto-generates:
- Monthly PF/ESI reports in government-mandated formats
- Form 16 for income tax filing
- Attendance summary reports for labor law compliance

## Technical Architecture

- **Django** handles business logic and the admin interface
- **Celery + Redis** processes payroll calculations asynchronously (500 payslips in under 30 seconds)
- **PostgreSQL** with partitioned tables for attendance data (millions of rows)
- **React** frontend for the employee self-service portal
- **PDF generation** via WeasyPrint for payslips and reports

## Scaling Lessons

1. **Index your attendance queries** — queries filtering by date + branch + employee are the most common
2. **Cache payroll calculations** — once a month's payroll is finalized, cache the results
3. **Async everything** — payroll, report generation, and bulk operations should never block the API

## Results

Our HRMS now handles 500+ employees across 4 branches with:
- Payroll processing in under 45 seconds
- 99.9% attendance accuracy
- Zero payroll disputes since launch
    `.trim(),
    author: 'Pranshu Dixit',
    date: '2025-01-20',
    readingTime: '8 min read',
    category: 'Enterprise Systems',
    accentColor: 'violet',
  },
  {
    slug: 'anr-mechanicals-digital-presence',
    title: 'How We Built ANR Mechanicals\' Digital Presence',
    excerpt: 'From zero online presence to showcasing their 150,000 sqft Tesla project — how we designed a portfolio that captures enterprise attention.',
    content: `
## The Challenge

ANR Mechanicals had completed massive projects — including a 150,000 sqft facility for Tesla — but had zero digital presence. Their leads came entirely from word-of-mouth and industry connections.

They needed a portfolio website that:
- Showcased their enterprise-scale capabilities
- Attracted new clients from search engines
- Projected the same quality and precision as their physical work

## Design Philosophy

For an engineering company, the website had to communicate **precision, scale, and reliability.** We chose:

### Visual Language
- Dark theme with high-contrast imagery
- Large-format project photography
- Minimal text, maximum visual impact
- Statistics and numbers prominently displayed (150,000 sqft, 200+ projects)

### Information Architecture
- Hero section immediately showcasing the Tesla project
- Project gallery with filterable categories (Industrial, Commercial, Residential)
- Capabilities section with technical specifications
- Contact section optimized for B2B inquiry capture

## Technical Implementation

Unlike our full-stack projects, ANR Mechanicals needed a fast, static website:

- **React** for component architecture and smooth interactions
- **Static deployment** for near-instant load times
- **Image optimization** — compressed project photos from 5MB to under 200KB without visible quality loss
- **SEO optimization** — structured data for local business, service area pages

## The Tesla Project Showcase

The centerpiece of the site is the Tesla project section. We designed it as a scroll-driven reveal:
1. The 150,000 sqft number animates in as the user scrolls
2. Project details (scope, timeline, specifications) appear sequentially
3. High-resolution imagery fills the viewport

This single section has generated more inbound inquiries than anything else on the site.

## Results

Within 6 months:
- **First page Google ranking** for "mechanical contractor Ahmedabad"
- **3x increase** in inbound project inquiries
- **Enterprise clients** reaching out after seeing the Tesla project showcase

## Tactical Architecture & Internal Systems

To protect the proprietary architectural advantages of our clients, certain mission-critical backend tools—such as bespoke project tracking and vendor management systems—remain strictly internal. However, the public-facing platform stands as a definitive case for modernizing industrial operations through premium digital engineering.

## Key Insight

For B2B companies, your website's job isn't to sell — it's to qualify. The Tesla project showcase doesn't explain every technical detail. It simply signals: "We operate at this scale." That's enough to start the conversation.
    `.trim(),
    author: 'Pranshu Dixit',
    date: '2024-12-10',
    readingTime: '5 min read',
    category: 'Case Study',
    accentColor: 'sky',
  },
];

export const insightsBySlug = Object.fromEntries(insights.map(i => [i.slug, i]));
