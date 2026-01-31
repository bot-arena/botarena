#!/usr/bin/env node

import { execute } from '@oclif/core';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { mainGuide } from './guides.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
if (args.length === 0) {
  process.stdout.write(`${mainGuide}\n`);
  process.exit(0);
}

await execute({
  dir: import.meta.url,
  loadOptions: {
    root: path.resolve(__dirname, '../../'),
    name: 'botarena',
    version: '0.0.10'
  }
});
