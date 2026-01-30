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
 *
 * Component Hierarchy:
 * - Primitives: Low-level building blocks (Panel, Tag, Label, Input, Select)
 * - Cards: Container components (RetroCard, BotCard)
 * - Data Display: Components for showing structured data (TagList, ConfigField, ConfigSection, StatBox, Badge)
 * - Layout: Page structure components (Navigation, Footer, CRTBackground)
 * - Composite: Higher-level components built from primitives (BotDetailView sections)
 */

// UI Primitives - Core building blocks
export { Badge, type BadgeProps } from './Badge';
export { FilterTag, type FilterTagProps } from './FilterTag';
export { Input, type InputProps } from './Input';
export { Label, type LabelProps } from './Label';
export { Panel, type PanelProps } from './Panel';
export { RetroButton, type RetroButtonProps } from './RetroButton';
export { RetroCard, RetroCardLink, type RetroCardProps, type RetroCardLinkProps } from './RetroCard';
export { Select, type SelectProps } from './Select';
export { Tag, type TagProps } from './Tag';

// Data Display Components
export { ConfigField, type ConfigFieldProps } from './ConfigField';
export { ConfigSection, type ConfigSectionProps } from './ConfigSection';
export { SectionHeader, type SectionHeaderProps } from './SectionHeader';
export { StatBox, type StatBoxProps, type StatBoxStatus } from './StatBox';
export { TagList, type TagListProps } from './TagList';

// Card Components
export { BotCard, type BotCardProps, type BotCardProfile } from './BotCard';

// Layout Components
export { Navigation, type NavigationProps } from './Navigation';
export { Footer, type FooterProps } from './Footer';
export { CRTBackground } from './CRTBackground';

// Complex Views
export {
  BotDetailView,
  type BotDetailViewProps,
  type BotProfile,
  type Skill,
  type Mcp,
  type Cli,
  type LlmConfig,
} from './BotDetailView';

// Page Sections
export { HowItWorksSection } from './HowItWorksSection';
export { FeaturedBotsSection } from './FeaturedBotsSection';
