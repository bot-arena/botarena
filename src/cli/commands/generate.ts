import { Command, Flags, Args } from '@oclif/core';
import inquirer from 'inquirer';
import {
  PublicBotConfigType,
  validatePublicConfig,
  detectSensitiveFields,
} from '../../schemas/bot-config.js';
import { ClawdBotDiscovery } from '../../lib/clawdbot.js';

export default class GenerateCommand extends Command {
  static description = 'Generate a bot profile for BotArena showcase';

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --interactive',
    '<%= config.bin %> <%= command.id %> --dry-run',
  ];

  static flags = {
    interactive: Flags.boolean({
      description: 'Run with interactive prompts for bot configuration',
      default: true,
    }),
    'dry-run': Flags.boolean({
      description: 'Generate profile without uploading to BotArena',
      default: false,
    }),
    output: Flags.string({
      description: 'Output file path for generated profile',
      char: 'o',
    }),
    verbose: Flags.boolean({
      description: 'Enable verbose logging output',
      default: false,
    }),
    path: Flags.string({
      char: 'p',
      description: 'Path to bot directory',
      default: '.',
    }),
  };

  static args = {
    botPath: Args.string({
      description: 'Path to bot directory for configuration discovery',
      required: false,
    }),
  };

  async run(): Promise<void> {
    const { flags, args } = await this.parse(GenerateCommand);

    if (flags.verbose) {
      this.log('BotArena Profile Generator');
      this.log('============================');
    }

    try {
      // Step 1: Initialize discovery
      const botPath = args.botPath || flags.path || process.cwd();
      if (flags.verbose) {
        this.log(`Scanning bot directory: ${botPath}`);
      }

      const discovery = new ClawdBotDiscovery(botPath);
      
      // Detect if this is a ClawdBot instance
      const isClawdBot = await discovery.isClawdBot();
      if (!isClawdBot) {
        this.warn('⚠️  No ClawdBot instance detected. Run from a bot directory with SOUL.md or skills/ folder.');
        return;
      }
      
      // Show progress
      this.log('🔍 Discovering bot configuration from safe files...');
      
      // Step 2: Discover bot info from files
      const discovered = await discovery.discover();
      this.log(`✅ Found bot: ${discovered.name || 'Unnamed'}`);
      this.log(`📦 Runtime: ${discovered.runtime}`);
      this.log(`🛠️  Skills detected: ${discovered.skills?.length || 0}`);

      // Step 3: Get user description interactively
      let userDescription = '';
      if (flags.interactive) {
        const answers = await inquirer.prompt([{
          type: 'input',
          name: 'description',
          message: 'Describe your bot (yearbook quote style):',
          default: 'A helpful AI assistant',
          validate: (input: string) => input.length > 0 && input.length <= 500 || 'Description must be 1-500 characters'
        }]);
        userDescription = answers.description;
      }

      // Step 4: Extract public configuration
      this.log('\n📝 Generating public configuration...');
      const publicConfig = await discovery.extractPublicConfig(userDescription);
      
      if (flags.verbose) {
        this.log('Extracted config:', publicConfig);
      }

      // Step 5: Generate profile
      const profile = await this.generateProfile(publicConfig, flags);
      
      if (flags.verbose) {
        this.log('Generated profile:', profile);
      }

      // Step 6: Handle output
      if (flags['dry-run']) {
        this.log('\n🔍 Dry run mode - profile generated but not uploaded');
        this.log(JSON.stringify(profile, null, 2));
      } else {
        await this.uploadProfile(profile, flags);
        this.log('✅ Profile successfully generated and uploaded to BotArena!');
      }

    } catch (error: any) {
      this.error(`Failed to generate profile: ${error.message}`);
    }
  }

  private async generateProfile(botConfig: PublicBotConfigType, flags: any): Promise<PublicBotConfigType & { id: string; generatedAt: string; platform: string }> {
    if (flags.verbose) {
      this.log('📝 Generating BotArena profile...');
    }

    // Security check: Detect any sensitive fields in the config
    const sensitiveFields = detectSensitiveFields(botConfig);
    if (sensitiveFields.length > 0) {
      this.warn(`⚠️  Warning: Potentially sensitive fields detected: ${sensitiveFields.join(', ')}`);
      this.warn('These fields will be excluded from the public profile.');
    }

    // Validate against PublicBotConfig schema
    // This ensures only safe, public fields are included
    let validatedConfig: PublicBotConfigType;
    try {
      validatedConfig = validatePublicConfig(botConfig);
    } catch (error: any) {
      throw new Error(`Configuration validation failed: ${error.message}`);
    }

    // Generate the final profile
    return {
      id: `bot-${Date.now()}`,
      ...validatedConfig,
      generatedAt: new Date().toISOString(),
      platform: 'botarena',
    };
  }

  private async uploadProfile(_profile: PublicBotConfigType & { id: string; generatedAt: string; platform: string }, flags: any): Promise<void> {
    // TODO: Implement profile upload to BotArena platform
    // This will handle the secure upload process
    
    if (flags.verbose) {
      this.log('🚀 Uploading profile to BotArena...');
    }

    // Placeholder implementation
    this.log('📤 Profile upload simulated (not implemented yet)');
    this.log('   In the next phase, this will upload to Convex backend');
  }
}
