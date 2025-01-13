'use client'

import * as React from 'react'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export function DateRangeSelector({
  className,
  range,
  onChangeAction,
}: React.HTMLAttributes<HTMLDivElement> & {
  range: DateRange
  onChangeAction: (range?: DateRange) => void
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: range.from,
    to: range.to,
  })

  const onInteractOutside = onChangeAction.bind(null, date)

  const onPresetChange = React.useCallback(
    (label: string) =>
      setDate(rangePresets.find((r) => r.label === label)?.date),
    []
  )

  return (
    <div className={cn('grid gap-2 justify-self-end', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          onInteractOutside={onInteractOutside}
          className="flex w-auto flex-col space-y-2 p-2"
          align="start"
        >
          <Select onValueChange={onPresetChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              {rangePresets.map((r) => (
                <SelectItem key={r.label} value={r.label}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

const rangePresets: { label: string; date: DateRange }[] = [
  {
    label: 'Last Month',
    date: {
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    },
  },
  {
    label: 'Past 4 Months',
    date: { from: subMonths(new Date(), 4), to: new Date() },
  },
]
