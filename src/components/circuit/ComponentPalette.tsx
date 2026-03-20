import { useCallback } from 'react';
import {
  BEGINNER_COMPONENTS,
  type ComponentDefinition,
  type ComponentInstance,
  type CircuitGraph,
} from '@/domain/circuit/types';

interface ComponentPaletteProps {
  graph: CircuitGraph;
  onGraphChange: (graph: CircuitGraph) => void;
  availableComponents?: ComponentDefinition[];
}

/**
 * Palette of circuit components. Click a component to add it to the workspace.
 * Adjustable properties (voltage, resistance) are editable inline.
 */
export function ComponentPalette({
  graph,
  onGraphChange,
  availableComponents = BEGINNER_COMPONENTS,
}: ComponentPaletteProps) {
  const addComponent = useCallback(
    (def: ComponentDefinition) => {
      const instanceId = `${def.id}-${Date.now()}`;
      const properties: Record<string, number> = {};
      for (const prop of def.adjustableProperties ?? []) {
        properties[prop.name] = prop.defaultValue;
      }

      // Place new component in an open spot
      const offsetY = graph.components.length * 70;
      const newInstance: ComponentInstance = {
        instanceId,
        definitionId: def.id,
        properties,
        position: { x: 100, y: 50 + (offsetY % 400) },
      };

      onGraphChange({
        ...graph,
        components: [...graph.components, newInstance],
      });
    },
    [graph, onGraphChange],
  );

  const updateProperty = useCallback(
    (instanceId: string, propName: string, value: number) => {
      onGraphChange({
        ...graph,
        components: graph.components.map((c) =>
          c.instanceId === instanceId
            ? { ...c, properties: { ...c.properties, [propName]: value } }
            : c,
        ),
      });
    },
    [graph, onGraphChange],
  );

  return (
    <div className="component-palette">
      <h3 className="component-palette__title">Components</h3>

      {/* Add component buttons */}
      <div className="component-palette__list">
        {availableComponents.map((def) => (
          <button
            key={def.id}
            className="component-palette__item"
            onClick={() => addComponent(def)}
          >
            <span className="component-palette__icon">{getIcon(def.type)}</span>
            <span className="component-palette__name">{def.name}</span>
          </button>
        ))}
      </div>

      {/* Placed component properties */}
      {graph.components.length > 0 && (
        <div className="component-palette__placed">
          <h4 className="component-palette__subtitle">Placed Components</h4>
          {graph.components.map((inst) => {
            const def = availableComponents.find((d) => d.id === inst.definitionId);
            if (!def?.adjustableProperties?.length) return null;
            return (
              <div key={inst.instanceId} className="component-palette__props">
                <span className="component-palette__label">{def.name}</span>
                {def.adjustableProperties.map((prop) => (
                  <label key={prop.name} className="component-palette__prop">
                    <span>{prop.name} ({prop.unit})</span>
                    <input
                      type="range"
                      min={prop.min}
                      max={prop.max}
                      step={prop.step}
                      value={inst.properties[prop.name] ?? prop.defaultValue}
                      onChange={(e) =>
                        updateProperty(inst.instanceId, prop.name, Number(e.target.value))
                      }
                    />
                    <span className="component-palette__value">
                      {inst.properties[prop.name] ?? prop.defaultValue} {prop.unit}
                    </span>
                  </label>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getIcon(type: string): string {
  switch (type) {
    case 'source': return '🔋';
    case 'resistor': return '⚡';
    case 'wire': return '〰️';
    case 'meter': return '📏';
    case 'switch': return '🔘';
    default: return '📦';
  }
}
