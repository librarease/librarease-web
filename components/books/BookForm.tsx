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
import { getListLibraries } from '@/lib/api/library'
import { Library } from '@/lib/types/library'
import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Book } from '@/lib/types/book'

export type BookFormValues = Pick<
  Book,
  'title' | 'author' | 'year' | 'code' | 'library_id'
>

type BookFormProps = {
  initialData: BookFormValues
  onSubmit(data: BookFormValues): void
}

const FormSchema = z.object({
  title: z
    .string({
      required_error: 'Please enter book title.',
    })
    .nonempty(),
  author: z
    .string({
      required_error: 'Please enter author name.',
    })
    .nonempty(),
  year: z.coerce
    .number({
      required_error: 'Please enter year.',
    })
    .gt(1000, 'Please enter valid year.'),
  code: z
    .string({
      required_error: 'Please set a code for book.',
    })
    .nonempty(),
  library_id: z
    .string({
      required_error: 'Please select the library.',
    })
    .uuid(),
})

export const BookForm: React.FC<BookFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData,
  })

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

  const onReset = useCallback(() => {
    form.reset()
  }, [form])

  return (
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Title"
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
            name="author"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
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
            name="year"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Year"
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
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Code"
                    {...field}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="reset" variant="ghost" onClick={onReset}>
            Reset
          </Button>
          <Button disabled={form.formState.isSubmitting} type="submit">
            Create
          </Button>
        </form>
      </Form>
    </div>
  )
}
