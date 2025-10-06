import { IsLoggedIn, Verify } from '@/lib/firebase/firebase'
import { getBorrow, getListBorrows } from '@/lib/api/borrow'
import { Borrow } from '@/lib/types/borrow'
import { redirect, RedirectType } from 'next/navigation'
import { DetailBorrow } from '@/components/borrows/DetailBorrow'
import { BtnReturnBook } from '@/components/borrows/BtnReturnBorrow'
import { Button } from '@/components/ui/button'
import { BtnUndoReturn } from '@/components/borrows/BtnUndoReturn'
import Link from 'next/link'
import { Pen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormLostBorrow } from '@/components/borrows/FormLostBorrow'

export default async function BorrowDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const from = `/admin/borrows/${id}`

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

  return (
    <DetailBorrow borrow={borrowRes.data} prevBorrows={prevBorrows}>
      <>
        {borrowRes.data.returning || borrowRes.data.lost ? null : (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardHeader>
              <CardTitle>Mark as Lost</CardTitle>
            </CardHeader>
            <CardContent>
              <FormLostBorrow id={borrowRes.data.id} />
            </CardContent>
          </Card>
        )}
        <div className="bottom-0 sticky py-2 grid md:grid-cols-2 gap-2">
          {borrowRes.data.returning ? (
            <BtnUndoReturn
              variant="outline"
              className="w-full backdrop-blur-md"
              borrow={borrowRes.data}
            />
          ) : (
            <BtnReturnBook
              variant="outline"
              className="w-full"
              borrow={borrowRes.data}
            />
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
      </>
    </DetailBorrow>
  )
}
