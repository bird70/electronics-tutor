import { useState, useRef, useEffect, useCallback } from 'react'
import { computeSHM } from '@/services/physics/kinematics'

export function SHMSim() {
  const [amplitude, setAmplitude] = useState(1)
  const [omega, setOmega] = useState(2)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const tRef = useRef(0)
  const lastRef = useRef(0)

  const result = computeSHM({ amplitude, omega, t: 0 })

  const draw = useCallback((t: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const cy = H / 2
    const ampPx = (H / 2 - 20)

    // Draw sinusoidal trail
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    const period = (2 * Math.PI) / omega
    const steps = 200
    for (let i = 0; i <= steps; i++) {
      const tPlot = t - period + (i / steps) * period
      const x = (i / steps) * (W - 20) + 10
      const y = cy - computeSHM({ amplitude, omega, t: tPlot }).displacement * ampPx
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Equilibrium line
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(10, cy)
    ctx.lineTo(W - 10, cy)
    ctx.stroke()
    ctx.setLineDash([])

    // Current position dot
    const curr = computeSHM({ amplitude, omega, t })
    const ballY = cy - curr.displacement * ampPx
    ctx.fillStyle = '#2563eb'
    ctx.beginPath()
    ctx.arc(W - 20, ballY, 8, 0, Math.PI * 2)
    ctx.fill()
  }, [amplitude, omega])

  useEffect(() => {
    const loop = (ts: number) => {
      const dt = (ts - lastRef.current) / 1000
      lastRef.current = ts
      tRef.current += dt
      draw(tRef.current)
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [draw])

  return (
    <div className="sim-container">
      <h3>Simple Harmonic Motion</h3>
      <div className="sim-input-grid">
        <div className="sim-input-group">
          <label htmlFor="shm-amp">Amplitude A (m)</label>
          <input id="shm-amp" type="number" value={amplitude}
            onChange={(e) => setAmplitude(+e.target.value)} min={0.1} max={5} step={0.1} />
        </div>
        <div className="sim-input-group">
          <label htmlFor="shm-omega">Angular freq ω (rad/s)</label>
          <input id="shm-omega" type="number" value={omega}
            onChange={(e) => setOmega(+e.target.value)} min={0.1} max={20} step={0.1} />
        </div>
      </div>
      <canvas ref={canvasRef} className="sim-canvas" width={480} height={180} />
      <div className="sim-result-panel">
        <h4>Properties</h4>
        <div className="sim-result-grid">
          <div className="sim-result-item">
            <span className="sim-result-item__label">Period (T)</span>
            <span className="sim-result-item__value">{result.period.toFixed(3)} s</span>
          </div>
          <div className="sim-result-item">
            <span className="sim-result-item__label">Frequency (f)</span>
            <span className="sim-result-item__value">{result.frequency.toFixed(3)} Hz</span>
          </div>
          <div className="sim-result-item">
            <span className="sim-result-item__label">Amplitude</span>
            <span className="sim-result-item__value">{amplitude} m</span>
          </div>
          <div className="sim-result-item">
            <span className="sim-result-item__label">Max speed</span>
            <span className="sim-result-item__value">{(amplitude * omega).toFixed(3)} m/s</span>
          </div>
        </div>
      </div>
    </div>
  )
}
