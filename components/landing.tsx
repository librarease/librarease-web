import Link from 'next/link'
import {
  BookOpen,
  Search,
  BarChart3,
  Users,
  Bell,
  ArrowRight,
  ShieldCheck,
  BookMarked,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from './button-toggle-theme'

const forLibraries = [
  {
    icon: BookOpen,
    title: 'Organize your collection',
    description:
      'Add books with cover art and details. Import your existing catalog in bulk with a CSV file.',
  },
  {
    icon: Users,
    title: 'Manage memberships',
    description:
      'Create plans with custom loan limits, borrow periods, and fine rates. Members subscribe and start borrowing.',
  },
  {
    icon: BarChart3,
    title: "See what's happening",
    description:
      'A clear picture of borrowing activity, popular titles, and revenue — updated in real time.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for your whole team',
    description:
      'Give staff access to handle day-to-day borrowing and returns, while admins keep full oversight.',
  },
]

const forReaders = [
  {
    icon: Search,
    title: 'Browse available books',
    description:
      "Explore your library's collection and see what's available before you visit.",
  },
  {
    icon: BookMarked,
    title: 'Track your borrows',
    description:
      "Know exactly what you have out, when it's due, and your full borrowing history.",
  },
  {
    icon: Bell,
    title: 'Stay on top of due dates',
    description:
      "Get notified before a book is due so you never pay a fine you didn't expect.",
  },
  {
    icon: Star,
    title: 'Leave a review',
    description:
      "Share your thoughts on books you've read. Help other members find their next favourite.",
  },
]

const stats = [
  { value: '50+', label: 'Libraries' },
  { value: '10,000+', label: 'Active Members' },
  { value: '200,000+', label: 'Books' },
  { value: '99.9%', label: 'Uptime' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans border container mx-auto">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold tracking-tight text-foreground text-base">
            Librarease
          </span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-foreground/60 transition-colors">
            <Link
              href="#for-libraries"
              className="hover:text-foreground transition-colors"
            >
              For Libraries
            </Link>
            <Link
              href="#for-readers"
              className="hover:text-foreground transition-colors"
            >
              For Readers
            </Link>
            <Link
              href="/explore/books"
              className="hover:text-foreground transition-colors"
            >
              Explore Books
            </Link>
            <Link
              href="/login"
              className="hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button asChild className="hidden sm:inline-flex">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-36">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-balance mb-6">
              Your library,
              <br />
              <span className="text-muted-foreground">connected.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg text-pretty">
              Experience a modern library ecosystem built for smooth operations
              and a better borrowing experience. Smart management for librarians
              and effortless access for readers.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button asChild size="lg">
                <Link href="/signup" className="flex items-center gap-2">
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/explore/books" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Browse books
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {stats.map((stat) => (
              <div key={stat.label} className="px-8 py-10 first:pl-0">
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Libraries */}
      <section id="for-libraries" className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">
              For Libraries
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-lg text-balance">
              Everything you need to run a modern library.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-border">
            {forLibraries.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="border-r border-b border-border p-8 hover:bg-muted/50 transition-colors"
                >
                  <Icon
                    className="h-5 w-5 text-muted-foreground mb-5"
                    strokeWidth={1.5}
                  />
                  <h3 className="font-semibold text-foreground mb-2 text-sm">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* For Readers */}
      <section id="for-readers" className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">
              For Readers
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-lg text-balance">
              Borrow books and keep track of your reading.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-border">
            {forReaders.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="border-r border-b border-border p-8 hover:bg-muted/50 transition-colors"
                >
                  <Icon
                    className="h-5 w-5 text-muted-foreground mb-5"
                    strokeWidth={1.5}
                  />
                  <h3 className="font-semibold text-foreground mb-2 text-sm">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Explore CTA */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 border border-border">
            <div className="p-10 md:p-12 border-b md:border-b-0 md:border-r border-border">
              <BookOpen
                className="h-6 w-6 text-muted-foreground mb-6"
                strokeWidth={1.5}
              />
              <h3 className="text-xl font-semibold mb-3">Just here to read?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Browse books across all libraries on Librarease. No account
                needed to explore.
              </p>
              <Button variant="outline" asChild>
                <Link href="/explore/books" className="flex items-center gap-2">
                  Explore books
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="p-10 md:p-12">
              <Users
                className="h-6 w-6 text-muted-foreground mb-6"
                strokeWidth={1.5}
              />
              <h3 className="text-xl font-semibold mb-3">Running a library?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Set up your library on Librarease in minutes. Manage your
                collection, members, and borrowing all in one place.
              </p>
              <Button asChild>
                <Link href="/signup" className="flex items-center gap-2">
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="font-semibold text-muted-foreground">
            Librarease
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/explore/books"
              className="hover:text-foreground transition-colors"
            >
              Explore Books
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/login"
              className="hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
          </div>
          <span>© {new Date().getFullYear()} Librarease</span>
        </div>
      </footer>
    </div>
  )
}
