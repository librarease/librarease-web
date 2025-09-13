'use server'

import { revalidatePath } from 'next/cache'
import { addToWatchlist, removeFromWatchlist } from '../api/watchlist'
import { Verify } from '../firebase/firebase'

export async function addToWatchlistAction(bookId: string) {
  const headers = await Verify({ from: `/books/${bookId}` })

  try {
    const res = await addToWatchlist(bookId, { headers })
    revalidatePath(`/books/${bookId}`)
    return res
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to add to watchlist' }
  }
}

export async function removeFromWatchlistAction(bookId: string) {
  const headers = await Verify({ from: `/books/${bookId}` })

  try {
    const res = await removeFromWatchlist(bookId, { headers })
    revalidatePath(`/books/${bookId}`)
    return res
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to remove from watchlist' }
  }
}
