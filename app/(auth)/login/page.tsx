import { LoginForm } from '@/components/login-form'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string
    from?: string
  }>
}) {
  const { email, from = '/' } = await searchParams
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm email={email} from={from} />
      </div>
    </div>
  )
}
