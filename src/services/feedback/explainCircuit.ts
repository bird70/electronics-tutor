import type { CircuitEvaluation } from '@/domain/circuit/types';

/**
 * Generate beginner-friendly textual explanations for circuit evaluation results.
 * All language targets high-school level comprehension.
 */
export function explainCircuit(evaluation: CircuitEvaluation): string[] {
  const explanations: string[] = [];

  if (!evaluation.isValid) {
    explanations.push('This circuit is not complete or has an issue.');
    for (const err of evaluation.errors) {
      explanations.push(`• ${err}`);
    }
    return explanations;
  }

  const { totalVoltage, totalCurrent, totalResistance, totalPower } = evaluation;

  explanations.push(
    `Your circuit is valid! Here's what's happening:`,
  );

  explanations.push(
    `⚡ The total voltage supplied is ${formatUnit(totalVoltage, 'V')}. ` +
    `This is the "push" that drives electrons through the circuit.`,
  );

  explanations.push(
    `🔧 The total resistance is ${formatUnit(totalResistance, 'Ω')}. ` +
    `Resistance limits how much current can flow — like a narrow pipe limits water flow.`,
  );

  explanations.push(
    `💧 The current flowing is ${formatUnit(totalCurrent * 1000, 'mA')} (${formatUnit(totalCurrent, 'A')}). ` +
    `Ohm's Law tells us: Current = Voltage ÷ Resistance (I = V/R).`,
  );

  explanations.push(
    `🔋 The total power consumed is ${formatUnit(totalPower, 'W')}. ` +
    `Power = Voltage × Current (P = V × I).`,
  );

  // Contextual tips
  if (totalResistance < 10) {
    explanations.push(
      `⚠️ That's very low resistance! In a real circuit this would draw a lot of current ` +
      `and could overheat components or blow a fuse.`,
    );
  }

  if (totalCurrent > 1) {
    explanations.push(
      `⚠️ That's over 1 Amp of current — quite high for a small circuit. ` +
      `Try increasing resistance to reduce the current.`,
    );
  }

  return explanations;
}

/** Generate comparison text when a user changes a component value */
export function explainChange(
  before: CircuitEvaluation,
  after: CircuitEvaluation,
): string[] {
  if (!before.isValid || !after.isValid) {
    return explainCircuit(after);
  }

  const explanations: string[] = ['Here is how your change affected the circuit:'];

  const vDiff = after.totalVoltage - before.totalVoltage;
  const rDiff = after.totalResistance - before.totalResistance;
  const iDiff = after.totalCurrent - before.totalCurrent;

  if (Math.abs(vDiff) > 0.001) {
    explanations.push(
      `⚡ Voltage changed from ${formatUnit(before.totalVoltage, 'V')} to ${formatUnit(after.totalVoltage, 'V')}.`,
    );
  }

  if (Math.abs(rDiff) > 0.001) {
    const direction = rDiff > 0 ? 'increased' : 'decreased';
    explanations.push(
      `🔧 Resistance ${direction} from ${formatUnit(before.totalResistance, 'Ω')} ` +
      `to ${formatUnit(after.totalResistance, 'Ω')}.`,
    );
  }

  if (Math.abs(iDiff) > 0.0001) {
    const direction = iDiff > 0 ? 'increased' : 'decreased';
    explanations.push(
      `💧 Current ${direction} from ${formatUnit(before.totalCurrent * 1000, 'mA')} ` +
      `to ${formatUnit(after.totalCurrent * 1000, 'mA')}.`,
    );
    if (rDiff > 0 && iDiff < 0) {
      explanations.push(
        `↕ When resistance goes up, current goes down — they have an inverse relationship (I = V/R).`,
      );
    } else if (rDiff < 0 && iDiff > 0) {
      explanations.push(
        `↕ When resistance goes down, current goes up — they have an inverse relationship (I = V/R).`,
      );
    }
  }

  return explanations;
}

function formatUnit(value: number, unit: string): string {
  return `${Number(value.toFixed(3))} ${unit}`;
}
