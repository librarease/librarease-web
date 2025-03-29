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
import { getBorrow, getListBorrows } from '@/lib/api/borrow'
import { Badge } from '@/components/ui/badge'
import {
  formatDate,
  getBorrowStatus,
  getSubscriptionStatus,
  isBorrowDue,
  isSubscriptionActive,
} from '@/lib/utils'
import { BtnReturnBook } from '@/components/borrows/BtnReturnBorrow'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Book,
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  Clock,
  CreditCard,
  Gavel,
  Library,
  Tally5,
  User,
  UserCog,
} from 'lucide-react'
import clsx from 'clsx'
import { differenceInDays } from 'date-fns'
import { Borrow } from '@/lib/types/borrow'

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

  const isDue = isBorrowDue(borrowRes.data)

  // const progressPercent = getBorrowProgressPercent(borrowRes.data)

  const headers = await Verify({
    from: '/borrows',
  })

  let prevBorrows: Borrow[] = []
  const [prevBorrowsRes] = await Promise.all([
    getListBorrows(
      {
        subscription_id: borrowRes.data.subscription.id,
        sort_in: 'asc',
        limit: 20,
      },
      {
        headers,
      }
    ),
  ])

  if ('error' in prevBorrowsRes) {
    prevBorrows = []
  } else {
    prevBorrows = prevBorrowsRes.data
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="md:row-span-2">
          <CardHeader>
            <CardTitle>Book Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Image
              src={borrowRes.data.book?.cover ?? '/book-placeholder.svg'}
              alt={borrowRes.data.book.title + "'s cover"}
              width={256}
              height={256}
              className="shadow-md rounded-lg w-56 h-auto place-self-center row-span-2"
            />
            <div>
              <h2 className="text-xl font-semibold">
                {borrowRes.data.book.title}
              </h2>
              <p className="text-gray-600">{borrowRes.data.book.author}</p>
              <p className="text-sm text-gray-500">
                {borrowRes.data.book.code}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 grid-cols-[max-content_1fr] items-center">
            <User className="size-4" />
            <p>
              <span className="font-medium">Name:&nbsp;</span>
              {/* <Link href={`/users/${borrowRes.data.subscription.user.id}`}> */}
              {borrowRes.data.subscription.user.name}
              {/* </Link> */}
            </p>
            <Library className="size-4" />
            <p>
              <span className="font-medium">Library:&nbsp;</span>
              <Link
                className="link"
                href={`/libraries/${borrowRes.data.subscription.membership.library.id}`}
              >
                {borrowRes.data.subscription.membership.library.name}
              </Link>
            </p>
            {/* <CreditCard className="size-4" />
            <p>
              <span className="font-medium">Membership:&nbsp;</span>
              {borrowRes.data.subscription.membership.name}
            </p>
            <Clock className="size-4" />
            <p>
              <span className="font-medium">Expires:&nbsp;</span>
              {formatDate(borrowRes.data.subscription.expires_at)}
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Borrow Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 grid-cols-[max-content_1fr] items-center">
            <UserCog className="size-4 text-muted-foreground" />
            <p>
              <span className="font-medium">Staff:&nbsp;</span>
              {borrowRes.data.staff.name}
              &nbsp;
              {borrowRes.data.returning
                ? '/ ' + borrowRes.data.returning.staff.name
                : null}
            </p>

            <Calendar className="size-4 text-muted-foreground" />
            <p>
              <span className="font-medium">Borrowed:&nbsp;</span>
              {formatDate(borrowRes.data.borrowed_at)}
            </p>
            {isDue ? (
              <>
                <Gavel className="size-4 text-muted-foreground" />
                <p>
                  <span className="font-medium">Fine Expected:&nbsp;</span>
                  {differenceInDays(
                    borrowRes.data.returning
                      ? new Date(borrowRes.data.returning.returned_at)
                      : new Date(),
                    new Date(borrowRes.data.due_at)
                  ) +
                    ' x ' +
                    (borrowRes.data.subscription.fine_per_day ?? 0) +
                    ' = ' +
                    differenceInDays(
                      borrowRes.data.returning
                        ? new Date(borrowRes.data.returning.returned_at)
                        : new Date(),
                      new Date(borrowRes.data.due_at)
                    ) *
                      (borrowRes.data.subscription.fine_per_day ?? 0) +
                    ' Pts'}
                </p>
                <CalendarX className="size-4 text-destructive" />
              </>
            ) : (
              <CalendarClock className="size-4 text-muted-foreground" />
            )}
            <p className={clsx({ 'text-destructive': isDue })}>
              <span className="font-medium">Due:&nbsp;</span>
              {formatDate(borrowRes.data.due_at)}
            </p>
            {borrowRes.data.returning ? (
              <>
                <CalendarCheck className="size-4 text-muted-foreground" />
                <p>
                  <span className="font-medium">Returned:&nbsp;</span>
                  {formatDate(borrowRes.data.returning.returned_at)}
                </p>
                <Gavel className="size-4 text-muted-foreground" />
                <p>
                  <span className="font-medium">Fine Received:&nbsp;</span>
                  {borrowRes.data.returning.fine ?? '-'} Pts
                </p>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} />
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Membership</CardTitle>
            <Badge
              variant={
                isSubscriptionActive(borrowRes.data.subscription)
                  ? 'default'
                  : 'secondary'
              }
              className="capitalize"
            >
              {getSubscriptionStatus(borrowRes.data.subscription)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 grid-cols-[max-content_1fr] md:grid-cols-[max-content_1fr_max-content_1fr] items-center">
          <CreditCard className="size-4" />
          <p>
            <span className="font-medium">Membership:&nbsp;</span>
            <Link
              href={`/subscriptions/${borrowRes.data.subscription.id}`}
              className="link"
            >
              {borrowRes.data.subscription.membership.name}
            </Link>
          </p>
          <Clock className="size-4" />
          <p>
            <span className="font-medium">Expires:&nbsp;</span>
            {formatDate(borrowRes.data.subscription.expires_at)}
          </p>
          <CalendarClock className="size-4" />
          <p>
            <span className="font-medium">Borrow Period:&nbsp;</span>
            {borrowRes.data.subscription.loan_period} D
          </p>
          <Tally5 className="size-4" />
          <p>
            <span className="font-medium">Usage Limit:&nbsp;</span>
            {borrowRes.data.subscription.usage_limit ?? '-'}
          </p>
          <Book className="size-4" />
          <p>
            <span className="font-medium">Active Borrow Limit:&nbsp;</span>
            {borrowRes.data.subscription.active_loan_limit ?? '-'}
          </p>
          <Gavel className="size-4" />
          <p>
            <span className="font-medium">Fine per Day:&nbsp;</span>
            {borrowRes.data.subscription.fine_per_day ?? '-'} Pts
          </p>
          <Calendar className="size-4" />
          <p>
            <span className="font-medium">Purchased At:&nbsp;</span>
            {formatDate(borrowRes.data.subscription.created_at)}
          </p>
        </CardContent>
      </Card>

      {prevBorrows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Borrows</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end overflow-x-scroll p-6">
            {prevBorrows.map((b) => (
              <Link
                href={`/borrows/${b.id}`}
                key={b.id}
                className={clsx(
                  'shrink-0 relative left-0 transition-all not-first-of-type:-ml-12 brightness-75',
                  'hover:transition-all hover:-translate-y-4 hover:transform-none hover:brightness-100',
                  'peer peer-hover:left-12 peer-hover:transition-all',
                  '[transform:perspective(800px)_rotateY(20deg)]',
                  {
                    'z-10 -translate-y-4 brightness-100 transform-none':
                      b.id === id,
                  }
                )}
              >
                <Image
                  src={b.book?.cover ?? '/book-placeholder.svg'}
                  alt={b.book.title + "'s cover"}
                  width={160}
                  height={240}
                  className="shadow-md rounded-lg w-40 h-64 place-self-center object-cover"
                />
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

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
