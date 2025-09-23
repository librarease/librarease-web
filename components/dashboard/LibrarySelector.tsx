'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Library } from '@/lib/types/library'

export const LibrarySelector: React.FC<{
  libs: Library[]
  lib: string
  onChangeAction: (libID: string) => void
}> = ({ libs, lib, onChangeAction: onChange }) => {
  return (
    <Select value={lib} onValueChange={onChange} disabled>
      <SelectTrigger className="w-1/2 justify-self-end">
        <SelectValue placeholder="Select a library" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Library</SelectLabel>
          {libs.map((lib) => (
            <SelectItem value={lib.id} key={lib.id}>
              {lib.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
