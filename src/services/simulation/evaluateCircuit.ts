import type { CircuitGraph, CircuitEvaluation, ComponentInstance } from '@/domain/circuit/types';
import type { CircuitCondition } from '@/domain/learning/types';

/**
 * Simple deterministic circuit evaluator for beginner-level series/parallel circuits.
 * Uses Ohm's law (V = IR) and basic series rules rather than full SPICE simulation.
 */
export function evaluateCircuit(
  graph: CircuitGraph,
  componentDefs: Record<string, { type: string }>,
): CircuitEvaluation {
  const errors: string[] = [];

  if (graph.components.length === 0) {
    return emptyResult(['No components placed on the workspace.']);
  }
  if (graph.wires.length === 0) {
    return emptyResult(['No wires connecting components. Connect your components to form a circuit.']);
  }

  // Identify sources and resistors
  const sources = graph.components.filter(
    (c) => componentDefs[c.definitionId]?.type === 'source',
  );
  const resistors = graph.components.filter(
    (c) => componentDefs[c.definitionId]?.type === 'resistor',
  );

  if (sources.length === 0) {
    errors.push('A circuit needs at least one voltage source.');
    return emptyResult(errors);
  }

  // Check connectivity: every component must have at least one wire attached
  const connectedIds = new Set<string>();
  for (const wire of graph.wires) {
    connectedIds.add(wire.fromInstanceId);
    connectedIds.add(wire.toInstanceId);
  }
  for (const comp of graph.components) {
    if (!connectedIds.has(comp.instanceId)) {
      errors.push(`${getComponentLabel(comp)} is not connected to the circuit.`);
    }
  }
  if (errors.length > 0) {
    return emptyResult(errors);
  }

  // Series circuit simplification: sum all voltages, sum all resistances
  const totalVoltage = sources.reduce((sum, s) => sum + (s.properties['voltage'] ?? 0), 0);
  const totalResistance = resistors.reduce(
    (sum, r) => sum + (r.properties['resistance'] ?? 0),
    0,
  );

  if (totalResistance === 0) {
    errors.push('Total resistance is zero — this would cause a short circuit!');
    return {
      isValid: false,
      totalVoltage,
      totalCurrent: Infinity,
      totalResistance: 0,
      totalPower: Infinity,
      nodeVoltages: {},
      branchCurrents: {},
      errors,
    };
  }

  const totalCurrent = totalVoltage / totalResistance;
  const totalPower = totalVoltage * totalCurrent;

  // Node voltages: simple voltage divider across series resistors
  const nodeVoltages: Record<string, number> = {};
  let cumulativeVDrop = 0;
  for (const r of resistors) {
    const vDrop = totalCurrent * (r.properties['resistance'] ?? 0);
    cumulativeVDrop += vDrop;
    nodeVoltages[r.instanceId] = roundTo(totalVoltage - cumulativeVDrop, 4);
  }

  // Branch currents: in series they're all the same
  const branchCurrents: Record<string, number> = {};
  for (const r of resistors) {
    branchCurrents[r.instanceId] = roundTo(totalCurrent, 6);
  }

  return {
    isValid: true,
    totalVoltage: roundTo(totalVoltage, 4),
    totalCurrent: roundTo(totalCurrent, 6),
    totalResistance: roundTo(totalResistance, 4),
    totalPower: roundTo(totalPower, 4),
    nodeVoltages,
    branchCurrents,
    errors: [],
  };
}

/** Check whether a circuit evaluation satisfies a target condition */
export function checkCondition(
  evaluation: CircuitEvaluation,
  condition: CircuitCondition,
): boolean {
  let actual: number | boolean;

  switch (condition.metric) {
    case 'validCircuit':
      actual = evaluation.isValid;
      break;
    case 'voltage':
      actual = evaluation.totalVoltage;
      break;
    case 'current':
      actual = evaluation.totalCurrent;
      break;
    case 'resistance':
      actual = evaluation.totalResistance;
      break;
    case 'power':
      actual = evaluation.totalPower;
      break;
    default:
      return false;
  }

  if (typeof condition.value === 'boolean') {
    return actual === condition.value;
  }

  const numActual = typeof actual === 'number' ? actual : NaN;
  const numExpected = condition.value;

  switch (condition.operator) {
    case 'eq':  return Math.abs(numActual - numExpected) < 0.001;
    case 'neq': return Math.abs(numActual - numExpected) >= 0.001;
    case 'lt':  return numActual < numExpected;
    case 'lte': return numActual <= numExpected;
    case 'gt':  return numActual > numExpected;
    case 'gte': return numActual >= numExpected;
    default:    return false;
  }
}

function emptyResult(errors: string[]): CircuitEvaluation {
  return {
    isValid: false,
    totalVoltage: 0,
    totalCurrent: 0,
    totalResistance: 0,
    totalPower: 0,
    nodeVoltages: {},
    branchCurrents: {},
    errors,
  };
}

function getComponentLabel(c: ComponentInstance): string {
  return c.definitionId.replace(/-/g, ' ').replace(/^\w/, (ch) => ch.toUpperCase());
}

function roundTo(n: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}
