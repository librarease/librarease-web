import * as React from 'react'
import { Input } from './input'

const TimeInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof Input> & {
    value: string
    onChange: (value: string) => void
  }
>(({ value, onChange, ...props }, ref) => {
  return (
    <Input
      className="max-w-max mx-auto mb-2"
      type="time"
      value={(() => {
        const d = new Date(value)
        const hh = String(d.getHours()).padStart(2, '0')
        const mm = String(d.getMinutes()).padStart(2, '0')
        return `${hh}:${mm}`
      })()}
      onChange={(e) => {
        const [hh = 0, mm = 0] = e.target.value.split(':').map(Number)
        const d = new Date(value)
        d.setHours(hh, mm)
        onChange(d.toISOString())
      }}
      ref={ref}
      {...props}
    />
  )
})

TimeInput.displayName = 'TimeInput'

export { TimeInput }
