import { SubscriptionDetail } from '@/lib/types/subscription'

import { formatDate } from '@/lib/utils'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ArrowRight,
  Book,
  Calendar,
  CalendarClock,
  CircleDollarSign,
  Clock,
  CreditCard,
  Gavel,
  Library,
  Mail,
  Tally5,
  User,
} from 'lucide-react'
import { formatDistanceToNowStrict } from 'date-fns'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { Route } from 'next'
import { Button } from '../ui/button'

export const DetailSubscription: React.FC<
  React.PropsWithChildren<{
    subscription: SubscriptionDetail
    isAdmin?: boolean
  }>
> = ({ children, subscription, isAdmin }) => {
  const activeLoanLimit = subscription.active_loan_limit ?? 0
  const activeLoanCount = subscription.active_loan_count ?? 0
  const activeLoanFree = Math.max(activeLoanLimit - activeLoanCount, 0)
  const activeLoanFreePct = activeLoanLimit
    ? (activeLoanFree / activeLoanLimit) * 100
    : 0

  const usageLimit = subscription.usage_limit ?? 0
  const usageCount = subscription.usage_count ?? 0
  const usageRemaining = Math.max(usageLimit - usageCount, 0)
  const usageRemainingPct = usageLimit ? (usageRemaining / usageLimit) * 100 : 0

  const isExpired = new Date(subscription.expires_at) < new Date()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="row-span-2">
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 grid-cols-[max-content_1fr] items-center">
            <CalendarClock className="size-4" />
            <p>
              <span className="font-medium">Borrow Period:&nbsp;</span>
              {subscription.loan_period} D
            </p>
            <Tally5 className="size-4" />
            <p>
              <span className="font-medium">Usage Limit:&nbsp;</span>
              {subscription.usage_limit ?? '-'}
            </p>
            <Book className="size-4" />
            <p>
              <span className="font-medium">Active Borrow Limit:&nbsp;</span>
              {subscription.active_loan_limit ?? '-'}
            </p>
            <Gavel className="size-4" />
            <p>
              <span className="font-medium">Fine per Day:&nbsp;</span>
              {subscription.fine_per_day ?? '-'} Pts
            </p>
            <Clock className="size-4" />
            <p>
              <span className="font-medium">Expires:&nbsp;</span>
              {formatDate(subscription.expires_at)} (
              {formatDistanceToNowStrict(new Date(subscription.expires_at), {
                addSuffix: true,
              })}
              )
            </p>
            <Calendar className="size-4" />
            <p>
              <span className="font-medium">Purchased At:&nbsp;</span>
              {formatDate(subscription.created_at)}
            </p>
            <CircleDollarSign className="size-4 text-muted-foreground" />
            <p>
              <span>Amount:&nbsp;</span>
              {subscription.amount ?? '-'} Pts
            </p>
          </CardContent>
        </Card>

        <Card className="order-first md:order-0">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 grid-cols-[max-content_1fr] items-center">
            <User className="size-4" />
            <p>
              <span className="font-medium">Name:&nbsp;</span>
              {/* <Link href={`/users/${subscription.user.id}`}> */}
              {subscription.user.name}
              {/* </Link> */}
            </p>
            <Mail className="size-4" />
            <p>
              <span className="font-medium">Email:&nbsp;</span>
              {subscription.user.email ?? '-'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 grid-cols-[max-content_1fr] items-center">
            <CreditCard className="size-4" />
            <p>
              <span className="font-medium">Name:&nbsp;</span>
              {/* <Link href={`/users/${subscription.user.id}`}> */}
              {subscription.membership.name}
              {/* </Link> */}
            </p>
            <Library className="size-4" />
            <p>
              <span className="font-medium">Library:&nbsp;</span>
              <Link
                className="link"
                // FIXME
                href={
                  `../libraries/${subscription.membership.library.id}` as Route
                }
              >
                {subscription.membership.library.name}
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent
            style={
              isExpired
                ? ({
                    '--color-primary': 'var(--primary-foreground)',
                  } as Record<string, string>)
                : undefined
            }
            className="grid md:grid-cols-2 gap-4"
          >
            {subscription.active_loan_limit && (
              <div>
                <div className="flex justify-between">
                  <span>Active Borrows</span>
                  <span className="text-sm text-muted-foreground">
                    Free {activeLoanFree} / {subscription.active_loan_limit}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>In use: {activeLoanCount}</span>
                  <span>Capacity: {subscription.active_loan_limit}</span>
                </div>
                <Progress value={activeLoanFreePct} className="mt-1" />
              </div>
            )}

            <div>
              <div className="flex justify-between">
                <span>Total Borrows</span>
                <span className="text-sm text-muted-foreground">
                  Remaining {usageRemaining} / {usageLimit}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Used: {usageCount}</span>
                <span>Quota: {usageLimit}</span>
              </div>
              <Progress value={usageRemainingPct} className="mt-1" />
            </div>
          </CardContent>
          <CardAction className="mx-auto">
            <Link
              href={
                ((isAdmin ? '/admin' : '') +
                  `/borrows?subscription_id=${subscription.id}`) as Route
              }
              className="self-center"
            >
              <Button variant="link" className="w-full bg-transparent">
                View Borrows
                <ArrowRight />
              </Button>
            </Link>
          </CardAction>
        </Card>
      </div>

      {children}
    </>
  )
}
