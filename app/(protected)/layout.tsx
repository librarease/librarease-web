export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  console.log('under (protected) layout: ')
  return <>{children}</>
}
