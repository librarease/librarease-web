'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, ChevronsUpDown, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { Library } from '@/lib/types/library'
import { getListLibraries } from '@/lib/api/library'
import { toast } from 'sonner'
import Link from 'next/link'

const FormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  cover: z.string().optional(),
  library_id: z.uuid(),
})

type CollectionFormValues = z.infer<typeof FormSchema>

type FormCollectionProps = {
  initialData: CollectionFormValues
  onSubmit(data: CollectionFormValues): void
}

export const FormCollection: React.FC<FormCollectionProps> = ({
  initialData,
  onSubmit,
}) => {
  const form = useForm<CollectionFormValues>({
    defaultValues: initialData,
    resolver: zodResolver(FormSchema),
  })
  const [dragActive, setDragActive] = useState(false)
  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      //   setFormData((prev) => ({
      //     ...prev,
      //     banner_file: file,
      //     banner_url: URL.createObjectURL(file),
      //   }))
      console.log(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

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
          className="container mx-auto grid gap-4 max-w-xl"
        >
          <Card>
            <CardHeader>
              <CardTitle>Collection Banner</CardTitle>
              <CardDescription>
                Upload a banner image to represent this collection (2:1 aspect
                ratio recommended)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {initialData.cover ? (
                <div className="space-y-4">
                  <div className="relative aspect-[2] rounded-lg overflow-hidden">
                    <Image
                      src={initialData.cover ?? '/book-placeholder.svg'}
                      alt={initialData.title + "'s cover"}
                      width={160}
                      height={240}
                      className="shadow-md rounded-lg w-full place-self-center object-contain"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => form.setValue('cover', '')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg aspect-[2/1] flex flex-col items-center justify-center transition-colors ${
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/20'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop a banner image here, or click to select
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Recommended: 800x400px (2:1 aspect ratio)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] && handleFileUpload(e.target.files[0])
                    }
                    className="hidden"
                    id="banner-upload"
                  />
                  <Button type="button" variant="outline" asChild>
                    <label htmlFor="banner-upload" className="cursor-pointer">
                      Choose File
                    </label>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details for your collection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Collection Title"
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
                name="description"
                render={({ field }) => (
                  <FormItem className="flex flex-col col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this collection is about... This will help users discover and follow your collection."
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/collections">Cancel</Link>
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? 'Submitting...'
                : 'Save Collection'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
