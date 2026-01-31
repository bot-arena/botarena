import { Command, Flags, Args } from '@oclif/core';
import {
  PublicBotConfigType,
  validatePublicConfig,
  detectSensitiveFields,
} from '../../schemas/bot-config.js';
import { ClawdBotDiscovery, PublicConfigOverrides } from '../../lib/clawdbot.js';
import { extractDescriptionFromSoul } from '../../lib/discovery.js';
import { generateGuide } from '../guides.js';

export default class GenerateCommand extends Command {
  static description = 'Generate a bot profile JSON for BotArena showcase';

  static examples = [
    '<%= config.bin %> <%= command.id %> --name "Bambus Bot" --description "Chill server goblin" --harness "ClawdBot" --llm "gpt-4o"',
    '<%= config.bin %> <%= command.id %> --name "Bambus Bot" --description "Chill server goblin" --harness "ClawdBot" --llm "gpt-4o" --skills "search,tools" --mcps "filesystem" --clis "git"',
  ];

  static flags = {
    output: Flags.string({
      description: 'Output file path for generated profile JSON',
      char: 'o',
    }),
    verbose: Flags.boolean({
      description: 'Enable verbose logging output',
      default: false,
    }),
    path: Flags.string({
      char: 'p',
      description: 'Path to bot directory for optional discovery',
      default: '.',
    }),
    // NOTE: --owner flag intentionally removed. Ownership is claimed via website flow, not CLI.
    name: Flags.string({
      description: 'Bot name (identity)',
    }),
    avatar: Flags.string({
      description: 'Avatar URL (optional)',
    }),
    description: Flags.string({
      char: 'd',
      description: 'Bot description for the profile (yearbook quote style, max 100 chars)',
    }),
    harness: Flags.string({
      description: 'Bot harness/framework (ex: ClawdBot)',
    }),
    model: Flags.string({
      description: 'Primary LLM model string (provider/model) (alias: --llm)',
    }),
    llm: Flags.string({
      description: 'Primary LLM model string (provider/model) (alias: --model)',
    }),
    fallbacks: Flags.string({
      description: 'Comma-separated list of fallback models',
    }),
    skills: Flags.string({
      description: 'Comma-separated list of skills',
    }),
    mcps: Flags.string({
      description: 'Comma-separated list of MCP servers',
    }),
    clis: Flags.string({
      description: 'Comma-separated list of CLI tools',
    }),
  };

  static args = {
    botPath: Args.string({
      description: 'Path to bot directory for optional discovery',
      required: false,
    }),
  };

  private normalizeFlag(value: string | undefined): string | undefined {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private parseCommaList(value: string | undefined, label: string): string[] | undefined {
    if (value === undefined) return undefined;
    const trimmed = value.trim();
    if (!trimmed) {
      this.error(`${label} must be a comma-separated list with at least one value`);
    }
    const items = trimmed.split(',').map((item) => item.trim());
    if (items.some((item) => item.length === 0)) {
      this.error(`${label} must be a comma-separated list with no empty values`);
    }
    return [...new Set(items)];
  }

  async run(): Promise<void> {
    const { flags, args } = await this.parse(GenerateCommand);

    const logVerbose = (message: string) => {
      if (flags.verbose) {
        process.stderr.write(`${message}\n`);
      }
    };

    const nameFlag = this.normalizeFlag(flags.name);
    const descriptionFlag = this.normalizeFlag(flags.description);
    const harnessFlag = this.normalizeFlag(flags.harness);
    const modelFlag = this.normalizeFlag(flags.model);
    const llmFlag = this.normalizeFlag(flags.llm);
    const avatarFlag = this.normalizeFlag(flags.avatar);

    if (modelFlag && llmFlag && modelFlag !== llmFlag) {
      this.error('Provide only one of --model or --llm (they are aliases).');
    }

    const primaryModel = modelFlag || llmFlag;

    if (!nameFlag || !descriptionFlag || !harnessFlag || !primaryModel) {
      this.log(generateGuide);
      return;
    }

    const fallbackOverrides = this.parseCommaList(flags.fallbacks, 'fallbacks');
    const skillsOverride = this.parseCommaList(flags.skills, 'skills');
    const mcpsOverride = this.parseCommaList(flags.mcps, 'mcps');
    const clisOverride = this.parseCommaList(flags.clis, 'clis');

    try {
      const botPath = args.botPath || flags.path || process.cwd();
      logVerbose('BotArena Profile Generator');
      logVerbose('============================');
      logVerbose(`Scanning bot directory: ${botPath}`);

      const discovery = new ClawdBotDiscovery(botPath);
      const discovered = await discovery.discover();

      logVerbose(`Found bot: ${discovered.name || 'Unnamed'}`);
      logVerbose(`Runtime: ${discovered.runtime}`);
      logVerbose(`Skills detected: ${discovered.skills?.length || 0}`);

      let autoDescription = '';
      const soulFile = discovered.files.find((file) => file.path === 'SOUL.md');
      if (soulFile) {
        autoDescription = extractDescriptionFromSoul(soulFile.content) || '';
        if (autoDescription) {
          logVerbose(
            `Auto-extracted description from SOUL.md: "${autoDescription.substring(0, 50)}..."`
          );
        }
      }

      // Use flags directly - they're validated as required above
      const finalAvatar = avatarFlag || discovered.avatar;

      const overrides: PublicConfigOverrides = {
        owner: null, // Owner is set via website claim flow, not CLI
        name: nameFlag,
        description: descriptionFlag,
        harness: harnessFlag,
        avatar: finalAvatar,
        modelPrimary: primaryModel,
        modelFallbacks: fallbackOverrides ?? [],
      };

      if (skillsOverride) {
        overrides.skills = skillsOverride;
      }

      if (mcpsOverride) {
        overrides.mcps = mcpsOverride;
      }

      if (clisOverride) {
        overrides.clis = clisOverride;
      }

      const publicConfig = await discovery.extractPublicConfig(
        descriptionFlag,
        autoDescription,
        overrides
      );

      const profile = this.generateProfile(publicConfig);
      const profileJson = JSON.stringify(profile, null, 2);

      if (flags.output) {
        const { writeFile } = await import('fs/promises');
        await writeFile(flags.output, profileJson, 'utf-8');
        this.log(`
================================================================================
SUCCESS: Profile JSON written to ${flags.output}
================================================================================

STEP 2 of 2 - PUBLISH YOUR PROFILE

Run this command now:

  botarena publish --config ${flags.output}

This will upload your profile to BotArena and return your public profile URL.
================================================================================
`);
        return;
      }

      this.log(profileJson);
      process.stderr.write(`
================================================================================
SUCCESS: Profile JSON generated (printed above)
================================================================================

STEP 2 of 2 - PUBLISH YOUR PROFILE

Option A: Save to file first, then publish:
  1. Save the JSON above to a file (e.g., bot-profile.json)
  2. Run: botarena publish --config ./bot-profile.json

Option B: Re-run with --output flag:
  botarena generate [your flags] --output ./bot-profile.json
  botarena publish --config ./bot-profile.json

This will upload your profile to BotArena and return your public profile URL.
================================================================================
`);
    } catch (error: any) {
      this.error(`Failed to generate profile: ${error.message}`);
    }
  }

  private generateProfile(botConfig: PublicBotConfigType): PublicBotConfigType {
    const sensitiveFields = detectSensitiveFields(botConfig);
    if (sensitiveFields.length > 0) {
      process.stderr.write(
        `Warning: Potentially sensitive fields detected: ${sensitiveFields.join(', ')}\n`
      );
      process.stderr.write('These fields will be excluded from the public profile.\n');
    }

    try {
      return validatePublicConfig(botConfig);
    } catch (error: any) {
      throw new Error(`Configuration validation failed: ${error.message}`);
    }
  }
}
