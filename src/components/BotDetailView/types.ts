export interface Skill {
  name: string;
  description: string;
}

export interface Mcp {
  name: string;
  version?: string;
}

export interface Cli {
  name: string;
}

export interface LlmConfig {
  primary: string;
  fallbacks?: string[];
  temperature?: number;
  maxTokens?: number;
}

export interface BotProfile {
  id?: string;
  slug?: string;
  name: string;
  harness: string;
  version: string;
  description: string;
  avatar?: string;
  skills: Skill[] | string[];
  mcps: Mcp[] | string[];
  clis?: Cli[] | string[];
  llm: LlmConfig;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BotDetailViewProps {
  profile: BotProfile;
}
