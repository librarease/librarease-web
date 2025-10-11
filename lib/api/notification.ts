import { QueryParams, ResList } from '@/lib/types/common'
import { Notification } from '@/lib/types/notification'
import { BASE_URL } from './common'

const NOTIFICATION_URL = `${BASE_URL}/notifications`

type NotificationHandlers = {
  onMessage?: (data: Notification) => void
  onError?: (event: Event) => void
  onConnect?: (event: Event) => void
}

export const streamNotification = (
  id: string,
  handlers: NotificationHandlers = {}
) => {
  const source = new EventSource(`${NOTIFICATION_URL}/stream?user_id=${id}`)

  source.onmessage = function (event) {
    const data = JSON.parse(event.data) as Notification
    handlers.onMessage?.(data)
  }

  source.onerror = function (event) {
    source.close()
    handlers.onError?.(event)
  }

  source.onopen = function (event) {
    handlers.onConnect?.(event)
  }

  // Return cleanup function
  return source.close.bind(source)
}

type GetListNotificationsResponse = Promise<ResList<Notification>>

export const getListNotifications = async (
  query: Pick<QueryParams<unknown>, 'skip' | 'limit'> & { is_unread?: 'true' },
  init?: RequestInit
): GetListNotificationsResponse => {
  const url = new URL(NOTIFICATION_URL)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })
  try {
    const response = await fetch(url.toString(), init)
    if (!response.ok) {
      const e = await response.json()
      throw e
    }
    return response.json()
  } catch (error) {
    return {
      error: 'Request failed',
      message: error as string,
    }
  }
}

export const readNotification = async (id: string, init?: RequestInit) => {
  const url = new URL(`${NOTIFICATION_URL}/${id}/read`)
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ read: true }),
    })
    if (!response.ok) {
      const e = await response.json()
      throw e
    }
  } catch (error) {
    return {
      error: 'Request failed',
      message: error as string,
    }
  }
}

export const readAllNotifications = async (init?: RequestInit) => {
  const url = new URL(`${NOTIFICATION_URL}/read`)
  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ read: true }),
      ...init,
    })
    if (!response.ok) {
      const e = await response.json()
      throw e
    }
  } catch (error) {
    return {
      error: 'Request failed',
      message: error as string,
    }
  }
}
