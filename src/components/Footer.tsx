'use client';

export function Footer() {
  return (
    <footer className="hidden md:block py-8 text-center border-t border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-[10px] text-[var(--color-text-secondary)]">
          <span>BOTARENA_V1.0</span>
          <span className="hidden md:inline">|</span>
          <a 
            href="https://github.com/bot-arena/botarena" 
            target="_blank"
            rel="noopener noreferrer"
            className="uppercase hover:text-[var(--color-accent-primary)]"
          >
            GITHUB
          </a>
          <span className="hidden md:inline">|</span>
          <span>OPEN_SOURCE</span>
        </div>
      </div>
    </footer>
  );
}
