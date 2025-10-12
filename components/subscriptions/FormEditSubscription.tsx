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
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { cn, formatDate } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../ui/calendar'
import { Input } from '../ui/input'
import { useCallback, useTransition } from 'react'
import { TimeInput } from '../ui/time-input'
import { Separator } from '../ui/separator'
import { BtnDeleteSubscription } from './BtnDeleteSubscription'
import { SubscriptionDetail } from '@/lib/types/subscription'
import { updateSubscriptionAction } from '@/lib/actions/update-subscription'

const FormSchema = z
  .object({
    id: z.string(),
    expires_at: z.string(),
    amount: z.coerce.number<number>().nonnegative(),
    loan_period: z.coerce.number<number>().positive(),
    active_loan_limit: z.coerce.number<number>().nonnegative(),
    usage_limit: z.coerce.number<number>().nonnegative(),
    fine_per_day: z.coerce.number<number>().nonnegative(),
  })
  .superRefine((data, ctx) => {
    // active loan limit must be equal or less than usage limit
    if (data.active_loan_limit > data.usage_limit) {
      ctx.addIssue({
        code: 'custom',
        message: 'Active loan limit must be equal or less than usage limit',
        path: ['active_loan_limit'],
      })
    }
  })

export const FormEditSubscription: React.FC<{
  sub: SubscriptionDetail
}> = ({ sub }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: sub,
  })

  const [isPending, startTransition] = useTransition()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const res = await updateSubscriptionAction(data)
      if ('error' in res) {
        toast.error(res.error)
        return
      }
      toast(res.message)
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
          name="expires_at"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiration Date</FormLabel>
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
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Amount</FormLabel>
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
          name="loan_period"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Loan Period</FormLabel>
              <FormControl>
                <Input
                  placeholder="Days"
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
          name="active_loan_limit"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Active Loan Limit</FormLabel>
              <FormControl>
                <Input
                  placeholder="Books"
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
          name="usage_limit"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Usage Limit</FormLabel>
              <FormControl>
                <Input
                  placeholder="Times"
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
          name="fine_per_day"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fine Per Day</FormLabel>
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
        <Separator className="my-2 col-span-2" />
        <BtnDeleteSubscription
          type="button"
          className="col-span-2"
          sub={sub}
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
