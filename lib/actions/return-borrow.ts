'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { returnBorrow } from '../api/borrow'
import { Verify } from '../firebase/firebase'
import { CACHE_KEY_BORROWS } from '../consts'

// server action to return a borrow
export async function returnBorrowAction({
  id,
  returned_at = new Date().toISOString(),
  ...data
}: Parameters<typeof returnBorrow>[0]) {
  const headers = await Verify({
    from: `/admin/borrows/${id}`,
  })

  try {
    const res = await returnBorrow(
      {
        id,
        returned_at,
        ...data,
      },
      {
        headers,
      }
    )
    if ('error' in res) {
      return {
        error: res.error,
      }
    }
    revalidatePath(`/admin/borrows/${id}`)
    revalidatePath(`/admin/borrows`)
    revalidateTag(CACHE_KEY_BORROWS, 'max')
    // revalidatePath(`/borrows/${id}`)
    // revalidatePath('/borrows')
    // revalidatePath('/admin/books')
    // revalidatePath('/books')
    return { message: 'borrow returned' }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to return borrow' }
  }
}
