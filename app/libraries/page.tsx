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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getListLibraries } from '@/lib/api/library'
import Link from 'next/link'

export default async function Libraries({
  searchParams,
}: {
  searchParams: Promise<{
    skip?: number
    limit?: number
    library_id?: string
  }>
}) {
  const sp = await searchParams
  const skip = Number(sp?.skip ?? 0)
  const limit = Number(sp?.limit ?? 20)
  const library_id = sp?.library_id
  const res = await getListLibraries({
    sort_by: 'created_at',
    sort_in: 'desc',
    limit: limit,
    skip: skip,
    ...(library_id ? { library_id } : {}),
  })

  if ('error' in res) {
    console.log(res)
    return <div>{JSON.stringify(res.message)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL = `/libraries?skip=${skip + limit}&limit=${limit}`
  const prevURL = `/libraries?skip=${prevSkip}&limit=${limit}`

  return (
    <div>
      <h1 className="text-2xl font-semibold">Libraries</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Libraries</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Table>
        {/* <TableCaption>List of books available in the library.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Creatd At</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res.data.map((lib) => (
            <TableRow key={lib.id}>
              <TableCell>
                <Link href={`libraries/${lib.id}`}>{lib.name}</Link>
              </TableCell>
              <TableCell>{lib.created_at}</TableCell>
              <TableCell>{lib.updated_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={prevURL} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={nextURL} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
