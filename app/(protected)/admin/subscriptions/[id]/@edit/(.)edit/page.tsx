import { ModalEditSubscription } from '@/components/subscriptions/ModalEditSubscription'
import { getSubscription } from '@/lib/api/subscription'
import { Verify } from '@/lib/firebase/firebase'

// This is a server component use to pass data to the modal
export default async function SubscriptionEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const headers = await Verify({ from: `/admin/subscriptions/${id}` })

  const [subRes] = await Promise.all([getSubscription({ id }, { headers })])
  if ('error' in subRes) {
    return <div>{JSON.stringify(subRes.message)}</div>
  }
  return <ModalEditSubscription subscription={subRes.data} />
}
