'use client'

import React, { useEffect } from 'react'
import { Input } from '../ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { cn } from '@/lib/utils'
import { QrCode, Scan } from 'lucide-react'

export const Scanner: React.FC<
  React.PropsWithChildren<{
    title?: string
    description?: string
    value?: string
    onChange: (id: string) => void
    error?: string
    isLoading?: boolean
    initialFocus?: boolean
  }>
> = ({
  title,
  description,
  error,
  initialFocus,
  onChange,
  value,
  children,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleCardClick = () => {
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (initialFocus) {
      inputRef.current?.focus()
    }
  }, [initialFocus, inputRef])

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200',
        '[&:has(input:focus)]:ring-1 ring-primary [&:has(input:focus)]:border-primary [&:has(input:focus)]:bg-primary/5'
      )}
      onClick={handleCardClick}
      tabIndex={0}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          {title || 'Scan QR Code'}
        </CardTitle>
        <CardDescription>
          {description || 'Select to scan the QR code'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          tabIndex={-1}
          className="opacity-0 w-0 h-0 p-0"
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {children || (
          <div
            className={cn(
              'grid place-items-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg',
              error && 'border-destructive/50'
            )}
          >
            <Scan
              className={cn(
                'h-12 w-12 text-muted-foreground',
                error && 'text-destructive'
              )}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
