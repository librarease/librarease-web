import { ListCardMembership } from '@/components/memberships/ListCardMembership'
import { getMembership } from '@/lib/api/membership'

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
    <div className="space-y-4">
      <ListCardMembership membership={membershipRes.data} />
    </div>
  )
}
