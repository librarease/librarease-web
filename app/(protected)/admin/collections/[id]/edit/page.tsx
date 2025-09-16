import { FormCollection } from '@/components/collections/FormCollection'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { updateCollectionAction } from '@/lib/actions/collection'
import { getCollection } from '@/lib/api/collection'

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [collectionRes] = await Promise.all([getCollection(id)])

  if ('error' in collectionRes) {
    console.log({ libRes: collectionRes })
    return <div>{JSON.stringify(collectionRes.message)}</div>
  }

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
            <BreadcrumbPage>{collectionRes.data.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <FormCollection
        initialData={{
          library_id: collectionRes.data.library_id,
          title: collectionRes.data.title,
          cover: collectionRes.data.cover?.path,
          description: collectionRes.data.description,
        }}
        onSubmit={updateCollectionAction.bind(null, collectionRes.data.id)}
      />
    </div>
  )
}
