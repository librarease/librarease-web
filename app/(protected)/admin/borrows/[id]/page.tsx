import { IsLoggedIn, Verify } from '@/lib/firebase/firebase'
import { getBorrow } from '@/lib/api/borrow'
import { redirect, RedirectType } from 'next/navigation'
import { DetailBorrow } from '@/components/borrows/DetailBorrow'
import { Button } from '@/components/ui/button'
import { BtnUndoReturn } from '@/components/borrows/BtnUndoReturn'
import Link from 'next/link'
import { CornerUpLeft, Pen, PenOff } from 'lucide-react'
import { BtnUndoLost } from '@/components/borrows/BtnUndoLost'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'

export default async function BorrowDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    status?: 'lost' | 'active' | 'overdue' | 'returned'
    user_id?: string
    book_id?: string
    borrowed_at?: string
    due_at?: string
    returned_at?: string
    lost_at?: string
  }>
}) {
  const { id } = await params
  const sp = await searchParams

  const from = `/admin/borrows/${id}`

  const headers = await Verify({ from })

  const [borrowRes] = await Promise.all([getBorrow({ id, ...sp }, { headers })])

  if ('error' in borrowRes) {
    return <div>{JSON.stringify(borrowRes.message)}</div>
  }

  const claim = await IsLoggedIn()
  if (!claim || !claim.librarease) {
    redirect(`/login?from=${encodeURIComponent(from)}`, RedirectType.replace)
  }

  return (
    <DetailBorrow borrow={borrowRes.data}>
      <div className="bottom-0 sticky py-2 grid md:grid-cols-2 gap-2">
        {borrowRes.data.returning ? (
          <BtnUndoReturn
            variant="outline"
            className="w-full backdrop-blur-md"
            borrow={borrowRes.data}
          />
        ) : null}
        {borrowRes.data.lost ? (
          <BtnUndoLost
            variant="outline"
            className="w-full backdrop-blur-md"
            borrow={borrowRes.data}
          />
        ) : null}
        {borrowRes.data.lost || borrowRes.data.returning ? null : (
          <ButtonGroup className="w-full backdrop-blur-md">
            <Button variant="secondary" asChild>
              <Link
                href={`/admin/borrows/${borrowRes.data.id}/return`}
                className="w-1/2 bg-secondary"
              >
                <CornerUpLeft />
                Return
              </Link>
            </Button>
            <ButtonGroupSeparator />
            <Button asChild variant="secondary" className="text-destructive">
              <Link
                href={`/admin/borrows/${borrowRes.data.id}/lost`}
                className="w-1/2"
              >
                <PenOff />
                Mark as Lost
              </Link>
            </Button>
          </ButtonGroup>
        )}
        <Button asChild>
          <Link
            href={`/admin/borrows/${borrowRes.data.id}/edit`}
            className="w-full"
          >
            <Pen />
            Edit
          </Link>
        </Button>
      </div>
    </DetailBorrow>
  )
}
