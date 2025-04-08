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
import { formatDate, getSubscriptionStatus } from '@/lib/utils'
import { getSubscription } from '@/lib/api/subscription'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Book,
  Calendar,
  CalendarClock,
  CircleDollarSign,
  Clock,
  CreditCard,
  Gavel,
  Library,
  Mail,
  Tally5,
  User,
} from 'lucide-react'
import { formatDistanceToNowStrict } from 'date-fns'
import { Progress } from '@/components/ui/progress'

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="row-span-2">
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 grid-cols-[max-content_1fr] items-center">
            <CalendarClock className="size-4" />
            <p>
              <span className="font-medium">Borrow Period:&nbsp;</span>
              {subsRes.data.loan_period} D
            </p>
            <Tally5 className="size-4" />
            <p>
              <span className="font-medium">Usage Limit:&nbsp;</span>
              {subsRes.data.usage_limit ?? '-'}
            </p>
            <Book className="size-4" />
            <p>
              <span className="font-medium">Active Borrow Limit:&nbsp;</span>
              {subsRes.data.active_loan_limit ?? '-'}
            </p>
            <Gavel className="size-4" />
            <p>
              <span className="font-medium">Fine per Day:&nbsp;</span>
              {subsRes.data.fine_per_day ?? '-'} Pts
            </p>
            <Clock className="size-4" />
            <p>
              <span className="font-medium">Expires:&nbsp;</span>
              {formatDate(subsRes.data.expires_at)} (
              {formatDistanceToNowStrict(new Date(subsRes.data.expires_at), {
                addSuffix: true,
              })}
              )
            </p>
            <Calendar className="size-4" />
            <p>
              <span className="font-medium">Purchased At:&nbsp;</span>
              {formatDate(subsRes.data.created_at)}
            </p>
            <CircleDollarSign className="size-4 text-muted-foreground" />
            <p>
              <span>Amount:&nbsp;</span>
              {subsRes.data.amount ?? '-'} Pts
            </p>
          </CardContent>
        </Card>

        <Card className="order-first md:order-none">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 grid-cols-[max-content_1fr] items-center">
            <User className="size-4" />
            <p>
              <span className="font-medium">Name:&nbsp;</span>
              {/* <Link href={`/users/${subsRes.data.user.id}`}> */}
              {subsRes.data.user.name}
              {/* </Link> */}
            </p>
            <Mail className="size-4" />
            <p>
              <span className="font-medium">Email:&nbsp;</span>
              {subsRes.data.user.email ?? '-'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 grid-cols-[max-content_1fr] items-center">
            <CreditCard className="size-4" />
            <p>
              <span className="font-medium">Name:&nbsp;</span>
              {/* <Link href={`/users/${subsRes.data.user.id}`}> */}
              {subsRes.data.membership.name}
              {/* </Link> */}
            </p>
            <Library className="size-4" />
            <p>
              <span className="font-medium">Library:&nbsp;</span>
              <Link
                className="link"
                href={`/libraries/${subsRes.data.membership.library.id}`}
              >
                {subsRes.data.membership.library.name}
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {subsRes.data.active_loan_limit && (
              <div>
                <div className="flex justify-between">
                  <span>Active Borrows</span>
                  <span>
                    {subsRes.data.active_loan_count ?? 0} /{' '}
                    {subsRes.data.active_loan_limit}
                  </span>
                </div>
                <Progress
                  value={
                    ((subsRes.data.active_loan_count ?? 0) /
                      subsRes.data.active_loan_limit) *
                    100
                  }
                />
              </div>
            )}
            {subsRes.data.usage_limit && (
              <div>
                <div className="flex justify-between">
                  <span>Borrowed Books</span>
                  <span>
                    {subsRes.data.usage_count ?? 0} / {subsRes.data.usage_limit}
                  </span>
                </div>
                <Progress
                  value={
                    ((subsRes.data.usage_count ?? 0) /
                      subsRes.data.usage_limit) *
                    100
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
