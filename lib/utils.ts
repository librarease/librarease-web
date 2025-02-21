import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Borrow } from './types/borrow'
import { Subscription } from './types/subscription'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: string): string => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return formatter.format(new Date(date))
}

export const isBorrowDue = (borrow: Borrow) => {
  const now = borrow.returning
    ? new Date(borrow.returning.returned_at)
    : new Date()
  const due = new Date(borrow.due_at)
  return now > due
}

export const getBorrowStatus = (borrow: Borrow) => {
  if (borrow.returning?.returned_at) return 'returned'

  return isBorrowDue(borrow) ? 'overdue' : 'active'
}

export const isSubscriptionActive = (subscription: Subscription) => {
  const now = new Date()
  const expires = new Date(subscription.expires_at)
  return now < expires
}

export const getSubscriptionStatus = (subscription: Subscription) => {
  return isSubscriptionActive(subscription) ? 'active' : 'expired'
}

export const getBorrowProgressPercent = (borrow: Borrow): number => {
  if (isBorrowDue(borrow)) return 100

  const start = new Date(borrow.borrowed_at).getTime()

  const end = borrow.returning
    ? new Date(borrow.returning.returned_at).getTime()
    : new Date().getTime()

  return Math.min(
    100,
    Math.max(
      0,
      ((end - start) / (new Date(borrow.due_at).getTime() - start)) * 100
    )
  )
}
