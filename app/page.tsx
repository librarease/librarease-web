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

export default function LibraryDashboard() {
  const menuItems = [
    { title: 'Libraries', icon: Library, href: '/libraries' },
    { title: 'Books', icon: Book, href: '/books' },
    { title: 'Users', icon: Users, href: '/users' },
    { title: 'Staffs', icon: UserCog, href: '/staffs' },
    { title: 'Memberships', icon: CreditCard, href: '/memberships' },
    { title: 'Subscriptions', icon: ScrollText, href: '/subscriptions' },
    { title: 'Borrows', icon: BookCopy, href: '/borrows' },
  ]

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Library Management</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => {
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
