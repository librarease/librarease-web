import { NextResponse } from 'next/server'
import { NextRequest, MiddlewareConfig } from 'next/server'

export async function middleware(request: NextRequest) {
  if (!request.cookies.has(process.env.SESSION_COOKIE_NAME!)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config: MiddlewareConfig = {
  matcher: [
    '/subscriptions/:path*',
    '/borrows/:path*',
    '/staffs/:path*',
    '/libraries/([0-9a-fA-F-]{36})/edit',
    '/notifications/:path*',
  ],
}
