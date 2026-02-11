'use client'

import { use, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { refreshToken } from './actions'
import type { Route } from 'next'

export default function RefreshPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const router = useRouter()
  const { from = '/' } = use(searchParams)
  const hasRefreshed = useRef(false)

  useEffect(() => {
    if (hasRefreshed.current) return
    hasRefreshed.current = true

    refreshToken(from).then((result) => {
      if (result.success && result.redirectTo) {
        router.replace(result.redirectTo as Route)
      } else {
        router.replace(`/login?from=${from}` as Route)
      }
    })
  }, [from, router])

  return null
}
