'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  ComponentProps,
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Route } from 'next'
import { ButtonGroup } from '../ui/button-group'

type FilterContextValue = {
  filters: Record<string, string | null>
  setFilter: (key: string, value: string | null) => void
  resetFilters: () => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

const useFilterContext = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Filter components must be used within ModelFilter')
  }
  return context
}

type ModelFilterProps = ComponentProps<typeof Button> & {
  children: ReactNode
  filterKeys: string[]
}

export const ModelFilter: React.FC<ModelFilterProps> = ({
  children,
  filterKeys,
  ...props
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const path = usePathname()

  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<Record<string, string | null>>(() => {
    const initial: Record<string, string | null> = {}
    filterKeys.forEach((key) => {
      initial[key] = searchParams.get(key)
    })
    return initial
  })

  const setFilter = (key: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    const reset: Record<string, string | null> = {}
    filterKeys.forEach((key) => {
      reset[key] = null
    })
    setFilters(reset)
  }

  const handleFilter = () => {
    const newSearchParams = new URLSearchParams(searchParams)
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value)
      } else {
        newSearchParams.delete(key)
      }
    })
    router.push(`${path}?${newSearchParams.toString()}` as Route)
    setOpen(false)
  }

  const handleClear = () => {
    resetFilters()
    const newSearchParams = new URLSearchParams(searchParams)
    filterKeys.forEach((key) => {
      newSearchParams.delete(key)
    })
    router.push(`${path}?${newSearchParams.toString()}` as Route)
  }

  const isFilterActive = filterKeys.some((key) => searchParams.get(key))

  return (
    <FilterContext.Provider value={{ filters, setFilter, resetFilters }}>
      <ButtonGroup>
        <Button
          {...props}
          variant={isFilterActive ? 'default' : 'outline'}
          onClick={() => setOpen(true)}
          className={cn(props.className)}
        >
          Filter
        </Button>
        {isFilterActive && (
          <Button size="icon" variant="outline" onClick={handleClear}>
            <X className="size-4" />
          </Button>
        )}
      </ButtonGroup>
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogContent className="bg-background/5 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>Filter</DialogTitle>
            <DialogDescription>Filter your search results</DialogDescription>
          </DialogHeader>

          {children}

          <DialogFooter>
            <Button onClick={resetFilters} variant="outline">
              Clear All
            </Button>
            <Button onClick={handleFilter}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FilterContext.Provider>
  )
}

ModelFilter.displayName = 'ModelFilter'

export { useFilterContext }
