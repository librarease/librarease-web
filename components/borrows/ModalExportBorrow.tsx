'use client'

import { useState } from 'react'
import { CalendarIcon, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { exportBorrowAction } from '@/lib/actions/export-borrow'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn, formatDate } from '@/lib/utils'
import { Calendar } from '../ui/calendar'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { subDays } from 'date-fns'
import { useRouter, useSearchParams } from 'next/navigation'

const FormSchema = z.object({
  status: z.enum(['all', 'active', 'overdue', 'returned', 'lost']),
  borrowed_at_from: z.date(),
  borrowed_at_to: z.date(),
})

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active Only' },
  { value: 'overdue', label: 'Overdue Only' },
  { value: 'returned', label: 'Returned Only' },
  { value: 'lost', label: 'Lost Only' },
] as const

export const ModalExportBorrow: React.FC = () => {
  const [open, setOpen] = useState(false)

  const params = useSearchParams()
  const status = params.get('status') as (typeof statusOptions)[number]['value']

  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: status ?? 'all',
      borrowed_at_from: subDays(new Date(), 30),
      borrowed_at_to: new Date(),
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await exportBorrowAction({
      is_active: data.status === 'active',
      is_overdue: data.status === 'overdue',
      is_returned: data.status === 'returned',
      is_lost: data.status === 'lost',
      borrowed_at_from: data.borrowed_at_from.toJSON(),
      borrowed_at_to: data.borrowed_at_to.toJSON(),
    })
    if ('error' in res) {
      toast.error(res.error, { richColors: true })
      return
    }
    toast.success(res.message, {
      richColors: true,
      action: {
        label: 'View Job',
        onClick: () => router.push(`/admin/jobs/${res.id}`),
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Borrows</DialogTitle>
          <DialogDescription>
            Configure export filters. The export will be processed
            asynchronously and you&apos;ll be notified when ready.
          </DialogDescription>
        </DialogHeader>

        <form
          id="export-borrows-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <FieldLabel>Status Filter</FieldLabel>
            <Controller
              name="status"
              control={form.control}
              render={({ field, fieldState }) => (
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                >
                  {statusOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`status-${option.value}`}
                      />
                      <Label
                        htmlFor={`status-${option.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="borrowed_at_from"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Borrowed From</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(!field.value && 'text-muted-foreground')}
                      >
                        {field.value ? (
                          formatDate(field.value.toJSON())
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const toDate = form.getValues('borrowed_at_to')
                          if (!toDate) return false
                          return date >= new Date(toDate)
                        }}
                        captionLayout="dropdown"
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="borrowed_at_to"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Borrowed To</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(!field.value && 'text-muted-foreground')}
                      >
                        {field.value ? (
                          formatDate(field.value.toJSON())
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const fromDate = form.getValues('borrowed_at_from')
                          if (!fromDate) return false
                          return date <= new Date(fromDate)
                        }}
                        captionLayout="dropdown"
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </div>
          <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Export Format</p>
                <p className="text-xs mt-1">
                  The file will be exported as CSV format.
                </p>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="export-borrows-form">
            Start Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
