import { NextResponse } from 'next/server'
import { NextRequest, ProxyConfig } from 'next/server'
import { getAuth } from 'firebase-admin/auth'
import { adminApp } from './lib/firebase/admin'

const auth = getAuth(adminApp)

export async function proxy(request: NextRequest) {
  const sessionName = process.env.SESSION_COOKIE_NAME!
  const refreshTokenName = process.env.REFRESH_TOKEN_COOKIE_NAME!
  const refreshToken = request.cookies.get(refreshTokenName)?.value
  const idToken = request.cookies.get(sessionName)?.value

  // If neither token exists, redirect to login
  if (!idToken && !refreshToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If ID token is missing but refresh token exists, try to refresh
  if (!idToken && refreshToken) {
    try {
      console.log('proxy: ID token missing, refreshing with refresh token')
      const refreshResponse = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          }),
        }
      )

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh token')
      }

      const data = await refreshResponse.json()
      const newIdToken = data.id_token
      const newRefreshToken = data.refresh_token

      const response = NextResponse.next()

      response.cookies.set(sessionName, newIdToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      })

      response.cookies.set(refreshTokenName, newRefreshToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      })

      return response
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ID token exists, verify it
  try {
    await auth.verifyIdToken(idToken!)
    return NextResponse.next()
  } catch (error: any) {
    console.log('proxy: Token verification error:', error)

    // Token is expired, try to refresh
    if (error?.code === 'auth/id-token-expired' && refreshToken) {
      try {
        console.log('proxy: ID token expired, refreshing')
        const refreshResponse = await fetch(
          `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
            }),
          }
        )

        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh token')
        }

        const data = await refreshResponse.json()
        const newIdToken = data.id_token
        const newRefreshToken = data.refresh_token

        const response = NextResponse.next()

        response.cookies.set(sessionName, newIdToken, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        })

        response.cookies.set(refreshTokenName, newRefreshToken, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        })

        return response
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    // Token is revoked or invalid, redirect to login
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
