import { Panel } from '@/components/Panel';
import { Skill } from './types';

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Panel className="p-2">
      <div className="font-bold text-xs">{skill.name}</div>
      {skill.description && (
        <div className="text-xs text-[var(--color-text-secondary)]">
          {skill.description}
        </div>
      )}
    </Panel>
  );
}
