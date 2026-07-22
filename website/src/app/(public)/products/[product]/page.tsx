import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/sections/PageHero';
import { CTASection } from '@/components/sections/CTASection';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/animations/Reveal';
import { SystemMockup } from '@/components/sections/SystemMockup';
import { RelatedLinksRail } from '@/components/sections/RelatedLinksRail';
import { homeContent } from '@/content/home';
import { products, productsBySlug } from '@/content/products';
import { siteConfig } from '@/content/site';
import { generatePageMetadata, canonicalUrl } from '@/lib/seo';
import {
  JsonLd,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateSoftwareApplicationSchema,
} from '@/lib/schema';

export function generateStaticParams() {
  return products.map((product) => ({ product: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ product: string }> }): Promise<Metadata> {
  const { product: slug } = await params;
  const product = productsBySlug[slug];
  if (!product) return { title: 'Product Not Found' };

  return generatePageMetadata({
    title: `${product.name} — ${product.category} by CodingBull`,
    description: product.summary,
    keywords: [product.name, product.category, 'CodingBull product', 'remote jobs for engineers'],
    canonical: canonicalUrl(`/products/${product.slug}`),
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ product: string }> }) {
  const { product: slug } = await params;
  const product = productsBySlug[slug];
  if (!product) notFound();

  const productUrl = `${siteConfig.baseUrl}/products/${product.slug}`;

  return (
    <>
      <JsonLd
        data={generateSoftwareApplicationSchema({
          name: product.name,
          description: product.summary,
          url: product.liveUrl,
          applicationCategory: 'BusinessApplication',
        })}
      />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: 'Home', url: siteConfig.baseUrl },
          { name: 'Products', url: `${siteConfig.baseUrl}/products` },
          { name: product.name, url: productUrl },
        ])}
      />
      {product.faqs.length > 0 && <JsonLd data={generateFAQSchema(product.faqs)} />}

      <PageHero title={product.name} subtitle={product.tagline} badge={product.category} />

      <section className="mind-section cb-section border-b border-white/[0.08]" aria-labelledby="product-overview-title">
        <div className="cb-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="cb-kicker">Overview</p>
            <h2 id="product-overview-title" className="cb-display mt-6 text-[clamp(2rem,3.8vw,3.4rem)]">
              A product that proves the thesis.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/60">{product.overview}</p>
            <div className="mt-9">
              <Button
                label={`Open ${product.name}`}
                href={product.liveUrl}
                variant="primary"
                icon="arrow"
                trackingSource={`product_${product.slug}_live`}
                size="large"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <SystemMockup kind="radar" />
          </Reveal>
        </div>
      </section>

      <section className="mind-section cb-section border-b border-white/[0.08]" aria-labelledby="product-how-title">
        <div className="cb-shell">
          <Reveal className="border-b border-white/10 pb-12">
            <p className="cb-kicker">How it works</p>
            <h2 id="product-how-title" className="cb-display mt-6 max-w-[14ch]">
              Find. Filter. Apply.
            </h2>
          </Reveal>
          <Reveal mode="group" className="grid gap-px border-l border-white/10 md:grid-cols-3">
            {product.steps.map((step, index) => (
              <div
                key={step.title}
                data-reveal=""
                style={{ ['--reveal-delay' as string]: `${index * 0.08}s` }}
                className="border-b border-r border-white/10 bg-white/[0.008] p-7 sm:p-9"
              >
                <span className="cb-mono text-xs tracking-[0.18em] text-[var(--accent-soft)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 font-[family-name:var(--font-display)] text-xl font-medium tracking-[-0.02em] text-white">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/55">{step.description}</p>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-14">
            <p className="cb-kicker">What’s inside</p>
            <ul className="mt-8 grid gap-px border-l border-t border-white/10 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="border-b border-r border-white/10 p-6 text-sm leading-7 text-white/70">
                  {feature}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {product.faqs.length > 0 && (
        <section className="mind-section cb-section border-b border-white/[0.08]" aria-labelledby="product-faq-title">
          <div className="cb-shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <Reveal>
              <p className="cb-kicker">Questions</p>
              <h2 id="product-faq-title" className="cb-display mt-6">{`About ${product.name}.`}</h2>
            </Reveal>
            <Reveal className="border-t border-white/10">
              {product.faqs.map((faq, index) => (
                <details key={faq.question} className="group border-b border-white/10" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-7 text-left text-base font-medium leading-6 text-white marker:hidden sm:text-lg">
                    <span className="flex gap-5">
                      <span className="cb-mono mt-1 text-xs text-[var(--accent-soft)]">{String(index + 1).padStart(2, '0')}</span>
                      {faq.question}
                    </span>
                    <span className="mt-0.5 text-xl font-light text-white/45 transition-transform group-open:rotate-45" aria-hidden="true">＋</span>
                  </summary>
                  <p className="max-w-2xl pb-8 pl-10 text-sm leading-7 text-white/55 sm:text-base sm:leading-8">{faq.answer}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <RelatedLinksRail
        kicker="More from CodingBull"
        title="Systems we build for clients."
        links={[
          { label: 'Custom Business Systems', href: '/services/custom-business-systems', description: 'CRM, dashboards, workflow automation, and internal tools.' },
          { label: 'Case Studies', href: '/case-studies', description: 'Deployed systems with the constraints and decisions behind them.' },
          { label: 'Start a project', href: '/contact', description: 'Bring the workflow — we’ll architect the system.' },
        ]}
      />

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
