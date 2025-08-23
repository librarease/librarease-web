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

  return (
    <div>
      <h1 className="text-2xl font-semibold">{libRes.data.name}</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/libraries">Libraries</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{libRes.data.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <LibraryEditForm library={libRes.data} />
    </div>
  )
}
