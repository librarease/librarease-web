'use server'

import { revalidatePath } from 'next/cache'
import { Verify } from '../firebase/firebase'
import { updateBook } from '../api/book'
import { processImageFile } from '../utils/image-processing'

type ActionState =
  | {
      error: string
    }
  | {
      message: string
    }

export async function updateBookAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const headers = await Verify({
    from: `/admin/books/${formData.get('id')}/edit`,
  })

  // Extract form data
  const bookData: Parameters<typeof updateBook>[1] & {
    imageFile: File | null
  } = {
    title: formData.get('title') as string,
    author: formData.get('author') as string,
    year: Number(formData.get('year')),
    code: formData.get('code') as string,
    imageFile: formData.get('imageFile') as File | null,
    description: formData.get('description') as string,
  }

  // Handle cover file upload and color extraction
  const coverFile = formData.get('imageFile') as File | null
  if (coverFile && coverFile.size > 0) {
    const imageResult = await processImageFile(coverFile, headers)
    if (imageResult) {
      if (imageResult.path) {
        bookData.update_cover = imageResult.path
      }
      if (imageResult.colors) {
        bookData.colors = imageResult.colors
      }
    }
  }
  console.log(bookData)

  try {
    const res = await updateBook(formData.get('id') as string, bookData, {
      headers,
    })
    if ('error' in res) {
      return {
        error: res.error,
      }
    }
    revalidatePath('/admin/books')
    revalidatePath('/books')
    return { message: 'Book updated successfully' }
  } catch (e) {
    console.error(e)
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'Failed to update book' }
  }
}
