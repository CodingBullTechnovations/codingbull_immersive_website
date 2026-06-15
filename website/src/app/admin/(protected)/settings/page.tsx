import { AdminField, adminInputClass, AdminSubmitButton } from '@/components/admin/AdminForm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { listSettingsAdmin } from '@/lib/server/cms';
import { listCredentialSummaries } from '@/lib/server/credentials';
import { getSeoIntegrationConfig } from '@/lib/server/env';
import { getGoogleSyncReadiness } from '@/lib/server/google-sync-readiness';
import {
  getGoogleOAuthBaseUrl,
  getLocalGoogleOAuthRedirectUri,
  getProductionGoogleOAuthRedirectUri,
} from '@/lib/server/google-oauth';
import {
  defaultSocialLinks,
  normalizeSocialLinksConfig,
  SOCIAL_LINKS_SETTING_KEY,
  type SocialLinksConfig,
} from '@/lib/social-links';
import { saveSettingAction } from '../content/actions';
import { deleteCredentialAction, saveCredentialAction, saveSocialLinksAction, syncGa4Action, syncSearchConsoleAction } from './actions';
import { SyncSubmitButton } from './SyncSubmitButton';

type CredentialSummary = Awaited<ReturnType<typeof listCredentialSummaries>>[number];
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const credentialSteps = [
  {
    provider: 'GA4',
    keyName: 'measurement_id',
    title: 'GA4 measurement ID',
    example: 'G-XXXXXXXXXX',
    purpose: 'Loads GA4 after cookie consent and keeps the public site ready for campaign reporting.',
  },
  {
    provider: 'GA4',
    keyName: 'property_id',
    title: 'GA4 property ID',
    example: '123456789 or properties/123456789',
    purpose: 'Required for server-side GA4 landing page, channel, session, and conversion sync.',
  },
  {
    provider: 'SEARCH_CONSOLE',
    keyName: 'site_url',
    title: 'Search Console property URL',
    example: 'https://www.codingbullz.com/',
    purpose: 'Must exactly match the verified Search Console property used for query/page imports.',
  },
  {
    provider: 'GOOGLE',
    keyName: 'client_id',
    title: 'Google OAuth client ID',
    example: 'OAuth Web application client ID',
    purpose: 'Used with the admin OAuth callback to request Search Console and Analytics readonly access.',
  },
  {
    provider: 'GOOGLE',
    keyName: 'client_secret',
    title: 'Google OAuth client secret',
    example: 'OAuth Web application secret',
    purpose: 'Stored encrypted and used only on the server to exchange OAuth codes and refresh tokens.',
  },
] as const;

const keywordClusters = [
  {
    title: 'Healthcare',
    keywords: [
      'healthcare software development company',
      'clinic management software development',
      'patient appointment booking system',
      'healthcare CRM for clinics',
      'multi-branch clinic software',
    ],
  },
  {
    title: 'E-commerce',
    keywords: [
      'custom ecommerce development company',
      'inventory management software for ecommerce',
      'order management automation',
      'SEO-first Next.js ecommerce development',
      'custom Shopify alternative',
    ],
  },
  {
    title: 'HRMS',
    keywords: [
      'custom HRMS software development',
      'payroll automation software',
      'attendance and leave management system',
      'employee self-service portal development',
      'multi-location HRMS software',
    ],
  },
  {
    title: 'Custom development',
    keywords: [
      'custom business software development',
      'internal CRM development company',
      'workflow automation software',
      'business dashboard development',
      'operations portal development',
    ],
  },
];

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getNotice(code: string, reason?: string, rows?: string) {
  const messages: Record<string, { tone: 'success' | 'warning'; title: string; body: string }> = {
    credential_saved: {
      tone: 'success',
      title: 'Credential saved',
      body: 'The value passed local validation, is encrypted in PostgreSQL, and only the masked preview is shown here.',
    },
    credential_invalid: {
      tone: 'warning',
      title: 'Credential was not saved',
      body: reason || 'The value did not pass validation, so the existing credential was left unchanged.',
    },
    credential_deleted: {
      tone: 'success',
      title: 'Credential deleted',
      body: 'The encrypted credential was removed from the database.',
    },
    google_connected: {
      tone: 'success',
      title: 'Google OAuth connected',
      body: 'The refresh token is stored encrypted. Search Console and GA4 sync can now run when the site URL and property ID are saved.',
    },
    missing_google_client_id: {
      tone: 'warning',
      title: 'Google client ID is missing',
      body: 'Save GOOGLE/client_id and GOOGLE/client_secret first, then connect OAuth again.',
    },
    google_oauth_failed: {
      tone: 'warning',
      title: 'Google OAuth failed',
      body: reason || 'Google did not return a usable OAuth token. Check the redirect URI and OAuth consent screen.',
    },
    search_console_synced: {
      tone: 'success',
      title: 'Search Console sync finished',
      body: `${rows ?? '0'} rows imported from the Search Analytics API.`,
    },
    search_console_sync_failed: {
      tone: 'warning',
      title: 'Search Console sync did not run',
      body: reason || 'Save the Search Console site URL and Google OAuth token, then retry.',
    },
    ga4_synced: {
      tone: 'success',
      title: 'GA4 sync finished',
      body: `${rows ?? '0'} landing page rows imported from the GA4 Data API.`,
    },
    ga4_sync_failed: {
      tone: 'warning',
      title: 'GA4 sync did not run',
      body: reason || 'Save the GA4 property ID and Google OAuth token, then retry.',
    },
    social_saved: {
      tone: 'success',
      title: 'Social links saved',
      body: 'Footer icons, organization sameAs links, and optional Instagram embed settings were updated.',
    },
    social_invalid: {
      tone: 'warning',
      title: 'Social links were not saved',
      body: reason || 'Check the URL format and enabled profile rows.',
    },
  };

  return messages[code] ?? null;
}

function statusText(configured: boolean, source: 'database' | 'environment' | 'missing') {
  if (!configured) return 'Missing';
  return source === 'database' ? 'Saved in admin' : 'Using env fallback';
}

function readinessText(item: { ready: boolean; reason: string }) {
  return `${item.ready ? 'Yes' : 'No'} - ${item.reason}`;
}

function SaveCredentialCard({ step, configured }: { step: (typeof credentialSteps)[number]; configured: boolean }) {
  return (
    <form action={saveCredentialAction} className="rounded-xl border border-white/10 bg-black/20 p-4">
      <input type="hidden" name="provider" value={step.provider} />
      <input type="hidden" name="key" value={step.keyName} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{step.title}</p>
          <p className="mt-1 text-xs leading-5 text-white/45">{step.purpose}</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
          configured ? 'border-teal/30 bg-teal/10 text-teal' : 'border-amber-300/20 bg-amber-300/10 text-amber-200'
        }`}>
          {configured ? 'Ready' : 'Needed'}
        </span>
      </div>
      <AdminField label={`${step.provider}.${step.keyName}`} hint={`Example: ${step.example}`}>
        <textarea name="value" required rows={2} className={`${adminInputClass} font-mono text-xs`} />
      </AdminField>
      <div className="mt-4">
        <AdminSubmitButton label={configured ? 'Replace encrypted value' : 'Save encrypted value'} />
      </div>
    </form>
  );
}

function CredentialList({ credentials }: { credentials: CredentialSummary[] }) {
  if (credentials.length === 0) {
    return <p className="px-5 py-10 text-sm text-white/45">No encrypted credentials saved yet.</p>;
  }

  return (
    <div className="divide-y divide-white/10">
      {credentials.map((credential) => (
        <div key={credential.id} className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-semibold text-white">
              {credential.provider} · {credential.key}
            </p>
            <p className="mt-1 text-xs text-white/40">
              {credential.maskedValue || 'Saved'} · {credential.status}
              {credential.lastVerifiedAt ? ` · verified ${credential.lastVerifiedAt.toISOString()}` : ''}
            </p>
            {credential.lastError && <p className="mt-2 text-xs text-amber-200">{credential.lastError}</p>}
          </div>
          <form action={deleteCredentialAction}>
            <input type="hidden" name="id" value={credential.id} />
            <button type="submit" className="rounded-lg border border-red-400/20 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-400/10">
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}

function boolText(value: boolean) {
  return value ? 'Enabled' : 'Hidden';
}

function additionalSocialLinksText(config: SocialLinksConfig) {
  const defaultIds = new Set(defaultSocialLinks.map((link) => link.id));

  return config.links
    .filter((link) => !defaultIds.has(link.id))
    .map((link) =>
      [
        link.label,
        link.platform,
        link.url,
        String(link.enabled),
        String(link.showInFooter),
        String(link.includeInSameAs),
      ].join(' | '),
    )
    .join('\n');
}

function SocialLinksSettingsForm({ config }: { config: SocialLinksConfig }) {
  const linksById = new Map(config.links.map((link) => [link.id, link]));
  const rows = defaultSocialLinks.map((fallback) => linksById.get(fallback.id) ?? fallback);
  const instagramContent = config.instagramContent;

  return (
    <form id="social-profiles" action={saveSocialLinksAction} className="mb-8 scroll-mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="grid gap-5 xl:grid-cols-[1fr_auto]">
        <div>
          <h2 className="font-semibold text-white">Public social profiles</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
            Manage footer visibility and schema sameAs profiles here. Platform logos are generated automatically from the selected platform, so admins only need to maintain URLs and visibility. Disabled rows or rows without URLs stay hidden on the live site.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/50">
          <span className="font-semibold text-teal">
            {config.links.filter((link) => link.enabled && link.url).length}
          </span>{' '}
          active profile(s)
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="bg-black/30 text-[10px] uppercase tracking-[0.16em] text-white/35">
            <tr>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Live</th>
              <th className="px-4 py-3">Footer</th>
              <th className="px-4 py-3">sameAs</th>
              <th className="px-4 py-3">Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((link) => (
              <tr key={link.id}>
                <td className="px-4 py-4 align-top">
                  <input type="hidden" name={`social_platform_${link.id}`} value={link.platform} />
                  <AdminField label={link.label}>
                    <input name={`social_label_${link.id}`} defaultValue={link.label} className={adminInputClass} />
                  </AdminField>
                </td>
                <td className="px-4 py-4 align-top">
                  <AdminField label="HTTPS URL">
                    <input name={`social_url_${link.id}`} defaultValue={link.url} placeholder="https://..." className={adminInputClass} />
                  </AdminField>
                </td>
                <td className="px-4 py-4 align-top">
                  <label className="inline-flex items-center gap-2 text-xs text-white/55">
                    <input name={`social_enabled_${link.id}`} type="checkbox" defaultChecked={link.enabled} className="h-4 w-4 accent-primary" />
                    {boolText(link.enabled)}
                  </label>
                </td>
                <td className="px-4 py-4 align-top">
                  <label className="inline-flex items-center gap-2 text-xs text-white/55">
                    <input name={`social_footer_${link.id}`} type="checkbox" defaultChecked={link.showInFooter} className="h-4 w-4 accent-primary" />
                    Show
                  </label>
                </td>
                <td className="px-4 py-4 align-top">
                  <label className="inline-flex items-center gap-2 text-xs text-white/55">
                    <input name={`social_same_as_${link.id}`} type="checkbox" defaultChecked={link.includeInSameAs} className="h-4 w-4 accent-primary" />
                    Include
                  </label>
                </td>
                <td className="px-4 py-4 align-top">
                  <input
                    name={`social_order_${link.id}`}
                    type="number"
                    defaultValue={link.order}
                    className={`${adminInputClass} max-w-24`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <h3 className="text-sm font-semibold text-white">Optional Instagram content embed</h3>
          <p className="mt-2 text-xs leading-5 text-white/40">
            Use a public Instagram post or reel URL. The server converts supported URLs to the official embed URL. A full automatic latest-feed sync needs an approved Instagram API integration.
          </p>
          <div className="mt-4 space-y-4">
            <label className="inline-flex items-center gap-2 text-sm text-white/65">
              <input name="instagramContentEnabled" type="checkbox" defaultChecked={instagramContent.enabled} className="h-4 w-4 accent-primary" />
              Show Instagram content block in footer
            </label>
            <AdminField label="Content title">
              <input name="instagramContentTitle" defaultValue={instagramContent.title} className={adminInputClass} />
            </AdminField>
            <AdminField label="Instagram post, reel, or embed URL" hint="Example: https://www.instagram.com/p/SHORTCODE/">
              <input name="instagramContentEmbedUrl" defaultValue={instagramContent.embedUrl} placeholder="https://www.instagram.com/p/..." className={adminInputClass} />
            </AdminField>
          </div>
        </div>

        <AdminField
          label="Additional profiles"
          hint="Optional. One per line: Label | platform | https://url | enabled | footer | sameAs"
        >
          <textarea
            name="additionalSocialLinks"
            rows={10}
            defaultValue={additionalSocialLinksText(config)}
            placeholder="Clutch | other | https://example.com/codingbull | true | true | true"
            className={`${adminInputClass} font-mono text-xs`}
          />
        </AdminField>
      </div>

      <div className="mt-5">
        <AdminSubmitButton label="Save social profiles" />
      </div>
    </form>
  );
}

export default async function AdminSettingsPage({ searchParams }: { searchParams?: SearchParams }) {
  const [settings, credentials, syncReadiness, params] = await Promise.all([
    listSettingsAdmin(),
    listCredentialSummaries(),
    getGoogleSyncReadiness(),
    searchParams ?? Promise.resolve({} as Record<string, string | string[] | undefined>),
  ]);
  const seoConfig = getSeoIntegrationConfig();
  const notice = getNotice(firstParam(params.integration) ?? '', firstParam(params.reason), firstParam(params.rows));

  const credential = (provider: string, key: string) => credentials.find((item) => item.provider === provider && item.key === key);
  const hasCredential = (provider: string, key: string) => Boolean(credential(provider, key));
  const configuredSource = (provider: string, key: string, envValue = ''): 'database' | 'environment' | 'missing' => {
    if (hasCredential(provider, key)) return 'database';
    if (envValue) return 'environment';
    return 'missing';
  };
  const isConfigured = (provider: string, key: string, envValue = '') => configuredSource(provider, key, envValue) !== 'missing';

  const hasGoogleClient = isConfigured('GOOGLE', 'client_id', process.env.GOOGLE_CLIENT_ID) && isConfigured('GOOGLE', 'client_secret', process.env.GOOGLE_CLIENT_SECRET);
  const hasGoogleToken = isConfigured('GOOGLE', 'refresh_token', process.env.GOOGLE_REFRESH_TOKEN);
  const hasSearchConsoleSite = isConfigured('SEARCH_CONSOLE', 'site_url', seoConfig.searchConsoleSiteUrl);
  const hasGa4Property = isConfigured('GA4', 'property_id', seoConfig.ga4PropertyId);
  const canConnectGoogle = hasGoogleClient;
  const canSyncSearchConsole = syncReadiness.searchConsole.ready;
  const canSyncGa4 = syncReadiness.ga4.ready;
  const socialConfig = normalizeSocialLinksConfig(settings.find((setting) => setting.key === SOCIAL_LINKS_SETTING_KEY)?.value);

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Manage encrypted integrations, SEO data sync, crawler policy, and operational configuration from one admin surface."
      />

      {notice && (
        <section className={`mb-6 rounded-xl border p-4 ${
          notice.tone === 'success'
            ? 'border-teal/25 bg-teal/10 text-teal'
            : 'border-amber-300/25 bg-amber-300/10 text-amber-100'
        }`}>
          <p className="text-sm font-semibold">{notice.title}</p>
          <p className="mt-1 text-sm opacity-80">{notice.body}</p>
        </section>
      )}

      <SocialLinksSettingsForm config={socialConfig} />

      <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="grid gap-5 xl:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-semibold text-white">Google Search, GA4, and AI discovery setup</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
              Admin-saved credentials are preferred and encrypted. Environment variables remain a server fallback. Sync actions stay disabled until the exact required values exist, so missing setup no longer crashes the app.
            </p>
          </div>
          <div className="flex flex-wrap items-start gap-3">
            <a
              href={canConnectGoogle ? '/api/admin/integrations/google/start' : '/admin/settings?integration=missing_google_client_id'}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                canConnectGoogle ? 'bg-primary text-black hover:bg-primary-hover' : 'border border-white/10 text-white/40'
              }`}
            >
              Connect Google OAuth
            </a>
            <div>
              <form action={syncSearchConsoleAction}>
                <SyncSubmitButton
                  label="Sync Search Console"
                  pendingLabel="Syncing Search Console..."
                  ready={canSyncSearchConsole}
                  reason={syncReadiness.searchConsole.reason}
                />
              </form>
              {!canSyncSearchConsole && <p className="mt-2 max-w-[18rem] text-xs leading-5 text-amber-200/80">{syncReadiness.searchConsole.reason}</p>}
            </div>
            <div>
              <form action={syncGa4Action}>
                <SyncSubmitButton
                  label="Sync GA4"
                  pendingLabel="Syncing GA4..."
                  ready={canSyncGa4}
                  reason={syncReadiness.ga4.reason}
                />
              </form>
              {!canSyncGa4 && <p className="mt-2 max-w-[18rem] text-xs leading-5 text-amber-200/80">{syncReadiness.ga4.reason}</p>}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {[
            ['Google client', hasGoogleClient, hasCredential('GOOGLE', 'client_id') && hasCredential('GOOGLE', 'client_secret') ? 'database' : process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_SECRET ? 'environment' : 'missing'],
            ['OAuth refresh token', hasGoogleToken, configuredSource('GOOGLE', 'refresh_token', process.env.GOOGLE_REFRESH_TOKEN)],
            ['Search Console site', hasSearchConsoleSite, configuredSource('SEARCH_CONSOLE', 'site_url', seoConfig.searchConsoleSiteUrl)],
            ['GA4 property', hasGa4Property, configuredSource('GA4', 'property_id', seoConfig.ga4PropertyId)],
            ['GA4 measurement', isConfigured('GA4', 'measurement_id', seoConfig.gaMeasurementId), configuredSource('GA4', 'measurement_id', seoConfig.gaMeasurementId)],
          ].map(([label, configured, source]) => (
            <div key={String(label)} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">{String(label)}</p>
              <p className={`mt-2 text-sm font-semibold ${configured ? 'text-teal' : 'text-amber-200'}`}>
                {statusText(Boolean(configured), source as 'database' | 'environment' | 'missing')}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-semibold text-white">Sync readiness</p>
          <div className="mt-3 grid gap-3 text-xs leading-5 text-white/55 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['OAuth ready', readinessText(syncReadiness.oauth)],
              ['Search Console ready', readinessText(syncReadiness.searchConsole)],
              ['GA4 ready', readinessText(syncReadiness.ga4)],
              ['GA4 measurement', `${syncReadiness.ga4Measurement.ready ? 'Yes' : 'No'} - ${syncReadiness.ga4Measurement.reason}${syncReadiness.ga4Measurement.ready ? '' : '; not required for GA4 Data API sync'}`],
            ].map(([label, body]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">{label}</p>
                <p className="mt-2 text-white/60">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-semibold text-white">Required Google Cloud redirect URIs</p>
          <p className="mt-2 text-xs leading-5 text-white/45">
            Production OAuth is generated from the canonical www URL, not the request host. Keep the localhost URL only for local development testing.
          </p>
          <div className="mt-3 grid gap-2 text-xs text-white/55 md:grid-cols-2">
            <code className="rounded-lg bg-black/30 p-3">{getProductionGoogleOAuthRedirectUri()}</code>
            <code className="rounded-lg bg-black/30 p-3">{getLocalGoogleOAuthRedirectUri()}</code>
          </div>
          <p className="mt-3 text-xs leading-5 text-white/45">
            Safe debug: production OAuth base URL is <code>{getGoogleOAuthBaseUrl()}</code> and production redirect URI is{' '}
            <code>{getProductionGoogleOAuthRedirectUri()}</code>.
          </p>
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm font-semibold text-white">Consent mode note</p>
          <p className="mt-2 text-xs leading-5 text-white/45">
            Current GA4 behavior is delayed loading after analytics cookie consent. Google Consent Mode v2 is an optional future enhancement for advanced Google Ads or remarketing workflows; no Ads or remarketing tags are installed here.
          </p>
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4">
          <h2 className="font-semibold text-white">Credential setup</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {credentialSteps.map((step) => (
              <SaveCredentialCard
                key={`${step.provider}.${step.keyName}`}
                step={step}
                configured={isConfigured(
                  step.provider,
                  step.keyName,
                  step.provider === 'GA4' && step.keyName === 'measurement_id'
                    ? seoConfig.gaMeasurementId
                    : step.provider === 'GA4' && step.keyName === 'property_id'
                      ? seoConfig.ga4PropertyId
                      : step.provider === 'SEARCH_CONSOLE'
                        ? seoConfig.searchConsoleSiteUrl
                        : step.keyName === 'client_id'
                          ? process.env.GOOGLE_CLIENT_ID
                          : step.keyName === 'client_secret'
                            ? process.env.GOOGLE_CLIENT_SECRET
                            : '',
                )}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="font-semibold text-white">Encrypted credentials</h2>
            <p className="mt-1 text-xs text-white/40">Full secret values are never displayed after save.</p>
          </div>
          <CredentialList credentials={credentials} />
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-semibold text-white">AI discovery and commercial keyword map</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
          These are the target query families the content, internal links, llms.txt, service pages, case studies, and Search Console reporting should be measured against. They are intentionally buyer-intent phrases, not generic traffic terms.
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-4">
          {keywordClusters.map((cluster) => (
            <div key={cluster.title} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal">{cluster.title}</p>
              <ul className="mt-3 space-y-2 text-sm leading-5 text-white/55">
                {cluster.keywords.map((keyword) => (
                  <li key={keyword}>{keyword}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            ['Google AI features', 'Use normal Google Search eligibility: indexed pages, snippets allowed, helpful text, internal links, page experience, and structured data matching visible content.'],
            ['ChatGPT search', 'Allow OAI-SearchBot and keep service/proof pages crawlable. GPTBot is separate from ChatGPT search and controls model-training access.'],
            ['Perplexity and Claude', 'Allow documented search/user crawlers and keep answer-ready proof blocks available in plain text. Monitor AI referral traffic by source.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-2 text-xs leading-5 text-white/45">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form action={saveSettingAction} className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-semibold text-white">Structured setting</h2>
          <AdminField label="Key">
            <input name="key" required placeholder="company.phone" className={adminInputClass} />
          </AdminField>
          <AdminField label="JSON value">
            <textarea name="value" required rows={8} placeholder={'"value" or {"enabled": true}'} className={`${adminInputClass} font-mono text-xs`} />
          </AdminField>
          <AdminField label="Description">
            <textarea name="description" rows={3} className={adminInputClass} />
          </AdminField>
          <AdminSubmitButton label="Save setting" />
        </form>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          {settings.length === 0 ? (
            <p className="px-5 py-10 text-sm text-white/45">No settings saved yet.</p>
          ) : (
            <div className="divide-y divide-white/10">
              {settings.map((setting) => (
                <div key={setting.id} className="px-5 py-4">
                  <p className="font-semibold text-white">{setting.key}</p>
                  {setting.description && <p className="mt-1 text-xs text-white/40">{setting.description}</p>}
                  <pre className="mt-3 overflow-x-auto rounded-xl bg-black/20 p-3 text-xs text-white/50">
                    {JSON.stringify(setting.value, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
