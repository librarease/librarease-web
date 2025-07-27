import { Verify } from '@/lib/firebase/firebase'
import { getBorrow } from '@/lib/api/borrow'
import { FormEditBorrow } from '@/components/borrows/FormEditBorrow'

export default async function BorrowDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await Verify({ from: `/borrows/${id}` })

  const [borrowRes] = await Promise.all([getBorrow({ id })])

  if ('error' in borrowRes) {
    console.log({ libRes: borrowRes })
    return <div>{JSON.stringify(borrowRes.message)}</div>
  }

  return (
    <div className="grid place-items-center">
      <FormEditBorrow borrow={borrowRes.data} />
    </div>
  )
}
