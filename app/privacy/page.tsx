import { getPrivacyDoc } from '@/lib/api/docs'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function PrivacyPage() {
  const doc = await getPrivacyDoc()

  return (
    <div className="">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <Button variant="ghost" asChild className="mb-4 -ml-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
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
            dangerouslySetInnerHTML={{ __html: doc }}
          />
        </div>
      </div>
    </div>
  )
}
