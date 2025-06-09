import { formatDate } from '@/lib/utils'
import { formatDistanceToNowStrict } from 'date-fns'

interface Props extends React.HTMLAttributes<HTMLTimeElement> {
  dateTime: string
  children?: React.ReactNode
  relative?: boolean
}

export function DateTime({ dateTime, children, relative, ...rest }: Props) {
  const formatted = formatDate(dateTime, {
    hour: '2-digit',
    minute: '2-digit',
  })
  const distance = formatDistanceToNowStrict(new Date(dateTime), {
    addSuffix: true,
  })
  return (
    <time dateTime={dateTime.slice(0, 19)} {...rest}>
      {children ?? `${formatted}${relative ? ` (${distance})` : ''}`}
    </time>
  )
}
