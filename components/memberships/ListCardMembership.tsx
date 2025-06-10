import { Book, Calendar, CircleDollarSign, Clock, Gavel } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Membership } from '@/lib/types/membership'
import { Badge } from '../ui/badge'

export const ListCardMembership: React.FC<{ membership: Membership }> = ({
  membership,
}) => {
  return (
    <Card
      key={membership.id}
      className={`relative ${true ? 'border-primary' : ''}`}
    >
      {true && (
        <Badge className="absolute -top-2 -right-2 bg-primary">Popular</Badge>
      )}
      <CardHeader>
        {/* <Link
          href={`/memberships/${membership.id}`}
          className="flex justify-between items-start min-h-20"
        > */}
        <div>
          <CardTitle className="text-lg line-clamp-2">
            {membership.name}
          </CardTitle>
          <CardDescription>{membership.library.name}</CardDescription>
        </div>
        {/* </Link> */}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="size-4 text-muted-foreground" />
          <span>
            Duration: {membership.duration} Days{' '}
            {membership.usage_limit > 0
              ? ` - ${membership.usage_limit} Books`
              : ''}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Book className="size-4 text-muted-foreground" />
          <span>Up to {membership.active_loan_limit} Books a time</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="size-4 text-muted-foreground" />
          <span>Borrow for {membership.loan_period} Days</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Gavel className="size-4 text-muted-foreground" />
          <span>
            Late Return Fine: {membership.fine_per_day ?? '-'} Pts/day
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <CircleDollarSign className="size-4 text-muted-foreground" />
          <span>Price: {membership.price ?? '-'} Pts</span>
        </div>
      </CardContent>
      <CardFooter>
        {/* <BtnReturnBook variant="outline" className="w-full" borrow={borrow}>
          Return Book
        </BtnReturnBook> */}
      </CardFooter>
    </Card>
  )
}
