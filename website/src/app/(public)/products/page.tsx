import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/sections/PageHero';
import { CTASection } from '@/components/sections/CTASection';
import { Reveal } from '@/components/animations/Reveal';
import { homeContent } from '@/content/home';
import { products } from '@/content/products';
import { siteConfig } from '@/content/site';
import { generatePageMetadata, canonicalUrl } from '@/lib/seo';
import { JsonLd, generateItemListSchema } from '@/lib/schema';

export const metadata: Metadata = generatePageMetadata({
  title: 'Products We’ve Built — CodingBull Technovations',
  description:
    'Proprietary software products built and operated by CodingBull Technovations, including RemoteRadar, a remote-job aggregation platform for engineers.',
  keywords: ['CodingBull products', 'RemoteRadar', 'remote job platform', 'software products by CodingBull'],
  canonical: canonicalUrl('/products'),
});

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        data={generateItemListSchema({
          name: 'CodingBull products',
          url: `${siteConfig.baseUrl}/products`,
          items: products.map((product) => ({
            name: product.name,
            url: `${siteConfig.baseUrl}/products/${product.slug}`,
            description: product.summary,
          })),
        })}
      />

      <PageHero
        title="Software we build for ourselves."
        subtitle="Founder-led delivery isn’t only client work. These are proprietary products CodingBull designed, built, and operates — proof of the same engineering we bring to your systems."
        badge="Products"
      />

      <section className="mind-section cb-section border-b border-white/[0.08]" aria-label="Products">
        <div className="cb-shell divide-y divide-white/10">
          {products.map((product, index) => (
            <Reveal
              key={product.slug}
              as="article"
              className="grid gap-6 py-12 lg:grid-cols-[0.18fr_0.82fr] lg:gap-10 lg:py-16"
            >
              <div className="cb-mono text-xs tracking-[0.18em] text-[var(--accent-soft)]">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{product.category}</p>
                <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
                  {product.name}
                </h2>
                <p className="mt-2 text-lg text-white/70">{product.tagline}</p>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55">{product.summary}</p>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-soft)] transition-colors hover:text-white"
                  >
                    How we built it <span aria-hidden="true">↗</span>
                  </Link>
                  <a
                    href={product.liveUrl}
                    target="_blank"
                    rel="noopener"
                    className="cb-mono text-xs uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-white"
                  >
                    Open live app <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection cta={homeContent.finalCTA} />
    </>
  );
}
