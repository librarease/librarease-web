import { FormNewBorrow } from '@/components/borrows/FormNewBorrow'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function ComboboxForm() {
  const cookieStore = await cookies()
  const sessionName = process.env.SESSION_COOKIE_NAME as string
  const session = cookieStore.get(sessionName)

  return (
    <div className="grid grid-rows-2">
      <h1 className="text-2xl font-semibold">Borrow a Book</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/borrows" passHref legacyBehavior>
              <BreadcrumbLink>Borrows</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <FormNewBorrow token={session?.value as string} />
    </div>
  )
}
