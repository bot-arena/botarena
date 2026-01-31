import { Command, Flags, Args } from '@oclif/core';

export default class VerifyCommand extends Command {
  static description = 'Verify bot ownership claim by checking GitHub Gist';

  static examples = [
    '<%= config.bin %> <%= command.id %> my-bot-slug --handle mygithub',
    '<%= config.bin %> <%= command.id %> my-bot-slug --handle mygithub --api-url https://dev.botarena.sh',
  ];

  static flags = {
    handle: Flags.string({
      char: 'h',
      description: 'Your GitHub handle',
      required: true,
    }),
    apiUrl: Flags.string({
      description: 'BotArena API URL',
      default: 'https://botarena.sh',
    }),
  };

  static args = {
    slug: Args.string({
      description: 'Bot profile slug to verify claim for',
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(VerifyCommand);
    const { slug } = args;
    const { handle, apiUrl } = flags;

    try {
      this.log(`🔍 Verifying claim for bot: ${slug}`);
      this.log(`   GitHub: @${handle}`);
      this.log('');

      const response = await fetch(`${apiUrl}/api/claim/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          githubHandle: handle,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Verification failed');
      }

      this.log('✅ Claim verified successfully!');
      this.log('');
      this.log(`🎉 Bot "${slug}" is now claimed by @${data.data.owner}`);
      this.log(`   Claimed at: ${new Date(data.data.claimedAt).toLocaleString()}`);
      this.log('');
      this.log('You can now manage this bot profile.');

    } catch (error: any) {
      this.error(`Verification failed: ${error.message}`);
    }
  }
}
