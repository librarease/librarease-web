import { Subscription } from '@/lib/types/subscription'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  formatDate,
  getSubscriptionStatus,
  isSubscriptionActive,
} from '@/lib/utils'
import { formatDistanceToNowStrict } from 'date-fns'
import { Badge } from '../ui/badge'
import Link from 'next/link'

export const Cardsubscription: React.FC<{ subscription: Subscription }> = ({
  subscription,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg line-clamp-2">
            <Link href={`/subscriptions/${subscription.id}`}>Subscription</Link>
          </CardTitle>

          <Badge
            variant={
              isSubscriptionActive(subscription) ? 'default' : 'secondary'
            }
            className="capitalize"
          >
            {getSubscriptionStatus(subscription)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-2">
          <div className="grid grid-cols-3">
            <dt className="font-medium">Expire At:</dt>
            <dd className="col-span-2">
              {formatDate(subscription.expires_at)} (
              {formatDistanceToNowStrict(new Date(subscription.expires_at), {
                addSuffix: true,
              })}
              )
            </dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Paid Amount:</dt>
            <dd className="col-span-2">{subscription.amount ?? '-'} Pts</dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Borrow Period:</dt>
            <dd className="col-span-2">{subscription.loan_period} D</dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Usage Limit:</dt>
            <dd className="col-span-2">{subscription.usage_limit ?? '-'}</dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Active Book Limit:</dt>
            <dd className="col-span-2">{subscription.active_loan_limit}</dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Fine per Day:</dt>
            <dd className="col-span-2">
              {subscription.fine_per_day ?? '-'} Pts
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
