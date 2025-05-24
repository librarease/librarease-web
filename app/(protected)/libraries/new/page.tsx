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

export default async function NewLibrary() {
  await Verify({ from: '/libraries/new' })

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

      <LibraryCreateForm />
    </div>
  )
}
