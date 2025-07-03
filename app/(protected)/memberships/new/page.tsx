'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Command,
  // CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { getListLibraries } from '@/lib/api/library'
import { createMembership } from '@/lib/api/membership'
import { useRouter } from 'next/navigation'
import { Library } from '@/lib/types/library'
import { Input } from '@/components/ui/input'

const FormSchema = z.object({
  library_id: z
    .string({
      required_error: 'Please select a library.',
    })
    .uuid(),
  name: z
    .string({
      required_error: 'Please name the membership.',
    })
    .nonempty(),
  loan_period: z.coerce
    .number({
      required_error: 'Loan period is required.',
    })
    .min(1),
  duration: z.coerce
    .number({
      required_error: 'Duration is required.',
    })
    .min(1),
  active_loan_limit: z.coerce
    .number({
      required_error: 'Active loan limit is required.',
    })
    .min(1, 'Active loan limit must be at least 1.'),
  fine_per_day: z.coerce.number({
    required_error: 'Fine per day is required.',
  }),
  price: z.coerce.number(),
  usage_limit: z.coerce.number(),
})

export default function ComboboxForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      library_id: '',
      name: '',
      loan_period: 1,
      duration: 1,
      active_loan_limit: 1,
      fine_per_day: 0,
      price: 0,
      usage_limit: 0,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createMembership(data)
      .then(() => {
        toast('Membership Created')
        router.push('/memberships')
      })
      .catch((e) => {
        toast.error(e?.error)
      })
  }

  const onReset = useCallback(() => {
    form.reset()
  }, [form])

  const [libQ, setLibQ] = useState('')
  const [libs, setLibs] = useState<Library[]>([])

  useEffect(() => {
    getListLibraries({
      limit: 20,
      name: libQ,
    }).then((res) => {
      if ('error' in res) {
        toast.error(res.message)
        return
      }
      setLibs(res.data)
    })
  }, [libQ])

  return (
    <div className="grid grid-rows-2">
      <h1 className="text-2xl font-semibold">Create New Membership</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/memberships" passHref legacyBehavior>
              <BreadcrumbLink>Memberships</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>New</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid place-items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-2"
          >
            <FormField
              control={form.control}
              name="library_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Library</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? libs.find((lib) => lib.id === field.value)?.name
                            : 'Select Library'}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          onValueChange={setLibQ}
                          value={libQ}
                          placeholder="Search library name..."
                        />
                        <CommandList>
                          {/* <CommandEmpty>No user found.</CommandEmpty> */}
                          <CommandGroup forceMount>
                            {libs.map((lib) => (
                              <CommandItem
                                value={lib.id}
                                key={lib.id}
                                onSelect={() => {
                                  form.setValue('library_id', lib.id)
                                }}
                              >
                                {lib.name}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    lib.id === field.value
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
                  {/* <FormDescription>
                    This is the language that will be used in the dashboard.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    How would you like to name this membership?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="Days" type="number" {...field} />
                  </FormControl>
                  <FormDescription>How long is the membership?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loan_period"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Borrow Period</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Days"
                      type="number"
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    How many days can a book be borrowed?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active_loan_limit"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Active Limit</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Days"
                      type="number"
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    How many books can be borrowed at a time?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fine_per_day"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fine per Day</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pts"
                      type="number"
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    How much is the fine per day?
                  </FormDescription>
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
                  <FormDescription>
                    How many times can a membership be used?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pts"
                      type="number"
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    How much does the membership cost?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="reset" variant="ghost" onClick={onReset}>
              Reset
            </Button>
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
