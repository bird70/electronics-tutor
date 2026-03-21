import { useState, useRef, useEffect, useCallback } from 'react'
import { computeCircularMotion } from '@/services/physics/kinematics'

export function CircularMotionSim() {
  const [radius, setRadius] = useState(2)
  const [mass, setMass] = useState(1)
  const [speed, setSpeed] = useState(4)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const angleRef = useRef(0)

  const result = computeCircularMotion({ radius, mass, speed })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H / 2
    const r = Math.min(W, H) * 0.35

    ctx.clearRect(0, 0, W, H)

    // Orbit ring
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Centre dot
    ctx.fillStyle = '#64748b'
    ctx.beginPath()
    ctx.arc(cx, cy, 4, 0, Math.PI * 2)
    ctx.fill()

    // Radius line
    const bx = cx + r * Math.cos(angleRef.current)
    const by = cy + r * Math.sin(angleRef.current)
    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(bx, by)
    ctx.stroke()

    // Ball
    ctx.fillStyle = '#2563eb'
    ctx.beginPath()
    ctx.arc(bx, by, 10, 0, Math.PI * 2)
    ctx.fill()

    // Velocity arrow
    const vx = -Math.sin(angleRef.current) * 30
    const vy = Math.cos(angleRef.current) * 30
    ctx.strokeStyle = '#dc2626'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(bx, by)
    ctx.lineTo(bx + vx, by + vy)
    ctx.stroke()
  }, [])

  useEffect(() => {
    let lastTime = 0
    const loop = (t: number) => {
      const dt = (t - lastTime) / 1000
      lastTime = t
      angleRef.current += result.angularVelocity * dt
      draw()
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [result.angularVelocity, draw])

  return (
    <div className="sim-container">
      <h3>Circular Motion</h3>
      <div className="sim-input-grid">
        <div className="sim-input-group">
          <label htmlFor="cm-radius">Radius (m)</label>
          <input id="cm-radius" type="number" value={radius}
            onChange={(e) => setRadius(+e.target.value)} min={0.1} max={20} step={0.1} />
        </div>
        <div className="sim-input-group">
          <label htmlFor="cm-mass">Mass (kg)</label>
          <input id="cm-mass" type="number" value={mass}
            onChange={(e) => setMass(+e.target.value)} min={0.1} max={100} step={0.1} />
        </div>
        <div className="sim-input-group">
          <label htmlFor="cm-speed">Speed (m/s)</label>
          <input id="cm-speed" type="number" value={speed}
            onChange={(e) => setSpeed(+e.target.value)} min={0.1} max={50} step={0.1} />
        </div>
      </div>
      <canvas ref={canvasRef} className="sim-canvas" width={300} height={300} />
      <div className="sim-result-panel">
        <h4>Results</h4>
        <div className="sim-result-grid">
          <div className="sim-result-item">
            <span className="sim-result-item__label">Angular velocity (ω)</span>
            <span className="sim-result-item__value">{result.angularVelocity.toFixed(3)} rad/s</span>
          </div>
          <div className="sim-result-item">
            <span className="sim-result-item__label">Period (T)</span>
            <span className="sim-result-item__value">{isFinite(result.period) ? result.period.toFixed(3) + ' s' : '∞'}</span>
          </div>
          <div className="sim-result-item">
            <span className="sim-result-item__label">Centripetal acc.</span>
            <span className="sim-result-item__value">{result.centripetalAcceleration.toFixed(3)} m/s²</span>
          </div>
          <div className="sim-result-item">
            <span className="sim-result-item__label">Centripetal force</span>
            <span className="sim-result-item__value">{result.centripetalForce.toFixed(3)} N</span>
          </div>
        </div>
      </div>
    </div>
  )
}
