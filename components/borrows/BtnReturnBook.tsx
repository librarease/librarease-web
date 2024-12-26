'use client'

import { Borrow } from '@/lib/types/borrow'
import { useState } from 'react'
import { Button, ButtonProps } from '../ui/button'
import { Lock, Unlock } from 'lucide-react'
import { Return } from '@/lib/actions/return-borrow'

export const BtnReturnBook: React.FC<
  ButtonProps & {
    borrow: Borrow
  }
> = ({ borrow, ...props }) => {
  const [confirm, setConfirm] = useState<NodeJS.Timeout>()

  const onUnlock = () => {
    console.log('unlock')
    const timerId = setTimeout(() => {
      setConfirm(undefined)
    }, 3_000)
    setConfirm(timerId)
  }

  const onClick = () => {
    console.log('return book', borrow.id)
    Return(borrow.id)
    if (confirm) clearTimeout(confirm)
  }

  if (borrow.returned_at)
    return (
      <Button {...props} variant="secondary" disabled>
        {borrow.returned_at}
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
