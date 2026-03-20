import { useState } from 'react';
import { solveKinematics1D } from '@/services/physics/kinematics';

/**
 * SUVAT equation solver — lets learners enter known values and compute the rest.
 */
export function KinematicsSolver() {
  const [u, setU] = useState('');
  const [v, setV] = useState('');
  const [a, setA] = useState('');
  const [t, setT] = useState('');
  const [s, setS] = useState('');

  const parse = (val: string): number | undefined =>
    val.trim() === '' ? undefined : Number(val);

  const result = solveKinematics1D({
    u: parse(u), v: parse(v), a: parse(a), t: parse(t), s: parse(s),
  });

  const known = [u, v, a, t, s].filter((x) => x.trim() !== '').length;

  return (
    <div className="sim-card">
      <h3 className="sim-card__title">📐 SUVAT Solver</h3>
      <p className="sim-card__desc">
        Enter any <strong>three</strong> known values and the solver will compute the rest.
      </p>

      <div className="suvat-grid">
        {(
          [
            { sym: 'u', label: 'Initial velocity (m/s)', val: u, set: setU },
            { sym: 'v', label: 'Final velocity (m/s)', val: v, set: setV },
            { sym: 'a', label: 'Acceleration (m/s²)', val: a, set: setA },
            { sym: 't', label: 'Time (s)', val: t, set: setT },
            { sym: 's', label: 'Displacement (m)', val: s, set: setS },
          ] as const
        ).map(({ sym, label, val, set }) => (
          <label key={sym} className="suvat-field">
            <span className="suvat-field__sym">{sym}</span>
            <span className="suvat-field__label">{label}</span>
            <input
              type="number"
              className="suvat-field__input"
              value={val}
              onChange={(e) => set(e.target.value)}
              placeholder="—"
              aria-label={label}
            />
          </label>
        ))}
      </div>

      {known >= 3 && result.valid && (
        <div className="suvat-result">
          <h4>Results</h4>
          <div className="sim-results">
            <div className="sim-metric">
              <span className="sim-metric__label">u</span>
              <span className="sim-metric__value">{result.u.toFixed(3)} m/s</span>
            </div>
            <div className="sim-metric">
              <span className="sim-metric__label">v</span>
              <span className="sim-metric__value">{result.v.toFixed(3)} m/s</span>
            </div>
            <div className="sim-metric">
              <span className="sim-metric__label">a</span>
              <span className="sim-metric__value">{result.a.toFixed(3)} m/s²</span>
            </div>
            <div className="sim-metric">
              <span className="sim-metric__label">t</span>
              <span className="sim-metric__value">{result.t.toFixed(3)} s</span>
            </div>
            <div className="sim-metric">
              <span className="sim-metric__label">s</span>
              <span className="sim-metric__value">{result.s.toFixed(3)} m</span>
            </div>
          </div>
        </div>
      )}

      {known >= 3 && !result.valid && result.errors.length > 0 && (
        <div className="suvat-error">
          {result.errors.map((e, i) => (
            <p key={i} className="feedback-error">{e}</p>
          ))}
        </div>
      )}

      {known < 3 && (
        <p className="sim-card__hint">Enter at least 3 values to solve.</p>
      )}
    </div>
  );
}
