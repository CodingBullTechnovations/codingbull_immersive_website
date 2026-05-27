import { AdminField, adminInputClass, AdminSubmitButton } from '@/components/admin/AdminForm';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { listSettingsAdmin } from '@/lib/server/cms';
import { listCredentialSummaries } from '@/lib/server/credentials';
import { getSeoIntegrationConfig } from '@/lib/server/env';
import { saveSettingAction } from '../content/actions';
import { deleteCredentialAction, saveCredentialAction, syncGa4Action, syncSearchConsoleAction } from './actions';

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
      body: 'The value is encrypted in PostgreSQL and only the masked preview is shown here.',
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
  };

  return messages[code] ?? null;
}

function statusText(configured: boolean, source: 'database' | 'environment' | 'missing') {
  if (!configured) return 'Missing';
  return source === 'database' ? 'Saved in admin' : 'Using env fallback';
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

export default async function AdminSettingsPage({ searchParams }: { searchParams?: SearchParams }) {
  const [settings, credentials, params] = await Promise.all([
    listSettingsAdmin(),
    listCredentialSummaries(),
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
  const canSyncSearchConsole = hasGoogleClient && hasGoogleToken && hasSearchConsoleSite;
  const canSyncGa4 = hasGoogleClient && hasGoogleToken && hasGa4Property;

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
            <form action={syncSearchConsoleAction}>
              <button
                disabled={!canSyncSearchConsole}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                  canSyncSearchConsole ? 'border-white/10 text-white/75 hover:bg-white/[0.04]' : 'cursor-not-allowed border-white/5 text-white/30'
                }`}
                type="submit"
              >
                Sync Search Console
              </button>
            </form>
            <form action={syncGa4Action}>
              <button
                disabled={!canSyncGa4}
                className={`rounded-xl border px-4 py-2 text-sm font-semibold ${
                  canSyncGa4 ? 'border-white/10 text-white/75 hover:bg-white/[0.04]' : 'cursor-not-allowed border-white/5 text-white/30'
                }`}
                type="submit"
              >
                Sync GA4
              </button>
            </form>
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
          <p className="text-sm font-semibold text-white">Required Google Cloud redirect URIs</p>
          <div className="mt-3 grid gap-2 text-xs text-white/55 md:grid-cols-2">
            <code className="rounded-lg bg-black/30 p-3">http://localhost:3000/api/admin/integrations/google/callback</code>
            <code className="rounded-lg bg-black/30 p-3">https://www.codingbullz.com/api/admin/integrations/google/callback</code>
          </div>
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
