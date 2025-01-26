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
import { getBorrow } from '@/lib/api/borrow'
import { Badge } from '@/components/ui/badge'
import { getBorrowStatus } from '@/lib/utils'
import { CardBorrow } from '@/components/borrows/CardBorrow'
import { CardBook } from '@/components/books/CardBook'
import { Carduser } from '@/components/users/CardUser'
import { Cardstaff } from '@/components/staffs/CardStaff'
import { Cardsubscription } from '@/components/subscriptions/CardSubscription'
import { CardMembership } from '@/components/memberships/CardMembership'
import { BtnReturnBook } from '@/components/borrows/BtnReturnBorrow'

export default async function BorrowDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await Verify({ from: `/borrows/${id}` })

  const [borrowRes] = await Promise.all([getBorrow({ id })])

  if ('error' in borrowRes) {
    console.log({ libRes: borrowRes })
    return <div>{JSON.stringify(borrowRes.message)}</div>
  }

  //   const cookieStore = await cookies()
  //   const sessionName = process.env.SESSION_COOKIE_NAME as string
  //   const session = cookieStore.get(sessionName)

  return (
    <div className="space-y-4">
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
              <BreadcrumbPage>{borrowRes.data.book.title}</BreadcrumbPage>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardBorrow borrow={borrowRes.data} />
        <CardBook book={borrowRes.data.book} />
        <Carduser user={borrowRes.data.subscription.user} />
        <Cardstaff staff={borrowRes.data.staff} />
        <Cardsubscription subscription={borrowRes.data.subscription} />
        <CardMembership membership={borrowRes.data.subscription.membership} />
      </div>
      {!borrowRes.data.returning && (
        <div className="bottom-0 sticky py-2">
          <BtnReturnBook
            variant="outline"
            className="w-full"
            borrow={borrowRes.data}
          />
        </div>
      )}
    </div>
  )
}
