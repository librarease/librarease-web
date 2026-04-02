import type { Metadata, Route } from 'next'
import { notFound } from 'next/navigation'
import { AnimatedBooksBackground } from '@/components/ui/animated-books-background'
import { LoginForm } from '@/components/login-form'
import {
  getDictionary,
  getMetadataForPage,
  isLocale,
  type Locale,
} from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    email?: string
    from?: Route
  }>
}

async function getPageLocale(params: Props['params']): Promise<Locale> {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return locale
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const locale = await getPageLocale(params)
  const dictionary = await getDictionary(locale)

  return getMetadataForPage(locale, '/login', dictionary.meta.login)
}

export default async function LoginPage({ params, searchParams }: Props) {
  const locale = await getPageLocale(params)
  const dictionary = await getDictionary(locale)
  const { email, from = '/' } = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <AnimatedBooksBackground />
      <div className="relative w-full max-w-sm">
        <LoginForm
          email={email}
          from={from}
          locale={locale}
          copy={dictionary.auth.login}
        />
      </div>
    </div>
  )
}
