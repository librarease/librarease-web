import { StaffCreateForm } from '@/components/staffs/staff-create-form'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Verify } from '@/lib/firebase/firebase'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function CreateStaffPage() {
  await Verify({ from: '/staffs/new' })

  const cookieStore = await cookies()
  const sessionName = process.env.SESSION_COOKIE_NAME as string
  const session = cookieStore.get(sessionName)

  return (
    <div className="grid grid-rows-2">
      <h1 className="text-2xl font-semibold">Assign a Staff</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/staffs" passHref legacyBehavior>
              <BreadcrumbLink>Staffs</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <StaffCreateForm token={session?.value as string} />
    </div>
  )
}
