import type { CircuitGraph, ComponentInstance } from '@/domain/circuit/types';

/** Max component instances on a single workspace to prevent performance issues */
const MAX_COMPONENTS = 20;
/** Max wires on a workspace */
const MAX_WIRES = 40;

export interface GuardResult {
  valid: boolean;
  warnings: string[];
}

/**
 * Validate a circuit graph for edge-case issues before evaluation.
 */
export function validateCircuitGraph(graph: CircuitGraph): GuardResult {
  const warnings: string[] = [];

  if (graph.components.length > MAX_COMPONENTS) {
    warnings.push(`Too many components (max ${MAX_COMPONENTS}). Remove some to continue.`);
  }
  if (graph.wires.length > MAX_WIRES) {
    warnings.push(`Too many wires (max ${MAX_WIRES}). Simplify your circuit.`);
  }

  // Check for duplicate wires between the same terminals
  const wireKeys = new Set<string>();
  for (const w of graph.wires) {
    const key = [w.fromInstanceId, w.fromTerminal, w.toInstanceId, w.toTerminal].join('::');
    if (wireKeys.has(key)) {
      warnings.push('Duplicate wire detected — remove the extra connection.');
    }
    wireKeys.add(key);
  }

  // Check for self-connections
  for (const w of graph.wires) {
    if (w.fromInstanceId === w.toInstanceId) {
      warnings.push(`A component is wired to itself — that won't work!`);
    }
  }

  // Check component property ranges
  for (const comp of graph.components) {
    const propWarnings = validateComponentProperties(comp);
    warnings.push(...propWarnings);
  }

  return { valid: warnings.length === 0, warnings };
}

function validateComponentProperties(comp: ComponentInstance): string[] {
  const warnings: string[] = [];

  for (const [name, value] of Object.entries(comp.properties)) {
    if (typeof value !== 'number' || !isFinite(value)) {
      warnings.push(`${comp.definitionId}: ${name} has an invalid value.`);
      continue;
    }
    if (name === 'voltage' && (value < 0 || value > 240)) {
      warnings.push(`${comp.definitionId}: voltage ${value}V is out of safe range (0–240V).`);
    }
    if (name === 'resistance' && value < 0) {
      warnings.push(`${comp.definitionId}: resistance cannot be negative.`);
    }
    if (name === 'resistance' && value > 1_000_000) {
      warnings.push(`${comp.definitionId}: resistance over 1MΩ is impractically high.`);
    }
  }

  return warnings;
}
