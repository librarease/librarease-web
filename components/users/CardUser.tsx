import { User } from '@/lib/types/user'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Carduser: React.FC<{ user: User }> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">User</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-2">
          <div className="grid grid-cols-3">
            <dt className="font-medium">Name:</dt>
            <dd className="col-span-2">{user.name}</dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Email:</dt>
            <dd className="col-span-2">{user.email ?? '-'}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
