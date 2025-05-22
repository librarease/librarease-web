import { NavUser } from '@/components/nav-user'
import { getMe } from '@/lib/api/user'
import { Verify } from '@/lib/firebase/firebase'
import Link from 'next/link'

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headers = await Verify({ from: '', forceRedirect: false })

  const me = await getMe(
    { include_unread_notifications_count: true },
    { headers }
  )
    .then((res) => ('error' in res ? null : res.data))
    .catch((e) => {
      console.warn('Error fetching me:', e)
      return null
    })

  return (
    <div className="container mx-auto px-4 my-4">
      <nav className="flex items-center justify-between">
        <Link href="/" className="uppercase font-semibold tracking-wider">
          Librarease
        </Link>
        {me && <NavUser user={me} />}
      </nav>

      {children}
    </div>
  )
}
