import type { ConceptTag } from '@/domain/learning/types';

interface ConceptTagBadgeProps {
  tag: ConceptTag;
  size?: 'sm' | 'md';
}

const TAG_COLORS: Record<ConceptTag, string> = {
  voltage: '#f59e0b',
  current: '#3b82f6',
  resistance: '#10b981',
  resistivity: '#8b5cf6',
  power: '#ef4444',
};

const TAG_ICONS: Record<ConceptTag, string> = {
  voltage: '⚡',
  current: '💧',
  resistance: '🔧',
  resistivity: '🔬',
  power: '🔋',
};

/** Small badge showing a concept tag with a color and icon */
export function ConceptTagBadge({ tag, size = 'sm' }: ConceptTagBadgeProps) {
  const color = TAG_COLORS[tag] ?? '#6b7280';
  const icon = TAG_ICONS[tag] ?? '📌';

  return (
    <span
      className={`concept-tag concept-tag--${size}`}
      style={{
        backgroundColor: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {icon} {tag}
    </span>
  );
}

/** Index page listing all concept tags with descriptions */
export function ConceptTagIndex() {
  const descriptions: Record<ConceptTag, string> = {
    voltage: 'The electrical "pressure" that pushes current through a circuit (measured in Volts).',
    current: 'The flow of electric charge through a conductor (measured in Amps).',
    resistance: 'Opposition to current flow in a material (measured in Ohms).',
    resistivity: 'An intrinsic material property determining how strongly it resists current.',
    power: 'The rate at which energy is used or produced (measured in Watts).',
  };

  const tags = Object.keys(descriptions) as ConceptTag[];

  return (
    <div className="concept-tag-index">
      <h3>Concept Reference</h3>
      <div className="concept-tag-index__list">
        {tags.map((tag) => (
          <div key={tag} className="concept-tag-index__item">
            <ConceptTagBadge tag={tag} size="md" />
            <p>{descriptions[tag]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
