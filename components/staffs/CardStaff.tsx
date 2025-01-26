import { Staff } from '@/lib/types/staff'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Cardstaff: React.FC<{ staff: Staff }> = ({ staff }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">Staff</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-2">
          <div className="grid grid-cols-3">
            <dt className="font-medium">Name:</dt>
            <dd className="col-span-2">{staff.name}</dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Role:</dt>
            <dd className="col-span-2">{staff.role}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
