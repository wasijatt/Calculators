import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/config/i18n'

function getPreferredLocale(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language') ?? ''
  // Simple best-match: check each locale in priority order
  for (const part of acceptLang.split(',')) {
    const code = part.split(';')[0].trim().toLowerCase().split('-')[0]
    if ((locales as readonly string[]).includes(code)) return code
  }
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip internal Next.js paths, static files, API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files like favicon.ico, sitemap.xml
  ) {
    return NextResponse.next()
  }

  // Check if the path already has a valid locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )

  if (pathnameHasLocale) return NextResponse.next()

  // Redirect root or unlocaled paths to preferred locale
  const locale = getPreferredLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
