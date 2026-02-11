'use server'

import { revalidateTag } from 'next/cache'
import { lostBorrow } from '../api/borrow'
import { Verify } from '../firebase/firebase'
import { CACHE_KEY_BORROWS } from '../consts'

// server action to lost a borrow
export async function lostBorrowAction(
  data: Parameters<typeof lostBorrow>[0]
): Promise<Promise<{ error: string } | { message: string }>> {
  const headers = await Verify({
    from: `/admin/borrows/${data.id}`,
  })

  try {
    const res = await lostBorrow(data, {
      headers,
    })
    if ('error' in res) {
      return {
        error: res.error,
      }
    }

    // revalidatePath(`/admin/borrows/${data.id}`)
    // revalidatePath(`/admin/borrows`)
    // revalidatePath(`/borrows/${data.id}`)
    // revalidatePath('/borrows')
    // revalidatePath('/admin/books')
    // revalidatePath('/books')
    revalidateTag(CACHE_KEY_BORROWS, 'max')
    return { message: 'marked as lost' }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to mark as lost' }
  }
}
