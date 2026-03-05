import { Verify } from '@/lib/firebase/firebase'
import { getMembership } from '@/lib/api/membership'
import { FormMembership } from '@/components/memberships/FormMembership'
import { updateMembershipAction } from '@/lib/actions/update-membership'
import { redirect } from 'next/navigation'

export default async function MembershipEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await Verify({ from: `/admin/memberships/${id}` })

  const [membershipRes] = await Promise.all([getMembership({ id })])

  if ('error' in membershipRes) {
    console.log({ libRes: membershipRes })
    return <div>{JSON.stringify(membershipRes.message)}</div>
  }

  const handleSubmit = async (data: any) => {
    'use server'
    const res = await updateMembershipAction({ id, ...data })
    if (!('error' in res)) {
      redirect(`/admin/memberships/${id}`)
    }
    return res
  }

  return (
    <div className="pt-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Edit Membership</h2>
      <FormMembership
        libraryID={membershipRes.data.library_id}
        membership={membershipRes.data}
        onSubmitAction={handleSubmit}
      />
    </div>
  )
}
