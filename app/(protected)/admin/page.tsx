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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IsLoggedIn } from '@/lib/firebase/firebase'
import { logoutAction } from '@/lib/actions/logout'
import { ModeToggle } from '@/components/button-toggle-theme'
import { redirect, RedirectType } from 'next/navigation'

const menuItems = [
  { title: 'Dashboard', icon: ChartSpline, href: '/admin/dashboard' },
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
] as const

export default async function LibraryDashboard() {
  const claim = await IsLoggedIn()

  // TODO: remove after the custom claim is set
  if (
    !claim ||
    !claim.librarease ||
    (claim.librarease.role == 'USER' &&
      claim.librarease.admin_libs.length === 0 &&
      claim.librarease.staff_libs.length === 0)
  ) {
    redirect(`/`, RedirectType.replace)
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Librarease</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={logoutAction}>
              Logout
            </Button>
            <ModeToggle />
          </div>
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
