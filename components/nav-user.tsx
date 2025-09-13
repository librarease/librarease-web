'use client'

import { BellIcon, LogOutIcon, UserCircleIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'
import { useEffect } from 'react'
import { Notification } from '@/lib/types/notification'
import { streamNotification } from '@/lib/api/notification'
import { logoutAction } from '@/lib/actions/logout'
import { User } from '@/lib/types/user'
import { Badge } from './ui/badge'
import Link from 'next/link'
import { toast } from 'sonner'

export function NavUser({
  user,
}: {
  user: User & {
    unread_notifications_count: number
  }
}) {
  useEffect(() => {
    function onMessage(data: Notification) {
      toast.info(data.title, {
        description: data.message,
      })
    }
    function onError(event: Event) {
      console.warn('Error in notification stream:', event)
    }

    const cleanup = streamNotification(user.id, {
      onMessage: onMessage,
      onError: onError,
      onConnect: console.log,
    })
    return cleanup
  }, [user.id])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="w-8 h-8">
            {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
            <AvatarFallback className="rounded-lg">
              {user.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        // side={isMobile ? "bottom" : "right"}
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                {user.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserCircleIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/notifications">
              <BellIcon />
              Notifications
              {user.unread_notifications_count > 0 && (
                <Badge className="" variant="outline">
                  {user.unread_notifications_count}
                </Badge>
              )}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logoutAction}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
