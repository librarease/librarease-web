'use server'

import { revalidatePath } from 'next/cache'
import { updateBorrow } from '../api/borrow'
import { Verify } from '../firebase/firebase'

export async function updateBorrowAction(
  data: Parameters<typeof updateBorrow>[0]
) {
  const headers = await Verify({
    from: '/borrows',
  })

  try {
    const res = await updateBorrow(data, {
      headers,
    })
    return res
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to update borrow' }
  } finally {
    revalidatePath(`/borrows/${data.id}`)
  }
}
