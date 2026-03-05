import { ModalEditMembership } from '@/components/memberships/ModalEditMembership'
import { getMembership } from '@/lib/api/membership'
import { Verify } from '@/lib/firebase/firebase'

// This is a server component use to pass data to the modal
export default async function MembershipEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await Verify({ from: `/admin/memberships/${id}` })

  const [membershipRes] = await Promise.all([getMembership({ id })])
  if ('error' in membershipRes) {
    return <div>{JSON.stringify(membershipRes.message)}</div>
  }
  return <ModalEditMembership membership={membershipRes.data} />
}
