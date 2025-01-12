'use client'

import { Borrow } from '@/lib/types/borrow'
import { useState } from 'react'
import { Button, ButtonProps } from '../ui/button'
import { Lock, Unlock } from 'lucide-react'
import { ReturnBorrow } from '@/lib/actions/return-borrow'
import { formatDate } from '@/lib/utils'

export const BtnReturnBook: React.FC<
  ButtonProps & {
    borrow: Borrow
  }
> = ({ borrow, ...props }) => {
  const [confirm, setConfirm] = useState<NodeJS.Timeout>()

  const onUnlock = () => {
    const timerId = setTimeout(() => {
      setConfirm(undefined)
    }, 3_000)
    setConfirm(timerId)
  }

  const onClick = () => {
    ReturnBorrow(borrow.id)
    if (confirm) clearTimeout(confirm)
  }

  if (borrow.returning)
    return (
      <Button {...props} variant="secondary" disabled>
        {formatDate(borrow.returning.returned_at)}
      </Button>
    )

  if (!confirm) {
    return (
      <Button onClick={onUnlock} {...props}>
        <Lock />
        Return
      </Button>
    )
  }
  return (
    <Button onClick={onClick} {...props} variant="default">
      <Unlock />
      Confirm
    </Button>
  )
}
