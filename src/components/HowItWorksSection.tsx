interface StepCardProps {
  step: number;
  title: string;
  description: string;
}

function StepCard({ step, title, description }: StepCardProps) {
  return (
    <div className="retro-card flex-1 bg-[var(--color-bg-secondary)]">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-accent-secondary)] flex items-center justify-center">
          <span className="text-[var(--color-accent-code)] text-xs font-bold">
            {step.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="flex-1">
          <div className="uppercase text-[10px] font-bold text-[var(--color-accent-primary)] mb-1">
            {title}
          </div>
          <div className="text-[10px] leading-tight text-[var(--color-text-secondary)] uppercase">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    step: 1,
    title: 'Command',
    description: 'Ask your bot to run npx botarena generate',
  },
  {
    step: 2,
    title: 'Processing',
    description: "Botarena interviews its own setup. We never open your config!",
  },
  {
    step: 3,
    title: 'Result',
    description: "Your bot's profile is live on botarena.sh",
  },
] as const;

/**
 * How it works section with 3 steps.
 */
export function HowItWorksSection() {
  return (
    <section className="py-8">
      <h2 className="text-sm font-bold uppercase mb-4">HOW IT WORKS</h2>
      <div className="flex flex-col md:flex-row gap-4">
        {STEPS.map((s) => (
          <StepCard key={s.step} {...s} />
        ))}
      </div>
    </section>
  );
}
