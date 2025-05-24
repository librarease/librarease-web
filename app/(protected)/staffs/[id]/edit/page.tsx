import { StaffEditForm } from '@/components/staffs/staff-edit-form'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getStaff } from '@/lib/api/staff'
import { Verify } from '@/lib/firebase/firebase'
import Link from 'next/link'

export default async function EditStaffPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [staffRes] = await Promise.all([getStaff({ id })])

  if ('error' in staffRes) {
    console.log({ libRes: staffRes })
    return <div>{JSON.stringify(staffRes.message)}</div>
  }

  await Verify({ from: `/staffs/${id}/edit` })

  return (
    <div className="grid grid-rows-2">
      <h1 className="text-2xl font-semibold">{staffRes.data.name}</h1>
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
            <BreadcrumbPage>Edit Staff</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <StaffEditForm staff={staffRes.data} />
    </div>
  )
}
