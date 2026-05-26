import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith('/admin');
  const isLoginPath = pathname === '/admin/login';
  const isAuthenticated = Boolean(request.auth?.user);

  if (!isAdminPath) {
    return NextResponse.next();
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
  matcher: ['/admin/:path*'],
};
