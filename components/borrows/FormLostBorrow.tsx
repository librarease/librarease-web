'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useCallback, useTransition } from 'react'
import { lostBorrowAction } from '@/lib/actions/lost-borrow'
import { Textarea } from '../ui/textarea'
import { Spinner } from '../ui/spinner'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn, formatDate } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { TimeInput } from '../ui/time-input'
import { BorrowDetail } from '@/lib/types/borrow'

const FormSchema = z.object({
  id: z.uuid(),
  reported_at: z.date(),
  note: z.string().nonempty(),
  fine: z.coerce.number<number>().nonnegative(),
})

export const FormLostBorrow: React.FC<{
  borrow: BorrowDetail
}> = ({ borrow }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      id: borrow.id,
      reported_at: new Date(),
      note: '',
      fine: 0,
    },
  })

  const [isPending, startTransition] = useTransition()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const msg = await lostBorrowAction({
        id: data.id,
        reported_at: new Date().toJSON(),
        note: data.note,
        fine: data.fine,
      })
      if ('error' in msg) {
        toast.error(msg.error, { richColors: true })
      } else {
        toast.success(msg.message)
      }
    })
  }

  const onReset = useCallback(() => {
    form.reset()
  }, [form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2">
        <FormField
          control={form.control}
          name="reported_at"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Reported Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(!field.value && 'text-muted-foreground')}
                    >
                      {field.value ? (
                        formatDate(field.value.toJSON(), {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(borrow.borrowed_at)}
                    captionLayout="dropdown"
                    autoFocus
                  />
                  <TimeInput
                    value={field.value.toJSON()}
                    onChange={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Remarks"
                  {...field}
                  onChange={field.onChange}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fine"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fine</FormLabel>
              <FormControl>
                <Input
                  placeholder="Pts"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="reset" variant="ghost" onClick={onReset}>
          Reset
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          Submit
        </Button>
      </form>
    </Form>
  )
}
