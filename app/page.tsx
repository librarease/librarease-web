import Link from 'next/link'
import {
  Library,
  Book,
  Users,
  UserCog,
  CreditCard,
  ScrollText,
  BookCopy,
  ChartSpline,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IsLoggedIn } from '@/lib/firebase/firebase'
import Landing from '@/components/landing'
import { cookies } from 'next/headers'

const menuItems = [
  { title: 'Dashboard', icon: ChartSpline, href: '/dashboard', level: 3 },
  { title: 'Libraries', icon: Library, href: '/libraries', level: 1 },
  { title: 'Books', icon: Book, href: '/books', level: 1 },
  { title: 'Users', icon: Users, href: '/users', level: 3 },
  { title: 'Staffs', icon: UserCog, href: '/staffs', level: 3 },
  { title: 'Memberships', icon: CreditCard, href: '/memberships', level: 3 },
  {
    title: 'Subscriptions',
    icon: ScrollText,
    href: '/subscriptions',
    level: 3,
  },
  { title: 'Borrows', icon: BookCopy, href: '/borrows', level: 2 },
]

async function logoutAction() {
  'use server'
  const cookieStore = await cookies()
  const sessionName = process.env.SESSION_COOKIE_NAME as string
  cookieStore.delete(sessionName)
}

export default async function LibraryDashboard() {
  const claim = await IsLoggedIn()

  // TODO: remove after the custom claim is set
  if (!claim || !claim.librarease) {
    return <Landing />
  }

  const userLvl =
    claim.librarease.role === 'SUPERADMIN'
      ? 5
      : claim.librarease.role === 'ADMIN'
        ? 4
        : claim.librarease.admin_libs.length > 0 ||
            claim.librarease.staff_libs.length > 0
          ? 3
          : 2

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Librarease</h1>
          <Button variant="ghost" onClick={logoutAction}>
            Logout
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => {
            if (item.level > userLvl) return null
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
