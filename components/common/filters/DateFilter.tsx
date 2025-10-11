'use client'

import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { useFilterContext } from '../ModelFilter'

type DateFilterProps = {
  filterKey?: string
  placeholder?: string
}

export const DateFilter: React.FC<DateFilterProps> = ({
  filterKey = 'date',
  placeholder = 'Select date',
}) => {
  const { filters, setFilter } = useFilterContext()
  const dateValue = filters[filterKey]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between',
            !dateValue && 'text-muted-foreground'
          )}
        >
          {dateValue ? formatDate(dateValue) : <span>{placeholder}</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={dateValue ? new Date(dateValue) : undefined}
          onSelect={(v) => setFilter(filterKey, v ? v.toJSON() : null)}
          captionLayout="dropdown"
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
