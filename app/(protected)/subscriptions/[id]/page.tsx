import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { Verify } from '@/lib/firebase/firebase'
import { Badge } from '@/components/ui/badge'
import { getSubscriptionStatus } from '@/lib/utils'
import { Carduser } from '@/components/users/CardUser'
import { Cardsubscription } from '@/components/subscriptions/CardSubscription'
import { CardMembership } from '@/components/memberships/CardMembership'
import { getSubscription } from '@/lib/api/subscription'

export default async function SubscriptionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await Verify({ from: `/subscriptions/${id}` })

  const [subsRes] = await Promise.all([getSubscription({ id })])

  if ('error' in subsRes) {
    console.log({ libRes: subsRes })
    return <div>{JSON.stringify(subsRes.message)}</div>
  }

  //   const cookieStore = await cookies()
  //   const sessionName = process.env.SESSION_COOKIE_NAME as string
  //   const session = cookieStore.get(sessionName)

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">{subsRes.data.user.name}</h1>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/" passHref legacyBehavior>
                  <BreadcrumbLink>Home</BreadcrumbLink>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link href="/subscriptions" passHref legacyBehavior>
                  <BreadcrumbLink>Subscriptions</BreadcrumbLink>
                </Link>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Carduser user={subsRes.data.user} />
        <Cardsubscription subscription={subsRes.data} />
        <CardMembership membership={subsRes.data.membership} />
      </div>
    </div>
  )
}
