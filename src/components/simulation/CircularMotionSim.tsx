import { useState, useEffect, useRef } from 'react';
import { computeCircularMotion } from '@/services/physics/kinematics';

interface Props {
  config?: {
    radius?: number;
    speed?: number;
    mass?: number;
  };
}

/**
 * Interactive circular motion simulation.
 */
export function CircularMotionSim({ config = {} }: Props) {
  const [radius, setRadius] = useState(config.radius ?? 1.5);
  const [speed, setSpeed] = useState(config.speed ?? 3.0);
  const [mass, setMass] = useState(config.mass ?? 0.5);
  const [running, setRunning] = useState(true);
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  const result = computeCircularMotion({ radius, speed, mass });

  useEffect(() => {
    if (!running) return;

    const tick = (now: number) => {
      if (lastRef.current === 0) lastRef.current = now;
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setAngle((a) => a + result.angularVelocity * dt);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastRef.current = 0;
    };
  }, [running, result.angularVelocity]);

  const W = 300;
  const H = 300;
  const cx = W / 2;
  const cy = H / 2;
  const svgRadius = 100;
  const bobX = cx + svgRadius * Math.cos(angle);
  const bobY = cy - svgRadius * Math.sin(angle);
  // Centripetal acceleration direction (toward center)
  const accelScale = 30;
  const ax = (cx - bobX) / svgRadius * accelScale;
  const ay = (cy - bobY) / svgRadius * accelScale;
  // Velocity direction (tangent)
  const velScale = 20;
  const vx = -speed / speed * Math.sin(angle) * velScale;
  const vy = -speed / speed * Math.cos(angle) * velScale;

  return (
    <div className="sim-card">
      <h3 className="sim-card__title">⭕ Circular Motion</h3>

      <div className="sim-controls">
        <label className="sim-control">
          <span>Radius: <strong>{radius.toFixed(1)} m</strong></span>
          <input
            type="range" min="0.5" max="5" step="0.1" value={radius}
            onChange={(e) => { setRadius(Number(e.target.value)); lastRef.current = 0; }}
          />
        </label>
        <label className="sim-control">
          <span>Speed: <strong>{speed.toFixed(1)} m/s</strong></span>
          <input
            type="range" min="0.5" max="20" step="0.1" value={speed}
            onChange={(e) => { setSpeed(Number(e.target.value)); lastRef.current = 0; }}
          />
        </label>
        <label className="sim-control">
          <span>Mass: <strong>{mass.toFixed(2)} kg</strong></span>
          <input
            type="range" min="0.1" max="5" step="0.05" value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
          />
        </label>
        <button className="btn btn--sm" onClick={() => { setRunning((r) => !r); lastRef.current = 0; }}>
          {running ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="sim-canvas sim-canvas--small" aria-label="Circular motion diagram">
        {/* Orbit path */}
        <circle cx={cx} cy={cy} r={svgRadius} fill="none" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="6" />
        {/* Center dot */}
        <circle cx={cx} cy={cy} r={4} fill="var(--color-text-muted)" />
        {/* Radius line */}
        <line x1={cx} y1={cy} x2={bobX} y2={bobY} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4" />

        {/* Centripetal acceleration arrow */}
        <defs>
          <marker id="arrow-accent" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-accent)" />
          </marker>
          <marker id="arrow-warning" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--color-warning)" />
          </marker>
        </defs>
        <line
          x1={bobX} y1={bobY}
          x2={bobX + ax} y2={bobY + ay}
          stroke="var(--color-accent)"
          strokeWidth="2"
          markerEnd="url(#arrow-accent)"
        />
        <text x={bobX + ax + 4} y={bobY + ay} fill="var(--color-accent)" fontSize="10">a_c</text>

        {/* Velocity arrow */}
        <line
          x1={bobX} y1={bobY}
          x2={bobX + vx} y2={bobY + vy}
          stroke="var(--color-warning)"
          strokeWidth="2"
          markerEnd="url(#arrow-warning)"
        />
        <text x={bobX + vx + 4} y={bobY + vy} fill="var(--color-warning)" fontSize="10">v</text>

        {/* Moving object */}
        <circle cx={bobX} cy={bobY} r={12} fill="var(--color-accent)" opacity={0.85} />
        <text x={bobX} y={bobY + 4} textAnchor="middle" fill="var(--color-bg)" fontSize="9">m</text>
      </svg>

      <div className="sim-results">
        <div className="sim-metric">
          <span className="sim-metric__label">ω (angular velocity)</span>
          <span className="sim-metric__value">{result.angularVelocity.toFixed(3)} rad/s</span>
        </div>
        <div className="sim-metric">
          <span className="sim-metric__label">Period T</span>
          <span className="sim-metric__value">{result.period.toFixed(3)} s</span>
        </div>
        <div className="sim-metric">
          <span className="sim-metric__label">Centripetal acc.</span>
          <span className="sim-metric__value">{result.centripetalAcceleration.toFixed(3)} m/s²</span>
        </div>
        <div className="sim-metric">
          <span className="sim-metric__label">Centripetal force</span>
          <span className="sim-metric__value">{result.centripetalForce.toFixed(3)} N</span>
        </div>
      </div>
    </div>
  );
}
