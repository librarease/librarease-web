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
            <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/staffs">Staffs</BreadcrumbLink>
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
