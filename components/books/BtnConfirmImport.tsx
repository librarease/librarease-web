'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { importBooks } from '@/lib/api/book'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle2, RefreshCw } from 'lucide-react'

interface BtnConfirmImportProps {
  path: string
  libraryId: string
  count: number
}

export const BtnConfirmImport: React.FC<BtnConfirmImportProps> = ({
  path,
  libraryId,
  count,
}) => {
  const [isImporting, setIsImporting] = useState(false)
  const router = useRouter()

  const handleImport = async () => {
    setIsImporting(true)

    try {
      const res = await importBooks({
        path,
        library_id: libraryId,
      })

      if ('error' in res) {
        toast.error('Failed to import books')
        setIsImporting(false)
        return
      }

      toast.success(`Import job created successfully!`, {
        richColors: true,
        action: {
          label: 'View Job',
          onClick: () => router.push(`/admin/jobs/${res.data.id}`),
        },
      })
    } catch (error) {
      console.error('Import error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to import books'
      )
      setIsImporting(false)
    }
  }

  return (
    <Button onClick={handleImport} disabled={isImporting}>
      {isImporting ? (
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Creating Import Job...
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Import {count} Book{count !== 1 ? 's' : ''}
        </>
      )}
    </Button>
  )
}
