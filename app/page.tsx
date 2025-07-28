import Link from 'next/link'
import {
  Library,
  Book,
  BellIcon,
  BookUser,
  Ticket,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IsLoggedIn } from '@/lib/firebase/firebase'
import Landing from '@/components/landing'
import { logoutAction } from '@/lib/actions/logout'
import { ModeToggle } from '@/components/button-toggle-theme'

const menuItems = [
  { title: 'Libraries', icon: Library, href: '/libraries' },
  { title: 'Notifications', icon: BellIcon, href: '/notifications' },
  { title: 'Books', icon: Book, href: '/books' },
  {
    title: 'My Subscriptions',
    icon: Ticket,
    href: '/subscriptions',
  },
  { title: 'My Borrows', icon: BookUser, href: '/borrows' },
]

export default async function LibraryDashboard() {
  const claim = await IsLoggedIn()

  // TODO: remove after the custom claim is set
  if (!claim || !claim.librarease) {
    return <Landing />
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

          {claim.librarease.admin_libs.concat(claim.librarease.staff_libs)
            .length > 0 ? (
            <Button
              className="w-full h-24 flex flex-col items-center justify-center gap-2"
              asChild
            >
              <Link href="/admin" className="text-sm">
                <Settings className="size-6" />
                <span>Admin Dashboard</span>
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </main>
  )
}
