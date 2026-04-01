TECHNICAL ARCHITECTURE REQUIREMENTS:

Build this as a production-quality marketing website using:

- Next.js (latest stable App Router)
- TypeScript
- Tailwind CSS
- Framer Motion or Motion for lightweight premium interactions
- Optional shadcn/ui components only where they improve consistency
- SEO-friendly server rendering / static generation where appropriate
- Reusable content-driven architecture for case studies, service pages, and geo pages
- Component-based design system
- Clean folder structure
- Strong metadata handling per page
- Schema markup support
- Image optimization
- Accessibility-first markup

ARCHITECTURE RULES:

- The website must be built as a scalable marketing platform, not a one-off visual demo.
- Use reusable section components for hero, trust strip, feature grids, case-study cards, CTA blocks, FAQs, and industry sections.
- Reuse data-driven patterns for service pages, case studies, and geo pages to avoid duplication.
- Keep content configuration separate from UI presentation wherever practical.
- Prepare the architecture so a Django backend or CRM integration can be added later without restructuring the entire frontend.
- Avoid unnecessary dependencies.
- Avoid overengineering.
- Avoid duplicate logic or repeated hardcoded layouts.
- Do not generate a brittle prototype structure.

DO NOT BUILD THIS AS:
- a plain React SPA
- a generic website template
- a purely visual landing page with weak content depth
- a codebase with repeated page-specific duplicated sections