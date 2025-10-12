'use server'

import { revalidatePath } from 'next/cache'
import { deleteSubscription } from '../api/subscription'
import { Verify } from '../firebase/firebase'

export async function deleteSubscriptionAction(id: string) {
  const headers = await Verify({ from: `/admin/subscriptions/${id}` })
  try {
    const res = await deleteSubscription(id, { headers })
    if (res && 'error' in res) {
      return { error: res.error }
    }
    return { message: 'subscription deleted successfully' }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to delete subscription' }
  } finally {
    revalidatePath(`/admin/subscriptions`)
  }
}
