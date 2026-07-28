import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import legacyRedirects from '@/config/legacy-redirects.json';

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host')?.split(':')[0].toLowerCase();
  const isAdminPath = pathname.startsWith('/admin');
  const isApiPath = pathname.startsWith('/api');
  const isLoginPath = pathname === '/admin/login';
  const isAuthenticated = Boolean(request.auth?.user);

  if (host === 'codingbullz.com') {
    const destinationPath = legacyRedirects[pathname as keyof typeof legacyRedirects] ?? pathname;
    const url = new URL(destinationPath, 'https://www.codingbullz.com');
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  if (!isAdminPath && !isApiPath) {
    return NextResponse.next();
  }

  if (isApiPath) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  if (!isAuthenticated && !isLoginPath) {
    const url = new URL('/admin/login', request.nextUrl);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname);
    const response = NextResponse.redirect(url);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  if (isAuthenticated && isLoginPath) {
    const response = NextResponse.redirect(new URL('/admin', request.nextUrl));
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
