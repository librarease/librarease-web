import { Verify } from '@/lib/firebase/firebase'
import { getBook } from '@/lib/api/book'
import { BookForm } from '@/components/books/BookForm'
import { updateBookAction } from '@/lib/actions/update-book'

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  await Verify({ from: `/admin/books/${id}/edit` })

  const [bookRes] = await Promise.all([getBook({ id })])

  if ('error' in bookRes) {
    console.log({ libRes: bookRes })
    return <div>{JSON.stringify(bookRes.message)}</div>
  }

  return (
    <BookForm initialData={bookRes.data} onSubmitAction={updateBookAction} />
  )
}
