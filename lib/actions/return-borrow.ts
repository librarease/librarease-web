'use server'
import { revalidatePath } from 'next/cache'
import { returnBorrow } from '../api/borrow'
import { Verify } from '../firebase/firebase'

// server action to return a borrow
export async function ReturnBorrow(id: string) {
  const headers = await Verify({
    from: '/borrows',
  })

  returnBorrow(
    {
      id,
      returned_at: new Date().toISOString(),
    },
    {
      headers,
    }
  )

  revalidatePath('/borrows')
}
