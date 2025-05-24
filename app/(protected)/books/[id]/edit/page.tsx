import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { Verify } from '@/lib/firebase/firebase'
import { getBook } from '@/lib/api/book'
import { BookEditForm } from '@/components/books/book-edit-form'

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await Verify({ from: `/libraries/${id}/edit` })

  const [bookRes] = await Promise.all([getBook({ id })])

  if ('error' in bookRes) {
    console.log({ libRes: bookRes })
    return <div>{JSON.stringify(bookRes.message)}</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{bookRes.data.title}</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/books" passHref legacyBehavior>
              <BreadcrumbLink>Books</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Book</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <BookEditForm book={bookRes.data} />
    </div>
  )
}
