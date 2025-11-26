import { Calendar, Hash, Library, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, getBookStatus } from '@/lib/utils'
import { getBook } from '@/lib/api/book'
import Link from 'next/link'
import { getListReviews } from '@/lib/api/review'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { IsLoggedIn, Verify } from '@/lib/firebase/firebase'
import { Review } from '@/components/reviews/Review'
import { DataRecentBorrows } from '@/components/books/DataRecentBorrows'

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const headers = await Verify({
    from: `/admin/books/${id}`,
  })

  const claim = await IsLoggedIn()

  const [bookRes, reviewsRes, myReviewsRes] = await Promise.all([
    getBook({ id, include_stats: 'true' }),
    getListReviews({ book_id: id, limit: 3 }, { headers }),
    getListReviews(
      { book_id: id, limit: 3, user_id: claim?.librarease.id },
      { headers }
    ),
  ])

  if ('error' in bookRes) {
    console.log({ libRes: bookRes })
    return <div>{JSON.stringify(bookRes.message)}</div>
  }
  if ('error' in reviewsRes) {
    console.log({ reviewsRes })
    return <div>{JSON.stringify(reviewsRes.message)}</div>
  }
  if ('error' in myReviewsRes) {
    console.log({ myReviewsRes })
    return <div>{JSON.stringify(myReviewsRes.message)}</div>
  }

  const status = getBookStatus(bookRes.data.stats)
  const isAvailable = status === 'available'

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">{bookRes.data.title}</h1>
        <p className="text-xl text-muted-foreground mb-4">
          {bookRes.data.author}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            className="uppercase"
            variant={isAvailable ? 'default' : 'secondary'}
          >
            {status}
          </Badge>
          {/* <Badge variant="outline">bookRes.data.genre</Badge> */}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Book Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 grid-cols-[max-content_1fr] md:grid-cols-[max-content_1fr_max-content_1fr] items-center">
          <Hash className="size-4" />
          <p>
            <span className="font-medium">Code:&nbsp;</span>
            {bookRes.data.code}
          </p>
          <Calendar className="size-4" />
          <p>
            <span className="font-medium">Year:&nbsp;</span>
            {bookRes.data.year}
          </p>
          <Library className="size-4" />
          <p>
            <span className="font-medium">Library:&nbsp;</span>
            <Link
              href={`/libraries/${bookRes.data.library.id}`}
              className="link"
            >
              {bookRes.data.library.name}
            </Link>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{bookRes.data.description}</p>
        </CardContent>
      </Card>

      <DataRecentBorrows book_id={id} user_id={claim?.librarease.id} />

      {myReviewsRes.data.map((review) => (
        <Review key={review.id} review={review} />
      ))}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reviews</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-(--color-vibrant,var(--color-yellow-400)) text-(--color-vibrant,var(--color-yellow-400))" />
                <span className="font-semibold">
                  {bookRes.data.stats?.rating?.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({reviewsRes.meta.total}{' '}
                {reviewsRes.meta.total === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {reviewsRes.data.map((review) => (
              <div
                key={review.id}
                className="border-b last:border-b-0 pb-6 last:pb-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/10">
                        {review.user?.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {review.user?.name}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(review.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'fill-(--color-vibrant,var(--color-yellow-400)) text-(--color-vibrant,var(--color-yellow-400))'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t">
            {/* <Link href="/reviews"> */}
            <Button variant="outline" className="w-full bg-transparent">
              View All Reviews
            </Button>
            {/* </Link> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
