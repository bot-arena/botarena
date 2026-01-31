import { Command, Flags } from '@oclif/core';
import { validatePublicConfig } from '../../schemas/bot-config.js';
import type { PublicBotConfigType } from '../../schemas/bot-config.js';

export default class Publish extends Command {
  static description = 'Publish bot profile to BotArena platform';

  static examples = [
    '<%= config.bin %> <%= command.id %> --config ./profile.json',
    'cat profile.json | <%= config.bin %> <%= command.id %>',
    'BOTARENA_API_URL=https://dev.botarena.sh <%= config.bin %> <%= command.id %> --config ./profile.json',
  ];

  static flags = {
    config: Flags.string({
      char: 'c',
      description: 'Path to bot configuration file',
      required: false,
    }),
    verbose: Flags.boolean({
      description: 'Enable verbose logging output',
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Publish);

    try {
      // Load configuration (from file or stdin)
      let config: PublicBotConfigType;

      if (flags.config) {
        // Load from file
        const fs = await import('fs/promises');
        const fileContent = await fs.readFile(flags.config, 'utf-8');
        config = JSON.parse(fileContent);
      } else {
        // Read from stdin
        const { createInterface } = await import('readline');
        const lines: string[] = [];

        const rl = createInterface({
          input: process.stdin,
          output: process.stdout,
          terminal: false,
        });

        for await (const line of rl) {
          lines.push(line);
        }

        config = JSON.parse(lines.join('\n'));
      }

      // Validate configuration
      const validatedConfig = validatePublicConfig(config);
      this.log(`Publishing profile: ${validatedConfig.name}`);

      if (flags.verbose) {
        this.log('Configuration:', validatedConfig);
      }

      const apiUrl = process.env.BOTARENA_API_URL || 'https://botarena.sh';

      // Upload to BotArena
      const response = await fetch(`${apiUrl}/api/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'botarena-cli/1.0.0',
        },
        body: JSON.stringify(validatedConfig),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const profileUrl = `${apiUrl}/bots/${result.data.slug}`;

        this.log('Profile published successfully!');
        this.log(`Name: ${result.data.name}`);
        this.log(`Profile URL: ${profileUrl}`);
        this.log(`Profile ID: ${result.data._id}`);
        this.log(`Created: ${new Date(result.data._creationTime).toLocaleDateString()}`);
        this.log('\nShare your bot profile with the world!');
      } else {
        throw new Error(result.error || 'Publish failed');
      }
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        this.error('Invalid JSON configuration format');
      } else {
        this.error(`Publish failed: ${error.message}`);
      }
    }
  }
}
