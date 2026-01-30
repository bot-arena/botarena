/**
 * BotArena Component Library
 * 
 * A retro-styled component library for building the BotArena web interface.
 * All components follow React best practices:
 * - forwardRef for composition
 * - displayName for debugging
 * - Proper TypeScript types
 * - Accessibility attributes
 * - Semantic HTML
 */

// UI Primitives
export { Badge, type BadgeProps } from './Badge';
export { FilterTag, type FilterTagProps } from './FilterTag';
export { RetroButton, type RetroButtonProps } from './RetroButton';
export { RetroCard, RetroCardLink, type RetroCardProps, type RetroCardLinkProps } from './RetroCard';
export { StatBox, type StatBoxProps, type StatBoxStatus } from './StatBox';

// Layout Components
export { Navigation, type NavigationProps } from './Navigation';
export { Footer, type FooterProps } from './Footer';
export { CRTBackground } from './CRTBackground';

// Data Display
export { ConfigField, type ConfigFieldProps } from './ConfigField';
export { ConfigSection, type ConfigSectionProps } from './ConfigSection';
export { BotCard, type BotCardProps, type BotCardProfile } from './BotCard';
export {
  BotDetailView,
  type BotDetailViewProps,
  type BotProfile,
  type Skill,
  type Mcp,
  type Cli,
  type LlmConfig,
} from './BotDetailView';

// Page Sections (flat structure - folders only for complex components with private subcomponents)
export { HowItWorksSection } from './HowItWorksSection';
export { FeaturedBotsSection } from './FeaturedBotsSection';
