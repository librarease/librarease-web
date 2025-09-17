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

function getTextColor([r, g, b]: number[]): 'white' | 'black' {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? 'black' : 'white'
}

export const ListCollection: React.FC<
  React.PropsWithChildren<{ collection: Collection }>
> = ({ collection, children }) => {
  const colors = collection.cover?.colors ?? []
  const primary = colors[0] || [240, 240, 240]
  const accent = colors[1] || [200, 200, 200]
  const textColor = getTextColor(primary)
  const accentText = getTextColor(accent)

  return (
    <Card style={{ backgroundColor: `rgb(${primary.join(',')})` }}>
      <CardHeader className="p-0 group">
        <div className="relative aspect-[2] overflow-hidden">
          <Image
            src={collection.cover?.path || '/book-placeholder.svg'}
            alt={collection.title}
            fill
            className="w-full h-full object-cover rounded-t group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <CardTitle
            className="text-lg line-clamp-2"
            style={{ color: textColor }}
          >
            {collection.title}
          </CardTitle>

          <CardDescription
            className="flex items-center my-2"
            style={{ color: accentText === 'white' ? '#f3f3f3' : '#222' }}
          >
            <Library
              className="size-4 mr-1"
              style={{ color: accentText === 'white' ? '#fff' : '#222' }}
            />
            <span className="text-xs font-medium">
              {collection.library?.name || 'Unknown Library'}
            </span>
          </CardDescription>

          <div className="flex justify-between items-center">
            <Badge
              variant="secondary"
              className="text-xs"
              style={{
                backgroundColor: `rgb(${accent.join(',')})`,
                color: accentText === 'white' ? '#fff' : '#222',
                border: 'none',
              }}
            >
              {collection.book_count} books
            </Badge>
            <div
              className="flex items-center gap-1 text-xs"
              style={{ color: accentText === 'white' ? '#f3f3f3' : '#222' }}
            >
              <Users
                className="size-4"
                style={{ color: accentText === 'white' ? '#fff' : '#222' }}
              />
              <span>{collection.follower_count}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent
        style={
          {
            '--accent-bg': `rgb(${accent.join(',')})`,
            '--accent-text': accentText,
          } as React.CSSProperties
        }
      >
        {children}
      </CardContent>
    </Card>
  )
}
