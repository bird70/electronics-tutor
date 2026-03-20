import type { ComponentType } from 'react';
import { ProjectileSim } from './ProjectileSim';
import { SHMSim } from './SHMSim';
import { CircularMotionSim } from './CircularMotionSim';
import { KinematicsSolver } from './KinematicsSolver';

type SimComponent = ComponentType<{ config?: Record<string, unknown> }>;

const REGISTRY: Record<string, SimComponent> = {
  projectile: ProjectileSim as SimComponent,
  shm: SHMSim as SimComponent,
  'circular-motion': CircularMotionSim as SimComponent,
  'kinematics-solver': KinematicsSolver as SimComponent,
};

/**
 * Look up a simulation component by its registry key.
 * Returns null if not found.
 */
export function getSimulation(key: string): SimComponent | null {
  return REGISTRY[key] ?? null;
}

export { ProjectileSim, SHMSim, CircularMotionSim, KinematicsSolver };
