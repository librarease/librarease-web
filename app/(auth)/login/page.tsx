import { LoginForm } from '@/components/login-form'
import type { Metadata, Route } from 'next'
import { SITE_NAME } from '@/lib/consts'
import { AnimatedBooksBackground } from '@/components/ui/animated-books-background'

export const metadata: Metadata = {
  title: `Login · ${SITE_NAME}`,
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string
    from?: Route
  }>
}) {
  const { email, from = '/' } = await searchParams
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <AnimatedBooksBackground />
      <div className="relative w-full max-w-sm">
        <LoginForm email={email} from={from} />
      </div>
    </div>
  )
}
