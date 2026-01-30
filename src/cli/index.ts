#!/usr/bin/env node

import {execute} from '@oclif/core';
import * as path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await execute({
  dir: import.meta.url,
  loadOptions: {
    root: path.resolve(__dirname, '../../'),
    name: 'botarena',
    version: '0.0.6'
  }
});
