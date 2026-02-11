'use server'

import { cookies } from 'next/headers'

export async function refreshToken(from: string = '/') {
  const refreshTokenName = process.env.REFRESH_TOKEN_COOKIE_NAME as string
  const sessionName = process.env.SESSION_COOKIE_NAME as string

  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(refreshTokenName)?.value

  if (!refreshToken) {
    return { success: false, error: 'No refresh token found' }
  }

  try {
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
      console.log('Refresh response not ok:', await refreshResponse.text())
      return { success: false, error: 'Token refresh failed' }
    }

    const data = await refreshResponse.json()
    const newIdToken = data.id_token
    const newRefreshToken = data.refresh_token

    cookieStore.set(sessionName, newIdToken, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    cookieStore.set(refreshTokenName, newRefreshToken, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    console.log('Token refresh successful')
    return { success: true, redirectTo: from }
  } catch (refreshError) {
    console.error('Token refresh failed:', refreshError)
    return { success: false, error: 'Token refresh failed' }
  }
}
