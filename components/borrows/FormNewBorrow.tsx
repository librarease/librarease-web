'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
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

import { useCallback, useEffect, useState } from 'react'
import { getListUsers } from '@/lib/api/user'
import { User } from '@/lib/types/user'
import { Book } from '@/lib/types/book'
import { getListBooks } from '@/lib/api/book'
import { Subscription } from '@/lib/types/subscription'
import { getListSubs } from '@/lib/api/subscription'
import { Staff } from '@/lib/types/staff'
import { getListStaffs } from '@/lib/api/staff'
import { createBorrow } from '@/lib/api/borrow'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from '@/components/hooks/use-toast'

const FormSchema = z.object({
  user_id: z.string({
    required_error: 'Please select a user.',
  }),
  book_id: z.string({
    required_error: 'Please select a book.',
  }),
  subscription_id: z.string({
    required_error: 'Please select a subscription.',
  }),
  staff_id: z.string({
    required_error: 'Please select a staff.',
  }),
})

export const FormNewBorrow: React.FC = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createBorrow(data)
      .then(console.log)
      .then(() => {
        toast({
          title: 'You submitted the following values:',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          ),
        })
        router.push('/borrows')
      })
      .catch((e) => {
        toast({
          title: 'Error',
          description: e?.error,
          variant: 'destructive',
        })
      })
  }

  const onReset = useCallback(() => {
    form.reset()
  }, [form])

  const [userQ, setUserQ] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const selectedUser = form.watch('user_id')

  useEffect(() => {
    getListUsers({
      limit: 20,
      name: userQ,
    }).then((res) => {
      if ('error' in res) {
        toast({
          title: 'Error',
          description: res.message,
        })
        return
      }
      setUsers(res.data)
    })
  }, [userQ])

  const [bookQ, setBookQ] = useState('')
  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    getListBooks({
      limit: 20,
      title: bookQ,
    }).then((res) => {
      if ('error' in res) {
        toast({
          title: 'Error',
          description: res.message,
        })
        return
      }
      setBooks(res.data)
    })
  }, [bookQ])

  const [subQ, setSubQ] = useState('')
  const [subs, setSubs] = useState<Subscription[]>([])

  useEffect(() => {
    getListSubs({
      limit: 20,
      user_id: selectedUser,
      membership_name: subQ,
      is_active: true,
    }).then((res) => {
      if ('error' in res) {
        toast({
          title: 'Error',
          description: res.message,
        })
        return
      }
      setSubs(res.data)
    })
  }, [subQ, selectedUser])

  const [staffQ, setStaffQ] = useState('')
  const [staffs, setStaffs] = useState<Staff[]>([])

  useEffect(() => {
    getListStaffs({
      limit: 20,
      name: staffQ,
    }).then((res) => {
      if ('error' in res) {
        toast({
          title: 'Error',
          description: res.message,
        })
        return
      }
      setStaffs(res.data)
    })
  }, [staffQ])

  return (
    <div className="grid place-items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-2"
        >
          <FormField
            control={form.control}
            name="book_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Book</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-[200px] justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? books.find((book) => book.id === field.value)?.title
                          : 'Select Book'}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        onValueChange={setBookQ}
                        value={bookQ}
                        placeholder="Search book title..."
                      />
                      <CommandList>
                        {/* <CommandEmpty>No user found.</CommandEmpty> */}
                        <CommandGroup forceMount>
                          {books.map((book) => (
                            <CommandItem
                              value={book.id}
                              key={book.id}
                              onSelect={() => {
                                form.setValue('book_id', book.id)
                              }}
                            >
                              {book.title}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  book.id === field.value
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
            name="user_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>User</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-[200px] justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? users.find((user) => user.id === field.value)?.name
                          : 'Select user'}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        onValueChange={setUserQ}
                        value={userQ}
                        placeholder="Search user name..."
                      />
                      <CommandList>
                        {/* <CommandEmpty>No user found.</CommandEmpty> */}
                        <CommandGroup forceMount>
                          {users.map((user) => (
                            <CommandItem
                              value={user.id}
                              key={user.id}
                              onSelect={() => {
                                form.setValue('user_id', user.id)
                              }}
                            >
                              {user.name}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  user.id === field.value
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
            name="subscription_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Subscription</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-[200px] justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                        disabled={!selectedUser}
                      >
                        {field.value
                          ? subs.find((sub) => sub.id === field.value)
                              ?.membership.name
                          : 'Select subscription'}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        onValueChange={setSubQ}
                        value={subQ}
                        placeholder="Search subscription..."
                      />
                      <CommandList>
                        {/* <CommandEmpty>No user found.</CommandEmpty> */}
                        <CommandGroup forceMount>
                          {subs.map((sub) => (
                            <CommandItem
                              value={sub.id}
                              key={sub.id}
                              onSelect={() => {
                                form.setValue('subscription_id', sub.id)
                              }}
                            >
                              {sub.membership.name}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  sub.id === field.value
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
            name="staff_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Staff</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-[200px] justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? staffs.find((staff) => staff.id === field.value)
                              ?.name
                          : 'Select Staff'}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        onValueChange={setStaffQ}
                        value={staffQ}
                        placeholder="Search staff name..."
                      />
                      <CommandList>
                        {/* <CommandEmpty>No user found.</CommandEmpty> */}
                        <CommandGroup forceMount>
                          {staffs.map((staff) => (
                            <CommandItem
                              value={staff.id}
                              key={staff.id}
                              onSelect={() => {
                                form.setValue('staff_id', staff.id)
                              }}
                            >
                              {staff.name}
                              <Check
                                className={cn(
                                  'ml-auto',
                                  staff.id === field.value
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

          <Button type="reset" variant="ghost" onClick={onReset}>
            Reset
          </Button>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}
