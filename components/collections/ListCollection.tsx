import { Collection } from '@/lib/types/collection'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import Image from 'next/image'
import { Library, Users } from 'lucide-react'
import { Badge } from '../ui/badge'

export const ListCollection: React.FC<
  React.PropsWithChildren<
    { collection: Collection } & React.HTMLAttributes<HTMLDivElement>
  >
> = ({ collection, children, ...props }) => {
  return (
    <Card
      {...props}
      className="pt-0 bg-(--color-light-muted) dark:bg-(--color-dark-muted)"
    >
      <CardHeader className="p-0 group">
        <div className="relative aspect-[2] overflow-hidden">
          <Image
            src={collection.cover || '/book-placeholder.svg'}
            alt={collection.title}
            fill
            className="w-full h-full object-cover rounded-t group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <CardTitle className="text-lg line-clamp-2 text-(--color-vibrant)">
            {collection.title}
          </CardTitle>

          <CardDescription className="flex items-center my-2">
            <Library className="size-4 mr-1" />
            <span className="text-xs font-medium">
              {collection.library?.name || 'Unknown Library'}
            </span>
          </CardDescription>

          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="text-xs">
              {collection.book_count} books
            </Badge>
            <div className="flex items-center gap-1 text-xs">
              <Users className="size-4" />
              <span>{collection.follower_count}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
