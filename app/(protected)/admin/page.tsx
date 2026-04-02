import Link from 'next/link'
import {
  Library,
  Book,
  Users,
  UserCog,
  CreditCard,
  ChartSpline,
  BellIcon,
  BookUser,
  Ticket,
  BookCopy,
  Workflow,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IsLoggedIn } from '@/lib/firebase/firebase'
import { logoutAction } from '@/lib/actions/logout'
import { ModeToggle } from '@/components/button-toggle-theme'
import { redirect, RedirectType } from 'next/navigation'
import type { Route } from 'next'
import { addDays, format, subMonths } from 'date-fns'
type MenuItem = {
  title: string
  icon: typeof Library
  href: Route
}

const baseMenuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: ChartSpline,
    href: '/admin/dashboard',
  },
  { title: 'Libraries', icon: Library, href: '/admin/libraries' },
  { title: 'Notifications', icon: BellIcon, href: '/notifications' },
  { title: 'Books', icon: Book, href: '/admin/books' },
  { title: 'Users', icon: Users, href: '/admin/users' },
  { title: 'Staffs', icon: UserCog, href: '/admin/staffs' },
  {
    title: 'Memberships',
    icon: CreditCard,
    href: '/admin/memberships',
  },
  {
    title: 'Subscriptions',
    icon: Ticket,
    href: '/admin/subscriptions',
  },
  { title: 'Borrows', icon: BookUser, href: '/admin/borrows' },
  { title: 'Collections', icon: BookCopy, href: '/admin/collections' },
  { title: 'Reviews', icon: MessageSquare, href: '/admin/reviews' },
  { title: 'Jobs', icon: Workflow, href: '/admin/jobs' },
]

export const dynamic = 'force-dynamic'

export default async function LibraryDashboard() {
  const claim = await IsLoggedIn()

  if (!claim) {
    redirect('/refresh?from=/admin')
  }

  // TODO: remove after the custom claim is set
  if (
    !claim.librarease ||
    (claim.librarease.role == 'USER' &&
      claim.librarease.admin_libs.length === 0 &&
      claim.librarease.staff_libs.length === 0)
  ) {
    redirect(`/`, RedirectType.replace)
  }

  const now = new Date()
  const to = format(addDays(now, 1), 'dd-MM-yyyy')
  const from = format(subMonths(now, 1), 'dd-MM-yyyy')
  const menuItems = baseMenuItems.map((item) =>
    item.title === 'Dashboard'
      ? {
          ...item,
          href: `/admin/dashboard?from=${from}&to=${to}` as Route,
        }
      : item
  )

  return (
    <main className="min-h-[calc(100vh-4rem)] p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="place-self-end flex items-center gap-2">
          <Button variant="ghost" onClick={logoutAction}>
            Logout
          </Button>
          <ModeToggle />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.href}
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2"
                asChild
              >
                <Link href={item.href}>
                  <Icon className="size-6" />
                  <span>{item.title}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
    </main>
  )
}
