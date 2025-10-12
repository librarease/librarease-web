export default async function SubscriptionDetailsLayout({
  children,
  edit,
}: Readonly<{
  children: React.ReactNode
  edit: React.ReactNode
  params: Promise<{ id: string }>
}>) {
  return (
    <>
      {children}
      {edit}
    </>
  )
}
