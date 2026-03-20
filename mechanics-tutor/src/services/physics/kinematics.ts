// ── 1D Kinematics (SUVAT) ────────────────────────────────────────────────────

export interface KinematicsInput {
  u?: number; v?: number; a?: number; t?: number; s?: number
}

export interface KinematicsResult {
  valid: boolean; errors: string[]
  u: number; v: number; a: number; t: number; s: number
}

export function solveKinematics1D(input: KinematicsInput): KinematicsResult {
  const known = Object.entries(input).filter(([, val]) => val !== undefined)
  if (known.length < 3) {
    return { valid: false, errors: ['At least 3 values are required'], u: 0, v: 0, a: 0, t: 0, s: 0 }
  }

  let { u, v, a, t, s } = input
  const errors: string[] = []

  // Try all four SUVAT equations to fill unknowns
  const solve = () => {
    for (let pass = 0; pass < 4; pass++) {
      if (u !== undefined && a !== undefined && t !== undefined && v === undefined) v = u + a * t
      if (u !== undefined && a !== undefined && t !== undefined && s === undefined) s = u * t + 0.5 * a * t * t
      if (u !== undefined && v !== undefined && a !== undefined && s === undefined) {
        if (a !== 0) s = (v * v - u * u) / (2 * a)
      }
      if (u !== undefined && v !== undefined && t !== undefined && s === undefined) s = 0.5 * (u + v) * t
      if (u !== undefined && v !== undefined && t !== undefined && a === undefined) a = (v - u) / t
      if (s !== undefined && u !== undefined && t !== undefined && a === undefined && t !== 0) a = 2 * (s - u * t) / (t * t)
      if (s !== undefined && u !== undefined && a !== undefined && t === undefined) {
        const disc = u * u + 2 * a * s
        if (disc >= 0 && a !== 0) t = (-u + Math.sqrt(disc)) / a
        else if (a === 0 && u !== 0) t = s / u
      }
      if (v !== undefined && a !== undefined && t !== undefined && u === undefined) u = v - a * t
    }
  }
  solve()

  if ([u, v, a, t, s].some((x) => x === undefined)) {
    errors.push('Unable to solve — check that the given values are consistent')
  }
  if (t !== undefined && t < 0) errors.push('Negative time — check your inputs')

  return {
    valid: errors.length === 0,
    errors,
    u: u ?? 0, v: v ?? 0, a: a ?? 0, t: t ?? 0, s: s ?? 0,
  }
}

// ── Projectile Motion ─────────────────────────────────────────────────────────

const G = 9.81

export interface ProjectileInput {
  speed: number; angleDeg: number; height?: number
}

export interface ProjectileResult {
  range: number; maxHeight: number; timeOfFlight: number; peakTime: number
  trajectory: Array<{ x: number; y: number }>
}

export function computeProjectile(input: ProjectileInput): ProjectileResult {
  const { speed, angleDeg, height = 0 } = input
  const rad = (angleDeg * Math.PI) / 180
  const vx = speed * Math.cos(rad)
  const vy0 = speed * Math.sin(rad)

  // Time of flight: solve y = height + vy0*t - 0.5*g*t² = 0
  const a = -0.5 * G
  const b = vy0
  const c = height
  const disc = b * b - 4 * a * c
  const tof = disc >= 0 ? (-b - Math.sqrt(disc)) / (2 * a) : (2 * vy0) / G
  const timeOfFlight = Math.max(tof, (2 * vy0) / G)

  const peakTime = vy0 / G
  const maxHeight = height + vy0 * peakTime - 0.5 * G * peakTime * peakTime
  const range = vx * timeOfFlight

  const steps = 60
  const trajectory = Array.from({ length: steps + 1 }, (_, i) => {
    const t = (i / steps) * timeOfFlight
    return { x: vx * t, y: height + vy0 * t - 0.5 * G * t * t }
  })

  return { range, maxHeight, timeOfFlight, peakTime, trajectory }
}

// ── Circular Motion ───────────────────────────────────────────────────────────

export interface CircularMotionInput {
  radius: number; mass: number
  speed?: number; period?: number; omega?: number
}

export interface CircularMotionResult {
  speed: number; angularVelocity: number; period: number; frequency: number
  centripetalAcceleration: number; centripetalForce: number
}

export function computeCircularMotion(input: CircularMotionInput): CircularMotionResult {
  const { radius, mass } = input
  let speed: number
  let omega: number
  if (input.speed !== undefined) {
    speed = input.speed
    omega = speed / radius
  } else if (input.period !== undefined) {
    omega = (2 * Math.PI) / input.period
    speed = omega * radius
  } else if (input.omega !== undefined) {
    omega = input.omega
    speed = omega * radius
  } else {
    speed = 0; omega = 0
  }
  const period = omega > 0 ? (2 * Math.PI) / omega : Infinity
  const frequency = omega > 0 ? omega / (2 * Math.PI) : 0
  const centripetalAcceleration = (speed * speed) / radius
  const centripetalForce = mass * centripetalAcceleration
  return { speed, angularVelocity: omega, period, frequency, centripetalAcceleration, centripetalForce }
}

// ── Simple Harmonic Motion ────────────────────────────────────────────────────

export interface SHMInput {
  amplitude: number; omega: number; t: number; mass?: number
}

export interface SHMResult {
  displacement: number; velocity: number; acceleration: number
  period: number; frequency: number
  kineticEnergy: number; potentialEnergy: number
}

export function computeSHM(input: SHMInput): SHMResult {
  const { amplitude, omega, t, mass = 1 } = input
  const displacement = amplitude * Math.cos(omega * t)
  const velocity = -amplitude * omega * Math.sin(omega * t)
  const acceleration = -omega * omega * displacement
  const period = (2 * Math.PI) / omega
  const frequency = omega / (2 * Math.PI)
  const kineticEnergy = 0.5 * mass * omega * omega * (amplitude * amplitude - displacement * displacement)
  const potentialEnergy = 0.5 * mass * omega * omega * displacement * displacement
  return { displacement, velocity, acceleration, period, frequency, kineticEnergy, potentialEnergy }
}
