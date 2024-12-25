export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  console.log('insice (protected) layout: ')
  return <>{children}</>
}
