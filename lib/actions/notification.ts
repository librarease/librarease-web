'use server'

import { revalidatePath } from 'next/cache'
import { readAllNotifications, readNotification } from '../api/notification'
import { Verify } from '../firebase/firebase'

export async function readAllNotificationsAction() {
  const headers = await Verify({ from: '/notifications' })

  try {
    const res = await readAllNotifications({
      headers,
    })
    return res
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to read all notifications' }
  } finally {
    revalidatePath('/notifications')
  }
}

export async function readNotificationAction(id: string) {
  const headers = await Verify({ from: '/notifications' })

  try {
    const res = await readNotification(id, {
      headers,
    })
    return res
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to read notification' }
  } finally {
    revalidatePath('/notifications')
  }
}
