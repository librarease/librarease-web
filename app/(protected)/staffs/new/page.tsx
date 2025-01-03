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
import { getListUsers } from '@/lib/api/user'
import { User } from '@/lib/types/user'
import { useRouter } from 'next/navigation'
import { createStaff } from '@/lib/api/staff'
import { Library } from '@/lib/types/library'
import { getListLibraries } from '@/lib/api/library'
import { Input } from '@/components/ui/input'

const FormSchema = z.object({
  user_id: z
    .string({
      required_error: 'Please select a user.',
    })
    .nonempty(),
  library_id: z
    .string({
      required_error: 'Please select a library.',
    })
    .nonempty(),
  name: z
    .string({
      required_error: 'Please enter staff name.',
    })
    .nonempty(),
})

export default function ComboboxForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      library_id: '',
      user_id: '',
      name: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createStaff(data)
      .then(console.log)
      .then(() => {
        toast({
          title: 'Assigned Staff to Library',
          description: `${data.name} has been assigned to the library.`,
        })
        router.push('/staffs')
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

  return (
    <div className="grid grid-rows-2">
      <h1 className="text-2xl font-semibold">Assign a Staff</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/staffs" passHref legacyBehavior>
              <BreadcrumbLink>Staffs</BreadcrumbLink>
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
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col col-span-2">
                  <FormLabel>Name</FormLabel>
                  <Input placeholder="Name" {...field} />
                  <FormDescription>
                    What is the name of the staff?
                  </FormDescription>
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
                            ? users.find((u) => u.id === field.value)?.name
                            : 'Select User'}
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
                            'w-[200px] justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? libs.find((lib) => lib.id === field.value)?.name
                            : 'Select library'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
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

            <Button type="reset" variant="ghost" onClick={onReset}>
              Reset
            </Button>
            <Button type="submit">Assign</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
