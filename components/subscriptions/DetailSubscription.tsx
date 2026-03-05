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
import { Badge } from '@/components/ui/badge'

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
    ? (activeLoanCount / activeLoanLimit) * 100 // Updated logic: Progress shows "Used" not "Free"
    : 0

  const usageLimit = subscription.usage_limit ?? 0
  const usageCount = subscription.usage_count ?? 0
  const usageRemaining = Math.max(usageLimit - usageCount, 0)
  const usageRemainingPct = usageLimit ? (usageCount / usageLimit) * 100 : 0

  const isExpired = new Date(subscription.expires_at) < new Date()

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Subscription Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Usage */}
        <div className="md:col-span-1 space-y-6">
          <Card
            className="sticky top-20"
            style={
              isExpired
                ? ({
                    '--color-primary': 'var(--primary-foreground)',
                  } as Record<string, string>)
                : undefined
            }
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Usage Limits</CardTitle>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Tally5 className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription.active_loan_limit ? (
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium">Active Borrows</span>
                    <Badge
                      variant={
                        activeLoanFree === 0 ? 'destructive' : 'secondary'
                      }
                    >
                      {activeLoanFree} left
                    </Badge>
                  </div>
                  <Progress
                    value={activeLoanFreePct}
                    className="h-2"
                    indicatorClassName={
                      activeLoanFree === 0 ? 'bg-destructive' : undefined
                    }
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Used: {activeLoanCount}</span>
                    <span>Max: {subscription.active_loan_limit}</span>
                  </div>
                </div>
              ) : null}

              {subscription.usage_limit ? (
                <div className="pt-4 border-t border-border/50">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium">
                      Total Lifetime Borrows
                    </span>
                    <Badge
                      variant={
                        usageRemaining === 0 ? 'destructive' : 'secondary'
                      }
                    >
                      {usageRemaining} left
                    </Badge>
                  </div>
                  <Progress
                    value={usageRemainingPct}
                    className="h-2"
                    indicatorClassName={
                      usageRemaining === 0 ? 'bg-destructive' : undefined
                    }
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Used: {usageCount}</span>
                    <span>Max: {usageLimit}</span>
                  </div>
                </div>
              ) : null}

              <CardAction className="mt-6">
                <Link
                  href={
                    ((isAdmin ? '/admin' : '') +
                      `/borrows?subscription_id=${subscription.id}`) as Route
                  }
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full bg-transparent hover:bg-accent/50 group"
                  >
                    View Borrow History
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardAction>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Data */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Plan Information</CardTitle>
                <Badge
                  variant={isExpired ? 'destructive' : 'default'}
                  className="capitalize"
                >
                  {isExpired ? 'Expired' : 'Active'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Purchased At
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {formatDate(subscription.created_at)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Expires At
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {formatDate(subscription.expires_at)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      (
                      {formatDistanceToNowStrict(
                        new Date(subscription.expires_at),
                        { addSuffix: true }
                      )}
                      )
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">
                  Membership
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href={
                      `../memberships/${subscription.membership.id}` as Route
                    }
                    className="text-sm font-medium hover:underline"
                  >
                    {subscription.membership.name}
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">
                  Library
                </div>
                <div className="flex items-center gap-2">
                  <Library className="h-4 w-4 text-muted-foreground" />
                  <Link
                    className="text-sm font-medium hover:underline"
                    href={
                      `../libraries/${subscription.membership.library.id}` as Route
                    }
                  >
                    {subscription.membership.library.name}
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Borrow Period Target
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {subscription.loan_period} Days
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Late Return Fine
                  </div>
                  <div className="flex items-center gap-2">
                    <Gavel className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {subscription.fine_per_day ?? '-'} Pts/Day
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-1">
                  Total Paid Amount
                </div>
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {subscription.amount ?? '-'} Pts
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Name</div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {subscription.user.name}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-2">
                  Email Address
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {subscription.user.email ?? '-'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {children}
    </>
  )
}
