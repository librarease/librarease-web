import type { Job } from '@/lib/types/job'
import { ExportBorrowingsData } from './api/borrow'
import { ClassValue } from 'clsx'

// Parsed result types
export interface ExportResult {
  path: string
  size: number
  name: string
}

export function parseJobPayload(job: Job) {
  try {
    const payload = JSON.parse(job.payload)

    switch (job.type) {
      case 'export:borrowings':
        return payload as ExportBorrowingsData
      default:
        return payload
    }
  } catch {
    return null
  }
}

export function parseJobResult(job: Job) {
  if (!job.result) return null

  try {
    const result = JSON.parse(job.result)

    switch (job.type) {
      case 'export:borrowings':
        return result as ExportResult
      default:
        return result
    }
  } catch {
    return null
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function getJobTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'export:borrowings': 'Export Borrowings',
  }
  return labels[type] || type
}

export function getStatusColor(status: string): Extract<ClassValue, string> {
  const colors: Record<string, Extract<ClassValue, string>> = {
    PENDING:
      'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800',
    PROCESSING:
      'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800',
    COMPLETED:
      'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800',
    FAILED:
      'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800',
  }
  return (
    colors[status] ||
    'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
  )
}
