'use client'

import { useRouter } from 'next/navigation'
import { LibraryForm, LibraryFormValues } from './LibraryForm'
import { createLibrary } from '@/lib/api/library'
import { toast } from 'sonner'

const initialData: LibraryFormValues = {
  name: '',
  logo: '',
  address: '',
  phone: '',
  email: '',
  description: '',
}

export const LibraryCreateForm: React.FC = () => {
  const router = useRouter()

  function onSubmit(data: LibraryFormValues) {
    createLibrary(data)
      .then(console.log)
      .then(() => {
        toast('Library Created')
        router.push('/libraries')
      })
      .catch((e) => {
        toast.error(e?.error)
      })
  }
  return <LibraryForm initialData={initialData} onSubmit={onSubmit} />
}
