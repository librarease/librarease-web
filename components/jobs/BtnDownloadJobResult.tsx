'use client'

import { Job } from '@/lib/types/job'
import { useTransition } from 'react'
import { Button } from '../ui/button'
import { Loader, Download } from 'lucide-react'
import { downloadJobAssetAction } from '@/lib/actions/download-job-asset'
import { toast } from 'sonner'

export const BtnDownloadJobAsset: React.FC<
  React.ComponentProps<typeof Button> & {
    job: Job
  }
> = ({ job, ...props }) => {
  const [isPending, startTransition] = useTransition()

  const onClick = () => {
    startTransition(async () => {
      const res = await downloadJobAssetAction(job.id)
      if ('error' in res) {
        toast.error(res.error)
        return
      }
      // open link in new tab
      window.open(res.url, '_blank')
    })
  }

  return (
    <Button onClick={onClick} {...props} disabled={isPending}>
      {isPending ? (
        <Loader className="animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      Download
    </Button>
  )
}
