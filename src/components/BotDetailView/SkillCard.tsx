import { Zap } from 'lucide-react';
import { Skill } from './types';

interface SkillCardProps {
  skill: Skill;
}

/**
 * Compact inline skill badge that fits around the skill name.
 * Displays skill name with Zap icon in a tight, badge-like format.
 */
export function SkillCard({ skill }: SkillCardProps) {
  // Handle string skills (backward compatibility)
  if (typeof skill === 'string') {
    return (
      <div className="badge-inline badge-inline-skill">
        <div className="badge-icon">
          <Zap aria-hidden="true" />
        </div>
        <span className="badge-name">{skill}</span>
      </div>
    );
  }

  return (
    <div className="badge-inline badge-inline-skill">
      <div className="badge-icon">
        <Zap aria-hidden="true" />
      </div>
      <span className="badge-name">{skill.name}</span>
    </div>
  );
}
