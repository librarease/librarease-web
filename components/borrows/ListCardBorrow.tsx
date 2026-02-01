import { Badge } from '@/components/ui/badge'
import { Borrow } from '@/lib/types/borrow'
import { formatDate, getBorrowStatus, cn, isBorrowDue } from '@/lib/utils'
import {
  Calendar,
  CalendarClock,
  CalendarX,
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
import { Route } from 'next'
import { GetBorrowQuery } from '@/lib/api/borrow'

export const ListCardBorrow: React.FC<
  React.PropsWithChildren<{
    borrow: Borrow
    idx: number
    searchParams: Pick<
      GetBorrowQuery,
      | 'status'
      | 'user_id'
      | 'book_id'
      | 'borrowed_at'
      | 'due_at'
      | 'returned_at'
      | 'lost_at'
      | 'subscription_id'
    >
  }>
> = ({ borrow, idx, children, searchParams }) => {
  const status = getBorrowStatus(borrow)
  const isDue = isBorrowDue(borrow)

  const href = (`./borrows/${borrow.id}?` +
    new URLSearchParams(
      Object.entries(searchParams).filter(([_, v]) => Boolean(v))
    ).toString()) as Route<string>

  return (
    <Card
      key={borrow.id}
      className={cn('relative', status === 'lost' && 'bg-destructive/5')}
    >
      <CardHeader>
        <Link href={href} className="flex justify-between items-start min-h-20">
          <div>
            <CardTitle className="text-lg line-clamp-2">
              <abbr title={borrow.book.title} className="no-underline">
                {borrow.book.title}
              </abbr>
            </CardTitle>
            <CardDescription>
              <span className="text-muted-foreground/80 font-bold tracking-wider">
                #&nbsp;{idx.toString().padStart(4, '0')}
              </span>
            </CardDescription>
          </div>
          <Badge
            variant={
              getBorrowStatus(borrow) === 'overdue'
                ? 'destructive'
                : getBorrowStatus(borrow) === 'active'
                  ? 'default'
                  : 'secondary'
            }
            className="capitalize"
          >
            {getBorrowStatus(borrow)}
          </Badge>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="size-4 text-muted-foreground" />
          <span>{borrow.subscription.user.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <LibraryIcon className="size-4 text-muted-foreground" />
          <span>{borrow.subscription.membership.library.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="size-4 text-muted-foreground" />
          <span>Borrowed: {formatDate(borrow.borrowed_at)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {isDue ? (
            <CalendarX className="size-4 text-destructive" />
          ) : (
            <CalendarClock className="size-4 text-muted-foreground" />
          )}
          <span className={cn(isDue && 'text-destructive')}>
            Due: {formatDate(borrow.due_at)}
          </span>
        </div>
      </CardContent>
      <CardFooter>{children}</CardFooter>
    </Card>
  )
}
