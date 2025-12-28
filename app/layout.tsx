// Copyright (c) 2025 [LibrarEase]
//
// This software is licensed under the PolyForm Noncommercial License 1.0.0
// See LICENSE file in the project root for full license terms.
//
// For commercial licensing inquiries, contact: solidifyarmor@gmail.com
// https://github.com/librarease/librarease-web

import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/consts'
import { ThemeProvider } from '@/components/theme-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#16a34a',
  colorScheme: 'light dark',
}

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  keywords: [
    'library management',
    'book tracking',
    'digital library',
    'catalog system',
    'book management software',
  ],
  authors: [{ name: 'Aung Myint Myat Oo', url: 'https://github.com/agmmtoo' }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  category: 'BusinessApplication',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        //  container mx-auto px-4
        className={`${geistSans.variable} ${geistMono.variable} antialiased mx-auto`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: SITE_NAME,
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'MMK',
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
