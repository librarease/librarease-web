import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AnimatedBooksBackground } from '@/components/ui/animated-books-background'
import { SignUpForm } from '@/components/signup-form'
import {
  getDictionary,
  getMetadataForPage,
  isLocale,
  type Locale,
} from '@/lib/i18n'

type Props = {
  params: Promise<{ locale: string }>
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

  return getMetadataForPage(locale, '/signup', dictionary.meta.signup)
}

export default async function SignupPage({ params }: Props) {
  const locale = await getPageLocale(params)
  const dictionary = await getDictionary(locale)

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <AnimatedBooksBackground />
      <div className="relative w-full max-w-sm">
        <SignUpForm locale={locale} copy={dictionary.auth.signup} />
      </div>
    </div>
  )
}
