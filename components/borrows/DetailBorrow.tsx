import { BorrowDetail } from '@/lib/types/borrow'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  getBorrowStatus,
  getSubscriptionStatus,
  isSubscriptionActive,
} from '@/lib/utils'
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
import { DateTime } from '@/components/common/DateTime'
import { ThreeDBook } from '@/components/books/three-d-book'
import { Route } from 'next'
import { ViewTransition } from 'react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { CardPrevBorrows } from './CardPrevBorrows'
import { colorsToCssVars } from '@/lib/utils/color-utils'

export const DetailBorrow: React.FC<
  React.PropsWithChildren<{
    borrow: BorrowDetail
  }>
> = ({ borrow, children }) => {
  const status = getBorrowStatus(borrow)
  const isDue = status === 'overdue'

  const cssVars = colorsToCssVars(borrow.book.colors)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={cssVars}>
        <Card className="md:row-span-2 bg-[var(--color-light-vibrant)] dark:bg-[var(--color-dark-muted)]">
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
              <DateTime dateTime={borrow.borrowed_at} relative={isDue} />
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
              <DateTime dateTime={borrow.due_at} relative={isDue} />
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
              <Calendar className="size-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Reported:&nbsp;</span>
                <DateTime dateTime={borrow.lost.reported_at} />
              </p>
              <Gavel className="size-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Fine:&nbsp;</span>
                {borrow.lost.fine ?? '-'} Pts
              </p>
              <UserCog className="size-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Staff:&nbsp;</span>
                {borrow.lost.staff.name}
              </p>
              <Pen className="size-4 text-muted-foreground" />
              <p>
                <span className="font-medium">Note:&nbsp;</span>
                {borrow.lost.note}
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

      <CardPrevBorrows borrow={borrow} />

      {children}
    </>
  )
}
