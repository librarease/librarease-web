import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createLibrary } from '@/lib/api/library'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function NewLibrary() {
  async function create(formData: FormData) {
    'use server'

    const name = formData.get('name') as string

    await createLibrary({
      name,
    })

    redirect('/libraries')
  }

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

      <form action={create} className="space-y-4 md:max-w-[40%]">
        <Input name="name" placeholder="Name" required />
        <Button type="submit">Create</Button>
      </form>
    </div>
  )
}
