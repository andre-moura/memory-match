import { useEffect, useRef } from "react"

interface ConfettiProps {
  isActive: boolean
}

export function Confetti({ isActive }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!isActive || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!canvas || !ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = [
      "#9333ea", "#22c55e", "#eab308",
      "#14b8a6", "#a855f7", "#84cc16", "#facc15"
    ]

    // Confetti particle class
    class ConfettiParticle {
      x: number
      y: number
      vx: number
      vy: number
      color: string
      size: number
      angle: number
      angleSpeed: number
      opacity: number
      canvas: HTMLCanvasElement
      ctx: CanvasRenderingContext2D

      constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas
        this.ctx = ctx
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height - canvas.height
        this.vx = Math.random() * 6 - 3
        this.vy = Math.random() * 3 + 3
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.size = Math.random() * 10 + 5
        this.angle = Math.random() * Math.PI * 2
        this.angleSpeed = Math.random() * 0.2 - 0.1
        this.opacity = 1
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.vy += 0.1 // Gravity
        this.angle += this.angleSpeed

        if (this.y > this.canvas.height - 100) {
          this.opacity = Math.max(0, this.opacity - 0.02)
        }
      }

      draw() {
        this.ctx.save()
        this.ctx.translate(this.x, this.y)
        this.ctx.rotate(this.angle)
        this.ctx.globalAlpha = this.opacity
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
        this.ctx.restore()
      }

      isOffScreen() {
        return this.y > this.canvas.height && this.opacity <= 0
      }
    }

    const particles: ConfettiParticle[] = []
    for (let i = 0; i < 150; i++) {
      particles.push(new ConfettiParticle(canvas, ctx))
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]
        particle.update()
        particle.draw()
        if (particle.isOffScreen()) {
          particles.splice(i, 1)
        }
      }

      if (particles.length < 150 && Math.random() < 0.3) {
        particles.push(new ConfettiParticle(canvas, ctx))
      }

      if (particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive])

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ width: "100%", height: "100%" }}
    />
  )
}