'use server'

import { revalidatePath } from 'next/cache'
import { updateMembership } from '../api/membership'
import { Verify } from '../firebase/firebase'

export async function updateMembershipAction(
  data: Parameters<typeof updateMembership>[0]
) {
  const headers = await Verify({ from: `/admin/memberships/${data.id}` })
  try {
    const res = await updateMembership(data, { headers })
    if ('error' in res) {
      return { error: res.error as string }
    }

    revalidatePath(`/admin/memberships/${data.id}`)
    revalidatePath(`/admin/memberships`)

    return { message: 'membership updated successfully' }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to update membership' }
  }
}
