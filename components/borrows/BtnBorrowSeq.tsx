'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Route } from 'next'

export const BtnBorrowSeq: React.FC<{ prevID?: string; nextID?: string }> = ({
  prevID,
  nextID,
}) => {
  const currentFilters = useSearchParams()

  const params = new URLSearchParams()
  currentFilters.forEach((value, key) => {
    params.append(key, value)
  })

  return (
    <div className="space-x-2">
      {prevID && (
        <Link href={`./${prevID}?${params.toString()}` as Route<string>}>
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
        </Link>
      )}
      {nextID && (
        <Link href={`./${nextID}?${params.toString()}` as Route<string>}>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4 mr-1" />
            Next
          </Button>
        </Link>
      )}
    </div>
  )
}
