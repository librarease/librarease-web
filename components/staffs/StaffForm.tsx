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
import { useCallback, useEffect, useState } from 'react'
import { getListUsers } from '@/lib/api/user'
import { User } from '@/lib/types/user'
import { Library } from '@/lib/types/library'
import { getListLibraries } from '@/lib/api/library'
import { Input } from '@/components/ui/input'
import { Staff } from '@/lib/types/staff'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type StaffFormValues = Pick<
  Staff,
  'name' | 'role' | 'library_id' | 'user_id'
>

type StaffFormProps = {
  initialData: StaffFormValues
  onSubmit(data: StaffFormValues): void
}

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
  role: z.union([z.literal('ADMIN'), z.literal('STAFF')]),
})

export const StaffForm: React.FC<StaffFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData,
  })

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
        toast.error(res.message)
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
        toast.error(res.message)
        return
      }
      setLibs(res.data)
    })
  }, [libQ])

  return (
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
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
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

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a staff role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="STAFF">STAFF</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectContent>
                </Select>
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
  )
}
