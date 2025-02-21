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
import { getBorrow } from '@/lib/api/borrow'
import { Badge } from '@/components/ui/badge'
import { formatDate, getBorrowStatus, isBorrowDue } from '@/lib/utils'
import { BtnReturnBook } from '@/components/borrows/BtnReturnBorrow'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  Gavel,
  Library,
  User,
  UserCog,
} from 'lucide-react'
import clsx from 'clsx'
import { differenceInDays } from 'date-fns'

export default async function BorrowDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await Verify({ from: `/borrows/${id}` })

  const [borrowRes] = await Promise.all([getBorrow({ id })])

  if ('error' in borrowRes) {
    console.log({ libRes: borrowRes })
    return <div>{JSON.stringify(borrowRes.message)}</div>
  }

  const isDue = isBorrowDue(borrowRes.data)

  // const progressPercent = getBorrowProgressPercent(borrowRes.data)

  //   const cookieStore = await cookies()
  //   const sessionName = process.env.SESSION_COOKIE_NAME as string
  //   const session = cookieStore.get(sessionName)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{borrowRes.data.book.title}</h1>
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
              <Link href="/borrows" passHref legacyBehavior>
                <BreadcrumbLink>Borrows</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{borrowRes.data.book.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Badge
          variant={
            getBorrowStatus(borrowRes.data) === 'overdue'
              ? 'destructive'
              : getBorrowStatus(borrowRes.data) === 'returned'
                ? 'secondary'
                : 'default'
          }
          className="uppercase h-8 min-w-24 justify-center"
        >
          {getBorrowStatus(borrowRes.data)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="md:row-span-2">
          <CardHeader>
            <CardTitle>Book Information</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <Image
              src={borrowRes.data.book?.cover ?? '/book-placeholder.svg'}
              alt={borrowRes.data.book.title + "'s cover"}
              width={256}
              height={256}
              className="shadow-md rounded-lg w-56 h-auto place-self-center row-span-2"
            />
            <div>
              <h2 className="text-xl font-semibold">
                {borrowRes.data.book.title}
              </h2>
              <p className="text-gray-600">{borrowRes.data.book.author}</p>
              <p className="text-sm text-gray-500">
                {borrowRes.data.book.code}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 grid-cols-[max-content,1fr] items-center">
            <User className="h-4 w-4" />
            <p>
              <span className="font-medium">Name:&nbsp;</span>
              {borrowRes.data.subscription.user.name}
            </p>
            <Library className="h-4 w-4" />
            <p>
              <span className="font-medium">Library:&nbsp;</span>
              {borrowRes.data.subscription.membership.library.name}
            </p>
            {/* <CreditCard className="h-4 w-4" />
            <p>
              <span className="font-medium">Membership:&nbsp;</span>
              {borrowRes.data.subscription.membership.name}
            </p>
            <Clock className="h-4 w-4" />
            <p>
              <span className="font-medium">Expires:&nbsp;</span>
              {formatDate(borrowRes.data.subscription.expires_at)}
            </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Borrow Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 grid-cols-[max-content,1fr] items-center">
            <UserCog className="h-4 w-4 text-muted-foreground" />
            <p>
              <span className="font-medium">Staff:&nbsp;</span>
              {borrowRes.data.staff.name}
              &nbsp;
              {borrowRes.data.returning
                ? '/ ' + borrowRes.data.returning.staff.name
                : null}
            </p>

            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p>
              <span className="font-medium">Borrowed:&nbsp;</span>
              {formatDate(borrowRes.data.borrowed_at)}
            </p>
            {isDue ? (
              <>
                <Gavel className="h-4 w-4 text-muted-foreground" />
                <p>
                  <span className="font-medium">Fine Expected:&nbsp;</span>
                  {differenceInDays(
                    new Date(),
                    new Date(borrowRes.data.due_at)
                  ) +
                    ' x ' +
                    borrowRes.data.subscription.fine_per_day +
                    ' = ' +
                    differenceInDays(
                      new Date(),
                      new Date(borrowRes.data.due_at)
                    ) *
                      borrowRes.data.subscription.fine_per_day +
                    ' Pts'}
                </p>
                <CalendarX className="h-4 w-4 text-destructive" />
              </>
            ) : (
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            )}
            <p className={clsx({ 'text-destructive': isDue })}>
              <span className="font-medium">Due:&nbsp;</span>
              {formatDate(borrowRes.data.due_at)}
            </p>
            {borrowRes.data.returning ? (
              <>
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                <p>
                  <span className="font-medium">Returned:&nbsp;</span>
                  {formatDate(borrowRes.data.returning.returned_at)}
                </p>
                <Gavel className="h-4 w-4 text-muted-foreground" />
                <p>
                  <span className="font-medium">Fine Received:&nbsp;</span>
                  {borrowRes.data.returning.fine ?? '-'} Pts
                </p>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} />
        </CardContent>
      </Card> */}

      {!borrowRes.data.returning && (
        <div className="bottom-0 sticky py-2">
          <BtnReturnBook
            variant="outline"
            className="w-full"
            borrow={borrowRes.data}
          />
        </div>
      )}
    </div>
  )
}
