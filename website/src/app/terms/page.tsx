import { Metadata } from 'next';
import { pageMetadata, generatePageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';

export const metadata: Metadata = generatePageMetadata(pageMetadata.terms);

export default function TermsPage() {
  const lastUpdated = 'April 4, 2026';

  return (
    <>
      <PageHero
        title="Terms of Engagement"
        subtitle={`Last Updated: ${lastUpdated}. Our standard operational terms for architectural software projects.`}
      />

      <SectionWrapper className="py-24">
        <div className="max-w-3xl mx-auto prose prose-invert prose-teal">
          <p className="text-white/60 mb-12 italic">
            CodingBull Technovations Pvt. Ltd. (the &quot;Company&quot;) provides custom software architecture and development services. By engaging with us, you agree to the following terms.
          </p>

          <h2 className="text-2xl font-bold mb-6">1. Scope of Work</h2>
          <p className="mb-4">
            Each project is defined by a specific Statement of Work (SOW). Any changes to the scope after the project begins may require additional time and budget, which will be agreed upon in writing.
          </p>

          <h2 className="text-2xl font-bold mb-6 mt-12">2. Fixed-Price Quotes</h2>
          <p className="mb-4">
            We provide fixed-price quotes based on detailed requirements. This ensures budget stability for our clients. Quotes are valid for 30 days from the date of issue.
          </p>

          <h2 className="text-2xl font-bold mb-6 mt-12">3. Intellectual Property</h2>
          <p className="mb-8">
            Unless otherwise specified in the SOW, upon full payment, the client owns the source code and IP for the custom system we build. The Company retains ownership of any pre-existing proprietary modules used within the system.
          </p>

          <h2 className="text-2xl font-bold mb-6 mt-12">4. NDAs and Confidentiality</h2>
          <p className="mb-8">
            We respect your trade secrets and proprietary processes. We sign NDAs for all enterprise projects and strictly adhere to confidentiality agreements. We will not use your company name or project details in our portfolio without explicit permission.
          </p>

          <h2 className="text-2xl font-bold mb-6 mt-12">5. Delivery and Payments</h2>
          <p className="mb-8">
            Projects are delivered in clear milestones associated with specific payment stages. Each milestone must be approved before work begins on the next.
          </p>

          <h2 className="text-2xl font-bold mb-6 mt-12">6. Limitation of Liability</h2>
          <p className="mb-8">
            While we build for enterprise scale and performance, CodingBull Technovations is not liable for indirect, incidental, or consequential damages resulting from the use of the software.
          </p>

          <h2 className="text-2xl font-bold mb-6 mt-12">7. Contact Us</h2>
          <p>
            If you have questions about these terms, contact us at <a href="mailto:codingbullz@gmail.com" className="text-teal underline">codingbullz@gmail.com</a>.
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
