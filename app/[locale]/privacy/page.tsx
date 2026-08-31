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

  return getMetadataForPage(locale, '/privacy', dictionary.meta.privacy)
}

export default async function PrivacyPage({ params }: Props) {
  const locale = await getPageLocale(params)
  const dictionary = await getDictionary(locale)

  return (
    <div>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-10">
          <Button variant="ghost" asChild className="mb-4 -ml-4">
            <Link href={localizePath(locale, '/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {dictionary.privacy.backToHome}
            </Link>
          </Button>

          <div
            className="prose prose-slate max-w-none w-full mx-auto
                prose-headings:text-foreground prose-headings:font-semibold
                prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8 prose-h1:border-b prose-h1:border-foreground/10 prose-h1:pb-3
                prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6 prose-h2:text-foreground/80
                prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4 prose-h3:text-foreground/70
                prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:text-emerald-700 hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-ul:text-foreground/80 prose-ol:text-foreground/80
                prose-li:mb-1 prose-li:leading-relaxed
                prose-blockquote:border-l-emerald-500 prose-blockquote:bg-emerald-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
                prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-foreground"
            dangerouslySetInnerHTML={{ __html: dictionary.privacy.html }}
          />
        </div>
      </div>
    </div>
  )
}
