'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { updateBorrow } from '../api/borrow'
import { Verify } from '../firebase/firebase'
import { CACHE_KEY_BORROWS } from '../consts'

export async function updateBorrowAction(
  data: Parameters<typeof updateBorrow>[0]
) {
  const headers = await Verify({
    from: `/admin/borrows/${data.id}/edit`,
  })

  try {
    const res = await updateBorrow(data, {
      headers,
    })

    revalidatePath(`/admin/borrows/${data.id}`)
    revalidatePath(`/admin/borrows`)
    // revalidatePath(`/borrows/${data.id}`)
    // revalidatePath('/borrows')
    revalidateTag(CACHE_KEY_BORROWS, 'max')
    revalidateTag(data.id, 'max')

    return res
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to update borrow' }
  }
}
