import { initializeApp } from 'firebase/app'

export const app = initializeApp(
  {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
  },
  'client'
)
