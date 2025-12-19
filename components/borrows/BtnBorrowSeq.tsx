'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Route } from 'next'

const ConditionalLink: React.FC<{
  href?: string
  children: React.ReactNode
}> = ({ href, children }) => {
  return href ? (
    <Link href={href as Route<string>}>{children}</Link>
  ) : (
    <>{children}</>
  )
}

export const BtnBorrowSeq: React.FC<{ prevID?: string; nextID?: string }> = ({
  prevID,
  nextID,
}) => {
  const currentFilters = useSearchParams()

  const params = new URLSearchParams()
  currentFilters.forEach((value, key) => {
    params.append(key, value)
  })

  const getHref = (id?: string) =>
    id ? `./${id}?${params.toString()}` : undefined

  return (
    <div className="space-x-2">
      <ConditionalLink href={getHref(prevID)}>
        <Button
          variant="outline"
          size="sm"
          disabled={!prevID}
          aria-disabled={!prevID}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Previous</span>
        </Button>
      </ConditionalLink>
      <ConditionalLink href={getHref(nextID)}>
        <Button
          variant="outline"
          size="sm"
          disabled={!nextID}
          aria-disabled={!nextID}
        >
          <ChevronRight className="h-4 w-4 mr-1" />
          <span>Next</span>
        </Button>
      </ConditionalLink>
    </div>
  )
}
