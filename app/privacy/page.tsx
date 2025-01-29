import { getPrivacyDoc } from '@/lib/api/docs'

export default async function PrivacyPage() {
  const doc = await getPrivacyDoc()
  return <div className="prose" dangerouslySetInnerHTML={{ __html: doc }} />
}
