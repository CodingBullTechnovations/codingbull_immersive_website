import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getGoogleOAuthConfig, getGoogleScopes } from '@/lib/server/seo-sync';
import { hasRole } from '@/lib/server/authz';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user || !hasRole(session.user.role, 'ADMIN')) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const { clientId } = await getGoogleOAuthConfig();
  if (!clientId) {
    return NextResponse.redirect(new URL('/admin/settings?integration=missing_google_client_id', request.url));
  }

  const state = crypto.randomUUID();
  const redirectUri = new URL('/api/admin/integrations/google/callback', request.url).toString();
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', getGoogleScopes().join(' '));
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  authUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authUrl);
  response.cookies.set('google_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 10 * 60,
  });

  return response;
}
