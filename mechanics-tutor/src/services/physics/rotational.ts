// ── Rotational Kinematics ─────────────────────────────────────────────────────

export interface RotationalInput {
  torque?: number
  momentOfInertia: number
  initialOmega?: number
  finalOmega?: number
  time?: number
}

export interface RotationalResult {
  torque: number
  momentOfInertia: number
  angularAcceleration: number
  initialOmega: number
  finalOmega: number
  rotationalKE: number
}

export function computeRotationalKinematics(input: RotationalInput): RotationalResult {
  const { momentOfInertia } = input
  const initialOmega = input.initialOmega ?? 0
  let finalOmega = input.finalOmega ?? initialOmega
  let alpha: number
  let torque: number

  if (input.torque !== undefined) {
    torque = input.torque
    alpha = torque / momentOfInertia
    if (input.time !== undefined) {
      finalOmega = initialOmega + alpha * input.time
    }
  } else if (input.finalOmega !== undefined && input.time !== undefined && input.time > 0) {
    alpha = (input.finalOmega - initialOmega) / input.time
    torque = momentOfInertia * alpha
    finalOmega = input.finalOmega
  } else {
    alpha = 0
    torque = 0
  }

  const rotationalKE = 0.5 * momentOfInertia * finalOmega * finalOmega

  return { torque, momentOfInertia, angularAcceleration: alpha, initialOmega, finalOmega, rotationalKE }
}

// ── Angular Momentum ──────────────────────────────────────────────────────────

export interface AngularMomentumInput {
  momentOfInertia: number
  omega: number
  newMomentOfInertia?: number
}

export interface AngularMomentumResult {
  angularMomentum: number
  conserved: boolean
  newOmega?: number
  newAngularMomentum?: number
}

export function computeAngularMomentum(input: AngularMomentumInput): AngularMomentumResult {
  const { momentOfInertia, omega, newMomentOfInertia } = input
  const angularMomentum = momentOfInertia * omega

  if (newMomentOfInertia !== undefined && newMomentOfInertia > 0) {
    // Conservation: L = I₁ω₁ = I₂ω₂
    const newOmega = angularMomentum / newMomentOfInertia
    return {
      angularMomentum,
      conserved: true,
      newOmega,
      newAngularMomentum: newMomentOfInertia * newOmega,
    }
  }

  return { angularMomentum, conserved: false }
}
