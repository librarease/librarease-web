import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Verify } from '@/lib/firebase/firebase'
import { Download, FileText } from 'lucide-react'
import { DownloadTemplateButton } from '@/components/books/DownloadTemplateButton'
import { cookies } from 'next/headers'

export default async function BorrowDetailsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{}>
}>) {
  const headers = await Verify({ from: `/admin/books/import` })

  const cookieStore = await cookies()
  const cookieName = process.env.LIBRARY_COOKIE_NAME as string
  const libraryId = cookieStore.get(cookieName)?.value

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">Import Books</h1>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/books">Books</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Import</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>
      {/* Instructions */}
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p>Upload a CSV file with the following columns:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>
                <strong>id</strong> - Book ID (optional, used to detect updates)
              </li>
              <li>
                <strong>code</strong> - Book code (required)
              </li>
              <li>
                <strong>title</strong> - Book title (required)
              </li>
              <li>
                <strong>author</strong> - Author name (optional)
              </li>
              <li>
                <strong>year</strong> - Year of publication (optional)
              </li>
            </ul>
            <DownloadTemplateButton libraryId={libraryId} />
          </div>
        </AlertDescription>
      </Alert>
      {children}
    </div>
  )
}
