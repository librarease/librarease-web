import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  getDictionary,
  getMetadataForPage,
  isLocale,
  localizePath,
  type Locale,
} from '@/lib/i18n'

type Props = {
  params: Promise<{
    locale: string
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

  return getMetadataForPage(locale, '/about', dictionary.meta.about)
}

export default async function AboutPage({ params }: Props) {
  const locale = await getPageLocale(params)
  const dictionary = await getDictionary(locale)

  return (
    <div>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-10">
          <Button variant="ghost" asChild className="mb-4 -ml-4">
            <Link href={localizePath(locale, '/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {dictionary.about.backToHome}
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold leading-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
              {dictionary.about.title}
            </h1>
          </div>
        </div>

        {dictionary.about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-lg text-foreground/80 mb-6">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}
