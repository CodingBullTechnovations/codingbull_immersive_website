CODE QUALITY, DRY, AND BEST PRACTICES REQUIREMENTS:

The implementation must follow strong engineering standards.

Core principles:
- DRY: do not repeat layout logic, styling logic, content patterns, metadata patterns, or CTA structures unnecessarily
- Use reusable components and data-driven rendering where appropriate
- Keep components focused and maintainable
- Prefer composition over duplication
- Keep naming clear and production-grade
- Keep styling consistent through design tokens and reusable utility patterns
- Avoid magic numbers and repeated class noise where abstraction improves clarity
- Avoid premature abstraction where it reduces readability

Required best practices:
- TypeScript types for all important props and data structures
- Semantic HTML
- Accessible navigation, buttons, links, forms, headings, and landmarks
- Mobile-first responsive design
- Proper loading behavior for images and media
- Motion only where it improves storytelling or conversion
- Respect prefers-reduced-motion
- Proper error-safe form states
- Maintainable metadata handling
- Clean internal linking structure
- Scalable file and folder naming

Performance best practices:
- Keep hero effects lightweight
- Do not use heavy 3D libraries unless absolutely necessary
- Avoid unnecessary client components
- Prefer server components where suitable
- Lazy-load non-critical visuals
- Optimize all images
- Use modern image formats
- Keep animation performant using transform and opacity where possible

SEO best practices:
- Unique page titles and meta descriptions
- Clear heading hierarchy
- Structured internal links
- Service pages with enough depth to rank
- Geo pages with genuinely localized messaging
- Case studies with real business framing
- Schema-ready structure

Output quality requirement:
Generate code and structure that a senior engineer would consider clean, scalable, and production-appropriate.