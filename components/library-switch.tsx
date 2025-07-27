'use client'

import { Library } from '@/lib/types/library'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Check, ChevronsUpDown } from 'lucide-react'

export const LibrarySwitch: React.FC<{
  libraries: Pick<Library, 'id' | 'name'>[]
  activeLibrary: Pick<Library, 'id' | 'name'>
  setActiveLibraryAction: (id: string) => void
}> = ({ libraries, activeLibrary, setActiveLibraryAction }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        {activeLibrary.name.length > 15
          ? activeLibrary.name.slice(0, 15) + '...'
          : activeLibrary.name}
        <ChevronsUpDown className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="/*w-(--radix-dropdown-menu-trigger-width)*/ min-w-max"
        align="start"
      >
        {libraries.map((library) => (
          <DropdownMenuItem
            key={library.id}
            onSelect={() => setActiveLibraryAction(library.id)}
          >
            {library.name}{' '}
            {library.id === activeLibrary?.id && <Check className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
