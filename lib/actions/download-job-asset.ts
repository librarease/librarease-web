'use server'

import { downloadJobAsset } from '../api/job'
import { Verify } from '../firebase/firebase'

export async function downloadJobAssetAction(id: string) {
  const headers = await Verify({ from: `/admin/jobs/${id}` })

  try {
    const res = await downloadJobAsset(id, { headers })
    if ('error' in res) {
      return { error: res.error }
    }
    return { url: res.data.url }
  } catch (e) {
    if (e instanceof Object && 'error' in e) {
      return { error: e.error as string }
    }
    return { error: 'failed to download job result' }
  }
}
