import { Verify } from '@/lib/firebase/firebase'
import { getBorrow } from '@/lib/api/borrow'
import { FormReview } from '@/components/reviews/FormReview'

export default async function BorrowReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const headers = await Verify({ from: `/borrows/${id}/review` })

  const [borrowRes] = await Promise.all([getBorrow({ id }, { headers })])

  if ('error' in borrowRes) {
    console.log({ libRes: borrowRes })
    return <div>{JSON.stringify(borrowRes.message)}</div>
  }

  return (
    <div className="grid place-items-center">
      <FormReview borrow={borrowRes.data} />
    </div>
  )
}
