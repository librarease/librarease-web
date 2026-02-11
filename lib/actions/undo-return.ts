'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { deleteReturn } from '../api/borrow'
import { Verify } from '../firebase/firebase'
import { CACHE_KEY_BORROWS } from '../consts'

// server action to undo return a borrow
export async function undoReturnAction(id: string) {
  const headers = await Verify({
    from: '/borrows',
  })

  try {
    const res = await deleteReturn(
      {
        id: id,
      },
      {
        headers,
      }
    )
    return res
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to undo return' }
  } finally {
    revalidatePath(`/admin/borrows/${id}`)
    revalidatePath(`/admin/borrows`)
    revalidateTag(CACHE_KEY_BORROWS, 'max')
    // revalidatePath(`/borrows/${id}`)
    // revalidatePath('/borrows')
    // revalidatePath('/admin/books')
    // revalidatePath('/books')
  }
}
