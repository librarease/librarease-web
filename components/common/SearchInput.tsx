'use client'

import { Search } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { Spinner } from '../ui/spinner'

export const SearchInput: React.FC<
  React.ComponentProps<typeof InputGroup> &
    Pick<
      React.ComponentProps<typeof InputGroupInput>,
      'name' | 'placeholder'
    > & {
      debounceMs?: number
    }
> = ({ name = 'q', debounceMs = 400, placeholder, ...props }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams?.get(name) ?? '')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isPending, startTransition] = useTransition()

  // Update local state if the URL changes externally
  useEffect(() => {
    setValue(searchParams?.get(name) ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.get(name)])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setValue(newValue)

      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        startTransition(() => {
          const params = new URLSearchParams(
            Array.from(searchParams?.entries() ?? [])
          )
          if (newValue) {
            params.set(name, newValue)
          } else {
            params.delete(name)
          }
          router.replace(`?${params.toString()}`)
        })
      }, debounceMs)
    },
    [router, searchParams, name, debounceMs]
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <InputGroup {...props}>
      <InputGroupInput
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      {isPending ? (
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      ) : value ? (
        <InputGroupAddon
          align="inline-end"
          onClick={() => handleChange({ target: { value: '' } } as any)}
        >
          &#10005;
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  )
}
