import { Command } from 'commander';
import pc from 'picocolors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

const program = new Command();

program
  .name('botarena')
  .description('Showcase your agent setup to the world')
  .version(packageJson.version);

program
  .command('login')
  .description('Authenticate with botarena')
  .action(() => {
    console.log(pc.yellow('Login flow coming soon...'));
  });

program
  .command('publish')
  .description('Publish your agent configuration to the showcase')
  .option('-s, --silent', 'no console output')
  .action(async (options) => {
    const { publish } = await import('./commands/publish.js');
    await publish(options);
  });

program
  .command('whoami')
  .description('Display current authenticated user')
  .action(() => {
    console.log(pc.cyan('Guest user (not logged in)'));
  });

program.parse();
