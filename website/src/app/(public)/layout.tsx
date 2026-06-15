import { JsonLd, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema';
import { getPublicSocialLinksConfig } from '@/lib/server/social-links';
import { sameAsSocialUrls } from '@/lib/social-links';

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const socialConfig = await getPublicSocialLinksConfig();

  return (
    <>
      <JsonLd data={generateOrganizationSchema(sameAsSocialUrls(socialConfig))} />
      <JsonLd data={generateWebSiteSchema()} />
      {children}
    </>
  );
}
