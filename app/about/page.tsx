import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <Button variant="ghost" asChild className="mb-4 -ml-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold leading-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
              About LibrarEase
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <p className="text-lg text-foreground/80 mb-6">
          LibrarEase is a modern library management platform built to make
          libraries easier to run and more enjoyable to use. Designed for
          libraries of all sizes, it provides a single place to manage books,
          memberships, subscriptions, and borrowing activities.
        </p>
        <p className="text-lg text-foreground/80 mb-6">
          For librarians, LibrarEase offers powerful tools to organize
          collections, track borrow and return histories, and manage memberships
          with ease. Libraries can assign roles such as admin and staff, send
          notifications, and stay connected with users through automated emails.
          Features like QR-based borrowing and returning ensure smooth
          day-to-day operations. The built-in dashboard provides useful charts
          and insights, helping librarians understand trends and make
          data-driven decisions.
        </p>
        <p className="text-lg text-foreground/80 mb-6">
          For readers and members, LibrarEase makes borrowing simple and
          accessible. Users can subscribe through their library memberships,
          receive timely notifications, and enjoy a seamless borrowing
          experience through the user app.
        </p>
        <p className="text-lg text-foreground/80">
          Fast, reliable, and easy to use, LibrarEase brings together everything
          needed to create a better library experience for both librarians and
          readers.
        </p>
      </div>
    </div>
  )
}
