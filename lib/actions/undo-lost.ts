'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { deleteLost } from '../api/borrow'
import { Verify } from '../firebase/firebase'
import { CACHE_KEY_BORROWS } from '../consts'

// server action to undo lost a borrow
export async function undoLostAction(id: string) {
  const headers = await Verify({
    from: `/admin/borrows/${id}`,
  })

  try {
    const res = await deleteLost(
      {
        id: id,
      },
      {
        headers,
      }
    )
    if ('error' in res) {
      return { error: res.error }
    }

    revalidatePath(`/admin/borrows/${id}`)
    revalidatePath(`/admin/borrows`)
    // revalidatePath(`/borrows/${id}`)
    // revalidatePath('/borrows')
    // revalidatePath('/admin/books')
    // revalidatePath('/books')
    revalidateTag(CACHE_KEY_BORROWS, 'max')
    return { message: 'Undo lost successful' }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to undo lost' }
  }
}
