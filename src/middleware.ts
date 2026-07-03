import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isValidAuthToken } from './app/utils/authToken';

const PUBLIC_PORTAL_PATHS = new Set([
  '/portal',
  '/portal/register',
  '/portal/forgot-password',
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/portal')) {
    return NextResponse.next();
  }

  const normalizedPath =
    pathname.endsWith('/') && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  const token = request.cookies.get('token')?.value;
  const hasValidToken = isValidAuthToken(token);

  if (PUBLIC_PORTAL_PATHS.has(normalizedPath)) {
    if (hasValidToken) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = '/portal/dashboard';
      dashboardUrl.search = '';
      return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();
  }

  if (!hasValidToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/portal';
    loginUrl.search = '';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/portal/:path*'],
};
