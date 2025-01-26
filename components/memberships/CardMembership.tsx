import { Membership } from '@/lib/types/membership'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export const CardMembership: React.FC<{ membership: Membership }> = ({
  membership,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">Membership</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-2">
          <div className="grid grid-cols-3">
            <dt className="font-medium">Name:</dt>
            <dd className="col-span-2">{membership.name}</dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Created At:</dt>
            <dd className="col-span-2">{formatDate(membership.created_at)}</dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Price:</dt>
            <dd className="col-span-2">{membership.price ?? '-'} Pts</dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Overdue Fine:</dt>
            <dd className="col-span-2">{membership.fine_per_day ?? '-'} Pts</dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Library:</dt>
            <dd className="col-span-2">{membership.library.name}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
