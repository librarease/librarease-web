'use server'
import { revalidatePath } from 'next/cache'
import { returnBorrow } from '../api/borrow'
import { Verify } from '../firebase/firebase'

export async function Return(id: string, init?: RequestInit) {
  const headers = await Verify({
    from: '/borrows',
  })

  returnBorrow(
    {
      id,
      returned_at: new Date().toISOString(),
      // FIXME: accept staff_id in api
      staff_id: '',
    },
    {
      headers,
      ...init,
    }
  )

  revalidatePath('/borrows')
}
