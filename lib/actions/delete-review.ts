'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { deleteReview } from '../api/review'
import { Verify } from '../firebase/firebase'
import { Borrow } from '../types/borrow'
import { Review } from '../types/review'
import { CACHE_KEY_REVIEWS } from '../consts'

export async function deleteReviewAction(
  id: Review['id'],
  borrowID: Borrow['id']
) {
  const headers = await Verify({ from: `/borrows/${borrowID}` })
  try {
    const res = await deleteReview(id, { headers })
    if (res && 'error' in res) {
      return { error: res.error }
    }

    revalidatePath(`/borrows/${borrowID}`)
    revalidateTag(CACHE_KEY_REVIEWS, 'max')

    return { message: 'Review deleted successfully' }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to delete Review' }
  }
}
