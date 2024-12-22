import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyAyqBa-fgy4kVnBGQb6MEENYIcCvxvmqMc',
  authDomain: 'librarease-dev.firebaseapp.com',
  projectId: 'librarease-dev',
  storageBucket: 'librarease-dev.firebasestorage.app',
  messagingSenderId: '329808199046',
  appId: '1:329808199046:web:33be1f2dde6b1b0d24c007',
  measurementId: 'G-VJY7LPK50P',
}

export const app = initializeApp(firebaseConfig)
