import { Notification as TNotification } from '@/lib/types/notification'
import { cn, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Bell, BookHeart, BookUser, CreditCard } from 'lucide-react'
import { NotificationAction } from './NotificationAction'
import Link from 'next/link'
import { Route } from 'next'

export const Notification: React.FC<{ noti: TNotification }> = ({ noti }) => {
  return (
    <div
      key={noti.id}
      className={cn(
        'flex gap-4 p-4 rounded-lg border',
        !noti.read_at && 'bg-secondary/50 border-secondary'
      )}
    >
      <div className="mt-1">{getIcon(noti.reference_type)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className={cn('font-medium', !noti.read_at && 'font-semibold')}>
            {noti.title}
          </h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {formatDate(noti.created_at, {})}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{noti.message}</p>
        {noti.reference_id && (
          <div className="mt-2">
            <Badge variant="outline" className="text-xs uppercase">
              <Link href={getLink(noti.reference_type, noti.reference_id)}>
                {noti.reference_type}_{noti.reference_id.slice(0, 8)}
              </Link>
            </Badge>
          </div>
        )}
      </div>
      <NotificationAction noti={noti} />
    </div>
  )
}

const getIcon = (type: string) => {
  switch (type) {
    case 'BOOK':
      return <BookHeart className="h-5 w-5 text-yellow-500" />
    case 'BORROWING':
      return <BookUser className="h-5 w-5 text-blue-500" />
    case 'SUBSCRIPTION':
      return <CreditCard className="h-5 w-5 text-green-500" />
    default:
      return <Bell className="h-5 w-5 text-gray-500" />
  }
}

const getLink = (type: string, id: string): Route => {
  switch (type) {
    case 'BOOK':
      return `/books/${id}` as Route
    case 'BORROWING':
      return `/borrows/${id}` as Route
    case 'SUBSCRIPTION':
      return `/subscriptions/${id}` as Route
    default:
      return `/notifications#${id}` as Route
  }
}
