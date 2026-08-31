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
import { localizePath, type LandingCopy, type Locale } from '@/lib/i18n'
import { ModeToggle } from './button-toggle-theme'

type LandingPageProps = {
  locale: Locale
  copy: LandingCopy
}

const libraryIcons = [BookOpen, Users, BarChart3, ShieldCheck]
const readerIcons = [Search, BookMarked, Bell, Star]

export default function LandingPage({ locale, copy }: LandingPageProps) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-background text-foreground font-sans border container mx-auto">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold tracking-tight text-foreground text-base">
            {copy.brand}
          </span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-foreground/60 transition-colors">
            <a
              href="#for-libraries"
              className="hover:text-foreground transition-colors"
            >
              {copy.nav.forLibraries}
            </a>
            <a
              href="#for-readers"
              className="hover:text-foreground transition-colors"
            >
              {copy.nav.forReaders}
            </a>
            <Link
              href="/explore/books"
              className="hover:text-foreground transition-colors"
            >
              {copy.nav.exploreBooks}
            </Link>
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href={localizePath(locale, '/login')}
              className="hover:text-foreground transition-colors"
            >
              {copy.nav.signIn}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button asChild className="hidden sm:inline-flex">
              <Link href={localizePath(locale, '/signup')}>
                {copy.nav.getStarted}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-36">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.2] tracking-tight text-balance mb-6">
              {copy.hero.title}
              <br />
              <span className="text-muted-foreground">{copy.hero.accent}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-lg text-pretty">
              {copy.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button asChild size="lg">
                <Link
                  href={localizePath(locale, '/login')}
                  className="flex items-center gap-2"
                >
                  {copy.hero.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/explore/books" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  {copy.hero.secondaryCta}
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
            {copy.stats.map((stat) => (
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
              {copy.forLibraries.eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-lg text-balance">
              {copy.forLibraries.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-border">
            {copy.forLibraries.items.map((item, index) => {
              const Icon = libraryIcons[index]
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
              {copy.forReaders.eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight max-w-lg text-balance">
              {copy.forReaders.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-border">
            {copy.forReaders.items.map((item, index) => {
              const Icon = readerIcons[index]
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
              <h3 className="text-xl font-semibold mb-3">
                {copy.cta.readerTitle}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {copy.cta.readerDescription}
              </p>
              <Button variant="outline" asChild>
                <Link href="/explore/books" className="flex items-center gap-2">
                  {copy.cta.readerButton}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="p-10 md:p-12">
              <Users
                className="h-6 w-6 text-muted-foreground mb-6"
                strokeWidth={1.5}
              />
              <h3 className="text-xl font-semibold mb-3">
                {copy.cta.libraryTitle}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {copy.cta.libraryDescription}
              </p>
              <Button asChild>
                <Link
                  href={localizePath(locale, '/signup')}
                  className="flex items-center gap-2"
                >
                  {copy.cta.libraryButton}
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
            {copy.brand}
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/explore/books"
              className="hover:text-foreground transition-colors"
            >
              {copy.footer.exploreBooks}
            </Link>
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href={localizePath(locale, '/terms')}
              className="hover:text-foreground transition-colors"
            >
              {copy.footer.terms}
            </Link>
            <Link
              href={localizePath(locale, '/privacy')}
              className="hover:text-foreground transition-colors"
            >
              {copy.footer.privacy}
            </Link>
            <Link
              href={localizePath(locale, '/login')}
              className="hover:text-foreground transition-colors"
            >
              {copy.footer.signIn}
            </Link>
          </div>
          <span>
            {copy.footer.copyright.replace('{year}', `${currentYear}`)}
          </span>
        </div>
      </footer>
    </div>
  )
}
