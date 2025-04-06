import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { SITE_NAME } from '@/lib/consts'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: SITE_NAME,
  description: 'A simple and powerful library management system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        //  container mx-auto px-4
        className={`${geistSans.variable} ${geistMono.variable} antialiased mx-auto`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
