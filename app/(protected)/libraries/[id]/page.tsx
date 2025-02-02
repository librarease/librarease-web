import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  //   TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getListBooks } from '@/lib/api/book'
import { getLibrary } from '@/lib/api/library'
import { getListMemberships } from '@/lib/api/membership'
import Image from 'next/image'
import Link from 'next/link'

export default async function LibraryDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [libRes, bookRes, memRes] = await Promise.all([
    getLibrary({ id }),
    getListBooks({ limit: 5, library_id: id }),
    getListMemberships({ limit: 5, library_id: id }),
  ])

  if ('error' in libRes) {
    console.log({ libRes })
    return <div>{JSON.stringify(libRes.message)}</div>
  }

  if ('error' in bookRes) {
    console.log({ bookRes })
    return <div>{JSON.stringify(bookRes.message)}</div>
  }

  if ('error' in memRes) {
    console.log({ memRes })
    return <div>{JSON.stringify(memRes.message)}</div>
  }

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{libRes.data.name}</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/libraries" passHref legacyBehavior>
              <BreadcrumbLink>Libraries</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{libRes.data.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row gap-4 py-2">
        {libRes.data.logo && (
          <Image
            src={libRes.data.logo}
            alt={libRes.data.name}
            width={256}
            height={256}
            className="rounded-lg w-56 h-auto"
          />
        )}
        <div className="">
          <dl className="grid gap-2">
            <div className="grid grid-cols-3">
              <dt className="font-medium">Phone:</dt>
              <dd className="col-span-2">{libRes.data.phone}</dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="font-medium">Email:</dt>
              <dd className="col-span-2">{libRes.data.email}</dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="font-medium">Description:</dt>
              <dd className="col-span-2">{libRes.data.description}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 ">
        <div className="border border-gray-200 my-4">
          <Table>
            <TableCaption>Latest added books from the library.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="">Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Author</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookRes.data.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.code}</TableCell>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.year}</TableCell>
                  <TableCell className="text-right">{book.author}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="border border-gray-200 my-4">
          <Table>
            <TableCaption>
              Latest added memberships from the library.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Borrow Limit</TableHead>
                <TableHead>Borrow Period</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memRes.data.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="whitespace-nowrap">{m.name}</TableCell>
                  <TableCell>{m.usage_limit ?? '-'}</TableCell>
                  <TableCell>{m.loan_period} D</TableCell>
                  <TableCell>{m.price ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
