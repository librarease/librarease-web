'use client'

import { useTransition, useState } from 'react'
import { Button } from '../ui/button'
import { Unlock, Loader, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'
import { Subscription } from '@/lib/types/subscription'
import { deleteSubscriptionAction } from '@/lib/actions/delete-subscription'

export const BtnDeleteSubscription: React.FC<
  React.ComponentProps<typeof Button> & {
    sub: Subscription
  }
> = ({ sub, ...props }) => {
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
      const res = await deleteSubscriptionAction(sub.id)
      if ('error' in res) {
        toast.error(res.error, { richColors: true })
        return
      }
      toast.success(res.message)
    })
    redirect('/admin/subscriptions')
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
