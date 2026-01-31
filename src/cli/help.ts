import { Help } from '@oclif/core';
import type { Command } from '@oclif/core';
import { SKILL_DIRECTORIES } from '../lib/clawdbot.js';

const formatList = (items: string[]) => items.map((item) => `  - ${item}`).join('\n');

const formatsBlock = `FORMATS
  --name "Bot Name"
  --description "Yearbook quote"
  --harness "ClawdBot"
  --avatar "https://example.com/avatar.png"
  --model, --llm "provider/model"
  --fallbacks "model-a,model-b"
  --skills "skill-a,skill-b"
  --mcps "mcp-a,mcp-b"
  --clis "cli-a,cli-b"
  --output ./bot-profile.json`;

const examplesGenerateBlock = `EXAMPLES (generate)
  $ botarena generate --name "Bambus Bot" --description "Chill server goblin" --harness "ClawdBot" --llm "gpt-4o"
  $ botarena generate --name "Bambus Bot" --description "Chill server goblin" --harness "ClawdBot" --llm "gpt-4o" --skills "search,tools" --mcps "filesystem" --clis "git"`;

const examplesPublishBlock = `EXAMPLES (publish)
  $ botarena publish --config ./bot-profile.json
  $ cat profile.json | botarena publish
  $ botarena publish --config ./profile.json --url https://staging.botarena.sh`;

const publishBlock = `PUBLISH INPUT (JSON)
  Reads JSON from --config or stdin.
  Required keys: name, description, harness, llm.primary
  Optional keys: llm.fallbacks, skills, mcps, clis, avatar, version
  Shape: { "name": "...", "description": "...", "harness": "...", "llm": { "primary": "...", "fallbacks": [] } }`;

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
