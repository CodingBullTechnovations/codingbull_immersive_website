import { Metadata } from 'next';
import { pageMetadata, generatePageMetadata } from '@/lib/seo';
import { PageHero } from '@/components/sections/PageHero';
import { SectionWrapper } from '@/components/ui/SectionWrapper';

export const metadata: Metadata = generatePageMetadata(pageMetadata.privacy);

export default function PrivacyPage() {
  const lastUpdated = 'April 4, 2026';

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
          </div>

          <h2 className="text-2xl font-bold mb-6 mt-12">2. How We Use Your Information</h2>
          <div className="mb-8 text-white/90">
            We use the information to:
            <ul className="list-disc pl-6 mb-8 mt-4 text-white/60">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your project inquiries and provide quotes</li>
              <li>Communicate directly about project updates and milestones</li>
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
          </p>

          <h2 className="text-2xl font-bold mb-6 mt-12">5. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at <a href="mailto:codingbullz@gmail.com" className="text-teal underline">codingbullz@gmail.com</a>.
          </p>
        </div>
      </SectionWrapper>
    </>
  );
}
