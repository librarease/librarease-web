import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Verify } from '@/lib/firebase/firebase'
import { Badge } from '@/components/ui/badge'
import { getSubscriptionStatus } from '@/lib/utils'
import { getSubscription } from '@/lib/api/subscription'
import { DetailSubscription } from '@/components/subscriptions/DetailSubscription'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Pen } from 'lucide-react'

export default async function SubscriptionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const headers = await Verify({ from: `/admin/subscriptions/${id}` })

  const [subsRes] = await Promise.all([getSubscription({ id }, { headers })])

  if ('error' in subsRes) {
    console.log({ libRes: subsRes })
    return <div>{JSON.stringify(subsRes.message)}</div>
  }

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">{subsRes.data.user.name}</h1>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/subscriptions">
                  Subscriptions
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{subsRes.data.user.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Badge
            variant={
              getSubscriptionStatus(subsRes.data) === 'active'
                ? 'default'
                : 'secondary'
            }
            className="uppercase h-8 min-w-24 justify-center"
          >
            {getSubscriptionStatus(subsRes.data)}
          </Badge>
        </div>
      </nav>
      <DetailSubscription subscription={subsRes.data} isAdmin>
        <Button asChild>
          <Link
            href={`/admin/subscriptions/${subsRes.data.id}/edit`}
            className="w-full"
          >
            <Pen />
            Edit
          </Link>
        </Button>
      </DetailSubscription>
    </div>
  )
}
