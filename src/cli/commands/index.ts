import { Command } from '@oclif/core';
import { mainGuide } from '../guides.js';

export default class IndexCommand extends Command {
  static description = 'BotArena CLI guide and next steps';

  async run(): Promise<void> {
    this.log(mainGuide);
  }
}
