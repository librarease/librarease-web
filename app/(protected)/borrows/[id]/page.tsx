import { IsLoggedIn, Verify } from '@/lib/firebase/firebase'
import { getBorrow, getListBorrows } from '@/lib/api/borrow'
import { Borrow } from '@/lib/types/borrow'
import { redirect, RedirectType } from 'next/navigation'
import { DetailBorrow } from '@/components/borrows/DetailBorrow'

export default async function BorrowDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const from = `/borrows/${id}`

  const headers = await Verify({ from })

  const [borrowRes] = await Promise.all([getBorrow({ id })])

  if ('error' in borrowRes) {
    return <div>{JSON.stringify(borrowRes.message)}</div>
  }

  const claim = await IsLoggedIn()
  if (!claim || !claim.librarease) {
    redirect(`/login?from=${encodeURIComponent(from)}`, RedirectType.replace)
  }

  let prevBorrows: Borrow[] = []
  const [prevBorrowsRes] = await Promise.all([
    getListBorrows(
      {
        subscription_id: borrowRes.data.subscription.id,
        sort_in: 'asc',
        limit: 20,
      },
      {
        headers,
      }
    ),
  ])

  if ('error' in prevBorrowsRes) {
    prevBorrows = []
  } else {
    prevBorrows = prevBorrowsRes.data
  }

  return <DetailBorrow borrow={borrowRes.data} prevBorrows={prevBorrows} />
}
