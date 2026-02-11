import { getListReviews } from '@/lib/api/review'
import { Verify } from '@/lib/firebase/firebase'
import { Calendar, Star } from 'lucide-react'
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
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { CACHE_KEY_REVIEWS, CACHE_TTL_SECONDS } from '@/lib/consts'

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    skip?: number
    limit?: number
    rating?: number
    comment?: string
    book_id?: string
    user_id?: string
  }>
}) {
  const { rating, comment, book_id, user_id, ...sp } = await searchParams
  const skip = Number(sp?.skip ?? 0)
  const limit = Number(sp?.limit ?? 20)

  const headers = await Verify({
    from: `/admin/reviews`,
  })

  const cookieStore = await cookies()
  const sessionName = process.env.LIBRARY_COOKIE_NAME as string
  const activeLibraryID = cookieStore.get(sessionName)?.value

  const res = await getListReviews(
    {
      library_id: activeLibraryID,
      book_id,
      user_id,
      skip,
      rating,
      comment,
      limit,
    },
    {
      headers,
      cache: 'force-cache',
      next: { tags: [CACHE_KEY_REVIEWS], revalidate: CACHE_TTL_SECONDS },
    }
  )

  if ('error' in res) {
    return <div>{JSON.stringify(res.message)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL = `/admin/reviews?skip=${skip + limit}&limit=${limit}` as const
  const prevURL = `/admin/reviews?skip=${prevSkip}&limit=${limit}` as const

  return (
    <div className="space-y-4">
      {res.data.map((review) => (
        <Card key={review.id} className="hover:shadow-md transition-shadow">
          <CardContent>
            <div className="flex gap-4">
              {/* 3D Book Effect */}

              <Link
                href={`/admin/books/${review.book.id}`}
                className="shrink-0"
              >
                <div className="flex">
                  <div className="bg-accent transform-[perspective(400px)_rotateY(314deg)] -mr-1 w-4">
                    <span className="inline-block text-nowrap text-[0.5rem] font-bold text-accent-foreground/50 transform-[rotate(90deg)_translateY(-16px)] origin-top-left"></span>
                  </div>
                  <Image
                    src={review.book.cover ?? '/book-placeholder.svg'}
                    alt={review.book.title + "'s cover"}
                    width={96}
                    height={144}
                    className={clsx(
                      'shadow-xl rounded-r-md md:w-24 md:h-36 object-cover',
                      'transform-[perspective(800px)_rotateY(14deg)]'
                    )}
                    priority
                  />
                </div>
              </Link>
              <Link href={`/admin/borrows/${review.borrowing_id}`}>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div>
                      <h4 className="font-medium">{review.book.title}</h4>
                      <div>{review.book.code}</div>
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
                  <div>
                    <p className="text-sm leading-relaxed mb-4 text-foreground line-clamp-4">
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-primary/10">
                          {review.user.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>{review.user.name}</div>
                      <div className="ml-auto flex gap-1">
                        <Calendar className="h-3 w-3" />
                        <DateTime
                          dateTime={review.created_at}
                          className="text-xs text-muted-foreground"
                        >
                          {formatDate(review.created_at)}
                        </DateTime>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
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
