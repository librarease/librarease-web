'use client'

import { useRouter } from 'next/navigation'
import { StaffForm, StaffFormValues } from './StaffForm'
import { toast } from '../hooks/use-toast'
import { updateStaff } from '@/lib/api/staff'
import { Staff } from '@/lib/types/staff'

export const StaffEditForm: React.FC<{ token: string; staff: Staff }> = ({
  staff,
  token,
}) => {
  const initialData = {
    name: staff.name,
    library_id: staff.library_id,
    user_id: staff.user_id,
    role: staff.role,
  }

  const router = useRouter()

  function onSubmit(data: StaffFormValues) {
    updateStaff(staff.id, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(console.log)
      .then(() => {
        toast({
          title: 'Staff Updated',
        })
        router.push('/staffs')
      })
      .catch((e) => {
        toast({
          title: 'Error',
          description: e?.error,
          variant: 'destructive',
        })
      })
  }

  return <StaffForm initialData={initialData} onSubmit={onSubmit} />
}
