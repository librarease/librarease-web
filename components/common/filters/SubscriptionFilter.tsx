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
import { getListSubs } from '@/lib/api/subscription'
import { toast } from 'sonner'
import { Subscription } from '@/lib/types/subscription'
import { useFilterContext } from '../ModelFilter'

export const SubscriptionFilter: React.FC<{ filterKey?: string }> = ({
  filterKey = 'subscription_id',
}) => {
  const { filters, setFilter } = useFilterContext()
  const [query, setQuery] = useState('')
  const [subs, setSubs] = useState<Subscription[]>([])

  useEffect(() => {
    getListSubs({
      limit: 20,
      membership_name: query,
    }).then((res) => {
      if ('error' in res) {
        toast.error(res.message)
        return
      }
      setSubs(res.data)
    })
  }, [query])

  const selectedSubID = filters[filterKey]
  const selectedSub = subs.find(
    (subscription) => subscription.id === selectedSubID
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'w-full justify-between',
            !selectedSubID && 'text-muted-foreground'
          )}
        >
          {selectedSub ? selectedSub.membership.name : 'Filter by subscription'}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            onValueChange={setQuery}
            value={query}
            placeholder="Search subscription title..."
          />
          <CommandList>
            <CommandGroup forceMount>
              {subs.map((subscription) => (
                <CommandItem
                  value={subscription.id}
                  key={subscription.id}
                  onSelect={() => {
                    setFilter(filterKey, subscription.id)
                  }}
                >
                  {subscription.membership.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      subscription.id === selectedSubID
                        ? 'opacity-100'
                        : 'opacity-0'
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
