import { Skill } from './types';

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] p-2">
      <div className="font-bold text-xs">{skill.name}</div>
      {skill.description && (
        <div className="text-xs text-[var(--color-text-secondary)]">
          {skill.description}
        </div>
      )}
    </div>
  );
}
