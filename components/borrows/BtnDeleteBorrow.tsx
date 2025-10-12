'use client'

import { Borrow } from '@/lib/types/borrow'
import { useTransition, useState } from 'react'
import { Button } from '../ui/button'
import { Lock, Unlock, Loader, Trash } from 'lucide-react'
import { deleteBorrowAction } from '@/lib/actions/delete-borrow'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'

export const BtnDeleteBook: React.FC<
  React.ComponentProps<typeof Button> & {
    borrow: Borrow
  }
> = ({ borrow, ...props }) => {
  const [confirmTimeout, setConfirmTimeout] = useState<NodeJS.Timeout>()
  const [isPending, startTransition] = useTransition()

  const onUnlock = () => {
    const timerId = setTimeout(() => {
      setConfirmTimeout(undefined)
    }, 3_000)
    setConfirmTimeout(timerId)
  }

  const onClick = () => {
    startTransition(async () => {
      clearTimeout(confirmTimeout)
      setConfirmTimeout(undefined)
      const res = await deleteBorrowAction(borrow.id)
      if ('error' in res) {
        toast.error(res.error)
        return
      }
      toast.success(res.message)
    })
    redirect('/admin/borrows')
  }

  if (!confirmTimeout) {
    return (
      <Button onClick={onUnlock} {...props}>
        <Trash />
        Delete
      </Button>
    )
  }

  return (
    <Button
      onClick={onClick}
      {...props}
      variant="destructive"
      disabled={isPending}
    >
      {isPending ? <Loader className="animate-spin" /> : <Unlock />}
      Click again to confirm
    </Button>
  )
}
