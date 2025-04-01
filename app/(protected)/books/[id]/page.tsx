import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
// import { Verify } from '@/lib/firebase/firebase'
import { getBook } from '@/lib/api/book'
import Image from 'next/image'
import clsx from 'clsx'
// import { cookies } from 'next/headers'

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // await Verify({ from: `/books/${id}` })

  const [bookRes] = await Promise.all([getBook({ id })])

  if ('error' in bookRes) {
    console.log({ libRes: bookRes })
    return <div>{JSON.stringify(bookRes.message)}</div>
  }

  // const cookieStore = await cookies()
  // const sessionName = process.env.SESSION_COOKIE_NAME as string
  // const session = cookieStore.get(sessionName)

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
            <BreadcrumbPage>{bookRes.data.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="place-self-center flex my-12">
        <div className="bg-accent [transform:perspective(400px)_rotateY(314deg)] -mr-1 w-10">
          <span className="my-2 inline-block text-nowrap text-xs font-bold text-accent-foreground/50 [transform:rotate(90deg)_translateY(-30px)] origin-top-left">
            {bookRes.data.title}
          </span>
        </div>
        <Image
          src={bookRes.data?.cover ?? '/book-placeholder.svg'}
          alt={bookRes.data.title + "'s cover"}
          width={256}
          height={256}
          className={clsx(
            'shadow-xl rounded-r-md w-56 h-auto',
            '[transform:perspective(800px)_rotateY(14deg)]'
          )}
          priority
        />
      </div>
      <div className="place-self-center text-center pt-4 border-t">
        <p className="text-gray-600">{bookRes.data.author}</p>
        <p className="text-sm text-gray-500">{bookRes.data.code}</p>
      </div>
    </div>
  )
}
