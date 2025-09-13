'use client'
import { useTransition } from 'react'
import { BellMinus, BellRing, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  addToWatchlistAction,
  removeFromWatchlistAction,
} from '@/lib/actions/watchlist'

export default function BtnWatchlist({
  bookId,
  isWatched,
}: {
  bookId: string
  isWatched: boolean
}) {
  const [pending, startTransition] = useTransition()

  const handleAdd = () => startTransition(() => addToWatchlistAction(bookId))
  const handleRemove = () =>
    startTransition(() => removeFromWatchlistAction(bookId))

  if (isWatched) {
    return (
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={handleRemove}
        disabled={pending}
      >
        <>
          {pending ? (
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BellMinus className="mr-2 h-4 w-4 text-destructive" />
          )}
          Remove from Watchlist
        </>
      </Button>
    )
  }
  return (
    <Button
      variant="outline"
      className="w-full bg-transparent"
      onClick={handleAdd}
      disabled={pending}
    >
      <>
        {pending ? (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <BellRing className="mr-2 h-4 w-4" />
        )}
        Add to Watchlist
      </>
    </Button>
  )
}
