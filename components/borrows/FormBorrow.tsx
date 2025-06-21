'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  QrCode,
  Search,
  UserIcon,
  BookIcon,
  CheckCircle2,
  ChevronsUpDown,
  Check,
  CreditCard,
  UserCog,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { User } from '@/lib/types/user'
import { getListUsers } from '@/lib/api/user'
import { toast } from '../hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBorrow } from '@/lib/api/borrow'
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
import { cn } from '@/lib/utils'
import { getListSubs } from '@/lib/api/subscription'
import { Subscription } from '@/lib/types/subscription'
import { FormNewBorrow } from './FormNewBorrow'
import { Input } from '../ui/input'
import { DateTime } from '../common/DateTime'
import { Book } from '@/lib/types/book'
import { getListBooks } from '@/lib/api/book'
import { Staff } from '@/lib/types/staff'
import { getListStaffs } from '@/lib/api/staff'
import { Scanner } from '../common/Scanner'
import Image from 'next/image'

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

type FormBorrowProps = {
  id: string
  role: 'USER' | 'ADMIN' | 'SUPERADMIN'
  admin_libs: string[]
  staff_libs: string[]
}

export const FormBorrow: React.FC<FormBorrowProps> = (props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedMethod = searchParams.get('tab') || 'manual'
  const setSelectedMethod = (value: 'manual' | 'qr') => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('tab', value)
    router.replace(`?${newParams.toString()}`)
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'all',
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

  // user
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

  // subscriptions
  const [subQ, setSubQ] = useState<
    Pick<Parameters<typeof getListSubs>[0], 'membership_name' | 'id'>
  >({
    membership_name: '',
    id: '',
  })
  const [subs, setSubs] = useState<Subscription[]>([])
  const selectedSubscription = subs.find(
    (sub) => sub.id === form.watch('subscription_id')
  )

  useEffect(() => {
    getListSubs({
      limit: 20,
      user_id: selectedUser,
      is_active: true,
      ...subQ,
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

  // books
  const [bookQ, setBookQ] = useState<
    Pick<Parameters<typeof getListBooks>[0], 'title' | 'id'>
  >({
    title: '',
    id: '',
  })
  const [books, setBooks] = useState<Book[]>([])

  const selectedBook = books.find((book) => book.id === form.watch('book_id'))

  useEffect(() => {
    getListBooks({
      limit: 20,
      ...bookQ,
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

  // staffs

  const [staffQ, setStaffQ] = useState('')
  const [staffs, setStaffs] = useState<Staff[]>([])

  useEffect(() => {
    getListStaffs({
      limit: 20,
      name: staffQ,
      user_id: props.id,
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
  }, [staffQ, props.id])
  const selectedStaff = form.watch('staff_id')

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container mx-auto p-6 max-w-4xl"
      >
        <Tabs
          value={selectedMethod}
          onValueChange={(value) => setSelectedMethod(value as 'manual' | 'qr')}
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Manual Selection
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Code Scan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle
                  className={cn(
                    'flex items-center gap-2',
                    selectedUser && 'text-primary'
                  )}
                >
                  <UserIcon className="h-5 w-5" />
                  Step 1: Select User
                </CardTitle>
                <CardDescription>
                  Choose the user who wants to borrow a book
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                                'justify-between',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? users.find((user) => user.id === field.value)
                                    ?.name
                                : 'Select user'}
                              <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {selectedUser && (
              <Card>
                <CardHeader>
                  <CardTitle
                    className={cn(
                      'flex items-center gap-2',
                      selectedSubscription && 'text-primary'
                    )}
                  >
                    <CreditCard className="h-5 w-5" />
                    Step 2: Select Subscription
                  </CardTitle>
                  <CardDescription>
                    Choose from available subscriptions for this user
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="subscription_id"
                    render={({ field }) => (
                      <FormItem>
                        <Input
                          type="text"
                          value={subQ.membership_name}
                          onChange={(e) =>
                            setSubQ({ membership_name: e.target.value })
                          }
                          placeholder="Search subscription..."
                        />
                        <div className="space-y-2 max-h-72 overflow-y-scroll">
                          {subs.map((sub) => (
                            <div
                              key={sub.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedSubscription?.id === sub.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => field.onChange(sub.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">
                                    {sub.membership.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {sub.membership.library.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Active loans limit: {sub.active_loan_limit}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="hidden md:block"
                                >
                                  Expires:&nbsp;
                                  <DateTime dateTime={sub.expires_at} />
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {selectedSubscription && (
              <Card>
                <CardHeader>
                  <CardTitle
                    className={cn(
                      'flex items-center gap-2',
                      selectedBook && 'text-primary'
                    )}
                  >
                    <BookIcon className="h-5 w-5" />
                    Step 3: Select Book
                  </CardTitle>
                  <CardDescription>Choose a book to borrow</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* <div className="space-y-3">
                    {availableBooks.map((book) => (
                      <div
                        key={book.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedBook === book.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedBook(book.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{book.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {book.author}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ISBN: {book.isbn}
                            </p>
                          </div>
                          <Badge variant="secondary">Available</Badge>
                        </div>
                      </div>
                    ))}
                  </div> */}
                  <FormField
                    control={form.control}
                    name="book_id"
                    render={({ field }) => (
                      <FormItem className="">
                        <Input
                          type="text"
                          value={bookQ.title}
                          onChange={(e) => setBookQ({ title: e.target.value })}
                          placeholder="Search book title..."
                        />
                        <div className="space-y-2 max-h-72 overflow-y-scroll">
                          {books.map((book) => (
                            <div
                              key={book.id}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedBook?.id === book.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              onClick={() => field.onChange(book.id)}
                            >
                              <div className="flex gap-4">
                                {book.cover && (
                                  <div className="w-12 h-auto">
                                    <Image
                                      src={book.cover}
                                      alt={book.title + "'s cover"}
                                      width={50}
                                      height={50}
                                      className="rounded"
                                    />
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-medium">{book.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {book.author}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Code: {book.code}
                                  </p>
                                </div>
                                {/* <Badge variant="secondary">Available</Badge> */}
                              </div>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {selectedBook && (
              <Card>
                <CardHeader>
                  <CardTitle
                    className={cn(
                      'flex items-center gap-2',
                      selectedStaff && 'text-primary'
                    )}
                  >
                    <UserCog className="h-5 w-5" />
                    Step 4: Select Staff
                  </CardTitle>
                  <CardDescription>
                    Choose the staff who will process this borrow
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                                  'justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? staffs.find(
                                      (staff) => staff.id === field.value
                                    )?.name
                                  : 'Select staff'}
                                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="qr" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="subscription_id"
                render={({ field }) => (
                  <Scanner
                    title="Scan Subscription QR"
                    description="Select to scan subscription QR code"
                    onChange={(id) => {
                      setSubQ({ id })
                      field.onChange(id)
                    }}
                  >
                    {selectedSubscription && (
                      <div className="p-4 border border-primary/40 bg-primary/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span className="font-medium text-primary">
                            Subscription Scanned
                          </span>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">
                            {selectedSubscription.membership.name}
                          </p>
                          <p className="text-muted-foreground">
                            {selectedSubscription.membership.library.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Borrow Period:&nbsp;
                            {selectedSubscription.loan_period}&nbsp;Days
                          </p>
                        </div>
                      </div>
                    )}
                  </Scanner>
                )}
              />

              <FormField
                control={form.control}
                name="book_id"
                render={({ field }) => (
                  <Scanner
                    title="Scan Book QR"
                    description="Select to scan book QR code"
                    onChange={(id) => {
                      setBookQ({ id })
                      field.onChange(id)
                    }}
                  >
                    {selectedBook && (
                      <div className="p-4 border border-primary/40 bg-primary/5 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span className="font-medium text-primary">
                            Book Scanned
                          </span>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{selectedBook.title}</p>
                          <p className="text-muted-foreground">
                            {selectedBook.library?.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Author:&nbsp;
                            {selectedBook.author}
                          </p>
                        </div>
                      </div>
                    )}
                  </Scanner>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="old" className="space-y-6">
            <FormNewBorrow />
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />

        <div className="flex justify-between items-center">
          <Button type="reset" variant="outline" onClick={onReset}>
            Reset
          </Button>
          <Button
            type="submit"
            // disabled={!form.formState.isValid}
            className="flex items-center gap-2"
          >
            Create Borrow
          </Button>
        </div>
      </form>
    </Form>
  )
}
