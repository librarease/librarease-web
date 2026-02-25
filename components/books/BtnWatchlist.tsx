'use client'
import { startTransition, useOptimistic } from 'react'
import { BellMinus, BellRing } from 'lucide-react'
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
  const [optimisticWatched, setOptimisticWatched] = useOptimistic(
    isWatched,
    (_, next: boolean) => next
  )

  const onToggle = () => {
    const currentState = optimisticWatched
    const nextState = !currentState

    startTransition(async () => {
      setOptimisticWatched(nextState)
      
      if (currentState) {
        await removeFromWatchlistAction(bookId)
      } else {
        await addToWatchlistAction(bookId)
      }
    })
  }

  if (optimisticWatched) {
    return (
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={onToggle}
        aria-pressed={optimisticWatched}
      >
        <>
          <BellMinus className="mr-2 h-4 w-4 text-destructive" />
          Remove from Watchlist
        </>
      </Button>
    )
  }
  return (
    <Button
      variant="outline"
      className="w-full hover:bg-(--color-light-vibrant) hover:text-white dark:hover:bg-(--color-dark-vibrant) dark:hover:text-white"
      onClick={onToggle}
      aria-pressed={optimisticWatched}
    >
      <>
        <BellRing className="mr-2 h-4 w-4" />
        Add to Watchlist
      </>
    </Button>
  )
}
