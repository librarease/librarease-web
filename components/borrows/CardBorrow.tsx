import { BtnReturnBook } from '@/components/borrows/BtnReturnBorrow'
import { Badge } from '@/components/ui/badge'
import { Borrow } from '@/lib/types/borrow'
import { formatDate } from '@/lib/utils'
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
import clsx from 'clsx'

const checkIsDue = (borrow: Borrow) => {
  const now = new Date()
  const due = new Date(borrow.due_at)
  return now > due
}

const getBorrowStatus = (borrow: Borrow) => {
  if (borrow.returning?.returned_at) return 'returned'

  return checkIsDue(borrow) ? 'overdue' : 'active'
}

export const CardBorrow: React.FC<{ borrow: Borrow }> = ({ borrow }) => {
  const isDue = checkIsDue(borrow)

  return (
    <Card
      key={borrow.id}
      className={clsx('relative', {
        'bg-destructive/5': isDue && !borrow.returning?.returned_at,
      })}
    >
      <CardHeader>
        <div className="flex justify-between items-start min-h-20">
          <div>
            <CardTitle className="text-lg line-clamp-2">
              <abbr title={borrow.book.title} className="no-underline">
                {borrow.book.title}
              </abbr>
            </CardTitle>
            <CardDescription>{borrow.book.code}</CardDescription>
          </div>
          <Badge
            variant={
              getBorrowStatus(borrow) === 'overdue'
                ? 'destructive'
                : getBorrowStatus(borrow) === 'returned'
                  ? 'secondary'
                  : 'default'
            }
            className="capitalize"
          >
            {getBorrowStatus(borrow)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{borrow.subscription.user.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <LibraryIcon className="h-4 w-4 text-muted-foreground" />
          <span>{borrow.subscription.membership.library.name}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>Borrowed: {formatDate(borrow.borrowed_at)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {isDue ? (
            <CalendarX className="h-4 w-4 text-destructive" />
          ) : (
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          )}
          <span className={`${isDue ? 'text-destructive' : ''}`}>
            Due: {formatDate(borrow.due_at)}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <BtnReturnBook variant="outline" className="w-full" borrow={borrow}>
          Return Book
        </BtnReturnBook>
      </CardFooter>
    </Card>
  )
}
