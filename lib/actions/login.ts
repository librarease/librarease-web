'use server'

import { app } from '@/firebase.config'
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
}

export async function login(
  _: formState,
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
    }
  }

  const user = userCredentials.user
  const token = await user.getIdToken()

  const cookieStore = await cookies()
  cookieStore.set('auth', token, {
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect('/', RedirectType.replace)
}
