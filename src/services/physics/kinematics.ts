/**
 * Kinematics calculation service
 * Covers 1D and 2D motion for NCEA Level 3 Physics
 */

export interface KinematicsInput1D {
  /** Initial velocity in m/s */
  u?: number;
  /** Final velocity in m/s */
  v?: number;
  /** Acceleration in m/s² */
  a?: number;
  /** Time in seconds */
  t?: number;
  /** Displacement in metres */
  s?: number;
}

export interface KinematicsResult1D {
  u: number;
  v: number;
  a: number;
  t: number;
  s: number;
  valid: boolean;
  errors: string[];
}

/**
 * Solve 1D kinematics given three of the five SUVAT variables.
 * Returns all five values, or errors if the system is under/over-determined.
 */
export function solveKinematics1D(input: KinematicsInput1D): KinematicsResult1D {
  const errors: string[] = [];
  let { u, v, a, t, s } = input;

  const known = [u, v, a, t, s].filter((x) => x !== undefined).length;
  if (known < 3) {
    return { u: 0, v: 0, a: 0, t: 0, s: 0, valid: false, errors: ['Need at least 3 known values.'] };
  }

  // Attempt to derive unknowns using SUVAT equations:
  // (1) v = u + at
  // (2) s = ut + ½at²
  // (3) v² = u² + 2as
  // (4) s = ½(u+v)t

  let changed = true;
  let iterations = 0;
  while (changed && iterations < 10) {
    changed = false;
    iterations++;

    // (1) v = u + at
    if (v === undefined && u !== undefined && a !== undefined && t !== undefined) { v = u + a * t; changed = true; }
    if (u === undefined && v !== undefined && a !== undefined && t !== undefined) { u = v - a * t; changed = true; }
    if (a === undefined && v !== undefined && u !== undefined && t !== undefined && t !== 0) { a = (v - u) / t; changed = true; }
    if (t === undefined && a !== undefined && a !== 0 && v !== undefined && u !== undefined) { t = (v - u) / a; changed = true; }

    // (4) s = ½(u+v)t
    if (s === undefined && u !== undefined && v !== undefined && t !== undefined) { s = 0.5 * (u + v) * t; changed = true; }
    if (t === undefined && s !== undefined && u !== undefined && v !== undefined && (u + v) !== 0) { t = (2 * s) / (u + v); changed = true; }

    // (3) v² = u² + 2as
    if (v === undefined && u !== undefined && a !== undefined && s !== undefined) {
      const vSq = u * u + 2 * a * s;
      if (vSq >= 0) { v = Math.sqrt(vSq); changed = true; }
    }
    if (u === undefined && v !== undefined && a !== undefined && s !== undefined) {
      const uSq = v * v - 2 * a * s;
      if (uSq >= 0) { u = Math.sqrt(uSq); changed = true; }
    }
    if (a === undefined && v !== undefined && u !== undefined && s !== undefined && s !== 0) { a = (v * v - u * u) / (2 * s); changed = true; }
    if (s === undefined && v !== undefined && u !== undefined && a !== undefined && a !== 0) { s = (v * v - u * u) / (2 * a); changed = true; }

    // (2) s = ut + ½at²
    if (s === undefined && u !== undefined && t !== undefined && a !== undefined) { s = u * t + 0.5 * a * t * t; changed = true; }
  }

  if ([u, v, a, t, s].some((x) => x === undefined)) {
    errors.push('Could not determine all values with the given inputs.');
    return { u: u ?? 0, v: v ?? 0, a: a ?? 0, t: t ?? 0, s: s ?? 0, valid: false, errors };
  }

  if (t! < 0) errors.push('Time cannot be negative — check your inputs.');

  return { u: u!, v: v!, a: a!, t: t!, s: s!, valid: errors.length === 0, errors };
}

export interface ProjectileInput {
  /** Initial speed in m/s */
  speed: number;
  /** Launch angle in degrees above horizontal */
  angleDeg: number;
  /** Initial height in metres (default 0) */
  height?: number;
  /** Gravitational acceleration (default 9.81) */
  g?: number;
}

export interface ProjectilePoint {
  t: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface ProjectileResult {
  maxHeight: number;
  range: number;
  timeOfFlight: number;
  peakTime: number;
  trajectory: ProjectilePoint[];
}

/**
 * Compute projectile motion trajectory.
 * Returns sampled points along the path as well as key metrics.
 */
export function computeProjectile(input: ProjectileInput): ProjectileResult {
  const { speed, angleDeg, height = 0, g = 9.81 } = input;
  const theta = (angleDeg * Math.PI) / 180;
  const vx = speed * Math.cos(theta);
  const vy = speed * Math.sin(theta);

  // Time of flight: solve height + vy*t - 0.5*g*t² = 0
  // 0.5g t² - vy t - height = 0
  const discriminant = vy * vy + 2 * g * height;
  const timeOfFlight = discriminant >= 0
    ? (vy + Math.sqrt(discriminant)) / g
    : 0;

  const peakTime = vy / g;
  const maxHeight = height + vy * peakTime - 0.5 * g * peakTime * peakTime;
  const range = vx * timeOfFlight;

  const steps = 60;
  const trajectory: ProjectilePoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * timeOfFlight;
    trajectory.push({
      t,
      x: vx * t,
      y: height + vy * t - 0.5 * g * t * t,
      vx,
      vy: vy - g * t,
    });
  }

  return { maxHeight, range, timeOfFlight, peakTime, trajectory };
}

export interface CircularMotionInput {
  /** Radius in metres */
  radius: number;
  /** Speed in m/s (or undefined if period given) */
  speed?: number;
  /** Period in seconds (or undefined if speed given) */
  period?: number;
  /** Mass in kg */
  mass: number;
}

export interface CircularMotionResult {
  speed: number;
  period: number;
  frequency: number;
  angularVelocity: number;
  centripetalAcceleration: number;
  centripetalForce: number;
}

/**
 * Compute quantities for uniform circular motion.
 */
export function computeCircularMotion(input: CircularMotionInput): CircularMotionResult {
  const { radius, mass } = input;
  let speed = input.speed;
  let period = input.period;

  if (speed === undefined && period !== undefined) {
    speed = (2 * Math.PI * radius) / period;
  } else if (period === undefined && speed !== undefined) {
    period = (2 * Math.PI * radius) / speed;
  } else {
    speed = speed ?? 0;
    period = period ?? 0;
  }

  const frequency = period !== 0 ? 1 / period : 0;
  const angularVelocity = (2 * Math.PI) / (period !== 0 ? period : 1);
  const centripetalAcceleration = speed * speed / radius;
  const centripetalForce = mass * centripetalAcceleration;

  return { speed, period, frequency, angularVelocity, centripetalAcceleration, centripetalForce };
}

export interface SHMInput {
  /** Amplitude in metres */
  amplitude: number;
  /** Angular frequency ω in rad/s */
  omega: number;
  /** Time in seconds */
  t: number;
  /** Initial phase in radians (default 0) */
  phi?: number;
}

export interface SHMResult {
  displacement: number;
  velocity: number;
  acceleration: number;
  period: number;
  frequency: number;
  kineticEnergy: number;
  potentialEnergy: number;
  /** Mass used for energy; pass separately */
  mass?: number;
}

/**
 * Compute SHM state at a given time.
 * x = A cos(ωt + φ)
 */
export function computeSHM(input: SHMInput & { mass?: number }): SHMResult {
  const { amplitude: A, omega, t, phi = 0, mass = 1 } = input;
  const x = A * Math.cos(omega * t + phi);
  const v = -A * omega * Math.sin(omega * t + phi);
  const acc = -omega * omega * x;
  const period = (2 * Math.PI) / omega;
  const frequency = 1 / period;
  const ke = 0.5 * mass * v * v;
  const pe = 0.5 * mass * omega * omega * x * x;

  return { displacement: x, velocity: v, acceleration: acc, period, frequency, kineticEnergy: ke, potentialEnergy: pe, mass };
}
