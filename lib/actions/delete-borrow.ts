'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { deleteBorrow } from '../api/borrow'
import { Verify } from '../firebase/firebase'
import { CACHE_KEY_BORROWS } from '../consts'

export async function deleteBorrowAction(id: string) {
  const headers = await Verify({
    from: `/admin/borrows/${id}`,
  })

  try {
    const res = await deleteBorrow({ id }, { headers })
    if ('error' in res) {
      return {
        error: res.error,
      }
    }

    revalidatePath(`/admin/borrows`)
    revalidatePath(`/borrows`)
    revalidateTag(CACHE_KEY_BORROWS, 'max')
    return { message: 'borrow deleted' }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to return borrow' }
  }
}
