import { NavUser } from '@/components/nav-user'
import { getMe } from '@/lib/api/user'
import { Verify } from '@/lib/firebase/firebase'
import Link from 'next/link'

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // const claim = await IsLoggedIn()

  const headers = await Verify({ from: '', forceRedirect: false })

  const res = await getMe(
    {
      include_unread_notifications_count: true,
    },
    {
      headers,
    }
  )

  if ('error' in res) {
    console.log('Error getting user', res.error)
    return <div>Something went wrong</div>
  }

  return (
    <div className="container mx-auto px-4 my-4">
      <nav className="flex items-center justify-between">
        <Link href="/" className="uppercase font-semibold tracking-wider">
          Librarease
        </Link>
        {res.data && <NavUser user={res.data} />}
      </nav>

      {children}
    </div>
  )
}
