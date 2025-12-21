import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getMembership } from '@/lib/api/membership'
import { SITE_NAME } from '@/lib/consts'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Membership · ${SITE_NAME}`,
}

export default async function MembershipDetailsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ id: string }>
}>) {
  const { id } = await params

  const [membershipRes] = await Promise.all([getMembership({ id })])

  if ('error' in membershipRes) {
    console.log({ libRes: membershipRes })
    return <div>{JSON.stringify(membershipRes.message)}</div>
  }
  return (
    <>
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">{membershipRes.data.name}</h1>
        <div className="flex justify-between items-center">
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
              <BreadcrumbItem>{membershipRes.data.name}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>
      {children}
    </>
  )
}
