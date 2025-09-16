import { FormCollection } from '@/components/collections/FormCollection'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { createCollectionAction } from '@/lib/actions/collection'
import { cookies } from 'next/headers'

export default async function NewCollectionPage() {
  const cookieStore = await cookies()
  const sessionName = process.env.LIBRARY_COOKIE_NAME as string
  const activeLibraryID = cookieStore.get(sessionName)?.value

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New Collection</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/collections">
              Collections
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Collection</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <FormCollection
        initialData={{
          library_id: activeLibraryID ?? '',
          title: '',
        }}
        onSubmit={createCollectionAction}
      />
    </div>
  )
}
