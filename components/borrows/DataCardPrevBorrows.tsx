import { Borrow } from '@/lib/types/borrow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { getListBorrows } from '@/lib/api/borrow'
import { Verify } from '@/lib/firebase/firebase'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import Link from 'next/link'
import { Route } from 'next'
import clsx from 'clsx'
import { Skeleton } from '../ui/skeleton'
import React, { ComponentProps, Suspense } from 'react'

export const DataCardPrevBorrows: React.FC<
  ComponentProps<typeof PrevBorrows>
> = async ({ borrow }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Borrows</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<LoadingPrevBorrows />}>
          <PrevBorrows borrow={borrow} />
        </Suspense>
      </CardContent>
    </Card>
  )
}

const PrevBorrows: React.FC<{ borrow: Borrow }> = async ({ borrow }) => {
  const headers = await Verify({ from: '' })

  const [prevBorrowsRes] = await Promise.all([
    getListBorrows(
      {
        subscription_id: borrow.subscription.id,
        sort_in: 'asc',
        limit: 20,
      },
      {
        headers,
      }
    ),
  ])

  if ('error' in prevBorrowsRes) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {JSON.stringify(prevBorrowsRes.error)}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex items-end overflow-x-scroll p-6 isolate">
      {prevBorrowsRes.data.map((b) => (
        <Link
          href={`./${b.id}` as Route}
          key={b.id}
          className={clsx(
            'shrink-0 relative left-0 transition-all not-first-of-type:-ml-12 brightness-75',
            'hover:transition-all hover:-translate-y-4 hover:transform-none hover:brightness-100',
            'peer peer-hover:left-12 peer-hover:transition-all',
            'transform-[perspective(800px)_rotateY(20deg)]',
            {
              'z-10 -translate-y-4 brightness-100 transform-none':
                b.id === borrow.id,
            }
          )}
        >
          <Image
            src={b.book?.cover ?? '/book-placeholder.svg'}
            alt={b.book.title + "'s cover"}
            width={160}
            height={240}
            className="shadow-md rounded-lg w-40 h-60 place-self-center object-cover"
          />
        </Link>
      ))}
    </div>
  )
}

const LoadingPrevBorrows: React.FC = () => {
  return <Skeleton className="p-6 w-full h-60" />
}
