'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="scale-100 dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute scale-0 dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ButtonToggleTheme() {
  const { setTheme } = useTheme()

  return (
    <fieldset className="flex items-center gap-2 justify-center">
      <legend className="sr-only">Toggle theme</legend>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme('light')}
        aria-label="Set light theme"
      >
        <Sun className="text-primary dark:text-foreground" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme('dark')}
        aria-label="Set dark theme"
      >
        <Moon className="text-foreground dark:text-primary" />
      </Button>
    </fieldset>
  )
}
