import Link from 'next/link'
import {
  ArrowRight,
  Users,
  BookCheck,
  TicketPlus,
  Library,
  BookCopy,
  CreditCard,
  CalendarClock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function LandingPage() {
  // In a real app, these would come from an API
  const stats = [
    { label: 'Libraries', value: '25+', icon: Library },
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Books Available', value: '100,000+', icon: BookCheck },
    { label: 'Daily Borrows', value: '500+', icon: BookCopy },
  ]

  const features = [
    {
      title: 'Effortless Browsing',
      description:
        'Find books across libraries in seconds—no more endless searches',
      icon: BookCheck,
    },
    {
      title: 'Reserve & Collect',
      description: "Reserve books online, pick them up when it's convenient",
      icon: TicketPlus,
    },
    {
      title: 'Tailored Memberships',
      description: 'Borrow the way that fits you, with options for everyone',
      icon: CreditCard,
    },
    {
      title: 'Stay on Top of It',
      description: 'Easy tracking for due dates, renewals, and past loans',
      icon: CalendarClock,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b justify-between">
        <Link className="flex items-center justify-center" href="/">
          <span className="ml-2 text-lg font-bold">Librarease</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Your Borrowing, Simplified
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Discover a hassle-free way to browse and reserve books online.
                  Borrow what you need, then pick it up from your library—on
                  your schedule.
                </p>
              </div>
              <div className="space-y-2 md:space-x-4">
                <Button size="lg" asChild>
                  <Link href="/login">
                    Start Borrowing Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/about">Explore Features</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label} className="relative overflow-hidden">
                    <CardHeader>
                      <Icon className="h-8 w-8 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Why Librarease?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl">
                  A smarter, simpler way to connect with your library.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
                {features.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <Card
                      key={feature.title}
                      className="relative overflow-hidden"
                    >
                      <CardHeader>
                        <Icon className="h-8 w-8 text-primary" />
                        <CardTitle className="text-lg">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Ready to Start?
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  Join our community today and get access to all features.
                </p>
              </div>
              <Button size="lg" asChild>
                <Link href="/signup">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Librarease. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="terms"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="privacy"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
