'use server'

// import { app } from '@/firebase.config'
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   UserCredential,
// } from 'firebase/auth'
import { redirect, RedirectType } from 'next/navigation'
import { registerUser } from '../api/auth'

// const auth = getAuth(app)

type formState = {
  error: string
  email: string
  name: string
  password: string
}

export async function register(
  _: formState,
  formData: FormData
): Promise<formState> {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    await registerUser({ name, email, password })
  } catch (error) {
    console.log(error)
    return {
      error: 'Something went wrong',
      name,
      email,
      password,
    }
  }

  redirect(`/login?email=${email}`, RedirectType.replace)
}
