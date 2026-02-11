'use server'

import { revalidatePath } from 'next/cache'
import { updateSubscription } from '../api/subscription'
import { Verify } from '../firebase/firebase'

export async function updateSubscriptionAction(
  data: Parameters<typeof updateSubscription>[0]
) {
  const headers = await Verify({ from: `/admin/subscriptions/${data.id}` })
  try {
    const res = await updateSubscription(data, { headers })
    if ('error' in res) {
      return { error: res.error }
    }

    revalidatePath(`/admin/subscriptions/${data.id}`)

    return { message: 'subscription updated successfully' }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to update subscription' }
  }
}
