'use server'

import { app } from '../firebase/client'
import {
  getAuth,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth'
import { cookies } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'

const auth = getAuth(app)

type formState = {
  error: string
  email: string
  password: string
  from: string
}

export async function login(
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
  })

  redirect(formState.from, RedirectType.replace)
}
