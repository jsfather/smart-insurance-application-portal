import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of supported locales
const locales = ['en', 'fa'] as const;
type Locale = (typeof locales)[number];

/**
 * Get the preferred locale from the request headers.
 * Falls back to 'en-US' if none match.
 */
function getLocale(request: NextRequest): Locale {
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) {
    const preferredLocales = acceptLang
      .split(',')
      .map((lang) => lang.split(';')[0].trim());

    for (const preferred of preferredLocales) {
      if (locales.includes(preferred as Locale)) {
        return preferred as Locale;
      }
    }
  }

  // Default fallback locale
  return 'en';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Skip internal Next.js paths
    '/((?!_next|favicon.ico|robots.txt|api).*)',
  ],
};
