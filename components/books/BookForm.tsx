'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getListLibraries } from '@/lib/api/library'
import { Library } from '@/lib/types/library'
import {
  useState,
  useEffect,
  useCallback,
  useActionState,
  startTransition,
} from 'react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { Book } from '@/lib/types/book'
import { Spinner } from '../ui/spinner'
import { Textarea } from '../ui/textarea'

export type BookFormValues = Pick<
  Book,
  'title' | 'author' | 'year' | 'code' | 'library_id' | 'cover' | 'description'
> & {
  id?: string
  imageFile?: FileList
}

type BookFormState = { message: string } | { error: string }

type BookFormProps = {
  initialData: BookFormValues
  onSubmitAction(
    currentState: BookFormState,
    data: FormData
  ): Promise<BookFormState>
}

export const BookForm: React.FC<BookFormProps> = ({
  initialData,
  onSubmitAction,
}) => {
  const FormSchema = z.object({
    title: z
      .string({
        error: (issue) =>
          issue.input === undefined ? 'Please enter book title.' : undefined,
      })
      .nonempty(),
    author: z
      .string({
        error: (issue) =>
          issue.input === undefined ? 'Please enter author name.' : undefined,
      })
      .nonempty(),
    year: z.coerce
      .number<number>({
        error: (issue) =>
          issue.input === undefined ? 'Please enter year.' : undefined,
      })
      .gt(1000, 'Please enter valid year.'),
    code: z
      .string({
        error: (issue) =>
          issue.input === undefined ? 'Please set a code for book.' : undefined,
      })
      .nonempty(),
    library_id: z.uuid(),
    cover: z.string().optional(),
    imageFile: z
      .custom<FileList>()
      .optional()
      .refine((v) => !v || v.length > 0, 'File required'),
    description: z.string().optional(),
  })

  type FormValues = z.infer<typeof FormSchema>
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: initialData.title,
      author: initialData.author,
      year: initialData.year,
      code: initialData.code,
      library_id: initialData.library_id,
      cover: initialData.cover,
      description: initialData.description,
    },
  })

  const cover = form.watch('cover')
  const imageFile = form.watch('imageFile')

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

  const onReset = useCallback(() => {
    form.reset()
  }, [form])

  const [state, formAction, isPending] = useActionState(onSubmitAction, {
    message: '',
    error: '',
  })

  function onSubmit(data: BookFormValues) {
    startTransition(() => {
      const formData = new FormData()
      if (initialData.id) {
        formData.append('id', initialData.id)
      }

      formData.append('title', data.title)
      formData.append('author', data.author)
      formData.append('year', data.year.toString())
      formData.append('code', data.code)
      formData.append('library_id', data.library_id)
      if (data.imageFile && data.imageFile.length > 0) {
        formData.append('imageFile', data.imageFile[0])
      }
      formData.append('description', data.description ?? '')
      formAction(formData)
    })
  }

  useEffect(() => {
    if ('error' in state && state.error) {
      toast.error(state.error, { richColors: true })
    }
    if ('message' in state && state.message) {
      toast.success(state.message, { richColors: true })
    }
  }, [state])

  return (
    <div className="grid place-items-center">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-2"
      >
        <Controller
          control={form.control}
          name="library_id"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex flex-col">
              <FieldLabel>Library</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
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
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex flex-col">
              <FieldLabel>Title</FieldLabel>
              <Input placeholder="Title" {...field} onChange={field.onChange} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="author"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex flex-col">
              <FieldLabel>Author</FieldLabel>
              <Input placeholder="Name" {...field} onChange={field.onChange} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="year"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex flex-col">
              <FieldLabel>Year</FieldLabel>
              <Input placeholder="Year" {...field} onChange={field.onChange} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="code"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex flex-col">
              <FieldLabel>Code</FieldLabel>
              <Input placeholder="Code" {...field} onChange={field.onChange} />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {cover && !imageFile?.length && (
          <Image
            className="w-12 h-auto rounded col-span-2"
            src={cover}
            alt={initialData.title}
            width={50}
            height={50}
          />
        )}

        <Controller
          control={form.control}
          name="imageFile"
          render={({ field: { onChange, value, ...field }, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col col-span-2"
            >
              <FieldLabel>Cover Image (File)</FieldLabel>
              <Input
                type="file"
                accept="image/*"
                {...field}
                onChange={(e) => {
                  const files = e.target.files
                  if (files && files.length > 0) {
                    onChange(files)
                  } else {
                    onChange(undefined)
                  }
                }}
              />
              {imageFile && (
                <Image
                  className="w-12! h-auto rounded"
                  src={URL.createObjectURL(imageFile[0])}
                  alt={form.getValues('title')}
                  width={50}
                  height={50}
                />
              )}
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col col-span-2"
            >
              <FieldLabel>Description</FieldLabel>
              <Textarea
                placeholder="Description"
                {...field}
                onChange={field.onChange}
                rows={4}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="reset" variant="ghost" onClick={onReset}>
          Reset
        </Button>
        <Button
          disabled={form.formState.isSubmitting || isPending}
          type="submit"
        >
          {isPending ? <Spinner /> : 'Submit'}
        </Button>
      </form>
    </div>
  )
}
