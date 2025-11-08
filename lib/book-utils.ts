import { Book } from './types/book'

export function getBookImportTemplate(books: Array<Partial<Book>>): string {
  const headers = ['id', 'code', 'title', 'author', 'year']
  const rows = books.map((b) => [
    b.id || '',
    b.code || '',
    b.title || '',
    b.author || '',
    (b.year as any) || '',
  ])
  const csvRows = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(',')
    ),
  ]
  return csvRows.join('\n')
}

/**
 * Trigger download of CSV file containing book import template
 */
export function downloadCSV(csv: string) {
  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    `books_template_${new Date().toISOString().split('T')[0]}.csv`
  )
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
