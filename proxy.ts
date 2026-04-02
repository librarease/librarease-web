import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  defaultLocale,
  isLocale,
  isLocalizedPublicPath,
  LOCALE_HEADER,
  localizePath,
} from '@/lib/i18n'

function withLocaleHeader(request: NextRequest, locale: string) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(LOCALE_HEADER, locale)
  return requestHeaders
}

function redirectToLocale(
  request: NextRequest,
  pathname:
    | '/'
    | '/about'
    | '/terms'
    | '/privacy'
    | '/login'
    | '/signup'
    | '/forgot-password',
) {
  const url = request.nextUrl.clone()
  url.pathname = localizePath(defaultLocale, pathname)

  return NextResponse.redirect(url)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (pathname === '/') {
    return redirectToLocale(request, '/')
  }

  if (isLocalizedPublicPath(pathname)) {
    return redirectToLocale(request, pathname)
  }

  if (firstSegment && isLocale(firstSegment)) {
    return NextResponse.next({
      request: {
        headers: withLocaleHeader(request, firstSegment),
      },
    })
  }

  return NextResponse.next({
    request: {
      headers: withLocaleHeader(request, defaultLocale),
    },
  })
}

export const proxyConfig = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
