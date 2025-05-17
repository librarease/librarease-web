import { NavUser } from '@/components/nav-user'
import { IsLoggedIn } from '@/lib/firebase/firebase'

export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const claim = await IsLoggedIn()
  return (
    <div className="container mx-auto px-4 my-4">
      <nav className="flex items-center justify-between">
        <div>LibrarEase</div>
        {claim && (
          <NavUser
            user={{
              id: claim.librarease.id,
              avatar: 'https://github.com/agmmtoo.png',
              email: claim.email ?? '',
              name: claim.librarease.role,
            }}
          />
        )}
      </nav>

      {children}
    </div>
  )
}
