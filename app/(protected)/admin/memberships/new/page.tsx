import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { FormMembership } from '@/components/memberships/FormMembership'
import { cookies } from 'next/headers'

export default async function NewMembership() {
  async function onSubmitAction() {
    'use server'
    return { message: 'Membership created successfully.' }
  }

  const cookieStore = await cookies()
  const sessionName = process.env.LIBRARY_COOKIE_NAME as string
  const activeLibraryID = cookieStore.get(sessionName)?.value

  return (
    <div className="grid grid-rows-2">
      <h1 className="text-2xl font-semibold">Create New Membership</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/memberships">
              Memberships
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <FormMembership
        libraryID={activeLibraryID!}
        onSubmitAction={onSubmitAction}
      />
    </div>
  )
}
