import { Job, JobStatus } from '@/lib/types/job'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Loader2,
  Upload,
  XCircle,
} from 'lucide-react'
import {
  getJobTypeLabel,
  getStatusColor,
  parseJobResult,
  canJobAssetDownload,
} from '@/lib/job-utils'
import { Badge } from '../ui/badge'
import { formatDate } from '@/lib/utils'
import { Button } from '../ui/button'
import Link from 'next/link'
import { BtnDownloadJobAsset } from './BtnDownloadJobResult'

export const ListCardJob: React.FC<{ job: Job }> = ({ job }) => {
  const canDownload = canJobAssetDownload(job)

  return (
    <Card key={job.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <Link href={`/admin/jobs/${job.id}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="mt-1">{getJobIcon(job.type)}</div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg link">
                  {getJobTypeLabel(job.type)}
                </CardTitle>
                <CardDescription className="text-sm">
                  {job.staff.name}
                </CardDescription>
              </div>
            </div>
            <Badge className={getStatusColor(job.status)}>
              {getStatusIcon(job.status)}
              <span className="ml-1">{job.status}</span>
            </Badge>
          </div>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Job ID</p>
            <p className="font-mono text-xs truncate">{job.id.slice(0, 8)}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Created</p>
            <p>
              {formatDate(job.created_at, {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          {job.status === 'FAILED' && job.error && (
            <div className="col-span-2 md:col-span-4">
              <p className="text-muted-foreground mb-1">Error</p>
              <p className="text-destructive text-sm">{job.error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export const getJobIcon = (type: string) => {
  if (type.startsWith('export:')) {
    return (
      <Download className="size-5 text-emerald-600 dark:text-emerald-400" />
    )
  }
  if (type.startsWith('import:')) {
    return <Upload className="size-5 text-blue-600 dark:text-blue-400" />
  }
  return <FileText className="size-5 text-gray-600 dark:text-gray-400" />
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
