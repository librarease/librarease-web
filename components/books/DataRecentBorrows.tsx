import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getListBorrows } from '@/lib/api/borrow'
import { Verify } from '@/lib/firebase/firebase'
import {
  AlertCircle,
  Book,
  ChevronRight,
  Clock,
  MessageSquare,
  Star,
  Calendar,
  CalendarCheck,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import { Route } from 'next'
import { Skeleton } from '../ui/skeleton'
import { Suspense } from 'react'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { formatDate, getBorrowStatus } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

export const DataRecentBorrows: React.FC<
  React.ComponentProps<typeof RecentBorrows>
> = async ({ book_id, user_id }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {user_id ? 'Your Borrowing History' : 'Recent Borrows'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Loading />}>
          <RecentBorrows user_id={user_id} book_id={book_id} />
        </Suspense>
      </CardContent>
    </Card>
  )
}

const RecentBorrows: React.FC<{
  book_id: string
  user_id?: string // if provided, fetch borrows for this user only
}> = async ({ user_id, book_id }) => {
  const headers = await Verify({ from: '' })

  const [res] = await Promise.all([
    getListBorrows(
      {
        book_id,
        sort_in: 'desc',
        sort_by: 'created_at',
        limit: 5,
        user_id,
        include_review: 'true',
      },
      {
        headers,
      }
    ),
  ])

  if ('error' in res) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{JSON.stringify(res.error)}</AlertDescription>
        </Alert>
      </div>
    )
  }
  const isAdmin = !user_id

  if (res.meta.total === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Book className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>
          {user_id
            ? "You haven't borrowed this book yet"
            : 'No borrowing records yet'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {res.data.map((borrow) => (
        <Link
          href={((isAdmin ? '/admin' : '') + `/borrows/${borrow.id}`) as Route}
          key={borrow.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-xs bg-primary/10">
                  {borrow.subscription.user.name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <span>{borrow.subscription.user.name}</span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(borrow.borrowed_at)}
                </span>
                {borrow.returning && (
                  <span className="flex items-center gap-1">
                    <CalendarCheck className="h-3 w-3" />
                    {formatDate(borrow.returning.returned_at)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {borrow.review ? (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-(--color-vibrant,var(--color-yellow-400)) text-(--color-vibrant,var(--color-yellow-400))" />
                <span>{borrow.review.rating}</span>
              </div>
            ) : borrow.returning ? (
              <Badge variant="outline" className="text-xs">
                <MessageSquare className="h-3 w-3 mr-1" />
                No review
              </Badge>
            ) : null}
            {getBorrowStatus(borrow)}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Link>
      ))}
      <div className="">
        <Link
          href={
            ((isAdmin ? '/admin' : '') + `/borrows?book_id=${book_id}`) as Route
          }
        >
          <Button variant="outline" className="w-full bg-transparent">
            View All Borrows ({res.meta.total})
          </Button>
        </Link>
      </div>
    </div>
  )
}

const Loading: React.FC = () => {
  return <Skeleton className="p-6 w-full h-60" />
}
