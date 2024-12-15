import Link from 'next/link'

export default function Home() {
  return (
    <main className="grid place-items-center h-screen">
      <div className="grid grid-cols-3 gap-4">
        <Link href="/libraries">Libraries</Link>
        <Link href="/books">Books</Link>
        <Link href="/users">Users</Link>
        <Link href="/staffs">Staffs</Link>
        <Link href="/memberships">Memberships</Link>
        <Link href="/subscriptions">Subscriptions</Link>
        <Link href="/borrows">Borrows</Link>
      </div>
    </main>
  )
}
