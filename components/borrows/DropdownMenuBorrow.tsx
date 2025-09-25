import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BookUser, Menu } from 'lucide-react'
import Link from 'next/link'

export function DropdownMenuBorrow() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Menu />
          Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Select an action</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BookUser className="mr-2 size-4" />
            <Link href="/admin/borrows/new">Borrow a book</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
