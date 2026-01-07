import Link from 'next/link'
import {
  ArrowRight,
  Users,
  BookCopy,
  Sparkles,
  Building2,
  Zap,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from './button-toggle-theme'

export default function LandingPage() {
  // In a real app, these would come from an API
  const stats = [
    {
      icon: Building2,
      label: 'Libraries Connected',
      value: '50+',
      color: 'emerald',
    },
    { icon: Users, label: 'Active Users', value: '10K+', color: 'blue' },
    { icon: BookCopy, label: 'Books Managed', value: '200K+', color: 'purple' },
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 md:left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 md:right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 md:left-1/3 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000" />

        {/* <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-200/40 to-emerald-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-200/30 to-cyan-200/25 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-200/25 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-2000" /> */}
      </div>
      <header className="px-4 lg:px-6 h-14 flex items-center border-b justify-between">
        <Link className="flex items-center justify-center" href="/">
          <span className="ml-2 text-lg font-bold">Librarease</span>
        </Link>
        <nav className="flex gap-2 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <ModeToggle />
        </nav>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-sm">
              <Sparkles className="h-4 w-4" />
              <span>The future of library management</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-linear-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                Digital Library
              </span>
              <br />
              <span className="bg-linear-to-r from-emerald-600 via-emerald-500 to-blue-600 dark:from-emerald-400 dark:via-emerald-300 dark:to-blue-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Experience seamless book borrowing with QR code scanning, smart
              subscriptions, and real-time availability. Built for the modern
              library ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white border-0 shadow-xl shadow-emerald-500/25 px-8 py-6 text-lg transition-colors duration-300"
                asChild
              >
                <Link href="/login">
                  <>
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-foreground/20 text-foreground px-8 py-6 text-lg backdrop-blur-sm bg-background/50"
                asChild
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                const colorClasses = {
                  emerald: {
                    text: 'text-emerald-600 dark:text-emerald-400',
                    glow: 'bg-emerald-200/40 dark:bg-emerald-500/20',
                  },
                  blue: {
                    text: 'text-blue-600 dark:text-blue-400',
                    glow: 'bg-blue-200/40 dark:bg-blue-500/20',
                  },
                  purple: {
                    text: 'text-purple-600 dark:text-purple-400',
                    glow: 'bg-purple-200/40 dark:bg-purple-500/20',
                  },
                }
                return (
                  <div key={index} className="text-center">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4 mx-auto">
                      <Icon
                        className={`h-8 w-8 ${colorClasses[stat.color as keyof typeof colorClasses].text} relative z-10`}
                      />
                      <div
                        className={`absolute inset-0 ${colorClasses[stat.color as keyof typeof colorClasses].glow} rounded-lg blur-md group-hover:blur-lg transition-all duration-300`}
                      />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {stat.value}
                    </div>
                    <div className="text-foreground/60">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Built for Speed & Simplicity
              </span>
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Every feature designed to make library management effortless and
              intuitive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast QR Scanning',
                description:
                  'Instant book borrowing and returns with advanced QR code technology',
                gradient:
                  'from-emerald-50 to-emerald-100/50 dark:from-emerald-500/10 dark:to-emerald-600/5',
                iconColor: 'text-emerald-600 dark:text-emerald-400',
                iconGlow: 'bg-emerald-200/40 dark:bg-emerald-500/20',
              },
              {
                icon: Shield,
                title: 'Smart Subscription Management',
                description:
                  'Flexible membership plans with automated renewals and usage tracking',
                gradient:
                  'from-blue-50 to-blue-100/50 dark:from-blue-500/10 dark:to-blue-600/5',
                iconColor: 'text-blue-600 dark:text-blue-400',
                iconGlow: 'bg-blue-200/40 dark:bg-blue-500/20',
              },
              {
                icon: Sparkles,
                title: 'Real-time Analytics',
                description:
                  'Comprehensive insights into library usage, popular books, and user behavior',
                gradient:
                  'from-purple-50 to-purple-100/50 dark:from-purple-500/10 dark:to-purple-600/5',
                iconColor: 'text-purple-600 dark:text-purple-400',
                iconGlow: 'bg-purple-200/40 dark:bg-purple-500/20',
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`relative p-8 rounded-2xl border border-foreground/10 backdrop-blur-sm bg-linear-to-br ${feature.gradient} group hover:border-foreground/20 transition-all duration-300 shadow-sm hover:shadow-md`}
                >
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-12 h-12 mb-6 relative">
                      <Icon
                        className={`h-6 w-6 ${feature.iconColor} relative z-10`}
                      />
                      <div
                        className={`absolute inset-0 ${feature.iconGlow} rounded-lg blur-md group-hover:blur-lg transition-all duration-300`}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground/90 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative p-12 rounded-3xl border border-foreground/10 backdrop-blur-sm bg-linear-to-br from-emerald-500/5 to-blue-500/5">
              <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-transparent to-blue-500/10 rounded-3xl blur-xl" />
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    Ready to Transform
                  </span>
                  <br />
                  <span className="bg-linear-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    Your Library?
                  </span>
                </h2>
                <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
                  Join hundreds of libraries already using LibraryConnect to
                  streamline their operations
                </p>
                <Button
                  size="lg"
                  className="bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white border-0 shadow-xl shadow-emerald-500/25 px-8 py-6 text-lg transition-colors duration-300"
                  asChild
                >
                  <Link href="/signup">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-foreground/60">
          &copy; {new Date().getFullYear()} Librarease. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4 text-foreground/60 hover:text-foreground"
            href="/terms"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4 text-foreground/60 hover:text-foreground"
            href="/privacy"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
