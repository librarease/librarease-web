import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Library,
  Book,
  BellIcon,
  BookUser,
  Ticket,
  Settings,
  BookCopy,
} from 'lucide-react'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { IsLoggedIn } from '@/lib/firebase/firebase'
import Landing from '@/components/landing'
import { logoutAction } from '@/lib/actions/logout'
import { ModeToggle } from '@/components/button-toggle-theme'
import {
  getDictionary,
  getMetadataForPage,
  isLocale,
  type Locale,
} from '@/lib/i18n'

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
  { title: 'Collections', icon: BookCopy, href: '/collections' },
] as const

type Props = {
  params: Promise<{
    locale: string
  }>
}

async function getPageLocale(params: Props['params']): Promise<Locale> {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return locale
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const locale = await getPageLocale(params)
  const dictionary = await getDictionary(locale)

  return getMetadataForPage(locale, '/', dictionary.meta.home)
}

export default async function LocalizedHomePage({ params }: Props) {
  const locale = await getPageLocale(params)
  const dictionary = await getDictionary(locale)
  const claim = await IsLoggedIn()

  if (!claim || !claim.librarease) {
    return <Landing locale={locale} copy={dictionary.landing} />
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
