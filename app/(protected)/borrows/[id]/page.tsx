import { IsLoggedIn, Verify } from '@/lib/firebase/firebase'
import { getBorrow } from '@/lib/api/borrow'
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

  const [borrowRes] = await Promise.all([getBorrow({ id }, { headers })])

  if ('error' in borrowRes) {
    return <div>{JSON.stringify(borrowRes.message)}</div>
  }

  const claim = await IsLoggedIn()
  if (!claim || !claim.librarease) {
    redirect(`/login?from=${encodeURIComponent(from)}`, RedirectType.replace)
  }

  return <DetailBorrow borrow={borrowRes.data} />
}
