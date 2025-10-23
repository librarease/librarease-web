import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'
import { ForgotPasswordForm } from '@/components/forgot-password-form'
import { Route } from 'next'

export const metadata: Metadata = {
  title: `Forgot Password · ${SITE_NAME}`,
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
      <div className="w-full max-w-sm">
        <ForgotPasswordForm email={email} from={from} />
      </div>
    </div>
  )
}
