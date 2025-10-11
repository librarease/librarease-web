'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getListUsers } from '@/lib/api/user'
import { toast } from 'sonner'
import { User } from '@/lib/types/user'
import { useFilterContext } from '../ModelFilter'

export const UserFilter: React.FC<{ filterKey?: string }> = ({
  filterKey = 'user_id',
}) => {
  const { filters, setFilter } = useFilterContext()
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    getListUsers({
      limit: 20,
      name: query,
    }).then((res) => {
      if ('error' in res) {
        toast.error(res.message)
        return
      }
      setUsers(res.data)
    })
  }, [query])

  const selectedUserID = filters[filterKey]
  const selectedUser = users.find((user) => user.id === selectedUserID)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'w-full justify-between',
            !selectedUserID && 'text-muted-foreground'
          )}
        >
          {selectedUser ? selectedUser.name : 'Filter by user'}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            onValueChange={setQuery}
            value={query}
            placeholder="Search user name..."
          />
          <CommandList>
            <CommandGroup forceMount>
              {users.map((user) => (
                <CommandItem
                  value={user.id}
                  key={user.id}
                  onSelect={() => {
                    setFilter(filterKey, user.id)
                  }}
                >
                  {user.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      user.id === selectedUserID ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
