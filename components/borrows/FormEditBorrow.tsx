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
import { useToast } from '../hooks/use-toast'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { cn, formatDate } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { Input } from '../ui/input'
import { useCallback, useTransition } from 'react'
import { actionUpdateBorrow } from '@/lib/actions/update-borrow'

const FormSchema = z.object({
  id: z.string({
    required_error: 'Please select a borrow.',
  }),
  borrowed_at: z.string(),
  due_at: z.string(),
  returning: z
    .object({
      returned_at: z.string(),
      fine: z.coerce.number().nonnegative(),
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
  const { toast } = useToast()

  const [isPending, startTransition] = useTransition()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const res = await actionUpdateBorrow(data)
      if ('error' in res) {
        toast({
          title: 'Failed to update borrow',
          description: res.error,
          variant: 'destructive',
        })
        return
      }
      toast({
        title: 'Success',
        description: 'Borrow updated successfully',
      })
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
                        formatDate(field.value)
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
                    initialFocus
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
                        formatDate(field.value)
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
        {borrow.returning ? (
          <>
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
                            formatDate(field.value)
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
                        initialFocus
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
                  <Input
                    placeholder="Pts"
                    type="number"
                    {...field}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : null}
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
