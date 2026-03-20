import { describe, expect, it } from 'vitest';
import {
  solveKinematics1D,
  computeProjectile,
  computeCircularMotion,
  computeSHM,
} from '@/services/physics/kinematics';

describe('solveKinematics1D', () => {
  it('solves for v given u, a, t', () => {
    const result = solveKinematics1D({ u: 0, a: 2, t: 5 });
    expect(result.valid).toBe(true);
    expect(result.v).toBeCloseTo(10, 2);
    expect(result.s).toBeCloseTo(25, 2);
  });

  it('solves for a given u, v, t', () => {
    const result = solveKinematics1D({ u: 5, v: 25, t: 10 });
    expect(result.valid).toBe(true);
    expect(result.a).toBeCloseTo(2, 5);
    expect(result.s).toBeCloseTo(150, 2);
  });

  it('solves for s given u, v, a', () => {
    // Car decelerating from 12 m/s to 0, deceleration = -2.4 m/s²
    const result = solveKinematics1D({ u: 12, v: 0, a: -2.4 });
    expect(result.valid).toBe(true);
    expect(result.s).toBeCloseTo(30, 2);
  });

  it('returns invalid for fewer than 3 known values', () => {
    const result = solveKinematics1D({ u: 5, a: 2 });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('handles free fall correctly (u=0, a=-9.81, t=2)', () => {
    const result = solveKinematics1D({ u: 0, a: -9.81, t: 2 });
    expect(result.valid).toBe(true);
    expect(result.v).toBeCloseTo(-19.62, 1);
    expect(result.s).toBeCloseTo(-19.62, 1);
  });
});

describe('computeProjectile', () => {
  it('computes 45° launch at 20 m/s correctly', () => {
    const result = computeProjectile({ speed: 20, angleDeg: 45 });
    // Range = u² sin(90°) / g = 400/9.81 ≈ 40.77 m
    expect(result.range).toBeCloseTo(40.77, 0);
    // Max height = (u sin 45°)² / 2g = (14.14)²/19.62 ≈ 10.19 m
    expect(result.maxHeight).toBeCloseTo(10.19, 0);
    // Time of flight ≈ 2 × 20 × sin45° / 9.81 ≈ 2.88 s
    expect(result.timeOfFlight).toBeCloseTo(2.88, 0);
  });

  it('returns trajectory array with correct length', () => {
    const result = computeProjectile({ speed: 10, angleDeg: 30 });
    expect(result.trajectory.length).toBe(61); // 0..60 steps
  });

  it('horizontal launch from height', () => {
    const result = computeProjectile({ speed: 15, angleDeg: 0, height: 20 });
    // Time: t = sqrt(2h/g) = sqrt(40/9.81) ≈ 2.02 s
    expect(result.timeOfFlight).toBeCloseTo(2.02, 1);
    // Range: x = v_x * t = 15 * 2.02 ≈ 30.3 m
    expect(result.range).toBeCloseTo(30.3, 0);
  });
});

describe('computeCircularMotion', () => {
  it('computes from speed', () => {
    const result = computeCircularMotion({ radius: 2, speed: 4, mass: 0.5 });
    // a_c = v²/r = 16/2 = 8 m/s²
    expect(result.centripetalAcceleration).toBeCloseTo(8, 5);
    // F_c = m * a_c = 0.5 * 8 = 4 N
    expect(result.centripetalForce).toBeCloseTo(4, 5);
    // T = 2πr/v = 4π/4 = π s ≈ 3.14 s
    expect(result.period).toBeCloseTo(Math.PI, 3);
  });

  it('computes from period', () => {
    const result = computeCircularMotion({ radius: 1, period: 2, mass: 1 });
    // speed = 2πr/T = 2π/2 = π ≈ 3.14 m/s
    expect(result.speed).toBeCloseTo(Math.PI, 3);
    // ω = 2π/T = π rad/s
    expect(result.angularVelocity).toBeCloseTo(Math.PI, 3);
  });
});

describe('computeSHM', () => {
  it('computes at t=0 (should be at amplitude)', () => {
    const result = computeSHM({ amplitude: 0.5, omega: 4, t: 0 });
    expect(result.displacement).toBeCloseTo(0.5, 5);
    expect(result.velocity).toBeCloseTo(0, 5);
    // a = -ω²x = -16 × 0.5 = -8
    expect(result.acceleration).toBeCloseTo(-8, 5);
  });

  it('computes period and frequency correctly', () => {
    const omega = 5;
    const result = computeSHM({ amplitude: 1, omega, t: 0 });
    expect(result.period).toBeCloseTo((2 * Math.PI) / omega, 5);
    expect(result.frequency).toBeCloseTo(omega / (2 * Math.PI), 5);
  });

  it('maximum speed at equilibrium (t = T/4)', () => {
    const A = 0.1;
    const omega = 5;
    const T = (2 * Math.PI) / omega;
    const result = computeSHM({ amplitude: A, omega, t: T / 4 });
    // At T/4, cos(ωt) = cos(π/2) = 0, so x ≈ 0
    expect(Math.abs(result.displacement)).toBeLessThan(1e-10);
    // v = -Aω sin(π/2) = -Aω (maximum magnitude)
    expect(Math.abs(result.velocity)).toBeCloseTo(A * omega, 5);
  });

  it('energy conservation: KE + PE ≈ constant', () => {
    const A = 0.2;
    const omega = 3;
    const mass = 2;
    const totalE = 0.5 * mass * omega * omega * A * A;

    for (const t of [0, 0.1, 0.3, 0.7]) {
      const r = computeSHM({ amplitude: A, omega, t, mass });
      const energy = r.kineticEnergy + r.potentialEnergy;
      expect(energy).toBeCloseTo(totalE, 5);
    }
  });
});
