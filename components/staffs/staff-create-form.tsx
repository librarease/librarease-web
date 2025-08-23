'use client'

import { useRouter } from 'next/navigation'
import { StaffForm, StaffFormValues } from './StaffForm'
import { toast } from 'sonner'
import { createStaff } from '@/lib/api/staff'

const initialData: StaffFormValues = {
  name: '',
  role: 'STAFF',
  library_id: '',
  user_id: '',
}

export const StaffCreateForm: React.FC = () => {
  const router = useRouter()

  function onSubmit(data: StaffFormValues) {
    createStaff(data)
      .then(console.log)
      .then(() => {
        toast(`${data.name} has been assigned to the library.`)
        router.push('/admin/staffs')
      })
      .catch((e) => {
        toast.error(e?.error)
      })
  }

  return <StaffForm initialData={initialData} onSubmit={onSubmit} />
}
