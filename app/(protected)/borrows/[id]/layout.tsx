import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getBorrow } from '@/lib/api/borrow'
import { Verify } from '@/lib/firebase/firebase'
import { getBorrowStatus } from '@/lib/utils'
import Link from 'next/link'

export default async function BorrowDetailsLayout({
  children,
  edit,
  params,
}: Readonly<{
  children: React.ReactNode
  edit: React.ReactNode
  params: Promise<{ id: string }>
}>) {
  const { id } = await params

  await Verify({ from: `/borrows/${id}` })

  const [borrowRes] = await Promise.all([getBorrow({ id })])

  if ('error' in borrowRes) {
    console.log({ libRes: borrowRes })
    return <div>{JSON.stringify(borrowRes.message)}</div>
  }
  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">{borrowRes.data.book.title}</h1>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/" passHref legacyBehavior>
                  <BreadcrumbLink>Home</BreadcrumbLink>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link href="/borrows" passHref legacyBehavior>
                  <BreadcrumbLink>Borrows</BreadcrumbLink>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link href={`/borrows/${id}`} passHref legacyBehavior>
                  <BreadcrumbLink>{borrowRes.data.book.title}</BreadcrumbLink>
                </Link>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Badge
            variant={
              getBorrowStatus(borrowRes.data) === 'overdue'
                ? 'destructive'
                : getBorrowStatus(borrowRes.data) === 'returned'
                  ? 'secondary'
                  : 'default'
            }
            className="uppercase h-8 min-w-24 justify-center"
          >
            {getBorrowStatus(borrowRes.data)}
          </Badge>
        </div>
      </nav>
      {edit}
      {children}
    </div>
  )
}
