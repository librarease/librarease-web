import { Badge } from '@/components/ui/badge'
import {
  formatDate,
  isSubscriptionActive,
  getSubscriptionStatus,
} from '@/lib/utils'
import {
  Calendar,
  CalendarClock,
  CalendarX,
  CircleDollarSign,
  LibraryIcon,
  User,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Subscription } from '@/lib/types/subscription'
import clsx from 'clsx'

export const ListCardSubscription: React.FC<{ subscription: Subscription }> = ({
  subscription,
}) => {
  const isActive = isSubscriptionActive(subscription)

  return (
    <Card key={subscription.id}>
      <CardHeader>
        <Link
          href={`/subscriptions/${subscription.id}`}
          className="flex justify-between items-start min-h-20"
          legacyBehavior>
          <div>
            <CardTitle className="text-lg line-clamp-2">
              {subscription.membership.name}
            </CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                {subscription.user.name}
              </div>
            </CardDescription>
          </div>
          <Badge
            variant={
              isSubscriptionActive(subscription) ? 'default' : 'secondary'
            }
            className="capitalize"
          >
            {getSubscriptionStatus(subscription)}
          </Badge>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <LibraryIcon className="size-4 text-muted-foreground" />
          <span>{subscription.membership.library.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="size-4 text-muted-foreground" />
          <span>Purchased: {formatDate(subscription.created_at)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {isActive ? (
            <CalendarClock className="size-4 text-primary" />
          ) : (
            <CalendarX className="size-4 text-muted-foreground" />
          )}
          <span className={clsx({ 'text-primary': isActive })}>
            Expire: {formatDate(subscription.expires_at)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CircleDollarSign className="size-4 text-muted-foreground" />
          <span>Amount: {subscription.amount ?? '-'} Pts</span>
        </div>
      </CardContent>
      <CardFooter>
        {/* <BtnReturnBook variant="outline" className="w-full" borrow={borrow}>
          Return Book
        </BtnReturnBook> */}
      </CardFooter>
    </Card>
  );
}
