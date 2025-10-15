import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Verify } from '@/lib/firebase/firebase'
import { getJob } from '@/lib/api/job'
import { DetailJob } from '@/components/jobs/DetailJob'

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const headers = await Verify({ from: `/admin/jobs/${id}` })

  const [jobRes] = await Promise.all([getJob(id, { headers })])

  if ('error' in jobRes) {
    console.log({ libRes: jobRes })
    return <div>{JSON.stringify(jobRes.message)}</div>
  }

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">{jobRes.data.id.slice(0, 8)}</h1>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/jobs">Jobs</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{jobRes.data.id.slice(0, 8)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* <Badge
            variant={
              getJobStatus(jobRes.data) === 'active' ? 'default' : 'secondary'
            }
            className="uppercase h-8 min-w-24 justify-center"
          >
            {getJobStatus(jobRes.data)}
          </Badge> */}
        </div>
      </nav>
      <DetailJob job={jobRes.data} />
    </div>
  )
}
