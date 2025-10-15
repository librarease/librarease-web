import {
  ExportResult,
  formatFileSize,
  getJobTypeLabel,
  getStatusColor,
  parseJobPayload,
  parseJobResult,
} from '@/lib/job-utils'
import { JobDetail } from '@/lib/types/job'
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  User,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ExportBorrowingsData } from '@/lib/api/borrow'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getStatusIcon } from './ListCardJob'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { format } from 'date-fns'
import { BtnDownloadJobResult } from './BtnDownloadJobResult'

export const DetailJob: React.FC<{ job: JobDetail }> = ({ job }) => {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(job.status)}
                <CardTitle className="text-2xl">
                  {getJobTypeLabel(job.type)}
                </CardTitle>
              </div>
              <CardDescription>Job ID: {job.id}</CardDescription>
            </div>
            <Badge className={getStatusColor(job.status)} variant="outline">
              {job.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Job Information */}
      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <User className="h-4 w-4" />
                Created By
              </div>
              <p className="font-medium">{job.staff.name}</p>
              <p className="text-sm text-muted-foreground">{job.staff.role}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                Created At
              </div>
              <p className="font-medium">
                {format(new Date(job.created_at), 'PPP')}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(job.created_at), 'p')}
              </p>
            </div>
            {job.started_at && (
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  Started At
                </div>
                <p className="font-medium">
                  {format(new Date(job.started_at), 'PPP')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(job.started_at), 'p')}
                </p>
              </div>
            )}
            {job.finished_at && (
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Finished At
                </div>
                <p className="font-medium">
                  {format(new Date(job.finished_at), 'PPP')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(job.finished_at), 'p')}
                </p>
              </div>
            )}
          </div>

          {job.started_at && job.finished_at && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="font-medium">
                  {(
                    (new Date(job.finished_at).getTime() -
                      new Date(job.started_at).getTime()) /
                    1000
                  ).toFixed(2)}
                  s
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payload */}
      <Card>
        <CardHeader>
          <CardTitle>Request Parameters</CardTitle>
        </CardHeader>
        <CardContent>{renderPayload(job)}</CardContent>
      </Card>

      {/* Result */}
      {job.status === 'COMPLETED' && job.result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>{renderResult(job)}</CardContent>
        </Card>
      )}

      {/* Error */}
      {job.status === 'FAILED' && job.error && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{job.error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const renderPayload = (job: JobDetail) => {
  if (!job) return null

  const payload = parseJobPayload(job)
  if (!payload)
    return <p className="text-muted-foreground">Unable to parse payload</p>

  switch (job.type) {
    case 'export:borrowings': {
      const exportPayload = payload as ExportBorrowingsData
      const statuses = []
      if (exportPayload.is_active) statuses.push('Active')
      if (exportPayload.is_overdue) statuses.push('Overdue')
      if (exportPayload.is_returned) statuses.push('Returned')
      if (exportPayload.is_lost) statuses.push('Lost')

      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters Applied
            </h4>
            <div className="space-y-2 text-sm">
              {statuses.length > 0 ? (
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  <span>{statuses.join(', ')}</span>
                </div>
              ) : (
                <div>
                  <span className="text-muted-foreground">Status: </span>
                  <span>All</span>
                </div>
              )}
              {exportPayload.borrowed_at_from && (
                <div>
                  <span className="text-muted-foreground">From: </span>
                  <span>
                    {formatDate(exportPayload.borrowed_at_from, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
              {exportPayload.borrowed_at_to && (
                <div>
                  <span className="text-muted-foreground">To: </span>
                  <span>
                    {formatDate(exportPayload.borrowed_at_to, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    // case 'import:books': {
    //   const importPayload = payload as ImportBooksPayload
    //   return (
    //     <div className="space-y-4">
    //       <div>
    //         <h4 className="font-medium mb-2 flex items-center gap-2">
    //           <Package className="h-4 w-4" />
    //           Import Settings
    //         </h4>
    //         <div className="space-y-2 text-sm">
    //           <div>
    //             <span className="text-muted-foreground">File: </span>
    //             <span className="font-mono">{importPayload.file_path}</span>
    //           </div>
    //           <div>
    //             <span className="text-muted-foreground">
    //               Overwrite Existing:{' '}
    //             </span>
    //             <span>{importPayload.overwrite_existing ? 'Yes' : 'No'}</span>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )
    // }

    default:
      return (
        <pre className="text-xs bg-muted p-4 rounded overflow-auto">
          {JSON.stringify(payload, null, 2)}
        </pre>
      )
  }
}

const renderResult = (job: JobDetail) => {
  if (!job || !job.result) return null

  const result = parseJobResult(job)
  if (!result)
    return <p className="text-muted-foreground">Unable to parse result</p>

  switch (job.type) {
    case 'export:borrowings': {
      const exportResult = result as ExportResult
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Export Details
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Filename: </span>
                <span className="font-mono">{exportResult.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Size: </span>
                <span>{formatFileSize(exportResult.size)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Path: </span>
                <span className="font-mono text-xs">{exportResult.path}</span>
              </div>
            </div>
          </div>
          <BtnDownloadJobResult job={job} className="w-full" />
        </div>
      )
    }

    //   case "import:books": {
    //     const importResult = result as ImportResult
    //     return (
    //       <div className="space-y-4">
    //         <div>
    //           <h4 className="font-medium mb-2 flex items-center gap-2">
    //             <CheckCircle2 className="h-4 w-4" />
    //             Import Summary
    //           </h4>
    //           <div className="grid grid-cols-3 gap-4 text-sm">
    //             <div className="text-center p-3 bg-green-50 rounded-lg">
    //               <div className="text-2xl font-bold text-green-600">{importResult.imported_count}</div>
    //               <div className="text-muted-foreground">Imported</div>
    //             </div>
    //             <div className="text-center p-3 bg-blue-50 rounded-lg">
    //               <div className="text-2xl font-bold text-blue-600">{importResult.updated_count}</div>
    //               <div className="text-muted-foreground">Updated</div>
    //             </div>
    //             <div className="text-center p-3 bg-red-50 rounded-lg">
    //               <div className="text-2xl font-bold text-red-600">{importResult.failed_count}</div>
    //               <div className="text-muted-foreground">Failed</div>
    //             </div>
    //           </div>
    //           {importResult.errors && importResult.errors.length > 0 && (
    //             <div className="mt-4">
    //               <p className="text-sm font-medium text-red-600 mb-2">Errors:</p>
    //               <ul className="text-sm space-y-1">
    //                 {importResult.errors.map((error, i) => (
    //                   <li key={i} className="text-red-600">
    //                     • {error}
    //                   </li>
    //                 ))}
    //               </ul>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     )
    //   }

    default:
      return (
        <pre className="text-xs bg-muted p-4 rounded overflow-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )
  }
}
