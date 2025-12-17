'use server'

import { returnBorrow } from '../api/borrow'
import { Verify } from '../firebase/firebase'

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
    return { message: 'borrow returned' }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to return borrow' }
  } finally {
    // revalidatePath(`/admin/borrows/${id}`)
    // revalidatePath(`/admin/borrows`)
    // revalidatePath(`/borrows/${id}`)
    // revalidatePath('/borrows')
    // revalidatePath('/admin/books')
    // revalidatePath('/books')
  }
}
