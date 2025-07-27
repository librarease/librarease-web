import Link from 'next/link'

export default async function ExploreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="container mx-auto px-4 my-4">
      <nav className="flex items-center justify-between">
        <Link href="/" className="uppercase font-semibold tracking-wider">
          Librarease
        </Link>
      </nav>

      {children}
    </div>
  )
}
