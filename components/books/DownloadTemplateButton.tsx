'use client'

import { ModalDownloadTemplate } from '@/components/books/ModalDownloadTemplate'

interface DownloadTemplateButtonProps {
  libraryId?: string
}

export const DownloadTemplateButton: React.FC<DownloadTemplateButtonProps> = ({
  libraryId,
}) => {
  return <ModalDownloadTemplate libraryId={libraryId} />
}
