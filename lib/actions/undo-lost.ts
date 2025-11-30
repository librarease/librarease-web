'use server'
import { revalidatePath } from 'next/cache'
import { deleteLost } from '../api/borrow'
import { Verify } from '../firebase/firebase'

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
    return { message: 'Undo lost successful' }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to undo lost' }
  } finally {
    revalidatePath(`/admin/borrows/${id}`)
    revalidatePath(`/admin/borrows`)
    revalidatePath(`/borrows/${id}`)
    revalidatePath('/borrows')
    revalidatePath('/admin/books')
    revalidatePath('/books')
  }
}
