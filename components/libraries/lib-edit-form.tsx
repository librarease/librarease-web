'use client'

import { Library } from '@/lib/types/library'
import { LibraryForm, LibraryFormValues } from './LibraryForm'
import { updateLibrary } from '@/lib/api/library'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export const LibraryEditForm: React.FC<{ library: Library }> = ({
  library,
}) => {
  const initialData = {
    name: library.name,
    logo: library.logo ?? '',
    address: library.address ?? '',
    phone: library.phone ?? '',
    email: library.email ?? '',
    description: library.description ?? '',
  }

  const router = useRouter()

  function onSubmit(data: LibraryFormValues) {
    updateLibrary(library.id, data)
      .then(console.log)
      .then(() => {
        toast('Library Updated')
        router.push(`/libraries/${library.id}`)
      })
      .catch((e) => {
        toast.error(e?.error)
      })
  }

  return <LibraryForm initialData={initialData} onSubmit={onSubmit} />
}
