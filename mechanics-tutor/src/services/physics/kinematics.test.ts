import { describe, it, expect } from 'vitest'
import {
  solveKinematics1D,
  computeProjectile,
  computeCircularMotion,
  computeSHM,
} from './kinematics'

describe('solveKinematics1D', () => {
  it('requires at least 3 known values', () => {
    const result = solveKinematics1D({ u: 0, a: 2 })
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('At least 3 values are required')
  })

  it('solves for v given u, a, t', () => {
    const result = solveKinematics1D({ u: 0, a: 3, t: 5 })
    expect(result.valid).toBe(true)
    expect(result.v).toBeCloseTo(15)
  })

  it('solves for s given u, a, t', () => {
    const result = solveKinematics1D({ u: 0, a: 2, t: 4 })
    expect(result.valid).toBe(true)
    expect(result.s).toBeCloseTo(16)
  })

  it('solves for a given u, v, t', () => {
    const result = solveKinematics1D({ u: 0, v: 20, t: 4 })
    expect(result.valid).toBe(true)
    expect(result.a).toBeCloseTo(5)
  })

  it('solves for t given u, v, a', () => {
    const result = solveKinematics1D({ u: 0, v: 10, a: 5 })
    expect(result.valid).toBe(true)
    expect(result.t).toBeCloseTo(2)
  })

  it('solves for s given u, v, a', () => {
    const result = solveKinematics1D({ u: 0, v: 10, a: 5 })
    expect(result.valid).toBe(true)
    expect(result.s).toBeCloseTo(10)
  })

  it('handles all 5 values given (redundant but consistent)', () => {
    const result = solveKinematics1D({ u: 0, v: 10, a: 5, t: 2, s: 10 })
    expect(result.valid).toBe(true)
  })
})

describe('computeProjectile', () => {
  it('computes range for horizontal launch', () => {
    const result = computeProjectile({ speed: 10, angleDeg: 0, height: 20 })
    expect(result.timeOfFlight).toBeGreaterThan(0)
    expect(result.range).toBeGreaterThan(0)
  })

  it('computes range and maxHeight at 45 degrees', () => {
    const result = computeProjectile({ speed: 20, angleDeg: 45 })
    expect(result.range).toBeGreaterThan(0)
    expect(result.maxHeight).toBeGreaterThan(0)
    expect(result.peakTime).toBeCloseTo(result.timeOfFlight / 2, 0)
  })

  it('returns trajectory array with correct length', () => {
    const result = computeProjectile({ speed: 15, angleDeg: 30 })
    expect(result.trajectory.length).toBe(61)
  })

  it('trajectory starts at origin (with zero height)', () => {
    const result = computeProjectile({ speed: 15, angleDeg: 30, height: 0 })
    expect(result.trajectory[0]?.x).toBeCloseTo(0)
    expect(result.trajectory[0]?.y).toBeCloseTo(0)
  })
})

describe('computeCircularMotion', () => {
  it('computes from speed', () => {
    const result = computeCircularMotion({ radius: 2, mass: 1, speed: 4 })
    expect(result.speed).toBe(4)
    expect(result.angularVelocity).toBeCloseTo(2)
    expect(result.centripetalAcceleration).toBeCloseTo(8)
    expect(result.centripetalForce).toBeCloseTo(8)
  })

  it('computes from period', () => {
    const result = computeCircularMotion({ radius: 1, mass: 1, period: Math.PI })
    expect(result.angularVelocity).toBeCloseTo(2)
    expect(result.speed).toBeCloseTo(2)
  })

  it('computes from omega', () => {
    const result = computeCircularMotion({ radius: 3, mass: 2, omega: 5 })
    expect(result.speed).toBeCloseTo(15)
    expect(result.centripetalForce).toBeCloseTo(2 * 75)
  })

  it('returns zero speed when no velocity input provided', () => {
    const result = computeCircularMotion({ radius: 1, mass: 1 })
    expect(result.speed).toBe(0)
    expect(result.centripetalForce).toBe(0)
  })
})

describe('computeSHM', () => {
  it('computes displacement at t=0', () => {
    const result = computeSHM({ amplitude: 2, omega: 3, t: 0 })
    expect(result.displacement).toBeCloseTo(2)
  })

  it('computes velocity at t=0 (should be 0)', () => {
    const result = computeSHM({ amplitude: 2, omega: 3, t: 0 })
    expect(result.velocity).toBeCloseTo(0)
  })

  it('computes maximum speed at quarter period', () => {
    const A = 2
    const omega = 3
    const T = (2 * Math.PI) / omega
    const result = computeSHM({ amplitude: A, omega, t: T / 4 })
    expect(Math.abs(result.velocity)).toBeCloseTo(A * omega, 1)
  })

  it('computes period and frequency correctly', () => {
    const omega = 4
    const result = computeSHM({ amplitude: 1, omega, t: 0 })
    expect(result.period).toBeCloseTo((2 * Math.PI) / omega)
    expect(result.frequency).toBeCloseTo(omega / (2 * Math.PI))
  })

  it('total energy is constant (KE + PE = constant)', () => {
    const A = 1.5
    const omega = 2
    const mass = 2
    const r1 = computeSHM({ amplitude: A, omega, t: 0, mass })
    const r2 = computeSHM({ amplitude: A, omega, t: 0.5, mass })
    const total1 = r1.kineticEnergy + r1.potentialEnergy
    const total2 = r2.kineticEnergy + r2.potentialEnergy
    expect(total1).toBeCloseTo(total2, 3)
  })
})
