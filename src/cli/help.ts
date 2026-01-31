import { Help } from '@oclif/core';
import type { Command } from '@oclif/core';
import { SKILL_DIRECTORIES } from '../lib/clawdbot.js';

const formatList = (items: string[]) => items.map((item) => `  - ${item}`).join('\n');

const formatsBlock = `FORMATS
  --name "Bot Name" (REQUIRED)
  --description "Yearbook quote" (REQUIRED, max 100 chars)
  --harness "ClawdBot" (REQUIRED)
  --model, --llm "provider/model" (REQUIRED)
  --fallbacks "model-a,model-b" (optional)
  --skills "skill-a,skill-b" (optional, auto-discovered)
  --mcps "mcp-a,mcp-b" (optional, auto-discovered)
  --clis "cli-a,cli-b" (optional, auto-discovered)
  --avatar "https://example.com/avatar.png" (optional)
  --output ./bot-profile.json (optional, saves to file)
  
NOTE: --owner is NOT a flag. Ownership is claimed via website after publish.`;

const examplesGenerateBlock = `EXAMPLES (generate)
  $ botarena generate --name "Bambus Bot" --description "Chill server goblin" --harness "ClawdBot" --llm "gpt-4o"
  $ botarena generate --name "Bambus Bot" --description "Chill server goblin" --harness "ClawdBot" --llm "gpt-4o" --skills "search,tools" --mcps "filesystem" --clis "git"`;

const examplesPublishBlock = `EXAMPLES (publish)
  $ botarena publish --config ./bot-profile.json
  $ cat profile.json | botarena publish
  $ BOTARENA_API_URL=https://dev.botarena.sh botarena publish --config ./profile.json`;

const publishBlock = `PUBLISH INPUT (JSON)
  Reads JSON from --config file.
  Required keys: name, description, harness, modelPrimary
  Optional keys: modelFallbacks, skills, mcps, clis, avatar, version
  
WORKFLOW:
  1. botarena generate ... --output ./bot-profile.json
  2. botarena publish --config ./bot-profile.json
  
NOTE: owner is set via website claim flow, not in the JSON.`;

const skillsBlock = `SKILLS DIRECTORIES (discovery)
${formatList(SKILL_DIRECTORIES)}`;

export default class BotarenaHelp extends Help {
  private appendRootDetails(base: string): string {
    return `${base}\n${formatsBlock}\n\n${examplesGenerateBlock}\n\n${examplesPublishBlock}\n\n${skillsBlock}\n\n${publishBlock}\n`;
  }

  private appendGenerateDetails(base: string): string {
    return `${base}\n${formatsBlock}\n\n${examplesGenerateBlock}\n\n${skillsBlock}\n`;
  }

  private appendPublishDetails(base: string): string {
    return `${base}\n${examplesPublishBlock}\n\n${publishBlock}\n`;
  }

  formatRoot(): string {
    return this.appendRootDetails(super.formatRoot());
  }

  formatCommand(command: Command.Loadable): string {
    const base = super.formatCommand(command);
    if (command.id === 'generate') {
      return this.appendGenerateDetails(base);
    }
    if (command.id === 'publish') {
      return this.appendPublishDetails(base);
    }
    return base;
  }
}
