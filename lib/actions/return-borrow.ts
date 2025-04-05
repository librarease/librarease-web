'use server'
import { revalidatePath } from 'next/cache'
import { returnBorrow } from '../api/borrow'
import { Verify } from '../firebase/firebase'

// server action to return a borrow
export async function actionReturnBorrow(id: string) {
  const headers = await Verify({
    from: '/borrows',
  })

  try {
    const res = await returnBorrow(
      {
        id: id,
        returned_at: new Date().toISOString(),
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
    return { error: 'failed to return borrow' }
  } finally {
    revalidatePath('/borrows')
  }
}
