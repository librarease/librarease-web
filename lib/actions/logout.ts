'use server'

import { cookies } from 'next/headers'

export async function logoutAction() {
  const cookieStore = await cookies()
  const sessionName = process.env.SESSION_COOKIE_NAME as string
  cookieStore.delete(sessionName)
}
