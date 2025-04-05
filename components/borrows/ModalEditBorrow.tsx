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
import { useRouter } from 'next/navigation'

export const ModalEditBorrow: React.FC<{ borrow: BorrowDetail }> = ({
  borrow,
}) => {
  const router = useRouter()
  return (
    <Dialog open={true} onOpenChange={router.back}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{borrow.book.title}</DialogTitle>
          <DialogDescription>{borrow.subscription.user.name}</DialogDescription>
        </DialogHeader>

        <FormEditBorrow borrow={borrow} />
      </DialogContent>
    </Dialog>
  )
}
