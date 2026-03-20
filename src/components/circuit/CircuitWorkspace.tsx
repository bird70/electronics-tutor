import { useState, useCallback } from 'react';
import type { Wire, CircuitGraph } from '@/domain/circuit/types';

interface CircuitWorkspaceProps {
  graph: CircuitGraph;
  onGraphChange: (graph: CircuitGraph) => void;
  readOnly?: boolean;
}

/**
 * Interactive circuit workspace where users place components and wire them together.
 * Uses SVG for rendering; drag-and-drop for placement and wiring.
 */
export function CircuitWorkspace({ graph, onGraphChange, readOnly = false }: CircuitWorkspaceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wiringFrom, setWiringFrom] = useState<{ instanceId: string; terminal: string } | null>(null);

  const handleComponentClick = useCallback(
    (instanceId: string) => {
      if (readOnly) return;
      if (wiringFrom) {
        // Complete a wire connection
        const newWire: Wire = {
          id: `wire-${Date.now()}`,
          fromInstanceId: wiringFrom.instanceId,
          fromTerminal: wiringFrom.terminal,
          toInstanceId: instanceId,
          toTerminal: 'in',
        };
        onGraphChange({
          ...graph,
          wires: [...graph.wires, newWire],
        });
        setWiringFrom(null);
      } else {
        setSelectedId(instanceId === selectedId ? null : instanceId);
      }
    },
    [graph, onGraphChange, readOnly, selectedId, wiringFrom],
  );

  const handleStartWire = useCallback(
    (instanceId: string, terminal: string) => {
      if (readOnly) return;
      setWiringFrom({ instanceId, terminal });
    },
    [readOnly],
  );

  const handleRemoveComponent = useCallback(
    (instanceId: string) => {
      onGraphChange({
        components: graph.components.filter((c) => c.instanceId !== instanceId),
        wires: graph.wires.filter(
          (w) => w.fromInstanceId !== instanceId && w.toInstanceId !== instanceId,
        ),
      });
      setSelectedId(null);
    },
    [graph, onGraphChange],
  );

  return (
    <div className="circuit-workspace" role="region" aria-label="Circuit workspace">
      <svg
        className="circuit-workspace__canvas"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Circuit with ${graph.components.length} components and ${graph.wires.length} wires`}
      >
        {/* Grid background */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-border)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="800" height="500" fill="url(#grid)" />

        {/* Wires */}
        {graph.wires.map((wire) => {
          const from = graph.components.find((c) => c.instanceId === wire.fromInstanceId);
          const to = graph.components.find((c) => c.instanceId === wire.toInstanceId);
          if (!from || !to) return null;
          return (
            <line
              key={wire.id}
              x1={from.position.x + 40}
              y1={from.position.y + 25}
              x2={to.position.x + 40}
              y2={to.position.y + 25}
              stroke="var(--color-accent)"
              strokeWidth="2"
              className="circuit-wire"
            />
          );
        })}

        {/* Components */}
        {graph.components.map((comp) => (
          <g
            key={comp.instanceId}
            transform={`translate(${comp.position.x}, ${comp.position.y})`}
            onClick={() => handleComponentClick(comp.instanceId)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleComponentClick(comp.instanceId);
              }
              if (e.key === 'Delete' || e.key === 'Backspace') {
                if (!readOnly) handleRemoveComponent(comp.instanceId);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`${comp.definitionId.replace(/-/g, ' ')} ${formatProperties(comp.properties)}`}
            className={`circuit-component ${selectedId === comp.instanceId ? 'circuit-component--selected' : ''}`}
          >
            <rect
              width="80"
              height="50"
              rx="6"
              fill="var(--color-surface)"
              stroke={
                selectedId === comp.instanceId
                  ? 'var(--color-accent)'
                  : 'var(--color-border)'
              }
              strokeWidth="2"
            />
            <text
              x="40"
              y="20"
              textAnchor="middle"
              fill="var(--color-text)"
              fontSize="11"
            >
              {comp.definitionId.replace(/-/g, ' ')}
            </text>
            <text
              x="40"
              y="38"
              textAnchor="middle"
              fill="var(--color-accent)"
              fontSize="10"
              fontFamily="var(--font-mono)"
            >
              {formatProperties(comp.properties)}
            </text>

            {/* Terminal dots for wiring */}
            {!readOnly && (
              <>
                <circle
                  cx="0"
                  cy="25"
                  r="5"
                  fill="var(--color-accent)"
                  className="terminal"
                  role="button"
                  aria-label={`Input terminal of ${comp.definitionId.replace(/-/g, ' ')}`}
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartWire(comp.instanceId, 'in');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      e.preventDefault();
                      handleStartWire(comp.instanceId, 'in');
                    }
                  }}
                />
                <circle
                  cx="80"
                  cy="25"
                  r="5"
                  fill="var(--color-accent)"
                  className="terminal"
                  role="button"
                  aria-label={`Output terminal of ${comp.definitionId.replace(/-/g, ' ')}`}
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartWire(comp.instanceId, 'out');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation();
                      e.preventDefault();
                      handleStartWire(comp.instanceId, 'out');
                    }
                  }}
                />
              </>
            )}
          </g>
        ))}

        {/* Wiring mode indicator */}
        {wiringFrom && (
          <text x="10" y="490" fill="var(--color-warning)" fontSize="12">
            Click another component to complete the wire connection...
          </text>
        )}
      </svg>

      {/* Selected component actions */}
      {selectedId && !readOnly && (
        <div className="circuit-workspace__actions">
          <button
            className="btn btn--sm btn--error"
            onClick={() => handleRemoveComponent(selectedId)}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

function formatProperties(props: Record<string, number>): string {
  return Object.entries(props)
    .map(([key, val]) => {
      if (key === 'voltage') return `${val}V`;
      if (key === 'resistance') return `${val}Ω`;
      if (key === 'closed') return val ? 'ON' : 'OFF';
      return `${val}`;
    })
    .join(' ');
}
