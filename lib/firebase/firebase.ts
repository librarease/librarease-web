import { cookies } from 'next/headers'
import { adminApp } from './admin'
import { redirect, RedirectType } from 'next/navigation'
import type { DecodedIdToken } from 'firebase-admin/auth'

/**
 * Verify checks if the cookie
 * is valid and returns the uid & internal client id headers
 * redirect to login page if the cookie is invalid
 */
export async function Verify({
  from,
  forceRedirect = true,
}: {
  from: string
  forceRedirect?: boolean
}): Promise<Headers> {
  const cookieStore = await cookies()
  const sessionName = process.env.SESSION_COOKIE_NAME as string
  const session = cookieStore.get(sessionName)
  const headers = new Headers()

  try {
    const decoded = await adminApp
      .auth()
      .verifyIdToken(session?.value as string)

    headers.set('X-Client-Id', process.env.CLIENT_ID as string)
    headers.set('X-Uid', decoded.uid)
  } catch (error) {
    if (error instanceof Error && 'code' in error) {
      switch (error.code) {
        case 'auth/id-token-expired':
          console.log('Token expired')
          break
        case 'auth/id-token-revoked':
          console.log('Token revoked')
          break
        case 'auth/argument-error':
          console.log('Token invalid')
          break
        default:
          console.log('Something went wrong')
          break
      }
    }
  }

  if (forceRedirect && (!headers.has('X-Uid') || !headers.has('X-Client-Id'))) {
    // redirect(`/login?from=${encodeURIComponent(from)}`, RedirectType.replace)
    redirect(`/refresh?from=${encodeURIComponent(from)}`, RedirectType.replace)
  }

  return headers
}

/**
 * IsLoggedIn checks if the user is logged in
 * and returns a token claims if the user is logged in
 */
export async function IsLoggedIn(): Promise<
  | (DecodedIdToken & {
      librarease: {
        id: string
        role: 'USER' | 'ADMIN' | 'SUPERADMIN'
        admin_libs: string[]
        staff_libs: string[]
      }
    })
  | null
> {
  const cookieStore = await cookies()
  const sessionName = process.env.SESSION_COOKIE_NAME as string
  const session = cookieStore.get(sessionName)

  // return early if the session is not found
  if (!session) {
    return null
  }

  try {
    const claims = await adminApp.auth().verifyIdToken(session?.value as string)
    return {
      librarease: {
        id: '',
        role: 'USER',
        admin_libs: [],
        staff_libs: [],
      },
      ...claims,
    }
  } catch (error) {
    console.log(error)
    return null
  }
}
