import { ModalReview } from '@/components/reviews/ModelReview'
import { getBorrow } from '@/lib/api/borrow'
import { Verify } from '@/lib/firebase/firebase'

// This is a server component use to pass data to the modal
export default async function ReviewDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const headers = await Verify({ from: `/borrows/${id}/review` })

  const [borrowRes] = await Promise.all([getBorrow({ id }, { headers })])
  if ('error' in borrowRes) {
    return <div>{JSON.stringify(borrowRes.message)}</div>
  }
  return <ModalReview borrow={borrowRes.data} />
}
