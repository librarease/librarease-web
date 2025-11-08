import { getListBooks } from '@/lib/api/book'
import { REDIS_KEY_BOOK_PRINT_PREFIX } from '@/lib/consts'
import { cache } from '@/lib/redis-helpers'
import qrcode from 'qrcode'
import { cookies } from 'next/headers'

export default async function BooksPrintQRPage({
  params,
}: {
  params: Promise<{ key: string }>
}) {
  const { key } = await params
  const bookIDs = await cache.get<string[]>(
    `${REDIS_KEY_BOOK_PRINT_PREFIX}:${key}`
  )

  if (!bookIDs) {
    return <div>No books found for the provided key.</div>
  }

  const cookieStore = await cookies()
  const cookieName = process.env.LIBRARY_COOKIE_NAME as string
  const libID = cookieStore.get(cookieName)?.value

  const res = await getListBooks(
    bookIDs ? { ids: bookIDs, library_id: libID } : { library_id: libID }
  )
  if ('error' in res) {
    return <div>Error loading books: {res.error}</div>
  }

  const qrPromises = res.data.map(async (book) => {
    try {
      const svg = await qrcode.toString(book.id, {
        margin: 0,
        width: 100,
        errorCorrectionLevel: 'L',
        type: 'svg',
      })
      return { id: book.id, code: book.code, svg }
    } catch (err) {
      console.error(`Failed to generate QR code for ${book.id}:`, err)
      return { id: book.id, svg: '' }
    }
  })

  const results = await Promise.all(qrPromises)

  return (
    <div className="grid grid-cols-4 gap-2">
      {results
        .filter((b) => b.svg)
        .map((b) => {
          return (
            <figure
              key={b.id}
              className="flex flex-col items-center border border-dashed justify-center p-2 rounded-lg"
            >
              <span
                dangerouslySetInnerHTML={{ __html: b.svg }}
                className="aspect-square border-1 rounded-md p-2"
              />
              <figcaption className="text-center">
                <p className="text-black dark:text-white font-mono font-medium text-xs">
                  {b.code}
                </p>
              </figcaption>
            </figure>
          )
        })}
    </div>
  )
}
