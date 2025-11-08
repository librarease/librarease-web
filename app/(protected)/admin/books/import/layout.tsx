import { BtnDownloadTemplate } from '@/components/books/BtnDownloadTemplate'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { FileText } from 'lucide-react'

export default async function BorrowDetailsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{}>
}>) {
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
            <BtnDownloadTemplate />
          </div>
        </AlertDescription>
      </Alert>
      {children}
    </div>
  )
}
