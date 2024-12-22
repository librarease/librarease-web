'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { toast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
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
import { getListMemberships } from '@/lib/api/membership'
import { useRouter } from 'next/navigation'
import { Library } from '@/lib/types/library'
import { User } from '@/lib/types/user'
import { getListUsers } from '@/lib/api/user'
import { Membership } from '@/lib/types/membership'
import { createSubscription } from '@/lib/api/subscription'

const FormSchema = z.object({
  user_id: z
    .string({
      required_error: 'Please select user.',
    })
    .uuid(),
  library_id: z
    .string({
      required_error: 'Please select a library.',
    })
    .uuid(),
  membership_id: z
    .string({
      required_error: 'Please select a membership.',
    })
    .uuid(),
})

export default function ComboboxForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      user_id: '',
      membership_id: '',
      library_id: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createSubscription(data)
      .then(console.log)
      .then(() => {
        toast({
          title: 'Purchased Membership',
        })
        router.push('/subscriptions')
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

  const [libQ, setLibQ] = useState('')
  const [libs, setLibs] = useState<Library[]>([])

  useEffect(() => {
    getListLibraries({
      limit: 20,
      name: libQ,
    }).then((res) => {
      if ('error' in res) {
        toast({
          title: 'Error',
          description: res.message,
        })
        return
      }
      setLibs(res.data)
    })
  }, [libQ])

  const [memQ, setMemQ] = useState('')
  const [mems, setMems] = useState<Membership[]>([])

  const libID = form.getValues('library_id')

  useEffect(() => {
    getListMemberships({
      limit: 20,
      name: memQ,
      library_ids: libID,
    }).then((res) => {
      if ('error' in res) {
        toast({
          title: 'Error',
          description: res.message,
        })
        return
      }
      setMems(res.data)
    })
  }, [memQ, libID])

  return (
    <div className="grid grid-rows-2">
      <h1 className="text-2xl font-semibold">Purchase a Membership</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/subscriptions" passHref legacyBehavior>
              <BreadcrumbLink>Subscriptions</BreadcrumbLink>
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
              name="user_id"
              render={({ field }) => (
                <FormItem className="flex flex-col col-span-2">
                  <FormLabel>User</FormLabel>
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
                            ? users.find((user) => user.id === field.value)
                                ?.name
                            : 'Select user'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
              name="membership_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Membership</FormLabel>
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
                            ? mems.find((mem) => mem.id === field.value)?.name
                            : 'Select membership'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          onValueChange={setMemQ}
                          value={memQ}
                          placeholder="Search membership name..."
                        />
                        <CommandList>
                          {/* <CommandEmpty>No user found.</CommandEmpty> */}
                          <CommandGroup forceMount>
                            {mems.map((mem) => (
                              <CommandItem
                                value={mem.id}
                                key={mem.id}
                                onSelect={() => {
                                  form.setValue('membership_id', mem.id)
                                }}
                              >
                                {mem.name}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    mem.id === field.value
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
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
