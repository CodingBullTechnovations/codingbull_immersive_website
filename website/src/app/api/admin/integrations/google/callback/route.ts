import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { hasRole } from '@/lib/server/authz';
import { exchangeGoogleCode } from '@/lib/server/seo-sync';
import { getGoogleOAuthAdminSettingsUrl, getGoogleOAuthRedirectUri } from '@/lib/server/google-oauth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user || !hasRole(session.user.role, 'ADMIN')) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = request.cookies.get('google_oauth_state')?.value;

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(getGoogleOAuthAdminSettingsUrl(request.url, '?integration=google_oauth_invalid'));
  }

  try {
    await exchangeGoogleCode({
      code,
      redirectUri: getGoogleOAuthRedirectUri(request.url),
    });

    const response = NextResponse.redirect(getGoogleOAuthAdminSettingsUrl(request.url, '?integration=google_connected'));
    response.cookies.delete('google_oauth_state');
    return response;
  } catch (error) {
    console.error('[google_oauth_callback_failed]', error);
    return NextResponse.redirect(getGoogleOAuthAdminSettingsUrl(request.url, '?integration=google_oauth_failed'));
  }
}
