import { cn } from '@/lib/utils'
import { ClassValue } from 'clsx'
import Link from 'next/link'

export const TabLink: React.FC<{
  className?: ClassValue
  tabs: { name: string; href: string }[]
  activeHref: string
}> = ({ tabs, className, activeHref }) => {
  return (
    <div
      className={cn(
        'inline-flex gap-2 w-fit items-center justify-center rounded-lg bg-muted text-muted-foreground p-[3px]',
        className
      )}
    >
      {tabs.map(({ name, href }) => (
        <Link
          replace
          key={href}
          href={href}
          className={cn(
            'px-2 py-1 text-center text-sm font-medium text-foreground flex items-center justify-center min-w-[80px]', // min-w ensures same width
            activeHref === href && 'bg-background rounded-md shadow-sm'
          )}
        >
          {name}
        </Link>
      ))}
    </div>
  )
}
