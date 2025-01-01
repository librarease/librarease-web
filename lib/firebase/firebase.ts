import { cookies } from 'next/headers'
import { adminApp } from './admin'
import { redirect, RedirectType } from 'next/navigation'

export async function Verify({ from }: { from: string }) {
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

  if (!headers.has('X-Uid') || !headers.has('X-Client-Id')) {
    redirect(`/login?from=${encodeURIComponent(from)}`, RedirectType.replace)
  }

  return headers
}
