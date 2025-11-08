'use client'

import { Download } from 'lucide-react'
import { Button } from '../ui/button'
import { downloadCSV, getBookImportTemplate } from '@/lib/book-utils'
import Link from 'next/link'

export const BtnDownloadTemplate: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="link"
        className="p-0 h-auto"
        onClick={() => downloadCSV(getBookImportTemplate([]))}
      >
        <Download className="h-3 w-3 mr-1" />
        Download Template
      </Button>
      <span>or</span>
      <Button variant="link">
        <Link href="/admin/books/manage">Get Edit Template</Link>
      </Button>
    </div>
  )
}
