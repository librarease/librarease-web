import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Verify } from '@/lib/firebase/firebase'
import { Button } from '@/components/ui/button'
import { getListCollections } from '@/lib/api/collection'
import { ListCollection } from '@/components/collections/ListCollection'
import { SearchInput } from '@/components/common/SearchInput'

export const metadata: Metadata = {
  title: `Collections · ${SITE_NAME}`,
}

export default async function UserCollections({
  searchParams,
}: {
  searchParams: Promise<{
    skip?: number
    limit?: number
    library_id?: string
    title?: string
  }>
}) {
  const sp = await searchParams
  const skip = Number(sp?.skip ?? 0)
  const limit = Number(sp?.limit ?? 20)
  const library_id = sp?.library_id

  const query = {
    sort_by: 'updated_at',
    sort_in: 'desc',
    limit: limit,
    skip: skip,
    title: sp?.title,
    include_library: 'true',
    ...(library_id ? { library_id } : {}),
  } as const

  await Verify({ from: '/admin/collections' })

  const res = await getListCollections(query)

  if ('error' in res) {
    console.log(res)
    return <div>{JSON.stringify(res.message)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL =
    `/admin/collections?skip=${skip + limit}&limit=${limit}` as const
  const prevURL = `/admin/collections?skip=${prevSkip}&limit=${limit}` as const

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">Collections</h1>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>
                  Collections{' '}
                  <Badge className="ml-4" variant="outline">
                    {res.meta.total}
                  </Badge>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button variant="default" asChild>
            <Link href="/admin/collections/new">
              <>
                <Plus className="mr-2 h-4 w-4" />
                New Collection
              </>
            </Link>
          </Button>
        </div>
      </nav>

      <div className="flex justify-between gap-4">
        <SearchInput
          className="max-w-md"
          placeholder="Search by title"
          name="title"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {res.data.map((col) => (
          <Link key={col.id} href={`/admin/collections/${col.id}`} passHref>
            <ListCollection collection={col} />
          </Link>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          {res.meta.skip > 0 && (
            <PaginationItem>
              <PaginationPrevious href={prevURL} />
            </PaginationItem>
          )}
          {res.meta.limit <= res.data.length && (
            <PaginationItem>
              <PaginationNext href={nextURL} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
