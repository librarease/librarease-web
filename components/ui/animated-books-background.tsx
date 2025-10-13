'use client'

import { useEffect, useRef } from 'react'

interface Book {
  x: number
  y: number
  z: number
  width: number
  height: number
  depth: number
  rotationX: number
  rotationY: number
  rotationZ: number
  speedX: number
  speedY: number
  speedZ: number
  rotationSpeedX: number
  rotationSpeedY: number
  rotationSpeedZ: number
  color: string
  opacity: number
}

export function AnimatedBooksBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let books: Book[] = []

    const LIGHT_COLORS = [
      '#10b981',
      '#059669',
      '#047857',
      '#6366f1',
      '#4f46e5',
      '#7c3aed',
      '#2563eb',
      '#0891b2',
    ] as const

    const DARK_COLORS = [
      '#0ea5e9',
      '#0369a1',
      '#3730a3',
      '#312e81',
      '#4c1d95',
      '#155e75',
      '#047857',
      '#0f766e',
    ] as const

    const LIGHT_GRADIENT = ['#ecfdf5', '#d1fae5', '#a7f3d0'] as const
    const DARK_GRADIENT = ['#0f172a', '#111827', '#1f2937'] as const

    const LIGHT_OPACITY_RANGE: [number, number] = [0.18, 0.45]
    const DARK_OPACITY_RANGE: [number, number] = [0.08, 0.28]

    let colorPalette: string[] = []
    let gradientStops: string[] = []
    let opacityRange: [number, number] = [0, 0]

    const gradientCss = (stops: readonly string[]) =>
      `linear-gradient(135deg, ${stops
        .map((stop, idx) => `${stop} ${(idx / (stops.length - 1)) * 100}%`)
        .join(', ')})`

    const randomBetween = (min: number, max: number) =>
      min + Math.random() * (max - min)

    const detectDarkMode = () => {
      const html = document.documentElement
      const style = getComputedStyle(html)
      return (
        html.classList.contains('dark') ||
        style.getPropertyValue('color-scheme').trim() === 'dark'
      )
    }

    const applyThemeConfig = () => {
      const isDark = detectDarkMode()
      colorPalette = Array.from(isDark ? DARK_COLORS : LIGHT_COLORS)
      gradientStops = Array.from(isDark ? DARK_GRADIENT : LIGHT_GRADIENT)
      opacityRange = [
        ...(isDark ? DARK_OPACITY_RANGE : LIGHT_OPACITY_RANGE),
      ] as [number, number]
      canvas.style.background = gradientCss(gradientStops)

      books.forEach((book) => {
        book.color =
          colorPalette[Math.floor(Math.random() * colorPalette.length)]
        book.opacity = randomBetween(opacityRange[0], opacityRange[1])
      })
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createBook = (): Book => {
      const size = Math.random() * 60 + 40
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        width: size,
        height: size * 1.4,
        depth: size * 0.3,
        rotationX: Math.random() * Math.PI * 2,
        rotationY: Math.random() * Math.PI * 2,
        rotationZ: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        speedZ: (Math.random() - 0.5) * 2,
        rotationSpeedX: (Math.random() - 0.5) * 0.02,
        rotationSpeedY: (Math.random() - 0.5) * 0.02,
        rotationSpeedZ: (Math.random() - 0.5) * 0.02,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        opacity: randomBetween(opacityRange[0], opacityRange[1]),
      }
    }

    const init = () => {
      resize()
      applyThemeConfig()
      books = Array.from({ length: 30 }, createBook)
    }

    const project = (x: number, y: number, z: number) => {
      const camera = 800
      const scale = camera / (camera + z)
      return {
        x: canvas.width / 2 + (x - canvas.width / 2) * scale,
        y: canvas.height / 2 + (y - canvas.height / 2) * scale,
        scale,
        z,
      }
    }

    // Sequential rotation (X -> Y -> Z). More robust and readable.
    const rotatePoint = (
      x: number,
      y: number,
      z: number,
      rotX: number,
      rotY: number,
      rotZ: number
    ) => {
      // Rotate around X
      const cx = Math.cos(rotX),
        sx = Math.sin(rotX)
      const y1 = y * cx - z * sx
      const z1 = y * sx + z * cx
      const x1 = x

      // Rotate around Y
      const cy = Math.cos(rotY),
        sy = Math.sin(rotY)
      const x2 = x1 * cy + z1 * sy
      const z2 = -x1 * sy + z1 * cy
      const y2 = y1

      // Rotate around Z
      const cz = Math.cos(rotZ),
        sz = Math.sin(rotZ)
      const x3 = x2 * cz - y2 * sz
      const y3 = x2 * sz + y2 * cz
      const z3 = z2

      return { x: x3, y: y3, z: z3 }
    }

    const drawBook = (book: Book) => {
      const corners = [
        [-book.width / 2, -book.height / 2, -book.depth / 2],
        [book.width / 2, -book.height / 2, -book.depth / 2],
        [book.width / 2, book.height / 2, -book.depth / 2],
        [-book.width / 2, book.height / 2, -book.depth / 2],
        [-book.width / 2, -book.height / 2, book.depth / 2],
        [book.width / 2, -book.height / 2, book.depth / 2],
        [book.width / 2, book.height / 2, book.depth / 2],
        [-book.width / 2, book.height / 2, book.depth / 2],
      ]

      // Rotate and translate each corner, keep world z for depth sorting
      const rotatedWorld = corners.map(([cx, cy, cz]) => {
        const r = rotatePoint(
          cx,
          cy,
          cz,
          book.rotationX,
          book.rotationY,
          book.rotationZ
        )
        return { x: book.x + r.x, y: book.y + r.y, z: book.z + r.z }
      })

      const projectedCorners = rotatedWorld.map((p) => project(p.x, p.y, p.z))

      const faces = [
        { indices: [0, 1, 2, 3], brightness: 1.0 },
        { indices: [4, 5, 6, 7], brightness: 0.6 },
        { indices: [0, 4, 7, 3], brightness: 0.8 },
        { indices: [1, 2, 6, 5], brightness: 0.8 },
        { indices: [0, 1, 5, 4], brightness: 0.7 },
        { indices: [3, 2, 6, 7], brightness: 0.9 },
      ]

      // Use average world Z (rotatedWorld.z) for depth sorting (nearer = larger z -> drawn last)
      const facesWithDepth = faces.map((face) => {
        const avgZ =
          face.indices.reduce((sum, i) => sum + rotatedWorld[i].z, 0) / 4
        return { ...face, depth: avgZ }
      })
      facesWithDepth.sort((a, b) => a.depth - b.depth)

      facesWithDepth.forEach((face) => {
        const points = face.indices.map((i) => projectedCorners[i])

        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y)
        }
        ctx.closePath()

        const r = Number.parseInt(book.color.slice(1, 3), 16)
        const g = Number.parseInt(book.color.slice(3, 5), 16)
        const b = Number.parseInt(book.color.slice(5, 7), 16)
        const finalOpacity = book.opacity * face.brightness
        ctx.fillStyle = `rgba(${Math.floor(r * face.brightness)}, ${Math.floor(
          g * face.brightness
        )}, ${Math.floor(b * face.brightness)}, ${finalOpacity})`
        ctx.fill()
        ctx.strokeStyle = `rgba(0, 0, 0, ${finalOpacity * 0.1})`
        ctx.lineWidth = 1
        ctx.stroke()
      })
    }

    const update = () => {
      books.forEach((book) => {
        book.x += book.speedX
        book.y += book.speedY
        book.z += book.speedZ
        book.rotationX += book.rotationSpeedX
        book.rotationY += book.rotationSpeedY
        book.rotationZ += book.rotationSpeedZ

        if (book.x < -200) book.x = canvas.width + 200
        if (book.x > canvas.width + 200) book.x = -200
        if (book.y < -200) book.y = canvas.height + 200
        if (book.y > canvas.height + 200) book.y = -200
        if (book.z < -500) book.z = 1000
        if (book.z > 1000) book.z = -500
      })
    }

    const draw = () => {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      )
      gradientStops.forEach((color, idx) => {
        const position =
          gradientStops.length === 1 ? 0 : idx / (gradientStops.length - 1)
        gradient.addColorStop(position, color)
      })
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const sortedBooks = [...books].sort((a, b) => a.z - b.z)
      sortedBooks.forEach(drawBook)
    }

    const animate = () => {
      update()
      draw()
      animationFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: 'transparent' }}
    />
  )
}
