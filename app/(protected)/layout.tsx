export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  console.log('layout is useless now: ')
  return <>{children}</>
}
