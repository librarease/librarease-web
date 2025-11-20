'use server'

import { Vibrant } from 'node-vibrant/node'
import { getUploadURL } from '../api/file'
import { Colors } from '../types/book'

export interface ImageProcessingResult {
  path?: string
  colors?: Colors
}

/**
 * Processes an image file by uploading it and extracting color palette
 * Both operations run in parallel and independently - failure of one doesn't affect the other
 * @param imageFile - The image file to process
 * @param headers - Request headers for authentication
 * @returns Object containing the uploaded file path and/or extracted colors (whichever succeeded)
 */
export async function processImageFile(
  imageFile: File,
  headers: HeadersInit
): Promise<ImageProcessingResult | null> {
  if (!imageFile || imageFile.size === 0) {
    return null
  }

  // Convert file to buffer once for both operations
  const buffer = Buffer.from(await imageFile.arrayBuffer())

  // Run upload and color extraction in parallel
  const [uploadResult, colorResult] = await Promise.allSettled([
    // Upload operation
    (async () => {
      const uploadUrlData = await getUploadURL(
        { name: imageFile.name },
        { headers }
      )

      const uploadResponse = await fetch(uploadUrlData.url, {
        method: 'PUT',
        body: buffer,
        headers: {
          'Content-Type': imageFile.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`)
      }

      return uploadUrlData.path
    })(),

    // Color extraction operation
    (async () => {
      const palette = await Vibrant.from(buffer).getPalette()
      const colors: Colors = {}

      if (palette.Vibrant) {
        const [h, s, l] = palette.Vibrant.hsl
        colors.vibrant = { h, s, l, space: 'hsl' }
      }
      if (palette.DarkVibrant) {
        const [h, s, l] = palette.DarkVibrant.hsl
        colors.dark_vibrant = { h, s, l, space: 'hsl' }
      }
      if (palette.LightVibrant) {
        const [h, s, l] = palette.LightVibrant.hsl
        colors.light_vibrant = { h, s, l, space: 'hsl' }
      }
      if (palette.Muted) {
        const [h, s, l] = palette.Muted.hsl
        colors.muted = { h, s, l, space: 'hsl' }
      }
      if (palette.DarkMuted) {
        const [h, s, l] = palette.DarkMuted.hsl
        colors.dark_muted = { h, s, l, space: 'hsl' }
      }
      if (palette.LightMuted) {
        const [h, s, l] = palette.LightMuted.hsl
        colors.light_muted = { h, s, l, space: 'hsl' }
      }

      return colors
    })(),
  ])

  // Collect results from whichever operations succeeded
  const result: ImageProcessingResult = {}

  if (uploadResult.status === 'fulfilled') {
    result.path = uploadResult.value
  } else {
    console.error('Upload failed:', uploadResult.reason)
  }

  if (colorResult.status === 'fulfilled') {
    result.colors = colorResult.value
  } else {
    console.error('Color extraction failed:', colorResult.reason)
  }

  // Return result if at least one operation succeeded
  return result.path || result.colors ? result : null
}
