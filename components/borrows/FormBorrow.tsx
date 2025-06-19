'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  QrCode,
  Search,
  UserIcon,
  BookIcon,
  Scan,
  CheckCircle2,
  ChevronsUpDown,
  Check,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
  const [subQ, setSubQ] = useState('')
  const [subs, setSubs] = useState<Subscription[]>([])
  const selectedSubscription = form.watch('subscription_id')

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

  // books

  const [bookQ, setBookQ] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const selectedBook = form.watch('book_id')

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

  const [scannedSubscription, setScannedSubscription] =
    useState<Subscription | null>(
      subs.find((sub) => sub.id === selectedSubscription) || null
    )
  const [scannedBook, setScannedBook] = useState<Book | null>(
    books.find((book) => book.id === selectedBook) || null
  )
  const [isScanning, setIsScanning] = useState<'subscription' | 'book' | null>(
    null
  )

  const simulateQRScan = (type: 'subscription' | 'book') => {
    setIsScanning(type)
    // Simulate scanning delay
    setTimeout(() => {
      if (type === 'subscription') {
        setScannedSubscription(
          subs.find((sub) => sub.id === selectedSubscription) || null
        )
      } else {
        setScannedBook(books[0])
      }
      setIsScanning(null)
    }, 5000)
  }

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
                      {/* <FormDescription>
                                      This is the language that will be used in the dashboard.
                                    </FormDescription> */}
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
                    <QrCode className="h-5 w-5" />
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
                      <FormItem className="space-y-2 max-h-72 overflow-y-scroll">
                        <Input
                          type="text"
                          value={subQ}
                          onChange={(e) => setSubQ(e.target.value)}
                          placeholder="Search subscription..."
                          className="mb-4 sticky top-0"
                        />
                        {subs.map((sub) => (
                          <div
                            key={sub.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedSubscription === sub.id
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
                              <Badge variant="outline">
                                Expires:&nbsp;
                                <DateTime dateTime={sub.expires_at} />
                              </Badge>
                            </div>
                          </div>
                        ))}
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
                      <FormItem className="space-y-2 max-h-72 overflow-y-scroll">
                        <Input
                          type="text"
                          value={bookQ}
                          onChange={(e) => setBookQ(e.target.value)}
                          placeholder="Search book title..."
                          className="mb-4 sticky top-0"
                        />
                        {books.map((book) => (
                          <div
                            key={book.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedBook === book.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => field.onChange(book.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{book.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {book.author}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Code: {book.code}
                                </p>
                              </div>
                              <Badge variant="secondary">Available</Badge>
                            </div>
                          </div>
                        ))}
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
                    <UserIcon className="h-5 w-5" />
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
                        {/* <FormDescription>
                                      This is the language that will be used in the dashboard.
                                    </FormDescription> */}
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Scan Subscription QR
                  </CardTitle>
                  <CardDescription>
                    Scan the user&apos;s subscription QR code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!scannedSubscription ? (
                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <Scan className="h-12 w-12 text-muted-foreground mb-4" />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => simulateQRScan('subscription')}
                            disabled={isScanning === 'subscription'}
                          >
                            {isScanning === 'subscription'
                              ? 'Scanning...'
                              : 'Start Scanning'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Scanning Subscription QR Code
                            </DialogTitle>
                            <DialogDescription>
                              Point your camera at the subscription QR code
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center justify-center py-8">
                            <div className="w-64 h-64 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
                              <Scan className="h-16 w-16 text-primary animate-pulse" />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">
                          Subscription Scanned
                        </span>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">
                          {scannedSubscription.membership.name}
                        </p>
                        <p className="text-muted-foreground">
                          {scannedSubscription.membership.library.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Active loans limit:{' '}
                          {scannedSubscription.active_loan_limit}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookIcon className="h-5 w-5" />
                    Scan Book QR
                  </CardTitle>
                  <CardDescription>
                    Scan the book&apos;s QR code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!scannedBook ? (
                    <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <Scan className="h-12 w-12 text-muted-foreground mb-4" />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => simulateQRScan('book')}
                            disabled={isScanning === 'book'}
                          >
                            {isScanning === 'book'
                              ? 'Scanning...'
                              : 'Start Scanning'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Scanning Book QR Code</DialogTitle>
                            <DialogDescription>
                              Point your camera at the book&apos;s QR code
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center justify-center py-8">
                            <div className="w-64 h-64 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
                              <Scan className="h-16 w-16 text-primary animate-pulse" />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">
                          Book Scanned
                        </span>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">{scannedBook.title}</p>
                        <p className="text-muted-foreground">
                          {scannedBook.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Code: {scannedBook.code}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="old" className="space-y-6">
            <FormNewBorrow />
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />

        <div className="flex justify-between items-center">
          <Button type="reset" variant="outline" onClick={onReset}>
            Cancel
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
