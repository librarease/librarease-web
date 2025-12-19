'use server'

import { revalidatePath } from 'next/cache'
import { Verify } from '../firebase/firebase'
import { createReview, updateReview } from '../api/review'

type ReviewBorrowParams =
  | Parameters<typeof createReview>[0]
  | ({
      id: Parameters<typeof updateReview>[0]
    } & Parameters<typeof updateReview>[1])

// server action to review a borrow
export async function reviewBorrowAction(
  id: string,
  params: ReviewBorrowParams
) {
  const headers = await Verify({
    from: `/borrows/${id}/review`,
  })

  try {
    const res =
      'id' in params
        ? await updateReview(params.id, params, { headers })
        : await createReview(params, { headers })

    if ('error' in res) {
      return {
        error: res.error,
      }
    }
    return { message: 'Review submitted successfully' }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'Failed to submit review' }
  } finally {
    revalidatePath(`/admin/borrows/${id}`)
    revalidatePath(`/admin/borrows/${id}/review`)
    revalidatePath(`/admin/borrows`)
  }
}
