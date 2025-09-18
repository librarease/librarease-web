'use server'

import { revalidatePath } from 'next/cache'
import {
  createCollection,
  deleteCollection,
  updateCollection,
  updateCollectionBooks,
} from '../api/collection'
import { IsLoggedIn, Verify } from '../firebase/firebase'

export async function createCollectionAction(
  data: Parameters<typeof createCollection>[0]
) {
  const headers = await Verify({ from: '/admin/collections/new' })
  try {
    const res = await createCollection(data, { headers })
    if ('error' in res) {
      return { error: res.error }
    }
    return res.data
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
  data: Parameters<typeof updateCollection>[1]
) {
  const headers = await Verify({
    from: `/admin/collections/${id}/edit`,
  })
  try {
    const res = await updateCollection(id, data, { headers })
    if ('error' in res) {
      return { error: res.error }
    }
    revalidatePath(`/admin/collections/${id}`, 'page')
    return res.data
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
