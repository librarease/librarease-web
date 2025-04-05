import { ModalEditBorrow } from '@/components/borrows/ModalEditBorrow'
import { getBorrow } from '@/lib/api/borrow'
import { Verify } from '@/lib/firebase/firebase'

// This is a server component use to pass data to the modal
export default async function BorrowDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await Verify({ from: `/borrows/${id}` })

  const [borrowRes] = await Promise.all([getBorrow({ id })])
  if ('error' in borrowRes) {
    return <div>{JSON.stringify(borrowRes.message)}</div>
  }
  return <ModalEditBorrow borrow={borrowRes.data} />
}
