'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Library } from '@/lib/types/library'

export type LibraryFormValues = Pick<
  Library,
  'name' | 'logo' | 'address' | 'phone' | 'email' | 'description'
>

type LibraryFormProps = {
  initialData: LibraryFormValues
  onSubmit(data: LibraryFormValues): void
}

const FormSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  logo: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  description: z.string().optional(),
})

export const LibraryForm: React.FC<LibraryFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto max-w-sm space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Name</FormLabel>
                <Input placeholder="Name" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Logo</FormLabel>
                <Input placeholder="Logo URL" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex flex-col col-span-2">
                <FormLabel>Address</FormLabel>
                <Input placeholder="Address" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Email</FormLabel>
                <Input placeholder="Email" type="email" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Phone</FormLabel>
                <Input placeholder="Phone" type="tel" {...field} />
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
                <Textarea placeholder="About" {...field} rows={3} />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full md:w-auto col-span-2 place-self-end"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
