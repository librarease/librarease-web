import { SignUpForm } from '@/components/signup-form'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'
import { AnimatedBooksBackground } from '@/components/ui/animated-books-background'

export const metadata: Metadata = {
  title: `Signup · ${SITE_NAME}`,
}

export default async function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <AnimatedBooksBackground />
      <div className="relative w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}
