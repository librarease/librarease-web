import { SubscriptionDetail } from '@/lib/types/subscription'

import { formatDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
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

export const DetailSubscription: React.FC<
  React.PropsWithChildren<{ subscription: SubscriptionDetail }>
> = ({ subscription }) => {
  return (
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

      <Card className="order-first md:order-none">
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
              href={`../libraries/${subscription.membership.library.id}`}
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
        <CardContent className="grid md:grid-cols-2 gap-4">
          {subscription.active_loan_limit && (
            <div>
              <div className="flex justify-between">
                <span>Active Borrows</span>
                <span>
                  {subscription.active_loan_count ?? 0} /{' '}
                  {subscription.active_loan_limit}
                </span>
              </div>
              <Progress
                value={
                  ((subscription.active_loan_count ?? 0) /
                    subscription.active_loan_limit) *
                  100
                }
              />
            </div>
          )}
          {subscription.usage_limit && (
            <div>
              <div className="flex justify-between">
                <span>Borrowed Books</span>
                <span>
                  {subscription.usage_count ?? 0} / {subscription.usage_limit}
                </span>
              </div>
              <Progress
                value={
                  ((subscription.usage_count ?? 0) / subscription.usage_limit) *
                  100
                }
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
