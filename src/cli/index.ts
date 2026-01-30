#!/usr/bin/env node

import {execute} from '@oclif/core';

await execute({
  dir: import.meta.url,
  loadOptions: {
    root: process.cwd(),
    name: 'botarena',
    version: '0.0.3'
  }
});
