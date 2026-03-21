import { describe, it, expect } from 'vitest'
import { computeRotationalKinematics, computeAngularMomentum } from './rotational'

describe('computeRotationalKinematics', () => {
  it('computes angular acceleration from torque and moment of inertia', () => {
    const result = computeRotationalKinematics({ torque: 12, momentOfInertia: 4 })
    expect(result.angularAcceleration).toBeCloseTo(3)
    expect(result.torque).toBeCloseTo(12)
  })

  it('computes final omega when torque and time are given', () => {
    const result = computeRotationalKinematics({ torque: 10, momentOfInertia: 2, initialOmega: 0, time: 5 })
    expect(result.angularAcceleration).toBeCloseTo(5)
    expect(result.finalOmega).toBeCloseTo(25)
  })

  it('computes rotational kinetic energy', () => {
    const result = computeRotationalKinematics({ torque: 0, momentOfInertia: 2, initialOmega: 4, finalOmega: 4 })
    // KE = ½Iω² = ½ × 2 × 16 = 16 J
    expect(result.rotationalKE).toBeCloseTo(16)
  })

  it('computes torque and alpha from initial/final omega and time', () => {
    const result = computeRotationalKinematics({
      momentOfInertia: 3,
      initialOmega: 0,
      finalOmega: 9,
      time: 3,
    })
    expect(result.angularAcceleration).toBeCloseTo(3)
    expect(result.torque).toBeCloseTo(9)
  })

  it('defaults to zero torque when insufficient data', () => {
    const result = computeRotationalKinematics({ momentOfInertia: 5 })
    expect(result.torque).toBe(0)
    expect(result.angularAcceleration).toBe(0)
  })
})

describe('computeAngularMomentum', () => {
  it('computes angular momentum L = Iω', () => {
    const result = computeAngularMomentum({ momentOfInertia: 3, omega: 4 })
    expect(result.angularMomentum).toBeCloseTo(12)
    expect(result.conserved).toBe(false)
  })

  it('applies conservation of angular momentum', () => {
    // Skater: I₁ω₁ = I₂ω₂ → ω₂ = I₁ω₁ / I₂
    const result = computeAngularMomentum({
      momentOfInertia: 2,
      omega: 3,
      newMomentOfInertia: 0.5,
    })
    expect(result.conserved).toBe(true)
    expect(result.newOmega).toBeCloseTo(12)
    expect(result.newAngularMomentum).toBeCloseTo(6)
  })

  it('conserved angular momentum equals original', () => {
    const I1 = 4
    const omega1 = 5
    const I2 = 2
    const result = computeAngularMomentum({ momentOfInertia: I1, omega: omega1, newMomentOfInertia: I2 })
    expect(result.angularMomentum).toBeCloseTo(result.newAngularMomentum!)
  })
})
