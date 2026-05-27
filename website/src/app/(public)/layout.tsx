import { JsonLd, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLd data={generateOrganizationSchema()} />
      <JsonLd data={generateWebSiteSchema()} />
      {children}
    </>
  );
}
