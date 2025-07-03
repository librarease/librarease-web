'use client'

import { useRouter } from 'next/navigation'
import { StaffForm, StaffFormValues } from './StaffForm'
import { toast } from 'sonner'
import { updateStaff } from '@/lib/api/staff'
import { Staff } from '@/lib/types/staff'

export const StaffEditForm: React.FC<{ staff: Staff }> = ({ staff }) => {
  const initialData = {
    name: staff.name,
    library_id: staff.library_id,
    user_id: staff.user_id,
    role: staff.role,
  }

  const router = useRouter()

  function onSubmit(data: StaffFormValues) {
    updateStaff(staff.id, data)
      .then(console.log)
      .then(() => {
        toast('Staff Updated')
        router.push('/staffs')
      })
      .catch((e) => {
        toast.error(e?.error)
      })
  }

  return <StaffForm initialData={initialData} onSubmit={onSubmit} />
}
