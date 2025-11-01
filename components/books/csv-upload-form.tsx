'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { RefreshCw, Upload, FileText } from 'lucide-react'
import { getUploadURL } from '@/lib/api/file'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const FormUploadCSV: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [uploadInfo, setUploadInfo] = useState<{
    url: string
    path: string
  } | null>(null)
  const [isPreparingUpload, setIsPreparingUpload] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) {
      setFile(null)
      setUploadInfo(null)
      return
    }

    setFile(selectedFile)
    setIsPreparingUpload(true)

    try {
      // Get upload URL immediately when file is selected
      const { url, path } = await getUploadURL({ name: selectedFile.name })
      setUploadInfo({ url, path })
    } catch (error) {
      console.error('Error getting upload URL:', error)
      toast.error('Failed to prepare upload')
      setFile(null)
      setUploadInfo(null)
    } finally {
      setIsPreparingUpload(false)
    }
  }

  const handleUpload = async () => {
    if (!file || !uploadInfo) {
      toast.error('Please select a file first')
      return
    }

    setIsUploading(true)

    try {
      // Get library ID from cookie
      const libraryId = document.cookie
        .split('; ')
        .find((row) =>
          row.startsWith(
            process.env.NEXT_PUBLIC_LIBRARY_COOKIE_NAME || 'library='
          )
        )
        ?.split('=')[1]

      if (!libraryId) {
        toast.error('No library selected')
        setIsUploading(false)
        return
      }

      // Upload file to the presigned URL
      const uploadResponse = await fetch(uploadInfo.url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/csv',
        },
        body: file,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      // Redirect to preview page
      router.push(`/admin/books/import/${encodeURIComponent(uploadInfo.path)}`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload file'
      )
      setIsUploading(false)
    }
  }

  const isLoading = isPreparingUpload || isUploading

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label
            htmlFor="csv-file-input"
            className={`
              block w-full text-sm cursor-pointer
              border border-input rounded-md
              px-4 py-2
              bg-background hover:bg-accent
              transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">
                {file ? file.name : 'Choose CSV file'}
              </span>
              {isPreparingUpload && (
                <RefreshCw className="h-3 w-3 ml-auto animate-spin text-muted-foreground" />
              )}
            </span>
          </label>
          <input
            id="csv-file-input"
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            disabled={isLoading}
            className="sr-only"
          />
        </div>
        <Button
          onClick={handleUpload}
          disabled={!file || !uploadInfo || isLoading}
        >
          {isUploading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload & Preview
            </>
          )}
        </Button>
      </div>

      {file && !isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
          <FileText className="h-4 w-4" />
          <span>
            Ready to upload:{' '}
            <span className="font-medium text-foreground">{file.name}</span> (
            {(file.size / 1024).toFixed(2)} KB)
          </span>
        </div>
      )}
    </div>
  )
}
