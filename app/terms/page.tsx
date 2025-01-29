import { getTermsDoc } from '@/lib/api/docs'

export default async function TermsPage() {
  const doc = await getTermsDoc()
  return <div className="prose" dangerouslySetInnerHTML={{ __html: doc }} />
}
