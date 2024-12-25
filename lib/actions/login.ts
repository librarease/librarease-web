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
      error: 'Something went wrong',
      email,
      password,
      from: formState.from,
    }
  }

  const user = userCredentials.user
  const sessionName = process.env.SESSION_COOKIE_NAME as string
  const token = await user.getIdToken()
  const cookieStore = await cookies()
  cookieStore.delete(sessionName)
  cookieStore.set(sessionName, token, {
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect(formState.from, RedirectType.replace)
}
