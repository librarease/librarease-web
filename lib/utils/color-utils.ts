import { Colors } from '../types/book'

/**
 * Convert a single Color object to a CSS color string
 * @param color - A Color object from the Colors type
 * @returns CSS color string (hsl, hex, or oklch) or null if invalid
 */
export function colorToCss(
  color: Colors[keyof Colors] | undefined
): string | null {
  if (!color) return null

  if ('space' in color) {
    switch (color.space) {
      case 'hsl': {
        const { h, s, l } = color
        // Vibrant returns normalized HSL values (0-1 range)
        // h is in [0, 1] representing [0°, 360°]
        // s and l are in [0, 1] representing [0%, 100%]
        const hh = Math.round(h * 360)
        const ss = Math.round(s * 100)
        const ll = Math.round(l * 100)
        return `hsl(${hh}deg, ${ss}%, ${ll}%)`
      }
      case 'hex': {
        return color.hex
      }
      case 'oklch': {
        const { l, c, h } = color
        return `oklch(${l} ${c} ${h}deg)`
      }
    }
  }

  return null
}

/**
 * Convert Colors object to CSS custom properties (CSS variables)
 * @param colors - Colors object containing color swatches
 * @returns Record of CSS variable names to color values
 * @example
 * const vars = colorsToCssVars(book.colors)
 * // Returns: { '--color-vibrant': 'hsl(220deg, 80%, 50%)', ... }
 */
export function colorsToCssVars(
  colors: Colors | undefined
): Record<string, string> {
  const vars: Record<string, string> = {}
  if (!colors) return vars

  const colorKeys: Array<keyof Colors> = [
    'vibrant',
    'light_vibrant',
    'dark_vibrant',
    'muted',
    'light_muted',
    'dark_muted',
  ]

  for (const key of colorKeys) {
    const cssValue = colorToCss(colors[key])
    if (cssValue) {
      // Convert snake_case to kebab-case for CSS variable names
      const varName = `--color-${String(key).replace(/_/g, '-')}`
      vars[varName] = cssValue
    }
  }

  // --color-muted is conflicting with tailwind's muted class, so we use --color-muted- instead
  if (vars['--color-muted']) {
    vars['--color-muted-'] = vars['--color-muted']
    delete vars['--color-muted']
  }

  return vars
}
