import { previewBookImport } from '@/lib/api/book'
import { Verify } from '@/lib/firebase/firebase'
import { cookies } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, FileText } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'
import { BtnConfirmImport } from '@/components/books/BtnConfirmImport'

export const metadata: Metadata = {
  title: `Import Books Preview · ${SITE_NAME}`,
}

export default async function ImportPreviewPage({
  params,
}: {
  params: Promise<{ path: string }>
}) {
  const { path } = await params
  const decodedPath = decodeURIComponent(path)

  const headers = await Verify({
    from: `/admin/books/import/${path}`,
  })

  const cookieStore = await cookies()
  const cookieName = process.env.LIBRARY_COOKIE_NAME as string
  const libraryId = cookieStore.get(cookieName)?.value

  if (!libraryId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Import Books</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>No library selected</AlertDescription>
        </Alert>
      </div>
    )
  }

  const res = await previewBookImport(
    {
      path: decodedPath,
      library_id: libraryId,
    },
    { headers }
  )

  if ('error' in res) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{JSON.stringify(res.error)}</AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/admin/books/import">Back to Import</Link>
        </Button>
      </div>
    )
  }

  const preview = res.data
  const validBooks = preview.rows.filter((b) => b.status !== 'invalid')
  const invalidBooks = preview.rows.filter((b) => b.status === 'invalid')

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{preview.rows.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valid</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {validBooks.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invalid</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {invalidBooks.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Book Preview List */}
      <Card>
        <CardHeader>
          <CardTitle>Books to Import</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {preview.rows.map((book, idx) => (
              <div
                key={idx}
                className={`p-4 border rounded-lg ${
                  book.status === 'invalid'
                    ? 'bg-destructive/10 border-destructive/50'
                    : book.status === 'update'
                      ? 'border-primary/50'
                      : 'bg-primary/10 border-primary/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{book.title}</h3>
                      {book.status === 'invalid' ? (
                        <Badge
                          variant="outline"
                          className="bg-destructive/20 text-destructive border-destructive"
                        >
                          Invalid
                        </Badge>
                      ) : book.status === 'update' ? (
                        <Badge
                          variant="outline"
                          className="bg-primary/20 text-primary border-primary"
                        >
                          Update
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Author: {book.author}</p>
                      <p>Code: {book.code}</p>
                      {book.id && (
                        <pre className="font-mono text-xs">ID: {book.id}</pre>
                      )}
                    </div>
                    {book.error && (
                      <div className="mt-2 text-sm text-destructive">
                        <p className="font-medium">Error:</p>
                        <pre>{book.error}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button asChild variant="outline">
          <Link href="/admin/books/import">Back</Link>
        </Button>
        {validBooks.length > 0 && (
          <BtnConfirmImport
            path={decodedPath}
            libraryId={libraryId}
            count={validBooks.length}
          />
        )}
      </div>
    </div>
  )
}
