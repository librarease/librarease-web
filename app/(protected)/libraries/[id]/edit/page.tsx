import { LibraryEditForm } from '@/components/libraries/lib-edit-form'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getLibrary } from '@/lib/api/library'
import { Verify } from '@/lib/firebase/firebase'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await Verify({ from: `/libraries/${id}/edit` })

  const [libRes] = await Promise.all([getLibrary({ id })])

  if ('error' in libRes) {
    console.log({ libRes })
    return <div>{JSON.stringify(libRes.message)}</div>
  }

  const cookieStore = await cookies()
  const sessionName = process.env.SESSION_COOKIE_NAME as string
  const session = cookieStore.get(sessionName)

  return (
    <div>
      <h1 className="text-2xl font-semibold">{libRes.data.name}</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
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
            <BreadcrumbPage>{libRes.data.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <LibraryEditForm library={libRes.data} token={session?.value as string} />
    </div>
  )
}
