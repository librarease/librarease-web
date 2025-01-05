export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="container mx-auto px-4">{children}</div>
}
