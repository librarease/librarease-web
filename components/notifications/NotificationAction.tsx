'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'
import { MoreHorizontal } from 'lucide-react'
import { Notification } from '@/lib/types/notification'
import { readNotificationAction } from '@/lib/actions/notification'

export const NotificationAction: React.FC<{
  noti: Notification
}> = ({ noti }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!noti.read_at && (
          <DropdownMenuItem
            onClick={readNotificationAction.bind(null, noti.id)}
          >
            Mark as read
          </DropdownMenuItem>
        )}
        <DropdownMenuItem disabled>Delete notification</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
