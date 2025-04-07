'use server'
import { revalidatePath } from 'next/cache'
import { deleteReturn } from '../api/borrow'
import { Verify } from '../firebase/firebase'

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
    revalidatePath('/borrows')
  }
}
