'use client'

import { FormEditBorrow } from '@/components/borrows/FormEditBorrow'
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

export const ModalEditBorrow: React.FC<{ borrow: BorrowDetail }> = ({
  borrow,
}) => {
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
    <Dialog open={open} onOpenChange={router.back} defaultOpen>
      <DialogContent className="bg-background/5 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>{borrow.book.title}</DialogTitle>
          <DialogDescription>{borrow.subscription.user.name}</DialogDescription>
        </DialogHeader>

        <FormEditBorrow borrow={borrow} />
      </DialogContent>
    </Dialog>
  )
}
