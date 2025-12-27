'use server'

import { app } from '../firebase/client'
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth'
import { cookies } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import { getMe } from '../api/user'
import { Route } from 'next'

const auth = getAuth(app)

type formState = {
  error: string
  email: string
  password: string
  from: Route
}

export async function loginAction(
  formState: formState,
  formData: FormData
): Promise<formState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let userCredentials: UserCredential
  try {
    userCredentials = await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    console.log(error)
    return {
      error: 'Invalid email or password',
      email,
      password,
      from: formState.from,
    }
  }

  const user = userCredentials.user
  const sessionName = process.env.SESSION_COOKIE_NAME as string
  const result = await user.getIdTokenResult()
  const token = result.token
  const maxAge =
    new Date(result.expirationTime).getTime() - new Date().getTime()
  const cookieStore = await cookies()
  cookieStore.set(sessionName, token, {
    maxAge,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  })

  // set active library
  const me = await getMe(
    { includeStaff: true },
    {
      headers: new Headers({
        'X-Client-Id': process.env.CLIENT_ID as string,
        'X-Uid': user.uid,
      }),
    }
  )
    .then((res) => ('error' in res ? null : res.data))
    .catch((e) => {
      console.warn('Error fetching me:', e)
      return null
    })

  if (me && me.staffs?.length) {
    const staffLibraries = me.staffs.map((s) => s.library_id)
    const activeLibrary = process.env.LIBRARY_COOKIE_NAME as string
    const existingActiveLibrary = cookieStore.get(activeLibrary)?.value
    if (
      !existingActiveLibrary ||
      !staffLibraries.includes(existingActiveLibrary)
    ) {
      cookieStore.set(activeLibrary, me.staffs[0].library_id, {})
    }
  }

  redirect(formState.from, RedirectType.replace)
}
