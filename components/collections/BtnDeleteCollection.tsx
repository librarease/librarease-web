'use client'

import { useTransition, useState } from 'react'
import { Button } from '../ui/button'
import { Loader, Trash2, Unlock } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

export const BtnDeleteCollection: React.FC<
  React.ComponentProps<typeof Button> & {
    deleteCollectionAction: () => Promise<string>
  }
> = ({ deleteCollectionAction, ...props }) => {
  const [confirmTimeout, setConfirmTimeout] = useState<NodeJS.Timeout>()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

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
      const msg = await deleteCollectionAction()
      toast(msg)
    })
    router.replace('/admin/collections')
  }

  if (!confirmTimeout) {
    return (
      <Button
        onClick={onUnlock}
        {...props}
        className={clsx(
          props.className,
          'text-destructive',
          'hover:bg-destructive'
        )}
      >
        <Trash2 />
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
      Confirm
    </Button>
  )
}
