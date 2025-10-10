import { Verify } from '@/lib/firebase/firebase'
import { getBorrow } from '@/lib/api/borrow'
import { FormReturnBorrow } from '@/components/borrows/FormReturnBorrow'

export default async function BorrowReturnPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await Verify({ from: `/admin/borrows/${id}/return` })

  const [borrowRes] = await Promise.all([getBorrow({ id })])

  if ('error' in borrowRes) {
    console.log({ libRes: borrowRes })
    return <div>{JSON.stringify(borrowRes.message)}</div>
  }

  return (
    <div className="grid place-items-center">
      <FormReturnBorrow borrow={borrowRes.data} />
    </div>
  )
}
