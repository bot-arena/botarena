import { Command, Flags, Args } from '@oclif/core';

export default class ClaimCommand extends Command {
  static description = 'Claim ownership of a bot profile via GitHub Gist verification';

  static examples = [
    '<%= config.bin %> <%= command.id %> my-bot-slug --gist https://gist.github.com/user/abc123',
    '<%= config.bin %> <%= command.id %> my-bot-slug --gist https://gist.github.com/user/abc123 --handle mygithub',
  ];

  static flags = {
    gist: Flags.string({
      char: 'g',
      description: 'GitHub Gist URL for verification',
      required: true,
    }),
    handle: Flags.string({
      char: 'h',
      description: 'Your GitHub handle (optional, auto-detected from Gist URL)',
    }),
    apiUrl: Flags.string({
      description: 'BotArena API URL',
      default: 'https://botarena.sh',
    }),
  };

  static args = {
    slug: Args.string({
      description: 'Bot profile slug to claim',
      required: true,
    }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(ClaimCommand);
    const { slug } = args;
    const { gist, handle, apiUrl } = flags;

    // Extract GitHub handle from Gist URL if not provided
    let githubHandle = handle;
    if (!githubHandle) {
      const match = gist.match(/gist\.github\.com\/([^/]+)/);
      if (match) {
        githubHandle = match[1];
      } else {
        this.error('Could not detect GitHub handle from Gist URL. Please provide --handle.');
      }
    }

    try {
      this.log(`🔐 Initiating claim for bot: ${slug}`);
      this.log(`   GitHub: @${githubHandle}`);
      this.log(`   Gist: ${gist}`);

      // Step 1: Initiate claim
      const initiateResponse = await fetch(`${apiUrl}/api/claim/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          gistUrl: gist,
          githubHandle,
        }),
      });

      const initiateData = await initiateResponse.json();

      if (!initiateData.success) {
        throw new Error(initiateData.error || 'Failed to initiate claim');
      }

      const { verificationCode, expiresAt } = initiateData.data;

      this.log('');
      this.log('✅ Claim initiated!');
      this.log('');
      this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.log('📋 NEXT STEPS:');
      this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      this.log('');
      this.log('1. Create a SECRET GitHub Gist at:');
      this.log(`   ${gist}`);
      this.log('');
      this.log('2. Add this verification code to the Gist:');
      this.log(`   ${verificationCode}`);
      this.log('');
      this.log('3. Run verification:');
      this.log(`   botarena verify ${slug} --handle ${githubHandle}`);
      this.log('');
      this.log(`⏰ Expires: ${new Date(expiresAt).toLocaleString()}`);
      this.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error: any) {
      this.error(`Claim failed: ${error.message}`);
    }
  }
}
