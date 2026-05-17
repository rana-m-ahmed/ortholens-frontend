'use client'

import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    let width = 0
    let height = 0
    let dpr = 1

    const HEX_FLAT_WIDTH = 56
    const hexRadius = HEX_FLAT_WIDTH / Math.sqrt(3)
    const hexVerticalStep = 1.5 * hexRadius

    let hexes: number[][] = []
    let particles: Particle[] = []

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const rebuildHexCache = () => {
      const newHexes: number[][] = []
      for (let colX = -HEX_FLAT_WIDTH; colX <= width + HEX_FLAT_WIDTH; colX += HEX_FLAT_WIDTH) {
        const isOddCol = Math.round(colX / HEX_FLAT_WIDTH) % 2 !== 0
        const offsetY = isOddCol ? hexVerticalStep / 2 : 0
        for (let rowY = -hexVerticalStep; rowY <= height + hexVerticalStep; rowY += hexVerticalStep) {
          const cx = colX
          const cy = rowY + offsetY
          const coords: number[] = []
          for (let i = 0; i < 6; i += 1) {
            const angle = (Math.PI / 180) * (60 * i - 30)
            coords.push(cx + hexRadius * Math.cos(angle), cy + hexRadius * Math.sin(angle))
          }
          newHexes.push(coords)
        }
      }
      hexes = newHexes
    }

    const rebuildParticles = () => {
      particles = Array.from({ length: 35 }, () => {
        const angle = Math.random() * Math.PI * 2
        const speed = randomInRange(0.1, 0.35)
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: randomInRange(0.8, 1.8),
          opacity: randomInRange(0.2, 0.5),
        }
      })
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      dpr = window.devicePixelRatio || 1

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      rebuildHexCache()
      rebuildParticles()
    }

    const startTime = performance.now()

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height)

      ctx.strokeStyle = 'rgba(0,229,255,0.04)'
      ctx.lineWidth = 0.6
      for (const coords of hexes) {
        ctx.beginPath()
        ctx.moveTo(coords[0], coords[1])
        for (let i = 2; i < coords.length; i += 2) {
          ctx.lineTo(coords[i], coords[i + 1])
        }
        ctx.closePath()
        ctx.stroke()
      }

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,229,255,${p.opacity})`
        ctx.fill()
      }

      const beamHeight = 80
      const elapsed = (now - startTime) % 7000
      const beamY = -beamHeight + ((height + beamHeight) * elapsed) / 7000
      const gradient = ctx.createLinearGradient(0, beamY, 0, beamY + beamHeight)
      gradient.addColorStop(0, 'rgba(0,229,255,0)')
      gradient.addColorStop(0.25, 'rgba(0,229,255,0.04)')
      gradient.addColorStop(0.5, 'rgba(0,229,255,0.07)')
      gradient.addColorStop(0.75, 'rgba(0,229,255,0.04)')
      gradient.addColorStop(1, 'rgba(0,229,255,0)')

      ctx.save()
      ctx.filter = 'blur(8px)'
      ctx.fillStyle = gradient
      ctx.fillRect(0, beamY, width, beamHeight)
      ctx.restore()

      rafId = window.requestAnimationFrame(draw)
    }

    resizeCanvas()
    rafId = window.requestAnimationFrame(draw)

    const observer = new ResizeObserver(() => {
      resizeCanvas()
    })
    observer.observe(canvas)

    return () => {
      window.cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  if (typeof window === 'undefined') {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
    />
  )
}
