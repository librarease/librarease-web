'use server'

import { cookies } from 'next/headers'
import { exportBorrows } from '../api/borrow'
import { Verify } from '../firebase/firebase'

export async function exportBorrowAction(
  filters: Omit<Parameters<typeof exportBorrows>[0], 'library_id'>
) {
  const headers = await Verify({
    from: '/admin/borrows',
  })

  const cookieStore = await cookies()
  const cookieName = process.env.LIBRARY_COOKIE_NAME as string
  const libID = cookieStore.get(cookieName)?.value

  try {
    const res = await exportBorrows(
      {
        ...filters,
        library_id: libID!,
      },
      {
        headers,
      }
    )
    if ('error' in res) {
      return { error: res.error }
    }
    return {
      message: 'Export is being processed, you will be notified when ready.',
      id: res.data.id,
    }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to export' }
  }
}
