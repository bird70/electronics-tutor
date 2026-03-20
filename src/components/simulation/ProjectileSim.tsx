import { useState, useCallback } from 'react';
import { computeProjectile } from '@/services/physics/kinematics';

interface Props {
  config?: {
    speed?: number;
    angleDeg?: number;
    height?: number;
  };
}

/**
 * Interactive projectile motion simulation.
 * Shows an SVG trajectory and key metrics.
 */
export function ProjectileSim({ config = {} }: Props) {
  const [speed, setSpeed] = useState(config.speed ?? 20);
  const [angle, setAngle] = useState(config.angleDeg ?? 45);
  const [height, setHeight] = useState(config.height ?? 0);

  const result = computeProjectile({ speed, angleDeg: angle, height });

  // SVG viewport: map metres to pixels
  const W = 600;
  const H = 280;
  const padding = 40;
  const maxX = Math.max(result.range, 1);
  const maxY = Math.max(result.maxHeight * 1.15, 1);
  const scaleX = (W - padding * 2) / maxX;
  const scaleY = (H - padding * 2) / maxY;

  const toSvg = (x: number, y: number) => ({
    x: padding + x * scaleX,
    y: H - padding - y * scaleY,
  });

  const pathPoints = result.trajectory
    .map((p) => toSvg(p.x, p.y))
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  const peak = toSvg(result.peakTime * speed * Math.cos((angle * Math.PI) / 180), result.maxHeight);
  const landing = toSvg(result.range, 0);

  const handleReset = useCallback(() => {
    setSpeed(20);
    setAngle(45);
    setHeight(0);
  }, []);

  return (
    <div className="sim-card">
      <h3 className="sim-card__title">🏀 Projectile Motion</h3>

      <div className="sim-controls">
        <label className="sim-control">
          <span>Initial Speed: <strong>{speed} m/s</strong></span>
          <input
            type="range"
            min="1"
            max="50"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </label>
        <label className="sim-control">
          <span>Launch Angle: <strong>{angle}°</strong></span>
          <input
            type="range"
            min="1"
            max="89"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
          />
        </label>
        <label className="sim-control">
          <span>Launch Height: <strong>{height} m</strong></span>
          <input
            type="range"
            min="0"
            max="30"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />
        </label>
        <button className="btn btn--sm" onClick={handleReset}>↺ Reset</button>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="sim-canvas"
        aria-label="Projectile trajectory graph"
        role="img"
      >
        {/* Ground line */}
        <line
          x1={padding} y1={H - padding}
          x2={W - padding} y2={H - padding}
          stroke="var(--color-border)" strokeWidth="1.5"
        />
        {/* Y-axis */}
        <line
          x1={padding} y1={padding}
          x2={padding} y2={H - padding}
          stroke="var(--color-border)" strokeWidth="1.5"
        />

        {/* Trajectory path */}
        <path d={pathPoints} fill="none" stroke="var(--color-accent)" strokeWidth="2" />

        {/* Peak marker */}
        <circle cx={peak.x} cy={peak.y} r={5} fill="var(--color-warning)" />
        <text
          x={peak.x + 6}
          y={peak.y - 4}
          fill="var(--color-warning)"
          fontSize="11"
        >
          H = {result.maxHeight.toFixed(1)} m
        </text>

        {/* Landing marker */}
        <circle cx={landing.x} cy={landing.y} r={5} fill="var(--color-success)" />
        <text
          x={landing.x + 6}
          y={landing.y - 4}
          fill="var(--color-success)"
          fontSize="11"
        >
          R = {result.range.toFixed(1)} m
        </text>

        {/* Axis labels */}
        <text x={W / 2} y={H - 4} fill="var(--color-text-muted)" fontSize="11" textAnchor="middle">
          Horizontal distance (m)
        </text>
        <text
          x={10}
          y={H / 2}
          fill="var(--color-text-muted)"
          fontSize="11"
          textAnchor="middle"
          transform={`rotate(-90, 10, ${H / 2})`}
        >
          Height (m)
        </text>
      </svg>

      <div className="sim-results">
        <div className="sim-metric">
          <span className="sim-metric__label">Range</span>
          <span className="sim-metric__value">{result.range.toFixed(2)} m</span>
        </div>
        <div className="sim-metric">
          <span className="sim-metric__label">Max Height</span>
          <span className="sim-metric__value">{result.maxHeight.toFixed(2)} m</span>
        </div>
        <div className="sim-metric">
          <span className="sim-metric__label">Time of Flight</span>
          <span className="sim-metric__value">{result.timeOfFlight.toFixed(2)} s</span>
        </div>
        <div className="sim-metric">
          <span className="sim-metric__label">vₓ</span>
          <span className="sim-metric__value">
            {(speed * Math.cos((angle * Math.PI) / 180)).toFixed(2)} m/s
          </span>
        </div>
        <div className="sim-metric">
          <span className="sim-metric__label">v_y₀</span>
          <span className="sim-metric__value">
            {(speed * Math.sin((angle * Math.PI) / 180)).toFixed(2)} m/s
          </span>
        </div>
      </div>
    </div>
  );
}
