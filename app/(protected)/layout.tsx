import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // check if the user is authenticated
  // if not, redirect to the login page
  // REF: https://nextjs.org/docs/app/api-reference/functions/cookies
  const c = await cookies()
  const token = c.get('auth')
  console.log({ token })
  if (!token) {
    redirect('/login')
  }
  return <>{children}</>
}
