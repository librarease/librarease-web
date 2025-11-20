'use server'

import { revalidatePath } from 'next/cache'
import { Verify } from '../firebase/firebase'
import { createBook } from '../api/book'
import { processImageFile } from '../utils/image-processing'

type ActionState =
  | {
      error: string
    }
  | {
      message: string
    }

export async function createBookAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const headers = await Verify({
    from: `/admin/books/new`,
  })

  // Extract form data
  const bookData: Parameters<typeof createBook>[0] & {
    imageFile: File | null
  } = {
    title: formData.get('title') as string,
    author: formData.get('author') as string,
    year: Number(formData.get('year')),
    code: formData.get('code') as string,
    library_id: formData.get('library_id') as string,
    imageFile: formData.get('imageFile') as File | null,
  }

  // Handle cover file upload and color extraction
  const coverFile = formData.get('imageFile') as File | null
  if (coverFile && coverFile.size > 0) {
    const imageResult = await processImageFile(coverFile, headers)
    if (imageResult) {
      if (imageResult.path) {
        bookData.cover = imageResult.path
      }
      if (imageResult.colors) {
        bookData.colors = imageResult.colors
      }
    }
  }

  try {
    const res = await createBook(bookData, { headers })
    if ('error' in res) {
      return {
        error: res.error,
      }
    }
    revalidatePath('/admin/books')
    revalidatePath('/books')
    return { message: 'Book created successfully' }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'Failed to create book' }
  }
}
