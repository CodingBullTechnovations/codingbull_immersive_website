<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before writing code. Respect deprecations and current file conventions.
<!-- END:nextjs-agent-rules -->

# CodingBull Repo Rules

## Mission

Build a website that feels founder-led, premium, technically serious, and commercially effective.

The target is not "fancy". The target is:
- memorable
- credible
- persuasive
- reusable
- maintainable

## Required Reads

Before doing UI, UX, layout, content-architecture, or motion work:
- read `design-system/MASTER.md`
- read `design-system/ACQUISITION_AND_DISCOVERY_PLAN.md` for homepage, service, proof, insight, and conversion work
- read `design-system/IMPLEMENTATION_PLAN.md` when the change affects page direction
- check current references from `21st.dev/community/components`, especially `newest`, `popular`, and `shaders`, plus `ui-ux-pro-max-skill.nextlevelbuilder.io`

## Design Rules

- One page must follow one dominant visual thesis.
- Prefer controlled cinematic storytelling over stacked gimmicks.
- Do not introduce random gradients, glows, or glass effects without system intent.
- Do not add premium effects that weaken readability.
- Check current design references before making major visual decisions. Do not rely only on stale prior taste.
- Use the existing frame libraries as strategic storytelling assets, not background noise.
- Use 3D or advanced canvas effects only for signature moments with fallback behavior.
- The desired quality bar is current, cinematic, and commercially serious, not experimental for its own sake.

## Motion Rules

- Motion must either guide attention, reveal proof, transition sections, or support CTA.
- Remove decorative motion that does not improve comprehension or persuasion.
- Respect `prefers-reduced-motion`.
- Mobile performance is a hard constraint, not an afterthought.
- Cinematic 3D is allowed only where it materially improves narrative and perceived quality.

## DRY Rules

- Repeated layout structures must become shared section patterns.
- Repeated visual treatments must become tokens or reusable variants.
- Repeated animation timings/easings must be centralized.
- Repeated copy structures should move to typed content/config where practical.
- Avoid one-off classes and one-off component variants when a shared primitive is more correct.
- Latest design inspiration must still be translated into reusable primitives, not pasted one-off effects.

## Content And Conversion Rules

- Headlines should be concrete and specific.
- Proof should appear early.
- Each section must justify its existence through trust, clarity, proof, or conversion.
- Location and industry pages must feel intentional, not duplicated with minor text changes.
- Pages with traffic intent must be structured for GEO, AEO, AIO, LLMO, and VEO, not only classic SEO.

## Technical Rules

- Keep pages understandable without client-side effects.
- Preserve accessibility, contrast, and keyboard usability.
- Prefer simpler implementations when they achieve the same result.
- Do not increase complexity without a measurable UX or business reason.
- Crawlable, quotable, and machine-readable content is required on high-value pages.

## Discovery And Traffic Rules

- GEO: structure content so AI systems can quote, summarize, and cite the brand.
- AEO: create direct-answer sections that can satisfy featured snippets and voice-style queries.
- AIO: make content easy for AI systems to parse through clean hierarchy, metadata, and explicit facts.
- LLMO: write content that is specific, credible, and rich enough for LLMs to trust and reference.
- VEO: optimize for semantic retrieval through topic depth, entity clarity, and conversational phrasing.
- Design and growth planning must happen together. A visually strong page that is weak for discovery is incomplete.

## External Reference Rules

- `21st.dev/community/components` may be used for inspiration, not blind copying.
- `21st.dev/community/components/s/newest` should be checked when the task asks for current design direction.
- `21st.dev/community/components/s/popular` should be checked when the task asks for proven interaction patterns.
- `21st.dev/community/components/s/shaders` should be checked when cinematic 3D, shader, or immersive direction is being considered.
- `ui-ux-pro-max-skill.nextlevelbuilder.io` may be used for design-system reasoning, style selection, and anti-pattern checks.
- Community patterns must be adapted to the CodingBull design system before implementation.
