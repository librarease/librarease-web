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
import { ButtonToggleTheme } from './button-toggle-theme'

export function NavUser({
  user,
}: {
  user: User & {
    unread_notifications_count: number
  }
}) {
  // Play iOS-inspired notification sound using Web Audio API
  const playNotificationSound = () => {
    const ctx = new window.AudioContext()
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0.2, ctx.currentTime)
    masterGain.connect(ctx.destination)

    // iOS "Tri-tone" inspired melody with bell-like harmonics
    const fundamentalNotes = [
      { freq: 659.25, time: 0.0, duration: 0.35 }, // E5
      { freq: 783.99, time: 0.1, duration: 0.35 }, // G5
      { freq: 1046.5, time: 0.2, duration: 0.4 }, // C6
    ]

    fundamentalNotes.forEach(({ freq, time, duration }) => {
      // Main tone
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(freq, ctx.currentTime + time)
      gain1.gain.setValueAtTime(0.4, ctx.currentTime + time)
      gain1.gain.exponentialRampToValueAtTime(
        0.01,
        ctx.currentTime + time + duration
      )
      osc1.connect(gain1)
      gain1.connect(masterGain)
      osc1.start(ctx.currentTime + time)
      osc1.stop(ctx.currentTime + time + duration)

      // Harmonic (octave higher for bell-like quality)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime + time)
      gain2.gain.setValueAtTime(0.15, ctx.currentTime + time)
      gain2.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + time + duration * 0.7
      )
      osc2.connect(gain2)
      gain2.connect(masterGain)
      osc2.start(ctx.currentTime + time)
      osc2.stop(ctx.currentTime + time + duration * 0.7)

      // Cleanup oscillators
      osc1.onended = () => osc1.disconnect()
      osc2.onended = () => osc2.disconnect()
    })

    // Close audio context after sound completes
    setTimeout(() => {
      masterGain.disconnect()
      ctx.close()
    }, 800)
  }

  useEffect(() => {
    function onMessage(data: Notification) {
      playNotificationSound()
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
          <DropdownMenuItem disabled>
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
        <DropdownMenuSeparator />
        <ButtonToggleTheme />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
