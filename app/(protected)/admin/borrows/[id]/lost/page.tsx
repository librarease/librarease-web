import { Verify } from '@/lib/firebase/firebase'
import { getBorrow } from '@/lib/api/borrow'
import { FormLostBorrow } from '@/components/borrows/FormLostBorrow'

export default async function BorrowLostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await Verify({ from: `/admin/borrows/${id}/lost` })

  const [borrowRes] = await Promise.all([getBorrow({ id })])

  if ('error' in borrowRes) {
    console.log({ libRes: borrowRes })
    return <div>{JSON.stringify(borrowRes.message)}</div>
  }

  return (
    <div className="grid place-items-center">
      <FormLostBorrow borrow={borrowRes.data} />
    </div>
  )
}
