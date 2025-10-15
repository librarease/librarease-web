import { Job, JobStatus } from '@/lib/types/job'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Loader2,
  XCircle,
} from 'lucide-react'
import {
  getJobTypeLabel,
  getStatusColor,
  parseJobResult,
} from '@/lib/job-utils'
import { Badge } from '../ui/badge'
import { formatDate } from '@/lib/utils'
import { Button } from '../ui/button'
import Link from 'next/link'
import { BtnDownloadJobResult } from './BtnDownloadJobResult'

export const ListCardJob: React.FC<{ job: Job }> = ({ job }) => {
  const result = parseJobResult(job)
  const isExport = job.type.startsWith('export:')
  const canDownload =
    job.status === 'COMPLETED' && isExport && result && 'path' in result

  return (
    <Card key={job.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">{getJobIcon(job.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg">
                  {getJobTypeLabel(job.type)}
                </CardTitle>
                <Badge className={getStatusColor(job.status)}>
                  {getStatusIcon(job.status)}
                  <span className="ml-1">{job.status}</span>
                </Badge>
              </div>
              <CardDescription className="text-sm">
                Created{' '}
                {formatDate(job.created_at, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                by {job.staff.name}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canDownload && <BtnDownloadJobResult job={job} size="sm" />}
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/jobs/${job.id}`}>
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Job ID</p>
            <p className="font-mono text-xs truncate">{job.id}</p>
          </div>
          {job.started_at && (
            <div>
              <p className="text-muted-foreground mb-1">Started</p>
              <p>
                {formatDate(job.started_at, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
          {job.finished_at && (
            <div>
              <p className="text-muted-foreground mb-1">Finished</p>
              <p>
                {formatDate(job.finished_at, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
          {job.error && (
            <div className="col-span-2 md:col-span-4">
              <p className="text-muted-foreground mb-1">Error</p>
              <p className="text-red-600 text-sm">{job.error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export const getJobIcon = (type: string) => {
  if (type.startsWith('export:')) {
    return <Download className="h-5 w-5 text-emerald-600" />
  }
  return <FileText className="h-5 w-5 text-gray-600" />
}

export const getStatusIcon = (status: JobStatus) => {
  switch (status) {
    case 'PENDING':
      return <Clock className="h-4 w-4" />
    case 'PROCESSING':
      return <Loader2 className="h-4 w-4 animate-spin" />
    case 'COMPLETED':
      return <CheckCircle2 className="h-4 w-4" />
    case 'FAILED':
      return <XCircle className="h-4 w-4" />
  }
}
