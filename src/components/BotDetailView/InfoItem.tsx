interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

export function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <div className="text-[9px] uppercase text-[var(--color-text-secondary)]">
        {label}
      </div>
      <div className="font-bold">{value}</div>
    </div>
  );
}
