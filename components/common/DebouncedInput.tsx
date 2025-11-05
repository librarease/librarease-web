'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '../ui/input'

type InputLikeProps = React.ComponentProps<'input'>
type InputComponent = React.ComponentType<InputLikeProps>

interface DebouncedInputProps {
  component?: InputComponent
  name?: string
  debounceMs?: number
}

/**
 *
 * @deprecated: Use SearchInput instead
 */
export const DebouncedInput = ({
  component: Component = Input,
  name = 'q',
  debounceMs = 400,
  ...props
}: DebouncedInputProps & Omit<InputLikeProps, keyof DebouncedInputProps>) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams?.get(name) ?? '')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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
        const params = new URLSearchParams(
          Array.from(searchParams?.entries() ?? [])
        )
        if (newValue) {
          params.set(name, newValue)
        } else {
          params.delete(name)
        }
        router.replace(`?${params.toString()}`)
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
    <Component {...props} name={name} value={value} onChange={handleChange} />
  )
}
