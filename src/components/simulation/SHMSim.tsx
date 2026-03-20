import { useState, useEffect, useRef } from 'react';
import { computeSHM } from '@/services/physics/kinematics';

interface Props {
  config?: {
    amplitude?: number;
    omega?: number;
  };
}

/**
 * Interactive SHM pendulum/spring visualiser.
 * Animates displacement vs time and shows current state values.
 */
export function SHMSim({ config = {} }: Props) {
  const [amplitude, setAmplitude] = useState(config.amplitude ?? 1.0);
  const [omega, setOmega] = useState(config.omega ?? 2.0);
  const [running, setRunning] = useState(true);
  const [time, setTime] = useState(0);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    if (!running) return;

    const tick = (now: number) => {
      if (lastRef.current === 0) lastRef.current = now;
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setTime((t) => t + dt);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastRef.current = 0;
    };
  }, [running]);

  const state = computeSHM({ amplitude, omega, t: time });
  const { period, frequency } = state;

  // SVG for spring/pendulum visualisation
  const W = 300;
  const H = 300;
  const cx = W / 2;
  const pivotY = 30;
  const maxLen = 120;
  const normX = state.displacement / amplitude;
  const bobX = cx + normX * 80;
  const bobY = pivotY + maxLen;

  // x-t graph
  const graphW = 300;
  const graphH = 120;
  const gPadX = 30;
  const gPadY = 15;
  const tWindow = Math.max(period * 2, 4);
  const tStart = Math.max(0, time - tWindow);
  const points: string[] = [];
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const t = tStart + (i / steps) * tWindow;
    const x = amplitude * Math.cos(omega * t);
    const px = gPadX + ((t - tStart) / tWindow) * (graphW - gPadX * 2);
    const py = gPadY + (graphH - gPadY * 2) * (1 - (x / (2 * amplitude) + 0.5));
    points.push(`${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`);
  }
  // current time cursor
  const cursorX = gPadX + graphW - gPadX * 2;

  return (
    <div className="sim-card">
      <h3 className="sim-card__title">🔁 Simple Harmonic Motion</h3>

      <div className="sim-controls">
        <label className="sim-control">
          <span>Amplitude: <strong>{amplitude.toFixed(2)} m</strong></span>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.05"
            value={amplitude}
            onChange={(e) => { setAmplitude(Number(e.target.value)); setTime(0); }}
          />
        </label>
        <label className="sim-control">
          <span>ω (angular freq): <strong>{omega.toFixed(2)} rad/s</strong></span>
          <input
            type="range"
            min="0.5"
            max="8"
            step="0.1"
            value={omega}
            onChange={(e) => { setOmega(Number(e.target.value)); setTime(0); }}
          />
        </label>
        <button className="btn btn--sm" onClick={() => { setRunning((r) => !r); lastRef.current = 0; }}>
          {running ? '⏸ Pause' : '▶ Play'}
        </button>
        <button className="btn btn--sm" onClick={() => { setTime(0); lastRef.current = 0; }}>↺ Reset</button>
      </div>

      <div className="sim-visuals">
        {/* Pendulum/spring bob */}
        <svg viewBox={`0 0 ${W} ${H}`} className="sim-canvas sim-canvas--small" aria-label="Pendulum visualisation">
          {/* Spring coil */}
          {Array.from({ length: 8 }, (_, i) => {
            const y0 = pivotY + (i * (bobY - pivotY - 10)) / 8;
            const y1 = pivotY + ((i + 1) * (bobY - pivotY - 10)) / 8;
            const mx = cx + normX * 80 * (i + 0.5) / 8;
            return (
              <path
                key={i}
                d={`M${cx + normX * 80 * i / 8},${y0} Q${mx + 12},${(y0 + y1) / 2} ${cx + normX * 80 * (i + 1) / 8},${y1}`}
                fill="none"
                stroke="var(--color-text-muted)"
                strokeWidth="2"
              />
            );
          })}
          {/* Pivot */}
          <rect x={cx - 20} y={pivotY - 8} width={40} height={8} rx={2} fill="var(--color-surface-alt)" />
          {/* Bob */}
          <circle cx={bobX} cy={bobY} r={16} fill="var(--color-accent)" opacity={0.85} />
          <text x={bobX} y={bobY + 4} textAnchor="middle" fill="var(--color-bg)" fontSize="10">m</text>
          {/* Equilibrium marker */}
          <line x1={cx} y1={pivotY + 10} x2={cx} y2={H - 10} stroke="var(--color-border)" strokeDasharray="4" strokeWidth="1" />
        </svg>

        {/* x-t graph */}
        <svg viewBox={`0 0 ${graphW} ${graphH}`} className="sim-canvas sim-canvas--small" aria-label="Displacement vs time graph">
          <line x1={gPadX} y1={gPadY} x2={gPadX} y2={graphH - gPadY} stroke="var(--color-border)" strokeWidth="1.5" />
          <line x1={gPadX} y1={graphH / 2} x2={graphW - gPadX} y2={graphH / 2} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3" />
          <line x1={gPadX} y1={graphH - gPadY} x2={graphW - gPadX} y2={graphH - gPadY} stroke="var(--color-border)" strokeWidth="1.5" />
          <path d={points.join(' ')} fill="none" stroke="var(--color-accent)" strokeWidth="2" />
          <line x1={gPadX + cursorX} y1={gPadY} x2={gPadX + cursorX} y2={graphH - gPadY} stroke="var(--color-warning)" strokeWidth="1.5" strokeDasharray="4" />
          <text x={gPadX - 4} y={gPadY + 4} fill="var(--color-text-muted)" fontSize="9" textAnchor="end">+A</text>
          <text x={gPadX - 4} y={graphH - gPadY + 4} fill="var(--color-text-muted)" fontSize="9" textAnchor="end">−A</text>
          <text x={graphW / 2} y={graphH - 2} fill="var(--color-text-muted)" fontSize="9" textAnchor="middle">time →</text>
        </svg>
      </div>

      <div className="sim-results">
        <div className="sim-metric">
          <span className="sim-metric__label">Displacement</span>
          <span className="sim-metric__value">{state.displacement.toFixed(3)} m</span>
        </div>
        <div className="sim-metric">
          <span className="sim-metric__label">Velocity</span>
          <span className="sim-metric__value">{state.velocity.toFixed(3)} m/s</span>
        </div>
        <div className="sim-metric">
          <span className="sim-metric__label">Acceleration</span>
          <span className="sim-metric__value">{state.acceleration.toFixed(3)} m/s²</span>
        </div>
        <div className="sim-metric">
          <span className="sim-metric__label">Period T</span>
          <span className="sim-metric__value">{period.toFixed(3)} s</span>
        </div>
        <div className="sim-metric">
          <span className="sim-metric__label">Frequency f</span>
          <span className="sim-metric__value">{frequency.toFixed(3)} Hz</span>
        </div>
      </div>
    </div>
  );
}
