import Link from 'next/link'
import {
  Library,
  Book,
  Users,
  UserCog,
  CreditCard,
  ScrollText,
  BookCopy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IsLoggedIn } from '@/lib/firebase/firebase'
import Landing from '@/components/landing'

const menuItems = [
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
  { title: 'Borrows', icon: BookCopy, href: '/borrows', level: 3 },
  {
    title: 'My Memberships',
    icon: CreditCard,
    href: '/memberships/me',
    level: 2,
  },
  {
    title: 'My Subscriptions',
    icon: ScrollText,
    href: '/subscriptions/me',
    level: 2,
  },
  { title: 'My Borrows', icon: BookCopy, href: '/borrows/me', level: 2 },
]

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
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Library Management</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => {
            if (item.level > userLvl) return null
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-slate-50"
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.title}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
