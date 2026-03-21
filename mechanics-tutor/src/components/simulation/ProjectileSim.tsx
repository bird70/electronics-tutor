import { useState, useRef, useEffect } from 'react'
import { computeProjectile } from '@/services/physics/kinematics'

export function ProjectileSim() {
  const [speed, setSpeed] = useState(20)
  const [angle, setAngle] = useState(45)
  const [height, setHeight] = useState(0)
  const [animating, setAnimating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const frameRef = useRef(0)

  const result = computeProjectile({ speed, angleDeg: angle, height })

  function drawTrajectory(progress = 1) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    // Ground
    ctx.fillStyle = '#86efac'
    ctx.fillRect(0, H - 20, W, 20)
    ctx.strokeStyle = '#16a34a'
    ctx.beginPath(); ctx.moveTo(0, H - 20); ctx.lineTo(W, H - 20); ctx.stroke()

    const pts = result.trajectory
    const maxX = Math.max(result.range, 1)
    const maxY = Math.max(result.maxHeight + height + 2, 1)
    const scaleX = (W - 20) / maxX
    const scaleY = (H - 30) / maxY

    const toCanvas = (x: number, y: number) => ({
      cx: 10 + x * scaleX,
      cy: H - 20 - y * scaleY,
    })

    const visibleCount = Math.floor(pts.length * progress)

    ctx.strokeStyle = '#2563eb'
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i <= visibleCount && i < pts.length; i++) {
      const p = pts[i]!
      const { cx, cy } = toCanvas(p.x, p.y)
      i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy)
    }
    ctx.stroke()

    // Ball at current position
    if (visibleCount < pts.length) {
      const p = pts[visibleCount] ?? pts[pts.length - 1]!
      const { cx, cy } = toCanvas(p.x, p.y)
      ctx.fillStyle = '#dc2626'
      ctx.beginPath()
      ctx.arc(cx, cy, 5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  useEffect(() => { drawTrajectory(1) })

  function animate() {
    frameRef.current = 0
    setAnimating(true)
    const totalFrames = 80
    const step = () => {
      frameRef.current += 1
      drawTrajectory(frameRef.current / totalFrames)
      if (frameRef.current < totalFrames) {
        animRef.current = requestAnimationFrame(step)
      } else {
        setAnimating(false)
      }
    }
    animRef.current = requestAnimationFrame(step)
  }

  useEffect(() => () => { if (animRef.current) cancelAnimationFrame(animRef.current) }, [])

  return (
    <div className="sim-container">
      <h3>Projectile Simulator</h3>
      <div className="sim-input-grid">
        <div className="sim-input-group">
          <label htmlFor="proj-speed">Speed (m/s)</label>
          <input id="proj-speed" type="number" value={speed}
            onChange={(e) => setSpeed(+e.target.value)} min={1} max={100} />
        </div>
        <div className="sim-input-group">
          <label htmlFor="proj-angle">Angle (°)</label>
          <input id="proj-angle" type="number" value={angle}
            onChange={(e) => setAngle(+e.target.value)} min={0} max={90} />
        </div>
        <div className="sim-input-group">
          <label htmlFor="proj-height">Launch height (m)</label>
          <input id="proj-height" type="number" value={height}
            onChange={(e) => setHeight(+e.target.value)} min={0} max={100} />
        </div>
      </div>
      <canvas ref={canvasRef} className="sim-canvas" width={480} height={220} />
      <button className="btn btn--accent btn--sm" onClick={animate} disabled={animating}>
        {animating ? 'Animating…' : '▶ Launch'}
      </button>
      <div className="sim-result-panel">
        <h4>Results</h4>
        <div className="sim-result-grid">
          <div className="sim-result-item">
            <span className="sim-result-item__label">Range</span>
            <span className="sim-result-item__value">{result.range.toFixed(2)} m</span>
          </div>
          <div className="sim-result-item">
            <span className="sim-result-item__label">Max Height</span>
            <span className="sim-result-item__value">{result.maxHeight.toFixed(2)} m</span>
          </div>
          <div className="sim-result-item">
            <span className="sim-result-item__label">Time of Flight</span>
            <span className="sim-result-item__value">{result.timeOfFlight.toFixed(2)} s</span>
          </div>
          <div className="sim-result-item">
            <span className="sim-result-item__label">Time to Peak</span>
            <span className="sim-result-item__value">{result.peakTime.toFixed(2)} s</span>
          </div>
        </div>
      </div>
    </div>
  )
}
