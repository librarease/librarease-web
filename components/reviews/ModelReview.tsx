'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BorrowDetail } from '@/lib/types/borrow'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FormReview } from './FormReview'

export const ModalReview: React.FC<{ borrow: BorrowDetail }> = ({ borrow }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(true)
  const prevPathRef = useRef(pathname)

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      setOpen(false)
    }
    prevPathRef.current = pathname
  }, [pathname])

  return (
    <Dialog open={open} onOpenChange={router.back} modal={false}>
      <DialogContent className="bg-background/50 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>
            {borrow.review ? borrow.book.title : 'Write a Review'}
          </DialogTitle>
          <DialogDescription>
            {borrow.review
              ? 'Your review details'
              : 'Let us know what you think about this book!'}
          </DialogDescription>
        </DialogHeader>

        <FormReview borrow={borrow} />
      </DialogContent>
    </Dialog>
  )
}
