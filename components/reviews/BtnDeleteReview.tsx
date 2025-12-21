'use client'

import { useTransition, useState } from 'react'
import { Button } from '../ui/button'
import { Unlock, Loader, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { Review } from '@/lib/types/review'
import { deleteReviewAction } from '@/lib/actions/delete-review'
import { Borrow } from '@/lib/types/borrow'

export const BtnDeleteReview: React.FC<
  React.ComponentProps<typeof Button> & {
    id: Review['id']
    borrowID: Borrow['id']
  }
> = ({ id, borrowID, ...props }) => {
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
      const res = await deleteReviewAction(id, borrowID)
      if ('error' in res) {
        toast.error(res.error, { richColors: true })
        return
      }
      toast.success(res.message)
    })
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
