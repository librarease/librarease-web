import { BorrowDetail } from '@/lib/types/borrow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isBorrowDue } from '@/lib/utils'
import { differenceInDays, format, formatDistanceToNowStrict } from 'date-fns'

export const CardBorrow: React.FC<{ borrow: BorrowDetail }> = ({ borrow }) => {
  const overduedDays = differenceInDays(
    borrow.returning ? new Date(borrow.returning.returned_at) : new Date(),
    new Date(borrow.due_at)
  )
  const finePerDay = borrow.subscription.membership.fine_per_day ?? 0

  const fine = overduedDays * finePerDay

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">Borrow</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-2">
          <div className="grid grid-cols-3">
            <dt className="font-medium">Borrowed At:</dt>
            <dd className="col-span-2">
              {format(new Date(borrow.borrowed_at), 'MMM d, yyyy hh:mm a')}
              {!borrow.returning &&
                ` (${formatDistanceToNowStrict(new Date(borrow.borrowed_at), { addSuffix: true })})`}
            </dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Due At:</dt>
            <dd className="col-span-2">
              {format(new Date(borrow.due_at), 'MMM d, yyyy hh:mm a')}
              {!borrow.returning &&
                ` (${formatDistanceToNowStrict(new Date(borrow.due_at), { addSuffix: true })})`}
            </dd>
          </div>

          {borrow.returning && (
            <>
              <div className="grid grid-cols-3">
                <dt className="font-medium">Returned At:</dt>
                <dd className="col-span-2">
                  {format(
                    new Date(borrow.returning.returned_at),
                    'MMM d, yyyy hh:mm a'
                  )}
                </dd>
              </div>
              <div className="grid grid-cols-3">
                <dt className="font-medium">Fine Received:</dt>
                <dd className="col-span-2">
                  {borrow.returning.fine ?? '-'} Pts
                </dd>
              </div>
            </>
          )}
          {isBorrowDue(borrow) && !borrow.returning && (
            <div className="grid grid-cols-3">
              <dt className="font-medium">Fine:</dt>
              <dd className="col-span-2">{fine ?? '-'} Pts</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}
