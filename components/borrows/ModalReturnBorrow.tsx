'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Scanner } from '@/components/common/Scanner'
import { toast } from 'sonner'
import { returnBorrowAction } from '@/lib/actions/return-borrow'
import Link from 'next/link'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

export const ModalReturnBorrow: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
}> = ({ open, onOpenChange }) => {
  const [id, setId] = useState<string>()

  const onChange = async (id: string) => {
    const res = await returnBorrowAction(id)
    if ('error' in res) {
      toast.error(res.error)
    } else {
      toast('Book returned successfully')
      setId(id)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan to Return</DialogTitle>
        </DialogHeader>

        <Scanner
          title="Return a Book"
          onChange={onChange}
          value={''}
          initialFocus
        />

        <DialogFooter>
          {id && (
            <Button variant="ghost" asChild>
              <Link href={`/borrows/${id}`} legacyBehavior>
                Go to Borrow Details
                <ArrowRight className="mr-2 size-4" />
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const BtnScanReturnBorrow: React.FC<
  React.PropsWithChildren<Parameters<typeof Button>[0]>
> = ({ children, ...props }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline" {...props}>
        {children}
      </Button>
      <ModalReturnBorrow open={open} onOpenChange={setOpen} />
    </>
  )
}
