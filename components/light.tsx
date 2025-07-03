import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Users,
  Building2,
  Sparkles,
  Zap,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 text-slate-900 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-200/40 to-emerald-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-200/30 to-cyan-200/25 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-purple-200/25 to-pink-200/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 lg:px-6 h-16 flex items-center border-b border-slate-200/60 backdrop-blur-sm bg-white/80">
        <Link className="flex items-center justify-center" href="/">
          <div className="relative">
            <BookOpen className="h-8 w-8 text-emerald-600" />
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-md" />
          </div>
          <span className="ml-3 text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
            LibraryConnect
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white border-0 shadow-lg shadow-emerald-500/25"
            asChild
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 border border-emerald-200/60 text-emerald-700 text-sm mb-8 shadow-sm">
              <Sparkles className="h-4 w-4" />
              <span>The future of library management</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                Digital Library
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience seamless book borrowing with QR code scanning, smart
              subscriptions, and real-time availability. Built for the modern
              library ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white border-0 shadow-xl shadow-emerald-500/25 px-8 py-6 text-lg"
                asChild
              >
                <Link href="/register">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-6 text-lg backdrop-blur-sm bg-white/60 shadow-sm"
                asChild
              >
                <Link href="/demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Building2,
                label: 'Libraries Connected',
                value: '500+',
                color: 'emerald',
              },
              {
                icon: Users,
                label: 'Active Users',
                value: '50K+',
                color: 'blue',
              },
              {
                icon: BookOpen,
                label: 'Books Managed',
                value: '2M+',
                color: 'purple',
              },
            ].map((stat, index) => {
              const Icon = stat.icon
              const colorClasses = {
                emerald:
                  'text-emerald-600 from-emerald-200/40 to-emerald-300/30',
                blue: 'text-blue-600 from-blue-200/40 to-cyan-300/30',
                purple: 'text-purple-600 from-purple-200/40 to-pink-300/30',
              }
              return (
                <div key={index} className="text-center group">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4 mx-auto">
                    <Icon
                      className={`h-8 w-8 ${colorClasses[stat.color as keyof typeof colorClasses].split(' ')[0]} relative z-10`}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${colorClasses[stat.color as keyof typeof colorClasses].split(' ').slice(1).join(' ')} rounded-full blur-lg group-hover:blur-xl transition-all duration-300`}
                    />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Built for Speed & Simplicity
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
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
                gradient: 'from-emerald-50 to-emerald-100/50',
                iconColor: 'text-emerald-600',
                iconGlow: 'bg-emerald-200/40',
              },
              {
                icon: Shield,
                title: 'Smart Subscription Management',
                description:
                  'Flexible membership plans with automated renewals and usage tracking',
                gradient: 'from-blue-50 to-blue-100/50',
                iconColor: 'text-blue-600',
                iconGlow: 'bg-blue-200/40',
              },
              {
                icon: Sparkles,
                title: 'Real-time Analytics',
                description:
                  'Comprehensive insights into library usage, popular books, and user behavior',
                gradient: 'from-purple-50 to-purple-100/50',
                iconColor: 'text-purple-600',
                iconGlow: 'bg-purple-200/40',
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`relative p-8 rounded-2xl border border-slate-200/60 backdrop-blur-sm bg-gradient-to-br ${feature.gradient} group hover:border-slate-300/60 transition-all duration-300 shadow-sm hover:shadow-md`}
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
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
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
            <div className="relative p-12 rounded-3xl border border-slate-200/60 backdrop-blur-sm bg-gradient-to-br from-white/80 via-emerald-50/30 to-blue-50/20 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/40 via-transparent to-blue-100/30 rounded-3xl blur-xl" />
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Ready to Transform
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Your Library?
                  </span>
                </h2>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                  Join thousands of libraries already using LibraryConnect to
                  streamline their operations
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white border-0 shadow-xl shadow-emerald-500/25 px-8 py-6 text-lg"
                  asChild
                >
                  <Link href="/register">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/60 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-emerald-600 mr-2" />
              <span className="text-slate-600">
                © 2025 LibraryConnect. All rights reserved.
              </span>
            </div>
            <nav className="flex gap-6">
              <Link
                className="text-slate-500 hover:text-slate-700 transition-colors"
                href="/privacy"
              >
                Privacy
              </Link>
              <Link
                className="text-slate-500 hover:text-slate-700 transition-colors"
                href="/terms"
              >
                Terms
              </Link>
              <Link
                className="text-slate-500 hover:text-slate-700 transition-colors"
                href="/contact"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
