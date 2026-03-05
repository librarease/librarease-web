'use client'

import { FormMembership } from '@/components/memberships/FormMembership'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Membership } from '@/lib/types/membership'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { updateMembershipAction } from '@/lib/actions/update-membership'

export const ModalEditMembership: React.FC<{
  membership: Membership
}> = ({ membership }) => {
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

  const handleSubmit = async (data: any) => {
    const res = await updateMembershipAction({ id: membership.id, ...data })
    if (!('error' in res)) {
      router.back()
    }
    return res
  }

  return (
    <Dialog open={open} onOpenChange={router.back} modal={false} defaultOpen>
      <DialogContent className="bg-background/5 backdrop-blur-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Membership</DialogTitle>
          <DialogDescription>{membership.name}</DialogDescription>
        </DialogHeader>

        <FormMembership
          libraryID={membership.library_id}
          membership={membership}
          onSubmitAction={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
