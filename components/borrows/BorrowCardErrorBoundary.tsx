'use client'

import { Component, ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

type Props = {
  children: ReactNode
  idx: number
}

type State = {
  hasError: boolean
  error?: Error
}

export class BorrowCardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error rendering borrow card:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="relative bg-destructive/5 border-destructive/20">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-destructive mt-1" />
              <div>
                <CardTitle className="text-lg text-destructive">
                  Error loading borrow
                </CardTitle>
                <CardDescription className="text-muted-foreground/80 font-bold tracking-wider">
                  #&nbsp;{this.props.idx.toString().padStart(4, '0')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Encountered an error while loading this borrow.
            </p>
            {this.state.error && (
              <details className="mt-2">
                <summary className="text-xs text-muted-foreground cursor-pointer">
                  Error details
                </summary>
                <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
