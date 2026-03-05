import { ListCardMembership } from '@/components/memberships/ListCardMembership'
import { getMembership } from '@/lib/api/membership'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Pen } from 'lucide-react'

export default async function Memberships({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) {
  const { id } = await params

  const [membershipRes] = await Promise.all([getMembership({ id })])

  if ('error' in membershipRes) {
    console.log(membershipRes)
    return <div>{JSON.stringify(membershipRes.message)}</div>
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <ListCardMembership membership={membershipRes.data}>
        <Button asChild>
          <Link
            href={`/admin/memberships/${membershipRes.data.id}/edit`}
            className="w-full"
          >
            <Pen />
            Edit
          </Link>
        </Button>
      </ListCardMembership>
    </div>
  )
}
