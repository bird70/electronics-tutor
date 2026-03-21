import { useState } from 'react'
import { solveKinematics1D } from '@/services/physics/kinematics'

type Field = 'u' | 'v' | 'a' | 't' | 's'

const FIELDS: { key: Field; label: string; unit: string }[] = [
  { key: 'u', label: 'Initial velocity (u)', unit: 'm/s' },
  { key: 'v', label: 'Final velocity (v)', unit: 'm/s' },
  { key: 'a', label: 'Acceleration (a)', unit: 'm/s²' },
  { key: 't', label: 'Time (t)', unit: 's' },
  { key: 's', label: 'Displacement (s)', unit: 'm' },
]

export function KinematicsSolver() {
  const [inputs, setInputs] = useState<Record<Field, string>>({ u: '', v: '', a: '', t: '', s: '' })

  const knownValues = Object.fromEntries(
    FIELDS.flatMap(({ key }) => {
      const val = parseFloat(inputs[key])
      return isNaN(val) ? [] : [[key, val]]
    })
  )

  const result = Object.keys(knownValues).length >= 3
    ? solveKinematics1D(knownValues)
    : null

  return (
    <div className="sim-container">
      <h3>SUVAT Solver</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        Enter any three known values to solve for the remaining two.
      </p>
      <div className="sim-input-grid">
        {FIELDS.map(({ key, label, unit }) => (
          <div key={key} className="sim-input-group">
            <label htmlFor={`suvat-${key}`}>{label} ({unit})</label>
            <input
              id={`suvat-${key}`}
              type="number"
              value={inputs[key]}
              onChange={(e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }))}
              placeholder="?"
              step="any"
            />
          </div>
        ))}
      </div>
      {result && (
        <div className="sim-result-panel">
          {result.valid ? (
            <>
              <h4>Results</h4>
              <div className="sim-result-grid">
                {FIELDS.map(({ key, label, unit }) => (
                  <div key={key} className="sim-result-item">
                    <span className="sim-result-item__label">{label}</span>
                    <span className="sim-result-item__value">
                      {(result[key] as number).toFixed(3)} {unit}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="sim-error">{result.errors.join('; ')}</div>
          )}
        </div>
      )}
    </div>
  )
}
