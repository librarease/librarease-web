import { BorrowDetail } from '@/lib/types/borrow'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  getSubscriptionStatus,
  isBorrowDue,
  isSubscriptionActive,
} from '@/lib/utils'
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
  Pen,
  Tally5,
  User,
  UserCog,
} from 'lucide-react'
import clsx from 'clsx'
import { differenceInDays } from 'date-fns'
import { Borrow } from '@/lib/types/borrow'
import { DateTime } from '@/components/common/DateTime'
import { ThreeDBook } from '@/components/books/three-d-book'
import { Route } from 'next'
import { unstable_ViewTransition as ViewTransition } from 'react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'

export const DetailBorrow: React.FC<
  React.PropsWithChildren<{
    borrow: BorrowDetail
    prevBorrows: Borrow[]
  }>
> = ({ borrow, prevBorrows, children }) => {
  const isDue = isBorrowDue(borrow)
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="md:row-span-2">
          <CardHeader>
            <CardTitle>Book Information</CardTitle>
          </CardHeader>
          <CardContent className="grid place-self-center md:place-self-auto md:grid-cols-2 gap-4">
            {/* FIXME */}
            <Link href={`../books/${borrow.book.id}` as Route}>
              <ViewTransition name={borrow.book.id}>
                <ThreeDBook book={borrow.book} />
              </ViewTransition>
            </Link>
            <div>
              {/* FIXME */}
              <Link
                href={`../books/${borrow.book.id}` as Route}
                className="link"
              >
                <h2 className="text-xl font-semibold">{borrow.book.title}</h2>
              </Link>
              <p className="text-foreground/80">{borrow.book.author}</p>
              <p className="text-sm text-foreground/60">{borrow.book.code}</p>
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
              {/* <Link href={`/users/${borrow.subscription.user.id}`}> */}
              {borrow.subscription.user.name}
              {/* </Link> */}
            </p>
            <Library className="size-4" />
            <p>
              <span className="font-medium">Library:&nbsp;</span>
              <Link
                className="link"
                // FIXME
                href={
                  `../libraries/${borrow.subscription.membership.library.id}` as Route
                }
              >
                {borrow.subscription.membership.library.name}
              </Link>
            </p>
            {/* <CreditCard className="size-4" />
            <p>
              <span className="font-medium">Membership:&nbsp;</span>
              {borrow.subscription.membership.name}
            </p>
            <Clock className="size-4" />
            <p>
              <span className="font-medium">Expires:&nbsp;</span>
              {formatDate(borrow.subscription.expires_at)}
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
              {borrow.staff.name}
              &nbsp;
              {borrow.returning ? '/ ' + borrow.returning.staff.name : null}
            </p>

            <Calendar className="size-4 text-muted-foreground" />
            <p>
              <span className="font-medium">Borrowed:&nbsp;</span>
              <DateTime
                dateTime={borrow.borrowed_at}
                relative={!borrow.returning}
              />
            </p>
            {isDue ? (
              <>
                <Gavel className="size-4 text-muted-foreground" />
                <p>
                  <span className="font-medium">Fine Expected:&nbsp;</span>
                  {differenceInDays(
                    borrow.returning
                      ? new Date(borrow.returning.returned_at)
                      : new Date(),
                    new Date(borrow.due_at)
                  ) +
                    ' x ' +
                    (borrow.subscription.fine_per_day ?? 0) +
                    ' = ' +
                    differenceInDays(
                      borrow.returning
                        ? new Date(borrow.returning.returned_at)
                        : new Date(),
                      new Date(borrow.due_at)
                    ) *
                      (borrow.subscription.fine_per_day ?? 0) +
                    ' Pts'}
                </p>
                <CalendarX className="size-4 text-destructive" />
              </>
            ) : (
              <CalendarClock className="size-4 text-muted-foreground" />
            )}
            <p className={clsx({ 'text-destructive': isDue })}>
              <span className="font-medium">Due:&nbsp;</span>
              <DateTime dateTime={borrow.due_at} relative={!borrow.returning} />
            </p>
            {borrow.returning ? (
              <>
                <CalendarCheck className="size-4 text-muted-foreground" />
                <p>
                  <span className="font-medium">Returned:&nbsp;</span>
                  <DateTime dateTime={borrow.returning.returned_at} />
                </p>
                <Gavel className="size-4 text-muted-foreground" />
                <p>
                  <span className="font-medium">Fine Received:&nbsp;</span>
                  {borrow.returning.fine ?? '-'} Pts
                </p>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {borrow.lost ? (
        <Alert variant="destructive" className="bg-destructive/10">
          <AlertTitle className="font-semibold mb-4">
            Borrow Marked as Lost
          </AlertTitle>
          <AlertDescription>
            <div className="grid gap-2 grid-cols-[max-content_1fr] items-center">
              <Pen className="size-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Note:&nbsp;</span>
                {borrow.lost.note}
              </p>
              <Calendar className="size-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Reported:&nbsp;</span>
                <DateTime dateTime={borrow.lost.reported_at} />
              </p>
              <Gavel className="size-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Fine:&nbsp;</span>3 pts
              </p>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Membership</CardTitle>
            <Badge
              variant={
                isSubscriptionActive(borrow.subscription)
                  ? 'default'
                  : 'secondary'
              }
              className="capitalize"
            >
              {getSubscriptionStatus(borrow.subscription)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-2 grid-cols-[max-content_1fr] md:grid-cols-[max-content_1fr_max-content_1fr] items-center">
          <CreditCard className="size-4" />
          <p>
            <span className="font-medium">Membership:&nbsp;</span>
            <Link
              href={`../subscriptions/${borrow.subscription.id}` as Route}
              className="link"
            >
              {borrow.subscription.membership.name}
            </Link>
          </p>
          <Clock className="size-4" />
          <p>
            <span className="font-medium">Expires:&nbsp;</span>
            <DateTime dateTime={borrow.subscription.expires_at} />
          </p>
          <CalendarClock className="size-4" />
          <p>
            <span className="font-medium">Borrow Period:&nbsp;</span>
            {borrow.subscription.loan_period} D
          </p>
          <Tally5 className="size-4" />
          <p>
            <span className="font-medium">Usage Limit:&nbsp;</span>
            {borrow.subscription.usage_limit ?? '-'}
          </p>
          <Book className="size-4" />
          <p>
            <span className="font-medium">Active Borrow Limit:&nbsp;</span>
            {borrow.subscription.active_loan_limit ?? '-'}
          </p>
          <Gavel className="size-4" />
          <p>
            <span className="font-medium">Fine per Day:&nbsp;</span>
            {borrow.subscription.fine_per_day ?? '-'} Pts
          </p>
          <Calendar className="size-4" />
          <p>
            <span className="font-medium">Purchased At:&nbsp;</span>
            <DateTime dateTime={borrow.subscription.created_at} />
          </p>
        </CardContent>
      </Card>
      {prevBorrows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Borrows</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end overflow-x-scroll p-6 isolate">
            {prevBorrows.map((b) => (
              <Link
                // FIXME
                href={`./${b.id}` as Route}
                key={b.id}
                className={clsx(
                  'shrink-0 relative left-0 transition-all not-first-of-type:-ml-12 brightness-75',
                  'hover:transition-all hover:-translate-y-4 hover:transform-none hover:brightness-100',
                  'peer peer-hover:left-12 peer-hover:transition-all',
                  '[transform:perspective(800px)_rotateY(20deg)]',
                  {
                    'z-10 -translate-y-4 brightness-100 transform-none':
                      b.id === borrow.id,
                  }
                )}
              >
                <Image
                  src={b.book?.cover ?? '/book-placeholder.svg'}
                  alt={b.book.title + "'s cover"}
                  width={160}
                  height={240}
                  className="shadow-md rounded-lg w-40 h-60 place-self-center object-cover"
                />
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
      {children}
    </>
  )
}
