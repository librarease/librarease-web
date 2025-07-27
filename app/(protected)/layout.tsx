import { LibrarySwitch } from '@/components/library-switch'
import { NavUser } from '@/components/nav-user'
import { getMe } from '@/lib/api/user'
import { Verify } from '@/lib/firebase/firebase'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function setActiveLibraryAction(id: string) {
  'use server'
  const cookieStore = await cookies()
  const sessionName = process.env.LIBRARY_COOKIE_NAME as string
  cookieStore.set({
    name: sessionName,
    value: id,
    path: '/',
  })
  console.log(`setActiveLibraryAction: ${id}`)
  // revalidatePath('/admin')
  redirect(`/admin`)
}

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
  const libraries = me?.staffs?.map((s) => s.library!) ?? []

  const cookieStore = await cookies()
  const sessionName = process.env.LIBRARY_COOKIE_NAME as string
  const activeLibraryID = cookieStore.get(sessionName)?.value
  const activeLibrary =
    libraries.find((l) => l.id === activeLibraryID) ?? libraries[0]

  return (
    <div className="container mx-auto px-4 my-4">
      <nav className="flex items-center justify-between">
        <Link href="/" className="uppercase font-semibold tracking-wider">
          Librarease
        </Link>
        {me && (
          <div className="inline-flex gap-2">
            {libraries.length > 0 && activeLibrary ? (
              <LibrarySwitch
                libraries={libraries}
                activeLibrary={activeLibrary}
                setActiveLibraryAction={setActiveLibraryAction}
              />
            ) : null}
            <NavUser user={me} />
          </div>
        )}
      </nav>

      {children}
    </div>
  )
}
