'use client'

import { Borrow } from '@/lib/types/borrow'
import { useTransition, useState } from 'react'
import { Button } from '../ui/button'
import { Lock, Unlock, Loader } from 'lucide-react'
import { undoReturnAction } from '@/lib/actions/undo-return'
import { toast } from 'sonner'

export const BtnUndoReturn: React.FC<
  React.ComponentProps<typeof Button> & {
    borrow: Borrow
  }
> = ({ borrow, ...props }) => {
  const [confirmTimeout, setConfirmTimeout] = useState<NodeJS.Timeout>()
  const [, setClientBorrow] = useState<Borrow>(borrow)
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
      const res = await undoReturnAction(borrow.id)
      if ('error' in res) {
        toast.error(res.error)
        return
      }
      // optimistic update
      setClientBorrow((prev) => ({
        ...prev,
        returning: undefined,
      }))
      toast('Borrow return undone successfully')
    })
  }

  if (!confirmTimeout) {
    return (
      <Button onClick={onUnlock} {...props}>
        <Lock />
        Undo Return
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
