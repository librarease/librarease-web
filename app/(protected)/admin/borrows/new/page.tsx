import { FormBorrow } from '@/components/borrows/FormBorrow'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { IsLoggedIn } from '@/lib/firebase/firebase'
import { redirect, RedirectType } from 'next/navigation'

export default async function ComboboxForm() {
  const claim = await IsLoggedIn()
  if (!claim || !claim.librarease) {
    redirect(
      `/login?from=${encodeURIComponent('/admin/borrows/new')}`,
      RedirectType.replace
    )
  }

  return (
    <div className="grid grid-rows-2">
      <h1 className="text-2xl font-semibold">Borrow a Book</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/borrows">Borrows</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <FormBorrow {...claim.librarease} />
    </div>
  )
}
