'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../ui/form'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { useCallback, useTransition } from 'react'
import { Spinner } from '../ui/spinner'
import { BorrowDetail } from '@/lib/types/borrow'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'
import { Textarea } from '../ui/textarea'
import { reviewBorrowAction } from '@/lib/actions/review-borrow'
import { Star } from 'lucide-react'

const REVIEW_MAX_LENGTH = 512

const BaseReviewSchema = z.object({
  rating: z.coerce.number<number>().min(0).max(5),
  comment: z.string().max(REVIEW_MAX_LENGTH).optional(),
})
const UpdateReviewSchema = BaseReviewSchema.extend({
  id: z.string(),
})
const CreateReviewSchema = BaseReviewSchema.extend({
  borrow_id: z.uuid(),
})
const FormSchema = z.union([UpdateReviewSchema, CreateReviewSchema])

export const FormReview: React.FC<{
  borrow: BorrowDetail
}> = ({ borrow }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: borrow.review
      ? {
          id: borrow.review.id,
          rating: borrow.review.rating,
          comment: borrow.review.comment,
        }
      : {
          borrow_id: borrow.id,
        },
  })

  const [isPending, startTransition] = useTransition()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const msg = await reviewBorrowAction(
        borrow.id,
        'id' in data
          ? {
              id: data.id,
              rating: data.rating,
              comment: data.comment,
            }
          : {
              borrowing_id: data.borrow_id,
              rating: data.rating,
              comment: data.comment,
            }
      )
      if ('error' in msg) {
        toast.error(msg.error, { richColors: true })
      } else {
        toast.success(msg.message)
      }
    })
  }

  const onReset = useCallback(() => {
    form.reset()
  }, [form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <Controller
          control={form.control}
          name="rating"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Rating</FieldLabel>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => field.onChange(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= field.value
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {field.value > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {field.value} {field.value === 1 ? 'star' : 'stars'}
                  </span>
                )}
              </div>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="comment"
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col col-span-2"
            >
              <FieldLabel>Your Review</FieldLabel>
              <Textarea
                placeholder="What did you think about the book?"
                {...field}
                onChange={field.onChange}
                rows={4}
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
              <FieldDescription>
                {field.value?.length ?? 0}/{REVIEW_MAX_LENGTH}
              </FieldDescription>
            </Field>
          )}
        />

        <Button type="reset" variant="ghost" onClick={onReset}>
          Reset
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Spinner />}
          Submit Review
        </Button>
      </form>
    </Form>
  )
}
