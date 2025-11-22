import type { Review as TReview } from '@/lib/types/review'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { DateTime } from '../common/DateTime'
import { Star } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const Review: React.FC<{ review: TReview }> = ({ review }) => {
  return (
    <Card className="border-yellow-200 dark:border-yellow-800/50 bg-yellow-50/50 dark:bg-yellow-950/30 ">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="size-5 text-yellow-600 dark:text-yellow-500 fill-yellow-600 dark:fill-yellow-500" />
            <CardTitle className="text-yellow-900 dark:text-yellow-200">
              User Review
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-5 ${
                  star <= review!.rating
                    ? 'fill-yellow-400 dark:fill-yellow-500 text-yellow-400 dark:text-yellow-500'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-yellow-900 dark:text-yellow-100">
          {review.comment}
        </p>
        <div className="pt-4 border-t border-yellow-200 dark:border-yellow-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-yellow-600/10 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                {review?.user?.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-yellow-900 dark:text-yellow-200">
                {review.user.name}
              </div>
              <div className="text-xs text-yellow-700 dark:text-yellow-400/80">
                <DateTime dateTime={review.created_at}>
                  {formatDate(review.created_at)}
                </DateTime>
              </div>
            </div>
          </div>
          {/* <Link href={`/reviews`}>
            <Button variant="outline" size="sm" className="bg-white">
              View All Reviews
            </Button>
          </Link> */}
        </div>
      </CardContent>
    </Card>
  )
}
