import { User } from '@/lib/types/user'
import { BASE_URL } from './common'

const AUTH_URL = `${BASE_URL}/auth`

type RegisterUser = Pick<User, 'name' | 'email'> & { password: string }
type RegisterUserResponse = Promise<Pick<User, 'email'>>
export const registerUser = async (
  user: RegisterUser
): RegisterUserResponse => {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
  if (!res.ok) {
    const e = await res.json()
    throw e
  }
  return res.json()
}
