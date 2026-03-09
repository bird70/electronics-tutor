/** Component types available in the circuit workspace */
export type ComponentType = 'source' | 'resistor' | 'wire' | 'meter' | 'switch';

/** Rule for an adjustable property on a component */
export interface PropertyRule {
  name: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

/** Definition of an available circuit component */
export interface ComponentDefinition {
  id: string;
  name: string;
  type: ComponentType;
  adjustableProperties?: PropertyRule[];
}

/** A placed instance of a component on the workspace */
export interface ComponentInstance {
  instanceId: string;
  definitionId: string;
  properties: Record<string, number>;
  position: { x: number; y: number };
}

/** A connection between two component terminals */
export interface Wire {
  id: string;
  fromInstanceId: string;
  fromTerminal: string;
  toInstanceId: string;
  toTerminal: string;
}

/** The complete state of a circuit on the workspace */
export interface CircuitGraph {
  components: ComponentInstance[];
  wires: Wire[];
}

/** Result of evaluating a circuit */
export interface CircuitEvaluation {
  isValid: boolean;
  totalVoltage: number;
  totalCurrent: number;
  totalResistance: number;
  totalPower: number;
  nodeVoltages: Record<string, number>;
  branchCurrents: Record<string, number>;
  errors: string[];
}

/** Built-in component definitions for beginner lessons */
export const BEGINNER_COMPONENTS: ComponentDefinition[] = [
  {
    id: 'dc-source',
    name: 'DC Voltage Source',
    type: 'source',
    adjustableProperties: [
      { name: 'voltage', unit: 'V', min: 0, max: 24, step: 0.5, defaultValue: 9 },
    ],
  },
  {
    id: 'resistor',
    name: 'Resistor',
    type: 'resistor',
    adjustableProperties: [
      { name: 'resistance', unit: 'Ω', min: 1, max: 10000, step: 1, defaultValue: 100 },
    ],
  },
  {
    id: 'wire',
    name: 'Wire',
    type: 'wire',
  },
  {
    id: 'ammeter',
    name: 'Ammeter',
    type: 'meter',
  },
  {
    id: 'voltmeter',
    name: 'Voltmeter',
    type: 'meter',
  },
  {
    id: 'switch',
    name: 'Switch',
    type: 'switch',
    adjustableProperties: [
      { name: 'closed', unit: '', min: 0, max: 1, step: 1, defaultValue: 1 },
    ],
  },
];
