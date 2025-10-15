'use server'

import { downloadJobResult } from '../api/job'
import { Verify } from '../firebase/firebase'

export async function downloadJobResultAction(id: string) {
  const headers = await Verify({ from: `/admin/jobs/${id}` })

  try {
    const res = await downloadJobResult(id, { headers })
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
