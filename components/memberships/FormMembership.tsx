'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { useCallback, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Membership } from '@/lib/types/membership'
import { Spinner } from '../ui/spinner'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '../ui/input-group'

const DESCRIPTION_MAX_LENGTH = 512

const BaseSchema = z.object({
  library_id: z.uuid(),
  name: z.string().min(1).max(100),
  loan_period: z.coerce.number<number>().positive(),
  duration: z.coerce.number<number>().positive().optional(),
  active_loan_limit: z.coerce.number<number>().positive(),
  fine_per_day: z.coerce.number<number>().positive(),
  price: z.coerce.number<number>().nonnegative(),
  usage_limit: z.coerce.number<number>().nonnegative(),
  description: z.string().max(DESCRIPTION_MAX_LENGTH).optional(),
})

const UpdateSchema = BaseSchema.extend({
  id: z.uuid(),
})

const FormSchema = z.union([BaseSchema, UpdateSchema])

export const FormMembership: React.FC<{
  libraryID: string
  membership?: Membership
  onSubmitAction: (
    data: z.infer<typeof FormSchema>
  ) => Promise<{ error: string } | { message: string }>
}> = ({ libraryID, membership, onSubmitAction }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: membership ?? {
      library_id: libraryID,
      name: '',
      active_loan_limit: 0,
      duration: 0,
      fine_per_day: 0,
      loan_period: 0,
      price: 0,
      usage_limit: 0,
    },
  })

  const onReset = useCallback(() => {
    form.reset()
  }, [form])

  const [isPending, startTransition] = useTransition()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('Submitting membership data:', data)
    startTransition(async () => {
      const res = await onSubmitAction(data)
      if ('error' in res) {
        toast.error(res.error, { richColors: true })
      } else {
        toast.success(res.message)
      }
    })
  }

  return (
    <form id="membership-form" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid gap-4 md:grid-cols-2 max-w-md mx-auto">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-2">
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id="name"
                aria-invalid={fieldState.invalid}
                placeholder="Membership Name"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="duration"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="duration">Duration</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  type="number"
                  id="duration"
                  aria-invalid={fieldState.invalid}
                  placeholder="Duration"
                  autoComplete="off"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>day</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="loan_period"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="loan_period">Loan Period</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  type="number"
                  id="loan_period"
                  aria-invalid={fieldState.invalid}
                  placeholder="Loan Period"
                  autoComplete="off"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>day</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="active_loan_limit"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="active_loan_limit">
                Active Loan Limit
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  type="number"
                  id="active_loan_limit"
                  aria-invalid={fieldState.invalid}
                  placeholder="Active Loan Limit"
                  autoComplete="off"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>day</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="fine_per_day"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="fine_per_day">Fine Per Day</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  type="number"
                  id="fine_per_day"
                  aria-invalid={fieldState.invalid}
                  placeholder="Fine Per Day"
                  autoComplete="off"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>day</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="usage_limit"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="usage_limit">Usage Limit</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  type="number"
                  id="usage_limit"
                  aria-invalid={fieldState.invalid}
                  placeholder="Usage Limit"
                  autoComplete="off"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>day</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="price"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="price">Price</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  type="number"
                  id="price"
                  aria-invalid={fieldState.invalid}
                  placeholder="Price"
                  autoComplete="off"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>pts</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-2">
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  id="description"
                  placeholder="Write a brief description about this membership."
                  {...field}
                  onChange={field.onChange}
                  rows={4}
                />

                <InputGroupAddon align="block-end">
                  <InputGroupText className="text-muted-foreground text-xs">
                    {field.value?.length ?? 0}/{DESCRIPTION_MAX_LENGTH}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="reset"
          variant="ghost"
          onClick={onReset}
          disabled={!form.formState.isDirty}
        >
          Reset
        </Button>
        <Button type="submit">
          {isPending && <Spinner />}
          Submit
        </Button>
      </FieldGroup>
    </form>
  )
}
