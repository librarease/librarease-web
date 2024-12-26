import admin from 'firebase-admin'
import { applicationDefault } from 'firebase-admin/app'

const adminApp = !admin.apps.length
  ? admin.initializeApp(
      {
        // export GOOGLE_APPLICATION_CREDENTIALS="/path/to/serviceAccountKey.json"
        credential: applicationDefault(),
      },
      'admin'
    )
  : admin.app('admin')

export { adminApp }
