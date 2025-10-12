'use client'

import { FormEditSubscription } from '@/components/subscriptions/FormEditSubscription'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SubscriptionDetail } from '@/lib/types/subscription'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export const ModalEditSubscription: React.FC<{
  subscription: SubscriptionDetail
}> = ({ subscription }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(true)
  const prevPathRef = useRef(pathname)

  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      setOpen(false)
    }
    prevPathRef.current = pathname
  }, [pathname])

  return (
    <Dialog open={open} onOpenChange={router.back} modal={false} defaultOpen>
      <DialogContent className="bg-background/5 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>{subscription.user.name}</DialogTitle>
          <DialogDescription>{subscription.membership.name}</DialogDescription>
        </DialogHeader>

        <FormEditSubscription sub={subscription} />
      </DialogContent>
    </Dialog>
  )
}
