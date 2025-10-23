import { NextResponse } from 'next/server'
import { NextRequest, ProxyConfig } from 'next/server'

export async function proxy(request: NextRequest) {
  if (!request.cookies.has(process.env.SESSION_COOKIE_NAME!)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config: ProxyConfig = {
  matcher: [
    '/subscriptions/:path*',
    '/borrows/:path*',
    '/staffs/:path*',
    '/libraries/([0-9a-fA-F-]{36})/edit',
    '/notifications/:path*',
  ],
}
