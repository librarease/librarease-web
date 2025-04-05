'use client'

import { FormEditBorrow } from '@/components/borrows/FormEditBorrow'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Borrow } from '@/lib/types/borrow'
import { useRouter } from 'next/navigation'

export const ModalEditBorrow: React.FC<{ borrow: Borrow }> = ({ borrow }) => {
  const router = useRouter()
  return (
    <Dialog open={true} onOpenChange={router.back}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{borrow.book.title}</DialogTitle>
          <DialogDescription>
            Editing {borrow.subscription.user.name}&apos;s Borrow.
          </DialogDescription>

          <FormEditBorrow borrow={borrow} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
