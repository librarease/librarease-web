'use client'

import { Borrow } from '@/lib/types/borrow'
import { useTransition, useState } from 'react'
import { Button } from '../ui/button'
import { Lock, Unlock, Loader } from 'lucide-react'
import { returnBorrowAction } from '@/lib/actions/return-borrow'
import { formatDate } from '@/lib/utils'
import { toast } from '../hooks/use-toast'

export const BtnReturnBook: React.FC<
  React.ComponentProps<typeof Button> & {
    borrow: Borrow
  }
> = ({ borrow, ...props }) => {
  const [confirmTimeout, setConfirmTimeout] = useState<NodeJS.Timeout>()
  const [clientBorrow, setClientBorrow] = useState<Borrow>(borrow)
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
      const res = await returnBorrowAction(borrow.id)
      if ('error' in res) {
        toast({
          title: 'Failed to return book',
          description: res.error,
          variant: 'destructive',
        })
        return
      }
      // optimistic update
      setClientBorrow((prev) => ({
        ...prev,
        returning: {
          returned_at: new Date().toISOString(),
        } as Borrow['returning'],
      }))
      toast({
        title: 'Success',
        description: 'Book returned successfully',
        variant: 'default',
      })
    })
  }

  if (clientBorrow.returning)
    return (
      <Button {...props} variant="secondary" disabled>
        {formatDate(clientBorrow.returning.returned_at)}
      </Button>
    )

  if (!confirmTimeout) {
    return (
      <Button onClick={onUnlock} {...props}>
        <Lock />
        Return
      </Button>
    )
  }

  return (
    <Button onClick={onClick} {...props} variant="default" disabled={isPending}>
      {isPending ? <Loader className="animate-spin" /> : <Unlock />}
      Click again to return book
    </Button>
  )
}
