'use client'

import { BorrowDetail } from '@/lib/types/borrow'
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
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { cn, formatDate } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { Input } from '../ui/input'
import { useCallback, useTransition } from 'react'
import { updateBorrowAction } from '@/lib/actions/update-borrow'
import { TimeInput } from '../ui/time-input'
import { Textarea } from '../ui/textarea'
import { Separator } from '../ui/separator'
import { BtnDeleteBorrow } from './BtnDeleteBorrow'

const FormSchema = z.object({
  id: z.string({
    error: (issue) =>
      issue.input === undefined ? 'Please select a borrow.' : undefined,
  }),
  borrowed_at: z.string(),
  due_at: z.string(),
  returning: z
    .object({
      returned_at: z.string(),
      fine: z.coerce.number<number>().nonnegative(),
    })
    .optional(),
  lost: z
    .object({
      reported_at: z.string(),
      fine: z.coerce.number<number>().nonnegative(),
      note: z.string(),
    })
    .optional(),
})

export const FormEditBorrow: React.FC<{
  borrow: BorrowDetail
}> = ({ borrow }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: borrow,
  })

  const [isPending, startTransition] = useTransition()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const res = await updateBorrowAction(data)
      if ('error' in res) {
        toast.error(res.error)
        return
      }
      toast('Borrow updated successfully')
    })
  }

  const onReset = useCallback(() => {
    form.reset()
  }, [form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid md:grid-cols-2 gap-2"
      >
        <FormField
          control={form.control}
          name="borrowed_at"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Borrow Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(!field.value && 'text-muted-foreground')}
                    >
                      {field.value ? (
                        formatDate(field.value, {
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
                    onSelect={(v) => field.onChange(v?.toISOString())}
                    disabled={(date) =>
                      date > new Date(form.getValues('due_at')) ||
                      date < new Date('1900-01-01')
                    }
                    captionLayout="dropdown"
                    autoFocus
                  />
                  <Input
                    className="max-w-max mx-auto mb-2"
                    type="time"
                    value={(() => {
                      const d = new Date(field.value)
                      const hh = String(d.getHours()).padStart(2, '0')
                      const mm = String(d.getMinutes()).padStart(2, '0')
                      return `${hh}:${mm}`
                    })()}
                    onChange={(e) => {
                      const [hh = 0, mm = 0] = e.target.value
                        .split(':')
                        .map(Number)
                      const d = new Date(field.value)
                      d.setHours(hh, mm)
                      field.onChange(d.toISOString())
                    }}
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="due_at"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(!field.value && 'text-muted-foreground')}
                    >
                      {field.value ? (
                        formatDate(field.value, {
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
                    onSelect={(v) => field.onChange(v?.toISOString())}
                    disabled={(date) =>
                      date < new Date(form.getValues('borrowed_at'))
                    }
                    captionLayout="dropdown"
                    autoFocus
                  />
                  <TimeInput value={field.value} onChange={field.onChange} />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
        {borrow.returning ? (
          <>
            <Separator className="my-2 col-span-2" />
            <FormField
              control={form.control}
              name="returning.returned_at"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Return Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            formatDate(field.value, {
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
                        selected={new Date(field.value ?? '')}
                        onSelect={(v) => field.onChange(v?.toISOString())}
                        disabled={(date) =>
                          date < new Date(form.getValues('borrowed_at'))
                        }
                        captionLayout="dropdown"
                        autoFocus
                      />
                      <TimeInput
                        value={field.value ?? ''}
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
              name="returning.fine"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fine</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pts"
                      type="number"
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : null}
        {borrow.lost ? (
          <>
            <Separator className="my-2 col-span-2" />
            <FormField
              control={form.control}
              name="lost.reported_at"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Lost Reported Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            formatDate(field.value, {
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
                        selected={new Date(field.value ?? '')}
                        onSelect={(v) => field.onChange(v?.toISOString())}
                        disabled={(date) =>
                          date < new Date(form.getValues('borrowed_at'))
                        }
                        captionLayout="dropdown"
                        autoFocus
                      />
                      <TimeInput
                        value={field.value ?? ''}
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
              name="lost.fine"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fine</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pts"
                      type="number"
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lost.note"
              render={({ field }) => (
                <FormItem className="flex flex-col col-span-2">
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Note"
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : null}
        <Separator className="my-2 col-span-2" />
        <BtnDeleteBorrow
          type="button"
          className="col-span-2"
          borrow={borrow}
          variant="secondary"
        />
        <Button type="reset" variant="ghost" onClick={onReset}>
          Reset
        </Button>
        <Button type="submit" disabled={!form.formState.isDirty || isPending}>
          Submit
        </Button>
      </form>
    </Form>
  )
}
