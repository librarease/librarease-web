import { IsLoggedIn, Verify } from '@/lib/firebase/firebase'
import { getBorrow } from '@/lib/api/borrow'
import { redirect, RedirectType } from 'next/navigation'
import { DetailBorrow } from '@/components/borrows/DetailBorrow'

export default async function BorrowDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    status?: 'lost' | 'active' | 'overdue' | 'returned'
    book_id?: string
    borrowed_at?: string
    due_at?: string
    returned_at?: string
    lost_at?: string
  }>
}) {
  const { id } = await params
  const sp = await searchParams

  const from = `/borrows/${id}`

  const headers = await Verify({ from })

  const claim = await IsLoggedIn()
  if (!claim || !claim.librarease) {
    redirect(`/login?from=${encodeURIComponent(from)}`, RedirectType.replace)
  }

  const [borrowRes] = await Promise.all([
    getBorrow({ id, user_id: claim.librarease.id, ...sp }, { headers }),
  ])

  if ('error' in borrowRes) {
    return <div>{JSON.stringify(borrowRes.message)}</div>
  }

  return <DetailBorrow borrow={borrowRes.data} />
}
