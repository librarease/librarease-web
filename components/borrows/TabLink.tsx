import { cn } from '@/lib/utils'
import { ClassValue } from 'clsx'
import { Route } from 'next'
import Link from 'next/link'

export const TabLink = <T extends string>({
  tabs,
  className,
  activeHref,
}: {
  className?: ClassValue
  tabs: { name: string; href: Route<T> }[]
  activeHref: string
}) => {
  return (
    <div
      className={cn(
        'inline-flex gap-2 w-fit items-center justify-center rounded-lg bg-muted text-muted-foreground p-[3px] flex-wrap',
        className
      )}
    >
      {tabs.map(({ name, href }) => {
        const isActive = activeHref === href
        const shouldReplace = activeHref.includes('?') && href.includes('?')
        const tabClassName = cn(
          'px-2 py-1 text-center text-sm font-medium text-foreground flex items-center justify-center min-w-[80px]',
          isActive && 'bg-background rounded-md shadow-sm'
        )

        if (isActive) {
          return (
            <a key={href} href="" aria-current="page" className={tabClassName}>
              {name}
            </a>
          )
        }

        return (
          <Link
            replace={shouldReplace}
            key={href}
            href={href}
            className={tabClassName}
          >
            {name}
          </Link>
        )
      })}
    </div>
  )
}
