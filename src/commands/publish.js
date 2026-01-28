import pc from 'picocolors';
import ora from 'ora';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';

export async function publish(options) {
  const spinner = ora('Gathering agent data...').start();

  try {
    // 1. Detect Clawdbot workspace
    const configPath = join(process.cwd(), '.clawdbot/clawdbot.json');
    const alternativeConfigPath = join(process.env.HOME || '', '.clawdbot/clawdbot.json');
    
    let config = null;
    let workspacePath = '';

    if (existsSync(configPath)) {
      config = JSON.parse(readFileSync(configPath, 'utf8'));
      workspacePath = process.cwd();
    } else if (existsSync(alternativeConfigPath)) {
      config = JSON.parse(readFileSync(alternativeConfigPath, 'utf8'));
      workspacePath = dirname(dirname(alternativeConfigPath));
    }

    if (!config) {
      spinner.fail(pc.red('No Clawdbot configuration found.'));
      console.log(pc.yellow('\nRun this command inside a Clawdbot workspace or ensure ~/.clawdbot/clawdbot.json exists.'));
      return;
    }

    spinner.text = `Found workspace at ${pc.dim(workspacePath)}`;
    
    // 2. Read Identity and Soul
    const identityPath = join(workspacePath, 'IDENTITY.md');
    const soulPath = join(workspacePath, 'SOUL.md');
    
    let identity = '';
    let soul = '';

    if (existsSync(identityPath)) {
      identity = readFileSync(identityPath, 'utf8');
    }
    if (existsSync(soulPath)) {
      soul = readFileSync(soulPath, 'utf8');
    }

    // 3. Gather skills (from config or directory)
    // In clawdbot, skills are often in a 'skills' folder or listed in config
    const skills = [];
    const skillsDir = join(workspacePath, 'skills');
    if (existsSync(skillsDir)) {
      // Basic check for skill folders
      // For now, let's just use what's in config or manual detection
    }

    // 4. Extract and Sanitize
    const manifest = {
      name: config.agents?.defaults?.identity?.name || 'Unknown Agent',
      model: config.agents?.defaults?.model?.primary,
      skills: Object.keys(config.skills?.installed || {}),
      plugins: Object.keys(config.plugins?.entries || {}).filter(p => config.plugins.entries[p].enabled),
      identity: identity.substring(0, 1000), // Limit size
      soul: soul.substring(0, 1000), // Limit size
      timestamp: new Date().toISOString()
    };

    // Attempt to refine name from IDENTITY.md if it's "Unknown Agent"
    if (manifest.name === 'Unknown Agent' && identity) {
      const nameMatch = identity.match(/Name:\*\*?\s*(.*)/i) || identity.match(/# (.*)/);
      if (nameMatch) manifest.name = nameMatch[1].trim();
    }

    spinner.succeed(pc.green('Agent data gathered.'));
    
    console.log('\n' + pc.bold('Manifest to be published:'));
    console.log(`${pc.cyan('Name:')} ${manifest.name}`);
    console.log(`${pc.cyan('Model:')} ${manifest.model}`);
    console.log(`${pc.cyan('Skills:')} ${manifest.skills.length > 0 ? manifest.skills.join(', ') : 'None'}`);
    console.log(`${pc.cyan('Plugins:')} ${manifest.plugins.join(', ')}`);
    
    if (identity) console.log(pc.dim('\nIdentity found.'));
    if (soul) console.log(pc.dim('Soul found.'));

    console.log(pc.yellow('\nAPI submission coming soon...'));

  } catch (error) {
    spinner.fail(pc.red(`Publish failed: ${error.message}`));
  }
}
