/**
 * Rotational mechanics calculation service
 * Covers rotational kinematics and dynamics for NCEA Level 3 Physics
 */

export interface RotationalKinematicsInput {
  /** Initial angular velocity in rad/s */
  omega0?: number;
  /** Final angular velocity in rad/s */
  omega?: number;
  /** Angular acceleration in rad/s² */
  alpha?: number;
  /** Time in seconds */
  t?: number;
  /** Angular displacement in radians */
  theta?: number;
}

export interface RotationalKinematicsResult {
  omega0: number;
  omega: number;
  alpha: number;
  t: number;
  theta: number;
  valid: boolean;
  errors: string[];
}

/**
 * Solve rotational SUVAT equations.
 * Analogous to linear kinematics with θ↔s, ω↔v, α↔a.
 */
export function solveRotationalKinematics(input: RotationalKinematicsInput): RotationalKinematicsResult {
  const errors: string[] = [];
  let { omega0, omega, alpha, t, theta } = input;

  const known = [omega0, omega, alpha, t, theta].filter((x) => x !== undefined).length;
  if (known < 3) {
    return { omega0: 0, omega: 0, alpha: 0, t: 0, theta: 0, valid: false, errors: ['Need at least 3 known values.'] };
  }

  let changed = true;
  let iterations = 0;
  while (changed && iterations < 10) {
    changed = false;
    iterations++;

    if (omega === undefined && omega0 !== undefined && alpha !== undefined && t !== undefined) { omega = omega0 + alpha * t; changed = true; }
    if (omega0 === undefined && omega !== undefined && alpha !== undefined && t !== undefined) { omega0 = omega - alpha * t; changed = true; }
    if (alpha === undefined && omega !== undefined && omega0 !== undefined && t !== undefined && t !== 0) { alpha = (omega - omega0) / t; changed = true; }
    if (t === undefined && alpha !== undefined && alpha !== 0 && omega !== undefined && omega0 !== undefined) { t = (omega - omega0) / alpha; changed = true; }

    if (theta === undefined && omega0 !== undefined && omega !== undefined && t !== undefined) { theta = 0.5 * (omega0 + omega) * t; changed = true; }
    if (t === undefined && theta !== undefined && omega0 !== undefined && omega !== undefined && (omega0 + omega) !== 0) { t = (2 * theta) / (omega0 + omega); changed = true; }

    if (omega === undefined && omega0 !== undefined && alpha !== undefined && theta !== undefined) {
      const omSq = omega0 * omega0 + 2 * alpha * theta;
      if (omSq >= 0) { omega = Math.sqrt(omSq); changed = true; }
    }
    if (alpha === undefined && omega !== undefined && omega0 !== undefined && theta !== undefined && theta !== 0) { alpha = (omega * omega - omega0 * omega0) / (2 * theta); changed = true; }
    if (theta === undefined && omega0 !== undefined && t !== undefined && alpha !== undefined) { theta = omega0 * t + 0.5 * alpha * t * t; changed = true; }
  }

  if ([omega0, omega, alpha, t, theta].some((x) => x === undefined)) {
    errors.push('Could not determine all values with the given inputs.');
    return { omega0: omega0 ?? 0, omega: omega ?? 0, alpha: alpha ?? 0, t: t ?? 0, theta: theta ?? 0, valid: false, errors };
  }

  return { omega0: omega0!, omega: omega!, alpha: alpha!, t: t!, theta: theta!, valid: errors.length === 0, errors };
}

export interface TorqueInput {
  /** Force magnitude in Newtons */
  force: number;
  /** Perpendicular distance (lever arm) in metres */
  leverArm: number;
}

/**
 * τ = F × d
 */
export function computeTorque(input: TorqueInput): number {
  return input.force * input.leverArm;
}

export type MomentOfInertiaShape =
  | 'solid-cylinder'
  | 'hollow-cylinder'
  | 'solid-sphere'
  | 'point-mass'
  | 'rod-center'
  | 'rod-end';

/**
 * Compute moment of inertia for common shapes.
 */
export function computeMomentOfInertia(
  shape: MomentOfInertiaShape,
  mass: number,
  radius: number,
  length?: number,
): number {
  switch (shape) {
    case 'solid-cylinder':   return 0.5 * mass * radius * radius;
    case 'hollow-cylinder':  return mass * radius * radius;
    case 'solid-sphere':     return 0.4 * mass * radius * radius;
    case 'point-mass':       return mass * radius * radius;
    case 'rod-center':       return (1 / 12) * mass * (length ?? radius) * (length ?? radius);
    case 'rod-end':          return (1 / 3) * mass * (length ?? radius) * (length ?? radius);
    default:                 return 0;
  }
}

export interface AngularMomentumInput {
  /** Moment of inertia in kg·m² */
  momentOfInertia: number;
  /** Angular velocity in rad/s */
  omega: number;
}

/**
 * L = I × ω
 */
export function computeAngularMomentum(input: AngularMomentumInput): number {
  return input.momentOfInertia * input.omega;
}
