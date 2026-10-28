import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Converts a 6-digit hex colour string to an rgba() string.
 * Used at particle creation time so we never string-replace inside the
 * animation loop, which runs up to 60× per second.
 */
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const PARTICLE_COLORS = ['#C8FF3D', '#C8FF3D']

/**
 * Particle count is derived from viewport area, but capped. The link-drawing
 * pass is O(n²), so an uncapped count on a 4K display would mean ~415 particles
 * and ~86k distance checks per frame — enough to drop below 60fps on the
 * integrated graphics most reviewers are running.
 */
const MAX_PARTICLES = 120
const AREA_PER_PARTICLE = 20000

/** Squared, so the hot loop never calls Math.sqrt. */
const LINK_DISTANCE = 100
const LINK_DISTANCE_SQ = LINK_DISTANCE * LINK_DISTANCE
const REPEL_RADIUS = 200
const REPEL_RADIUS_SQ = REPEL_RADIUS * REPEL_RADIUS

const ParticleBackground = () => {
  const canvasRef = useRef(null)
  // Store mouse position in a ref — no state — so reading it inside the
  // animation loop never triggers a re-render or re-runs the effect.
  const mouseRef = useRef({ x: -9999, y: -9999 })

  const { scrollY } = useScroll()
  const gridOpacity = useTransform(scrollY, [0, 500], [1, 0.3])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []

    // Logical (CSS) pixel dimensions. The backing store is scaled by DPR
    // separately so the canvas isn't blurry on high-density displays.
    let width = 0
    let height = 0

    const resize = () => {
      // Cap DPR at 2 — beyond that the pixel cost roughly quadruples for
      // no perceptible gain on a decorative background.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight

      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      // Reset any prior transform before applying the new scale, otherwise
      // successive resizes compound the DPR scaling.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const createParticles = () => {
      particles = []
      const count = Math.min(
        Math.floor((width * height) / AREA_PER_PARTICLE),
        MAX_PARTICLES
      )
      for (let i = 0; i < count; i++) {
        const hex = PARTICLE_COLORS[Math.random() > 0.7 ? 0 : 1]
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.4 + 0.1,
          hex,
          // Pre-compute glow colour once at creation — avoids string ops in loop
          glowRgba: hexToRgba(hex, 0.15),
        })
      }
    }

    const drawGrid = () => {
      const gridSize = 80
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.015)'
      ctx.lineWidth = 1

      // One path for every line, one stroke call — batching this way avoids
      // a state flush per gridline.
      ctx.beginPath()
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()

      ctx.fillStyle = 'rgba(0, 243, 255, 0.04)'
      ctx.beginPath()
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          ctx.moveTo(x + 1.5, y)
          ctx.arc(x, y, 1.5, 0, Math.PI * 2)
        }
      }
      ctx.fill()
    }

    const connectParticles = () => {
      // O(n²) over a capped particle count. Comparing squared distances keeps
      // Math.sqrt out of the inner loop entirely — it only runs for pairs that
      // are actually close enough to draw, which is a small minority.
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distSq = dx * dx + dy * dy
          if (distSq < LINK_DISTANCE_SQ) {
            const dist = Math.sqrt(distSq)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(0, 243, 255, ${0.08 * (1 - dist / LINK_DISTANCE)})`
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.15)'
      ctx.fillRect(0, 0, width, height)

      drawGrid()

      const { x: mx, y: my } = mouseRef.current

      particles.forEach((p) => {
        // Mouse repulsion
        const dx = mx - p.x
        const dy = my - p.y
        const distSq = dx * dx + dy * dy
        if (distSq < REPEL_RADIUS_SQ && distSq > 0) {
          const dist = Math.sqrt(distSq)
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS
          p.x -= dx * force * 0.01
          p.y -= dy * force * 0.01
        }

        p.x += p.speedX
        p.y += p.speedY

        // Wrap edges
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Core particle dot
        ctx.globalAlpha = p.opacity
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.hex
        ctx.fill()

        // Radial glow — uses pre-computed rgba so no string ops here
        ctx.globalAlpha = 1
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        gradient.addColorStop(0, p.glowRgba)
        gradient.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      // Reset alpha once after particle loop — not per-particle
      ctx.globalAlpha = 1
      connectParticles()

      animationFrameId = requestAnimationFrame(animate)
    }

    // Named so it can be removed in cleanup — anonymous arrows can't be
    // unregistered by removeEventListener.
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleResize = () => {
      resize()
      createParticles()
    }

    // A background tab still services requestAnimationFrame in some browsers,
    // and even when throttled it keeps the GPU warm for no benefit. Suspend on
    // hide, resume on show.
    const handleVisibility = () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
        }
      } else if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }

    resize()
    createParticles()

    // Honour the OS reduced-motion setting: render one static frame and stop.
    // Continuous ambient motion is a genuine accessibility problem for people
    // with vestibular disorders, and the background carries no information.
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (reduceMotion?.matches) {
      ctx.fillStyle = '#0B0B0D'
      ctx.fillRect(0, 0, width, height)
      drawGrid()
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }

    animate()

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
    // Empty deps: intentional — this effect runs once and is self-contained.
    // Mouse position is read via mouseRef; resize is handled by a named listener.
  }, [])

  return (
    <>
      <motion.canvas
        ref={canvasRef}
        style={{ opacity: gridOpacity }}
        className="fixed inset-0 pointer-events-none"
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, #0B0B0D 70%)',
          opacity: 0.6,
        }}
      />

      {/* Corner Accents */}
      <div className="fixed top-0 left-0 w-64 h-64 pointer-events-none">
        <div className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-[#C8FF3D]/30 to-transparent" />
        <div className="absolute top-0 left-0 h-px w-32 bg-gradient-to-r from-[#C8FF3D]/30 to-transparent" />
      </div>
      <div className="fixed top-0 right-0 w-64 h-64 pointer-events-none">
        <div className="absolute top-0 right-0 w-px h-32 bg-gradient-to-b from-[#C8FF3D]/30 to-transparent" />
        <div className="absolute top-0 right-0 h-px w-32 bg-gradient-to-l from-[#C8FF3D]/30 to-transparent" />
      </div>
      <div className="fixed bottom-0 left-0 w-64 h-64 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-px h-32 bg-gradient-to-t from-[#C8FF3D]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 h-px w-32 bg-gradient-to-r from-[#C8FF3D]/30 to-transparent" />
      </div>
      <div className="fixed bottom-0 right-0 w-64 h-64 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-px h-32 bg-gradient-to-t from-[#C8FF3D]/30 to-transparent" />
        <div className="absolute bottom-0 right-0 h-px w-32 bg-gradient-to-l from-[#C8FF3D]/30 to-transparent" />
      </div>
    </>
  )
}

export default ParticleBackground
