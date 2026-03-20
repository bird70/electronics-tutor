import type { MechanicsConceptTag } from '@/domain/learning/types';

interface ConceptTagBadgeProps {
  tag: MechanicsConceptTag;
  size?: 'sm' | 'md';
}

const TAG_COLORS: Record<MechanicsConceptTag, string> = {
  kinematics: '#3b82f6',
  dynamics: '#10b981',
  forces: '#f59e0b',
  energy: '#ef4444',
  momentum: '#8b5cf6',
  'circular-motion': '#06b6d4',
  rotation: '#ec4899',
  shm: '#84cc16',
  projectile: '#f97316',
};

const TAG_ICONS: Record<MechanicsConceptTag, string> = {
  kinematics: '📐',
  dynamics: '⚙️',
  forces: '↗️',
  energy: '⚡',
  momentum: '💥',
  'circular-motion': '⭕',
  rotation: '🔄',
  shm: '🔁',
  projectile: '🏀',
};

/** Small badge showing a mechanics concept tag with a color and icon */
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
