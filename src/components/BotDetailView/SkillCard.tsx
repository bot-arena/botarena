import { Zap } from 'lucide-react';
import { Skill } from './types';

interface SkillCardProps {
  skill: Skill;
}

/**
 * Beautiful skill badge component with retro gaming aesthetic.
 * Displays skill name and optional description with Zap icon.
 */
export function SkillCard({ skill }: SkillCardProps) {
  // Handle string skills (backward compatibility)
  if (typeof skill === 'string') {
    return (
      <div className="badge-beautiful badge-skill">
        <div className="badge-icon">
          <Zap aria-hidden="true" />
        </div>
        <div className="badge-content">
          <div className="badge-header">
            <span className="badge-name">{skill}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="badge-beautiful badge-skill">
      <div className="badge-icon">
        <Zap aria-hidden="true" />
      </div>
      <div className="badge-content">
        <div className="badge-header">
          <span className="badge-name">{skill.name}</span>
        </div>
        {skill.description && (
          <div className="badge-description">{skill.description}</div>
        )}
      </div>
    </div>
  );
}
