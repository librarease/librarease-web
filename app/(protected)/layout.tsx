export default async function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode; heading: React.ReactNode }>) {
  return <div className="container mx-auto px-4">{children}</div>
}
