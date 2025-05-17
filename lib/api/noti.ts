import { Notification } from '../types/notification'
import { BASE_URL } from './common'

const NOTI_URL = `${BASE_URL}/notifications`

type NotificationHandlers = {
  onMessage?: (data: Notification) => void
  onError?: (event: Event) => void
  onConnect?: (event: Event) => void
}

export const streamNoti = (id: string, handlers: NotificationHandlers = {}) => {
  const source = new EventSource(`${NOTI_URL}/stream?user_id=${id}`)

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
