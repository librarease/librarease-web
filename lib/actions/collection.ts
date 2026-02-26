'use server'

import { revalidatePath } from 'next/cache'
import {
  createCollection,
  deleteCollection,
  updateCollection,
  updateCollectionBooks,
  followCollection,
  unfollowCollection,
} from '../api/collection'
import { IsLoggedIn, Verify } from '../firebase/firebase'

type ActionState =
  | {
      error: string
    }
  | {
      message: string
    }

export async function createCollectionAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const headers = await Verify({ from: '/admin/collections/new' })

  // Extract form data
  const data: Parameters<typeof createCollection>[0] = {
    title: formData.get('title') as string,
    library_id: formData.get('library_id') as string,
    description: formData.get('description') as string,
  }

  // Handle cover file upload
  const coverFile = formData.get('imageFile') as File | null
  if (coverFile && coverFile.size > 0) {
    const importImageProcessing = await import('../utils/image-processing')
    const imageResult = await importImageProcessing.processImageFile(
      coverFile,
      headers
    )
    if (imageResult) {
      if (imageResult.path) {
        data.cover = imageResult.path
      }
      if (imageResult.colors) {
        data.colors = imageResult.colors
      }
    }
  }

  try {
    const res = await createCollection(data, { headers })
    if ('error' in res) {
      return { error: res.error as string }
    }
    revalidatePath('/admin/collections')
    return { message: 'Collection created successfully' }
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { error: e.message }
    }
    return { error: 'An unknown error occurred.' }
  }
}

export async function deleteCollectionAction(
  collectionId: string,
  libraryId: string
) {
  const headers = await Verify({ from: '/admin/collections' })
  const claims = await IsLoggedIn()
  if (!claims || !claims.librarease) {
    return 'You must be logged in to delete a collection'
  }

  if (
    !claims.librarease.admin_libs
      .concat(claims.librarease.staff_libs)
      .includes(libraryId)
  ) {
    return "You don't have permission to delete this collection"
  }
  try {
    const res = await deleteCollection(collectionId, { headers })
    if ('error' in res) {
      return res.error
    }
    revalidatePath('/admin/collections', 'page')
    return 'Collection deleted successfully'
  } catch (e: unknown) {
    if (e instanceof Error) {
      return e.message
    }
    return 'An unknown error occurred.'
  }
}

export async function updateCollectionAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const headers = await Verify({
    from: `/admin/collections/${id}/edit`,
  })

  // Extract form data
  const data: Parameters<typeof updateCollection>[1] = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
  }

  // Handle cover file upload
  const coverFile = formData.get('imageFile') as File | null
  if (coverFile && coverFile.size > 0) {
    const importImageProcessing = await import('../utils/image-processing')
    const imageResult = await importImageProcessing.processImageFile(
      coverFile,
      headers
    )
    if (imageResult) {
      if (imageResult.path) {
        data.update_cover = imageResult.path
      }
      if (imageResult.colors) {
        data.colors = imageResult.colors
      }
    }
  }

  try {
    const res = await updateCollection(id, data, { headers })
    if ('error' in res) {
      return { error: res.error as string }
    }
    revalidatePath(`/admin/collections/${id}`, 'page')
    return { message: 'Collection updated successfully' }
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { error: e.message }
    }
    return { error: 'An unknown error occurred.' }
  }
}

export async function updateCollectionBooksAction(
  id: string,
  bookIDs: string[]
): Promise<string> {
  const headers = await Verify({
    from: `admin/collections/${id}/manage-books`,
  })
  try {
    const res = await updateCollectionBooks(
      id,
      { book_ids: bookIDs },
      { headers }
    )
    if ('error' in res) {
      return res.error
    }
    revalidatePath(`/admin/collections/${id}`, 'page')
    return 'Collection books updated successfully'
  } catch (e: unknown) {
    if (e instanceof Error) {
      return e.message
    }
    return 'An unknown error occurred.'
  }
}

export async function toggleFollowCollectionAction(
  id: string,
  isFollowed: boolean
): Promise<string | undefined> {
  const headers = await Verify({ from: `/collections/${id}` })

  try {
    if (isFollowed) {
      const res = await unfollowCollection(id, { headers })
      if ('error' in res) return res.error
    } else {
      const res = await followCollection(id, { headers })
      if ('error' in res) return res.error
    }

    revalidatePath(`/collections/${id}`, 'page')
    revalidatePath(`/collections`, 'page')

    return undefined // success
  } catch (e: unknown) {
    if (e instanceof Error) {
      return e.message
    }
    return 'An unknown error occurred.'
  }
}
