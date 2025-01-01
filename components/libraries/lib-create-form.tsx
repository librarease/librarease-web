'use client'

import { useRouter } from 'next/navigation'
import { LibraryForm, LibraryFormValues } from './LibraryForm'
import { createLibrary } from '@/lib/api/library'
import { toast } from '@/components/hooks/use-toast'

const initialData: LibraryFormValues = {
  name: '',
  logo: '',
  address: '',
  phone: '',
  email: '',
  description: '',
}

export const LibraryCreateForm: React.FC<{ token: string }> = ({ token }) => {
  const router = useRouter()

  function onSubmit(data: LibraryFormValues) {
    createLibrary(data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(console.log)
      .then(() => {
        toast({
          title: 'Library Created',
        })
        router.push('/libraries')
      })
      .catch((e) => {
        toast({
          title: 'Error',
          description: e?.error,
          variant: 'destructive',
        })
      })
  }
  return <LibraryForm initialData={initialData} onSubmit={onSubmit} />
}
