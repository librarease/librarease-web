'use client'

import { useRouter } from 'next/navigation'
import { StaffForm, StaffFormValues } from './StaffForm'
import { toast } from '../hooks/use-toast'
import { createStaff } from '@/lib/api/staff'

const initialData: StaffFormValues = {
  name: '',
  role: 'STAFF',
  library_id: '',
  user_id: '',
}

export const StaffCreateForm: React.FC<{ token: string }> = ({ token }) => {
  const router = useRouter()

  function onSubmit(data: StaffFormValues) {
    createStaff(data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(console.log)
      .then(() => {
        toast({
          title: 'Assigned Staff to Library',
          description: `${data.name} has been assigned to the library.`,
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
