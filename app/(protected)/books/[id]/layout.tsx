import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getBook } from '@/lib/api/book'
import { colorsToCssVars } from '@/lib/utils/color-utils'
import { ThreeDBook } from '@/components/books/three-d-book'
import { ViewTransition } from 'react'
import BtnWatchlist from '@/components/books/BtnWatchlist'

export default async function BookDetailsLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>
  children: React.ReactNode
}) {
  const { id } = await params

  const [bookRes] = await Promise.all([getBook({ id, include_stats: 'true' })])

  if ('error' in bookRes) {
    console.log({ libRes: bookRes })
    return <div>{JSON.stringify(bookRes.message)}</div>
  }

  const cssVars = colorsToCssVars(bookRes.data.colors)

  return (
    <div className="space-y-4" style={cssVars}>
      <h1 className="text-2xl font-semibold">{bookRes.data.title}</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/books">Books</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{bookRes.data.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <div className="grid place-items-center gap-4 lg:sticky lg:top-4">
            <ViewTransition name={bookRes.data.id}>
              <div className="relative">
                <div className="absolute inset-0 blur-3xl opacity-80 bg-(--color-light-vibrant) dark:bg-(--color-dark-vibrant) rounded-lg" />
                <ThreeDBook book={bookRes.data} />
              </div>
            </ViewTransition>
            <BtnWatchlist
              bookId={bookRes.data.id}
              isWatched={!!bookRes.data.watchlists?.[0]}
            />
          </div>
        </div>

        <div className="lg:col-span-2">{children}</div>
      </div>
    </div>
  )
}
