import Link from 'next/link';
import type { Product } from '@/content/products';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/animations/Reveal';
import { SystemMockup } from '@/components/sections/SystemMockup';

interface ProductSpotlightProps {
  product: Product;
}

/**
 * Homepage beat for a proprietary CodingBull product (RemoteRadar). Frames it
 * as proof that we ship our own software, shows the stylized product mockup,
 * and drives the particle field to the "custom" formation. All copy and links
 * are server-rendered; the mockup is decorative enhancement.
 */
export function ProductSpotlight({ product }: ProductSpotlightProps) {
  return (
    <section
      data-mind-shape="custom"
      className="mind-section relative overflow-hidden cb-section border-t border-white/[0.08]"
      aria-labelledby="product-spotlight-title"
    >
      <div className="cb-shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="field-readable">
          <p className="cb-kicker">Proprietary product / 04</p>
          <h2
            id="product-spotlight-title"
            className="cb-display mt-6 max-w-[16ch] text-[clamp(2.2rem,4.4vw,4rem)]"
          >
            We don’t just build for clients. We ship our own.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/78">
            <strong className="font-semibold text-white">{product.name}</strong> — {product.tagline}{' '}
            {product.summary}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              label={`Open ${product.name}`}
              href={product.liveUrl}
              variant="primary"
              icon="arrow"
              trackingSource="home_product_remoteradar_live"
              size="large"
            />
            <Link
              href={`/products/${product.slug}`}
              className="cb-mono text-xs uppercase tracking-[0.16em] text-[var(--accent-soft)] transition-colors hover:text-white"
            >
              How we built it <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="field-readable relative">
          <SystemMockup kind="radar" />
        </Reveal>
      </div>
    </section>
  );
}
