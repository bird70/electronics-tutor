import { describe, expect, it } from 'vitest';
import {
  solveRotationalKinematics,
  computeTorque,
  computeMomentOfInertia,
  computeAngularMomentum,
} from '@/services/physics/rotational';

describe('solveRotationalKinematics', () => {
  it('solves for omega given omega0, alpha, t', () => {
    const result = solveRotationalKinematics({ omega0: 0, alpha: 3, t: 4 });
    expect(result.valid).toBe(true);
    expect(result.omega).toBeCloseTo(12, 5);
    expect(result.theta).toBeCloseTo(24, 5);
  });

  it('returns invalid with fewer than 3 knowns', () => {
    const result = solveRotationalKinematics({ omega0: 5, alpha: 2 });
    expect(result.valid).toBe(false);
  });
});

describe('computeTorque', () => {
  it('calculates torque correctly', () => {
    expect(computeTorque({ force: 10, leverArm: 0.5 })).toBeCloseTo(5, 5);
    expect(computeTorque({ force: 20, leverArm: 1.5 })).toBeCloseTo(30, 5);
  });
});

describe('computeMomentOfInertia', () => {
  it('solid cylinder: I = ½MR²', () => {
    expect(computeMomentOfInertia('solid-cylinder', 4, 0.3)).toBeCloseTo(0.5 * 4 * 0.09, 5);
  });

  it('hollow cylinder: I = MR²', () => {
    expect(computeMomentOfInertia('hollow-cylinder', 2, 0.5)).toBeCloseTo(2 * 0.25, 5);
  });

  it('rod about end: I = ML²/3', () => {
    const M = 3;
    const L = 2;
    expect(computeMomentOfInertia('rod-end', M, 0, L)).toBeCloseTo((1 / 3) * M * L * L, 5);
  });

  it('rod about centre: I = ML²/12', () => {
    const M = 4;
    const L = 3;
    expect(computeMomentOfInertia('rod-center', M, 0, L)).toBeCloseTo((1 / 12) * M * L * L, 5);
  });
});

describe('computeAngularMomentum', () => {
  it('L = Iω', () => {
    expect(computeAngularMomentum({ momentOfInertia: 3, omega: 5 })).toBeCloseTo(15, 5);
    expect(computeAngularMomentum({ momentOfInertia: 0.09, omega: 6 })).toBeCloseTo(0.54, 5);
  });
});
