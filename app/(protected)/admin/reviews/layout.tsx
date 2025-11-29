import { BookFilter, UserFilter } from '@/components/common/filters'
import { ModelFilter } from '@/components/common/ModelFilter'
import { SearchInput } from '@/components/common/SearchInput'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default async function ReviewsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10 mb-4">
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Reviews</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>
      <div className="flex justify-between">
        <SearchInput
          className="max-w-md"
          placeholder="Search by review comment..."
          name="comment"
        />
        <div className="self-end inline-flex gap-2">
          <ModelFilter
            filterKeys={[
              'user_id',
              'book_id',
              'borrowed_at',
              'due_at',
              'returned_at',
              'lost_at',
            ]}
          >
            <UserFilter />
            <BookFilter />
          </ModelFilter>
        </div>
      </div>
      {children}
    </div>
  )
}
