import { Verify } from '@/lib/firebase/firebase'
import { getSubscription } from '@/lib/api/subscription'
import { FormEditSubscription } from '@/components/subscriptions/FormEditSubscription'

export default async function SubscriptionEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const headers = await Verify({ from: `/admin/subscriptions/${id}` })

  const [subRes] = await Promise.all([getSubscription({ id }, { headers })])

  if ('error' in subRes) {
    console.log({ libRes: subRes })
    return <div>{JSON.stringify(subRes.message)}</div>
  }

  return (
    <div className="grid place-items-center">
      <FormEditSubscription sub={subRes.data} />
    </div>
  )
}
