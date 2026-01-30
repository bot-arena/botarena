import { Tag } from './Tag';

export interface TagListProps {
  /**
   * Array of tag strings to display
   */
  items: string[];
  /**
   * Label to display above the tags
   */
  label: string;
  /**
   * Maximum number of tags to display before showing "+N more"
   * @default 3
   */
  maxDisplay?: number;
  /**
   * Visual variant for the tags
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

/**
 * A component for displaying a list of tags with a label.
 * Handles truncation when there are more items than maxDisplay.
 */
export function TagList({
  items,
  label,
  maxDisplay = 3,
  variant = 'default',
}: TagListProps) {
  if (items.length === 0) return null;

  const displayItems = items.slice(0, maxDisplay);
  const remaining = items.length - maxDisplay;

  return (
    <div className="mb-2">
      <div className="text-xs uppercase text-[var(--color-text-secondary)] mb-1">
        {label} ({items.length})
      </div>
      <div className="flex flex-wrap gap-1">
        {displayItems.map((item) => (
          <Tag key={item} variant={variant}>
            {item}
          </Tag>
        ))}
        {remaining > 0 && (
          <Tag>+{remaining}</Tag>
        )}
      </div>
    </div>
  );
}
