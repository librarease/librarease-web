import { getListReviews } from '@/lib/api/review'
import { Verify } from '@/lib/firebase/firebase'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import { DateTime } from '@/components/common/DateTime'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Route } from 'next'
import { CACHE_KEY_REVIEWS, CACHE_TTL_SECONDS } from '@/lib/consts'

export default async function BookReviewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    skip?: number
    limit?: number
    rating?: number
    comment?: string
  }>
}) {
  const { id } = await params
  const { rating, comment, ...sp } = await searchParams
  const skip = Number(sp?.skip ?? 0)
  const limit = Number(sp?.limit ?? 20)

  const headers = await Verify({
    from: `/books/${id}/reviews`,
  })

  const res = await getListReviews(
    {
      book_id: id,
      skip,
      rating,
      comment,
      limit,
    },
    {
      headers,
      cache: 'force-cache',
      next: {
        tags: [CACHE_KEY_REVIEWS, id],
        revalidate: CACHE_TTL_SECONDS,
      },
    }
  )

  if ('error' in res) {
    return <div>{JSON.stringify(res.message)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL =
    `/books/${id}/reviews?skip=${skip + limit}&limit=${limit}` as const
  const prevURL =
    `/books/${id}/reviews?skip=${prevSkip}&limit=${limit}` as const

  return (
    <div className="space-y-4">
      {res.data.map((review) => (
        <Card key={review.id} className="hover:shadow-md transition-shadow">
          <CardContent>
            <div className="space-y-4">
              {/* Header with user and rating */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/10">
                        {review.user.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="font-medium">{review.user.name}</h4>
                      <DateTime
                        dateTime={review.created_at}
                        className="text-xs text-muted-foreground"
                      >
                        {formatDate(review.created_at)}
                      </DateTime>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= review.rating
                          ? 'fill-(--color-vibrant,var(--color-yellow-400)) text-(--color-vibrant,var(--color-yellow-400))'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review text */}
              <p className="text-sm leading-relaxed mb-4 text-foreground">
                {review.comment}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      <Pagination>
        <PaginationContent>
          {res.meta.skip > 0 && (
            <PaginationItem>
              <PaginationPrevious href={prevURL as Route} />
            </PaginationItem>
          )}
          {res.meta.limit <= res.data.length && (
            <PaginationItem>
              <PaginationNext href={nextURL as Route} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
