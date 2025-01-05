import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { LibraryCreateForm } from '@/components/libraries/lib-create-form'
import { Verify } from '@/lib/firebase/firebase'
import { cookies } from 'next/headers'

export default async function NewLibrary() {
  await Verify({ from: '/libraries/new' })

  const cookieStore = await cookies()
  const sessionName = process.env.SESSION_COOKIE_NAME as string
  const session = cookieStore.get(sessionName)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Create Library</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/libraries" passHref legacyBehavior>
              <BreadcrumbLink>Libraries</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create a Library</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <LibraryCreateForm token={session?.value as string} />
    </div>
  )
}
