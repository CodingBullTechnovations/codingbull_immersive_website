import { Metadata } from 'next';
import { pageMetadata, generatePageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';

export const metadata: Metadata = generatePageMetadata(pageMetadata.privacy);

export default function PrivacyPage() {
  const lastUpdated = 'May 27, 2026';

  return (
    <>
      <PageHero
        title="Privacy Policy"
        subtitle={`Last Updated: ${lastUpdated}. Our commitment to protecting your data and your digital identity.`}
      />

      <SectionWrapper className="py-24">
        <div className="max-w-3xl mx-auto prose prose-invert prose-teal">
          <p className="text-white/60 mb-12 italic">
            At CodingBull Technovations, we prioritize the privacy of our clients and users. This policy outlines our data collection, usage, and protection practices.
          </p>

          <h2 className="text-2xl font-bold mb-6">1. Information We Collect</h2>
          <div className="mb-4 text-white/90">
            We collect information you provide directly to us, such as when you request a quote, subscribe to our newsletter, or contact us for support. This includes:
            <ul className="list-disc pl-6 mb-8 mt-4 text-white/60">
              <li>Contact Information (Name, Email, Phone, WhatsApp Number)</li>
              <li>Project Specification Details</li>
              <li>Company Information</li>
            </ul>
            We also collect first-party website analytics separately from Google Analytics so our admin team can understand which pages, industries, sources, and conversion paths are producing business inquiries. This may include:
            <ul className="list-disc pl-6 mb-8 mt-4 text-white/60">
              <li>IP address, approximate proxy-provided location when available, browser, operating system, and device category</li>
              <li>Pages visited, landing page, referrer, campaign parameters, CTA clicks, WhatsApp clicks, form starts, and form submissions</li>
              <li>Screen and viewport size, language, timezone, platform, color-scheme preference, and touch capability</li>
            </ul>
            We do not collect visitor MAC addresses because normal public websites cannot access that hardware identifier.
          </div>

          <h2 className="text-2xl font-bold mb-6 mt-12">2. How We Use Your Information</h2>
          <div className="mb-8 text-white/90">
            We use the information to:
            <ul className="list-disc pl-6 mb-8 mt-4 text-white/60">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your project inquiries and provide quotes</li>
              <li>Communicate directly about project updates and milestones</li>
              <li>Understand website performance, industry demand, and conversion paths from first-party analytics</li>
              <li>Comply with legal and regulatory requirements (e.g., HIPAA)</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mb-6 mt-12">3. Data Protection</h2>
          <p className="mb-8">
            We implement industry-standard security measures to protect your information. For sensitive healthcare data, we use end-to-end encryption and strict role-based access controls within the custom systems we architect.
          </p>

          <h2 className="text-2xl font-bold mb-6 mt-12">4. Third Parties</h2>
          <p className="mb-8">
            We do not sell your personal data. We only share information with third-party service providers (like Cloudflare or AWS) necessary to host and operate the systems we build for you under strict confidentiality.
            Google Analytics 4 is optional analytics and loads only after consent. Our first-party visitor analytics is stored separately in our own database and is not sent to GA4.
          </p>

          <h2 className="text-2xl font-bold mb-6 mt-12">5. Analytics Retention And Deletion</h2>
          <p className="mb-8">
            First-party analytics is available only inside the admin area. Admin users can manually delete visitor profiles, sessions, event history, and older analytics data when it is no longer needed. The system shows review reminders, but it does not automatically delete analytics data.
          </p>

          <h2 className="text-2xl font-bold mb-6 mt-12">6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at <a href="mailto:codingbullz@gmail.com" className="text-teal underline">codingbullz@gmail.com</a>.
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
