import { notFound } from 'next/navigation'
import { isLocale, locales } from '@/lib/i18n'

type Props = {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return children
}
