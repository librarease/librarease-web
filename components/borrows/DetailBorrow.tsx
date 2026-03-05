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
  Clock,
  CreditCard,
  Gavel,
  Library,
  Pen,
  Tally5,
  UserCog,
  AlertCircle,
  CheckCircle2,
  CalendarX,
} from 'lucide-react'
import clsx from 'clsx'
import { differenceInDays } from 'date-fns'
import { DateTime } from '@/components/common/DateTime'
import { ThreeDBook } from '@/components/books/three-d-book'
import { Route } from 'next'
import { ViewTransition } from 'react'

import { DataCardPrevBorrows } from './DataCardPrevBorrows'
import { colorsToCssVars } from '@/lib/utils/color-utils'
import { BtnBorrowSeq } from './BtnBorrowSeq'
import { Review } from '../reviews/Review'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export const DetailBorrow: React.FC<
  React.PropsWithChildren<{
    borrow: BorrowDetail
  }>
> = ({ borrow, children }) => {
  const status = getBorrowStatus(borrow)
  const isDue = status === 'overdue'

  const cssVars = colorsToCssVars(borrow.book.colors)

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      case 'returned':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Returned</Badge>
      case 'lost':
        return <Badge className="bg-red-500 hover:bg-red-600">Lost</Badge>
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">{statusStr}</Badge>
    }
  }

  return (
    <div className="mt-4" style={cssVars}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Borrow Details</h1>
          <BtnBorrowSeq prevID={borrow.prev_id} nextID={borrow.next_id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Book info */}
        <div className="lg:col-span-1">
          <Card className="bg-(--color-light-vibrant) dark:bg-(--color-dark-vibrant) sticky top-20">
            <CardContent className="p-6">
              <Link href={`../books/${borrow.book.id}` as Route}>
                <ViewTransition name={borrow.book.id}>
                  <div className="mb-6 flex justify-center">
                    <ThreeDBook book={borrow.book} />
                  </div>
                </ViewTransition>
              </Link>
              <Link
                href={`../books/${borrow.book.id}` as Route}
                className="font-semibold text-lg hover:text-primary transition-colors block mb-1"
              >
                {borrow.book.title}
              </Link>
              <p className="text-foreground/80 mb-3">{borrow.book.author}</p>
              <Badge variant="outline" className="text-xs">
                {borrow.book.code}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Borrow details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Borrow Status</CardTitle>
                {getStatusBadge(status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Borrowed At
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      <DateTime
                        dateTime={borrow.borrowed_at}
                        relative={isDue}
                      />
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Due At
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span
                      className={clsx('text-sm font-medium', {
                        'text-destructive': isDue,
                      })}
                    >
                      <DateTime dateTime={borrow.due_at} relative={isDue} />
                    </span>
                  </div>
                </div>
              </div>

              {isDue && (
                <div className="pt-4 border-t">
                  <div className="text-sm text-destructive mb-1">
                    Fine Expected
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarX className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium text-destructive">
                      {differenceInDays(
                        borrow.returning
                          ? new Date(borrow.returning.returned_at)
                          : new Date(),
                        new Date(borrow.due_at)
                      ) +
                        ' d x ' +
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
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">
                  Borrowed By
                </div>
                <Link
                  href={`../users/${borrow.subscription.user.id}` as Route}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10">
                      {borrow.subscription.user.name
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {borrow.subscription.user.name}
                  </span>
                </Link>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">
                  Library
                </div>
                <div className="flex items-center gap-2">
                  <Library className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href={
                      `../libraries/${borrow.subscription.membership.library.id}` as Route
                    }
                    className="text-sm font-medium hover:underline"
                  >
                    {borrow.subscription.membership.library.name}
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">
                  Checkout Processed By
                </div>
                <div className="flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {borrow.staff.name}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Details */}
          {borrow.returning && (
            <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle className="text-blue-900 dark:text-blue-100">
                      Return Details
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-blue-700 dark:text-blue-400 mb-1">
                      Returned At
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                        <DateTime dateTime={borrow.returning.returned_at} />
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-700 dark:text-blue-400 mb-1">
                      Fine
                    </div>
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      {borrow.returning.fine ?? '-'} Pts
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
                  <div className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                    Processed By
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                        {borrow.returning.staff.name
                          .substring(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-blue-900 dark:text-blue-200">
                      {borrow.returning.staff.name}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lost Details */}
          {borrow.lost && (
            <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <CardTitle className="text-red-900 dark:text-red-100">
                      Lost Details
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-red-700 dark:text-red-400 mb-1">
                      Reported At
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-600 dark:text-red-500" />
                      <span className="text-sm font-medium text-red-900 dark:text-red-200">
                        <DateTime dateTime={borrow.lost.reported_at} />
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-red-700 dark:text-red-400 mb-1">
                      Fine
                    </div>
                    <div className="text-sm font-medium text-red-900 dark:text-red-200">
                      {borrow.lost.fine ?? '-'} Pts
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-red-200 dark:border-red-800">
                  <div className="text-sm text-red-700 dark:text-red-400 mb-2">
                    Processed By
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-red-600/10 dark:bg-red-500/20 text-red-700 dark:text-red-300">
                        {borrow.lost.staff.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-red-900 dark:text-red-200">
                      {borrow.lost.staff.name}
                    </span>
                  </div>
                </div>

                {borrow.lost.note && (
                  <div className="pt-4 border-t border-red-200 dark:border-red-800">
                    <div className="text-sm text-red-700 dark:text-red-400 mb-1">
                      Note
                    </div>
                    <div className="flex items-start gap-2">
                      <Pen className="h-4 w-4 mt-0.5 text-red-600 dark:text-red-500" />
                      <span className="text-sm font-medium text-red-900 dark:text-red-200">
                        {borrow.lost.note}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {borrow.review && <Review review={borrow.review} />}

          {/* Subscription Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Subscription</CardTitle>
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
            <CardContent className="grid gap-y-4 gap-x-6 grid-cols-1 md:grid-cols-2">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Membership
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href={`../subscriptions/${borrow.subscription.id}` as Route}
                    className="text-sm font-medium hover:underline"
                  >
                    {borrow.subscription.membership.name}
                  </Link>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Expires
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    <DateTime dateTime={borrow.subscription.expires_at} />
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-1">
                  Borrow Period
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {borrow.subscription.loan_period} Days
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-1">
                  Usage Limit
                </div>
                <div className="flex items-center gap-2">
                  <Tally5 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {borrow.subscription.usage_limit ?? '-'}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-1">
                  Active Borrow Limit
                </div>
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {borrow.subscription.active_loan_limit ?? '-'}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-1">
                  Fine per Day
                </div>
                <div className="flex items-center gap-2">
                  <Gavel className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {borrow.subscription.fine_per_day ?? '-'} Pts
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <DataCardPrevBorrows borrow={borrow} />

          {children}
        </div>
      </div>
    </div>
  )
}
