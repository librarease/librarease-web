import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getBook } from '@/lib/api/book'
import { colorsToCssVars } from '@/lib/utils/color-utils'
import { ThreeDBook } from '@/components/books/three-d-book'
import { ViewTransition } from 'react'
import { Route } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/explore/books">Books</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/explore/books/${id}` as Route}>
              {bookRes.data.title}
            </BreadcrumbLink>
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
            <Button className="w-full" asChild>
              <Link href={`/login?from=/books/${bookRes.data.id}`}>Login</Link>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2">{children}</div>
      </div>
    </div>
  )
}
